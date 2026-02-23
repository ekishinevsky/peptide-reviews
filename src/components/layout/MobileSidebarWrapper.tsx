import { createClient } from "@/lib/supabase/server";
import MobileSidebar from "./MobileSidebar";

export default async function MobileSidebarWrapper() {
  const supabase = await createClient();
  const { data: peptides } = await supabase
    .from("peptides")
    .select("name, slug")
    .order("name", { ascending: true });

  return <MobileSidebar peptides={(peptides || []).map((p) => ({ name: p.name, slug: p.slug }))} />;
}
