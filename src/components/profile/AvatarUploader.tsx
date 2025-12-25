import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Camera, Save, User } from "lucide-react";

type Props = {
  userId: string;
  currentAvatarUrl?: string | null;
  currentUsername?: string;
  onUploaded?: (url: string) => void;
  onUsernameUpdated?: (name: string) => void;
};

const AvatarUploader = ({
  userId,
  currentAvatarUrl,
  currentUsername,
  onUploaded,
  onUsernameUpdated,
}: Props) => {
  const [uploading, setUploading] = useState(false);
  const [username, setUsername] = useState(currentUsername || "");
  const [updatingName, setUpdatingName] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || username === currentUsername) return;
    setUpdatingName(true);
    setError(null);
    try {
      const { error: updateProfileError } = await supabase
        .from("user_profiles")
        .update({ username })
        .eq("id", userId);
      if (updateProfileError) throw updateProfileError;
      await supabase.auth.updateUser({ data: { full_name: username } });
      onUsernameUpdated?.(username);
    } catch (err: any) {
      setError(err.message ?? "Update name failed");
    } finally {
      setUpdatingName(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setError(null);
      const file = e.target.files?.[0];
      if (!file) return;
      if (!file.type.startsWith("image/")) throw new Error("Only images allowed");
      setUploading(true);
      const fileExt = file.name.split(".").pop();
      const fileName = `${userId}.${fileExt}`;
      const filePath = `avatars/${fileName}`;
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true, contentType: file.type });
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(filePath);
      await supabase.from("user_profiles").update({ avatar_url: publicUrl }).eq("id", userId);
      await supabase.auth.updateUser({ data: { avatar_url: publicUrl } });
      onUploaded?.(publicUrl);
    } catch (err: any) {
      setError(err.message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-md mx-auto p-4 bg-transparent transition-colors duration-500 overflow-hidden">
      
      {/* AVATAR SECTION */}
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          <motion.img
            whileHover={{ scale: 1.05 }}
            src={currentAvatarUrl ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUsername || 'U')}&background=random&color=fff`}
            alt="Avatar"
            className="w-28 h-28 rounded-full object-cover border-4 border-white dark:border-neutral-800 shadow-md"
          />
          <label className="absolute bottom-0 right-0 p-2 bg-black dark:bg-white text-white dark:text-black rounded-full cursor-pointer shadow-lg active:scale-90 transition-all">
            <Camera size={18} />
            <input type="file" accept="image/*" hidden onChange={handleUpload} disabled={uploading} />
          </label>
        </div>
        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-400">
          {uploading ? "UPLOADING..." : "TAP CAMERA TO CHANGE"}
        </p>
      </div>

      {/* USERNAME SECTION - RAMPING & MOBILE FRIENDLY */}
      <form onSubmit={handleUpdateName} className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-black dark:text-white flex items-center gap-2 ml-1">
          <User size={12} className="text-emerald-500" />
          Username
        </label>
        
        <div className="flex items-center gap-2 h-[42px]">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="flex-1 min-w-0 bg-white dark:bg-neutral-900 border-2 border-gray-100 dark:border-neutral-800 rounded-lg px-3 h-full text-sm font-bold text-black dark:text-white focus:border-emerald-500 outline-none transition-all placeholder:text-neutral-300"
          />
          
          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={updatingName || !username || username === currentUsername}
            className="h-full px-4 bg-black dark:bg-white text-white dark:text-black rounded-lg font-black uppercase text-[9px] tracking-widest disabled:opacity-20 transition-all flex items-center justify-center gap-1.5 flex-shrink-0"
          >
            {updatingName ? (
              <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Save size={14} />
                <span>Save</span>
              </>
            )}
          </motion.button>
        </div>
      </form>

      {/* RAINBOW DIVIDER */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-red-500 via-green-500 via-blue-500 to-transparent opacity-30" />

      {/* ERROR MESSAGE */}
      {error && (
        <p className="text-[9px] font-black uppercase text-red-500 text-center bg-red-50 dark:bg-red-900/10 p-2 rounded-lg border border-red-100 dark:border-red-900/20">
          {error}
        </p>
      )}
    </div>
  );
};

export default AvatarUploader;