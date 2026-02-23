"use client";

import { useSidebar } from "./SidebarContext";

export default function MobileMenuButton() {
  const { toggle } = useSidebar();

  return (
    <button
      type="button"
      onClick={toggle}
      className="lg:hidden p-1.5 text-muted hover:text-foreground rounded-md"
      aria-label="Toggle menu"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    </button>
  );
}
