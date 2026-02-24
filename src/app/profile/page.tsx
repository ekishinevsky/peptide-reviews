import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProfileContent from "@/components/ProfileContent";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, created_at")
    .eq("id", user.id)
    .single();

  const { data: threads } = await supabase
    .from("threads")
    .select("id, title, created_at, comment_count, peptides(name, slug)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const { data: comments } = await supabase
    .from("comments")
    .select("id, body, created_at, threads(id, title, peptide_id, peptides(slug))")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const joinedDate = new Date(profile?.created_at || "").toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div>
      <div className="bg-card border border-border rounded-lg p-5 mb-6">
        <div className="flex items-center gap-3">
          <span className="w-12 h-12 rounded-full bg-primary text-black text-xl font-bold flex items-center justify-center">
            {profile?.username?.[0]?.toUpperCase() || "?"}
          </span>
          <div>
            <h1 className="text-2xl font-bold">{profile?.username}</h1>
            <p className="text-muted text-sm">Joined {joinedDate}</p>
          </div>
        </div>
      </div>

      <ProfileContent
        threads={(threads as any[]) || []}
        comments={(comments as any[]) || []}
      />
    </div>
  );
}
