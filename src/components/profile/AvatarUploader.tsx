import { useState } from "react";
import { supabase } from "@/lib/supabase";

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

  // Simpan Username Baru
  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || username === currentUsername) return;

    setUpdatingName(true);
    setError(null);

    try {
      // Update ke public.user_profiles
      const { error: updateProfileError } = await supabase
        .from("user_profiles")
        .update({ username })
        .eq("id", userId);

      if (updateProfileError) throw updateProfileError;

      // Update session agar user_metadata ikut berubah
      const { error: updateAuthError } = await supabase.auth.updateUser({
        data: { full_name: username }
      });

      if (updateAuthError) {
        console.warn("Gagal update auth metadata:", updateAuthError);
      }

      onUsernameUpdated?.(username);
    } catch (err: any) {
      console.error(err);
      setError(err.message ?? "Update name failed");
    } finally {
      setUpdatingName(false);
    }
  };

  // Upload Avatar Baru
  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      setError(null);

      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        throw new Error("Only image files are allowed");
      }

      setUploading(true);

      const fileExt = file.name.split(".").pop();
      const fileName = `${userId}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // 1. Upload ke Storage
      const { error: uploadError } =
        await supabase.storage
          .from("avatars")
          .upload(filePath, file, {
            upsert: true,
            contentType: file.type,
          });

      if (uploadError) {
        throw uploadError;
      }

      const {
        data: { publicUrl },
      } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      // 2. Update URL di tabel user_profiles
      const { error: updateProfileError } =
        await supabase
          .from("user_profiles")
          .update({
            avatar_url: publicUrl,
          })
          .eq("id", userId);

      if (updateProfileError) {
        throw updateProfileError;
      }

      // 3. Update Session Metadata
      const { error: updateAuthError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });

      if (updateAuthError) {
        console.warn("Gagal update auth metadata:", updateAuthError);
      }

      onUploaded?.(publicUrl);
    } catch (err: any) {
      console.error(err);
      setError(err.message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4 w-full">
      {/* Avatar Preview & Button */}
      <div className="flex items-center justify-center gap-4">
        <img
          src={
            currentAvatarUrl ??
            `https://ui-avatars.com/api/?name=${currentUsername || 'User'}&background=0D8ABC&color=fff`
          }
          alt="Avatar"
          className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
        />

        <label className="cursor-pointer flex flex-col items-start gap-1">
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleUpload}
            disabled={uploading}
          />
          <span className="px-4 py-2 text-sm font-medium bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors">
            {uploading ? "Uploading..." : "Change Photo"}
          </span>
          <span className="text-xs text-gray-400">JPG, PNG</span>
        </label>
      </div>

      {/* Input Username */}
      <form onSubmit={handleUpdateName} className="flex flex-col gap-2">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
          Username
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            disabled={updatingName || !username || username === currentUsername}
            className="px-4 py-2 text-sm font-medium bg-emerald-600 text-white rounded hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {updatingName ? "Saving..." : "Save"}
          </button>
        </div>
      </form>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-600 text-center bg-red-50 p-2 rounded border border-red-100">
          {error}
        </p>
      )}
    </div>
  );
};

export default AvatarUploader;