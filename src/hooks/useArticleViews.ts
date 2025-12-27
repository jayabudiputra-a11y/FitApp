import { useState, useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

/* ======================
    METRIC ENGINE 
   ====================== */
const _0xview = [
    'article_view_counts',      
    'total_views',               
    'article_id',                
    'increment_article_views',   
    'article_id_input',          
    'public'                     
] as const;

const _v = (i: number) => _0xview[i] as any;

async function trackPageView(articleId: string, queryClient: any) { 
    if (!articleId) return;
    
    const { error } = await supabase.rpc(_v(3), {
        [_v(4)]: articleId
    });

    if (!error) {
        queryClient.invalidateQueries({ queryKey: ['articles'] });
    }
}

interface ArticleIdentifiers {
    id: string;
    slug: string;
    initialViews?: number; 
}

export const useArticleViews = (articleIds: ArticleIdentifiers) => {
    const { id: articleId, initialViews = 0 } = articleIds; 
    const queryClient = useQueryClient();
    const [liveViewCount, setLiveViewCount] = useState<number>(initialViews);

    useEffect(() => {
        if (articleId && initialViews !== liveViewCount) {
             setLiveViewCount(initialViews);
        }
    }, [initialViews, articleId]); 

    const { data: fetchedViewCount } = useQuery<number>({
        queryKey: ["viewCount", articleId],
        queryFn: async () => {
            if (!articleId) return 0;
            
            const { data: countsRow } = await (supabase.from(_v(0)) as any)
                .select(_v(1))
                .eq(_v(2), articleId)
                .maybeSingle();

            return countsRow?.[_v(1)] ?? 0; 
        },
        enabled: !!articleId,
        placeholderData: initialViews, 
        refetchInterval: 5000, 
    });

    useEffect(() => {
        if (typeof fetchedViewCount === "number" && fetchedViewCount !== liveViewCount) {
            setLiveViewCount(fetchedViewCount);
        }
    }, [fetchedViewCount, liveViewCount]); 
    
    useEffect(() => {
        if (!articleId) return;
        
        const channelName = `ev_v1_${articleId}`; // Masked channel name

        const channel = supabase
            .channel(channelName) 
            .on(
                "postgres_changes",
                { 
                    event: "UPDATE", 
                    schema: _v(5), 
                    table: _v(0), 
                    filter: `${_v(2)}=eq.${articleId}` 
                }, 
                (payload) => {
                    const rec = (payload as any).new;
                    if (rec?.[_v(1)] && rec[_v(2)] === articleId) { 
                        const newViews = rec[_v(1)];
                        setLiveViewCount(newViews); 
                        queryClient.setQueryData(["viewCount", articleId], newViews);
                        queryClient.invalidateQueries({ queryKey: ['articles'] });
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [articleId, queryClient]);

    const hasTrackedRef = useRef<string | null>(null);
    useEffect(() => {
        if (!articleId || hasTrackedRef.current === String(articleId)) return;
        
        trackPageView(String(articleId), queryClient).catch(() => {}); 
        hasTrackedRef.current = String(articleId);
    }, [articleId, queryClient]); 

    return { viewCount: liveViewCount };
};