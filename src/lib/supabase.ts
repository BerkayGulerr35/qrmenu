import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function uploadImage(file: File, folder: string = "menu-items"): Promise<string | null> {
  const fileExt = file.name.split(".").pop();
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

  const { error } = await supabase.storage
    .from("images")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Upload error:", error);
    return null;
  }

  const { data } = supabase.storage.from("images").getPublicUrl(fileName);
  return data.publicUrl;
}

export async function deleteImage(url: string): Promise<boolean> {
  // Extract path from URL
  const match = url.match(/images\/(.+)$/);
  if (!match) return false;

  const path = match[1];
  const { error } = await supabase.storage.from("images").remove([path]);

  return !error;
}
