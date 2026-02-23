"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useSidebar } from "./SidebarContext";

interface SidebarLinkProps {
  href: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export default function SidebarLink({ href, children, icon }: SidebarLinkProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { close } = useSidebar();

  // Match both path-only links and links with query params
  const currentFull = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");
  const isActive = href.includes("?")
    ? currentFull === href
    : pathname === href && !searchParams.toString();

  return (
    <Link
      href={href}
      onClick={close}
      className={`flex items-center gap-3 px-4 py-2 text-sm rounded-md transition-colors ${
        isActive
          ? "bg-surface text-foreground font-medium"
          : "text-muted hover:bg-hover hover:text-foreground"
      }`}
    >
      {icon && <span className="w-5 h-5 flex items-center justify-center">{icon}</span>}
      {children}
    </Link>
  );
}
