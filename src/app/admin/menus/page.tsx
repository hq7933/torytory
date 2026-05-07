import { supabase } from "@/lib/supabase";
import MenusClient from "./MenusClient";

export default async function MenusPage() {
  const [{ data: categories }, { data: menus }] = await Promise.all([
    supabase.from("categories").select("*").order("sort_order"),
    supabase.from("menus").select("*, categories(*)").order("sort_order"),
  ]);

  return <MenusClient initialMenus={menus ?? []} categories={categories ?? []} />;
}
