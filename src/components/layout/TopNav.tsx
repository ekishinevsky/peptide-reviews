import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import GlobalSearchBar from "./GlobalSearchBar";
import MobileMenuButton from "./MobileMenuButton";

export default async function TopNav() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profile = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("username, is_admin")
      .eq("id", user.id)
      .single();
    profile = data;
  }

  return (
    <nav className="border-b border-border bg-card sticky top-0 z-50">
      <div className="px-4 h-14 flex items-center gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <MobileMenuButton />
          <Link href="/" className="text-xl font-bold text-primary">
            peptabase
          </Link>
        </div>

        <div className="flex-1 max-w-xl mx-auto">
          <GlobalSearchBar />
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {profile?.is_admin && (
            <Link
              href="/admin"
              className="text-sm text-muted hover:text-foreground hidden sm:inline"
            >
              Admin
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/profile"
                className="text-sm text-muted hover:text-foreground hidden sm:inline"
              >
                {profile?.username}
              </Link>
              <form action="/auth/logout" method="POST">
                <button
                  type="submit"
                  className="text-sm text-muted hover:text-foreground"
                >
                  Log Out
                </button>
              </form>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/auth/login"
                className="text-sm text-muted hover:text-foreground"
              >
                Log In
              </Link>
              <Link
                href="/auth/signup"
                className="text-sm bg-primary text-black px-3 py-1.5 rounded-md hover:bg-primary-hover"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
