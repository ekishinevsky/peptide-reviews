"use client";

import { useSidebar } from "./SidebarContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

function MobileLink({
  href,
  children,
  icon,
  active,
  onClose,
}: {
  href: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  active: boolean;
  onClose: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClose}
      className={`flex items-center gap-3 px-4 py-2 text-sm rounded-md transition-colors ${
        active
          ? "bg-surface text-foreground font-medium"
          : "text-muted hover:bg-hover hover:text-foreground"
      }`}
    >
      {icon && <span className="w-5 h-5 flex items-center justify-center">{icon}</span>}
      {children}
    </Link>
  );
}

interface MobileSidebarProps {
  peptides: { name: string; slug: string }[];
}

export default function MobileSidebar({ peptides }: MobileSidebarProps) {
  const { open, close } = useSidebar();
  const pathname = usePathname();

  useEffect(() => {
    close();
  }, [pathname, close]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={close}
      />

      <div className="absolute top-0 left-0 h-full w-[270px] bg-card border-r border-border overflow-y-auto animate-slide-in">
        <div className="p-4 border-b border-border">
          <span className="text-lg font-bold text-primary">peptabase</span>
        </div>

        <nav className="py-3 space-y-0.5">
          <MobileLink href="/" active={pathname === "/"} onClose={close} icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          }>
            Home
          </MobileLink>
          <MobileLink href="/explore" active={pathname === "/explore"} onClose={close} icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
            </svg>
          }>
            Explore
          </MobileLink>

          <div className="pt-4 pb-2 px-4">
            <p className="text-xs font-semibold text-muted uppercase tracking-wider">
              Peptides
            </p>
          </div>

          {peptides.map((p) => (
            <MobileLink
              key={p.slug}
              href={`/peptides/${p.slug}`}
              active={pathname === `/peptides/${p.slug}`}
              onClose={close}
            >
              p/{p.name}
            </MobileLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
