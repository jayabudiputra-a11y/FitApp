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

  // Update Username
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

      const { error: updateAuthError } = await supabase.auth.updateUser({
        data: { full_name: username }
      });

      if (updateAuthError) console.warn("Auth metadata update failed:", updateAuthError);

      onUsernameUpdated?.(username);
    } catch (err: any) {
      setError(err.message ?? "Update name failed");
    } finally {
      setUpdatingName(false);
    }
  };

  // Upload Avatar
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
    <div className="space-y-8 w-full max-w-md mx-auto p-6 bg-transparent transition-colors duration-500">
      
      {/* AVATAR SECTION */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative group">
          <motion.img
            whileHover={{ scale: 1.05 }}
            src={
              currentAvatarUrl ??
              `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUsername || 'U')}&background=random&color=fff`
            }
            alt="Avatar"
            className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-neutral-800 shadow-[0_0_20px_rgba(0,0,0,0.1)] dark:shadow-[0_0_20px_rgba(255,255,255,0.05)]"
          />
          <label className="absolute bottom-0 right-0 p-2 bg-black dark:bg-white text-white dark:text-black rounded-full cursor-pointer shadow-lg hover:scale-110 active:scale-90 transition-all">
            <Camera size={20} />
            <input type="file" accept="image/*" hidden onChange={handleUpload} disabled={uploading} />
          </label>
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 dark:text-neutral-500">
          {uploading ? "UPLOADING..." : "CLICK CAMERA TO CHANGE"}
        </p>
      </div>

      {/* USERNAME SECTION */}
      <form onSubmit={handleUpdateName} className="space-y-4">
        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase tracking-[0.2em] text-black dark:text-white flex items-center gap-2">
            <User size={14} className="text-emerald-500" />
            Username
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="flex-1 bg-white dark:bg-neutral-900 border-2 border-gray-100 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm font-bold text-black dark:text-white focus:border-[#00a354] outline-none transition-all placeholder:text-neutral-300 dark:placeholder:text-neutral-700 shadow-sm"
            />
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={updatingName || !username || username === currentUsername}
              className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-black uppercase text-[10px] tracking-widest disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-xl transition-all flex items-center gap-2"
            >
              {updatingName ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save size={16} />
              )}
              {updatingName ? "" : "Save"}
            </motion.button>
          </div>
        </div>
      </form>

      {/* RAINBOW DIVIDER (Selaras dengan Halaman Articles) */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-red-500 via-yellow-500 via-green-500 via-blue-500 to-transparent opacity-50" />

      {/* ERROR MESSAGE */}
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[11px] font-black uppercase tracking-widest text-red-500 text-center bg-red-50 dark:bg-red-900/10 p-3 rounded-lg border border-red-100 dark:border-red-900/20"
        >
          {error}
        </motion.div>
      )}
    </div>
  );
};

export default AvatarUploader;