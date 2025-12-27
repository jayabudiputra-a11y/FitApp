/* ======================
    T
   ====================== */
const _0xtrk = [
  "VITE_SUPABASE_URL",        
  "VITE_SUPABASE_ANON_KEY",    
  "/functions/v1/track-view",  
  "POST",                      
  "application/json",          
  "Authorization",             
  "Bearer "                    
] as const;

const _t = (i: number) => _0xtrk[i] as string;

export async function trackPageView(articleId: string) {
  try {
    if (!articleId) return;

    const _B = import.meta.env[_t(0)];
    const _K = import.meta.env[_t(1)];

    if (!_B || !_K) return;

    const _E = `${_B.replace(/\/$/, "")}${_t(2)}`;

    const res = await fetch(`${_E}?article_id=${encodeURIComponent(articleId)}`, {
      method: _t(3),
      headers: {
        "Content-Type": _t(4),
        "x-article-id": articleId,
        [_t(5)]: `${_t(6)}${_K}`, 
      },
      body: JSON.stringify({ article_id: articleId }),
    });

    if (!res.ok && import.meta.env.DEV) {
      const txt = await res.text();
      console.error("SYS_TRACK_FAULT:", res.status, txt);
    }
  } catch (err) {
    if (import.meta.env.DEV) console.error("NET_SIGNAL_LOST:", err);
  }
}