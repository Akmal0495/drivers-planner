import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Ошибка: переменные окружения Supabase не найдены!");
  console.error("NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl);
  console.error("NEXT_PUBLIC_SUPABASE_ANON_KEY:", supabaseAnonKey ? "есть" : "нет");
  throw new Error("Supabase env variables are missing");
} else {
  console.log("✅ Supabase env загружены");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
