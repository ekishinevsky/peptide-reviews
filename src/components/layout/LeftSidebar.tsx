import { createClient } from "@/lib/supabase/server";
import SidebarLink from "./SidebarLink";

export default async function LeftSidebar() {
  const supabase = await createClient();
  const { data: peptides } = await supabase
    .from("peptides")
    .select("name, slug")
    .order("name", { ascending: true });

  return (
    <aside className="hidden lg:block w-[270px] shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto border-r border-border bg-card">
      <nav className="py-3 space-y-0.5">
        <SidebarLink
          href="/"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          }
        >
          Home
        </SidebarLink>
        <SidebarLink
          href="/explore"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
            </svg>
          }
        >
          Explore
        </SidebarLink>

        <div className="pt-4 pb-2 px-4">
          <p className="text-xs font-semibold text-muted uppercase tracking-wider">
            Peptides
          </p>
        </div>

        {(peptides || []).map((p) => (
          <SidebarLink
            key={p.slug}
            href={`/peptides/${p.slug}`}
          >
            p/{p.name}
          </SidebarLink>
        ))}
      </nav>
    </aside>
  );
}
