import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Peptide } from "@/lib/types";
import DeletePeptideButton from "@/components/DeletePeptideButton";

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) redirect("/");

  const { data: peptides } = await supabase
    .from("peptides")
    .select("*")
    .order("name", { ascending: true });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Admin: Manage Peptides</h1>
        <Link
          href="/admin/peptides/new"
          className="bg-primary text-black px-4 py-2 rounded-md text-sm hover:bg-primary-hover"
        >
          + Add Peptide
        </Link>
      </div>

      {peptides && peptides.length > 0 ? (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface">
                <th className="text-left px-4 py-3 font-medium">Name</th>
                <th className="text-left px-4 py-3 font-medium">Slug</th>
                <th className="text-left px-4 py-3 font-medium">Ratings</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(peptides as Peptide[]).map((peptide) => (
                <tr key={peptide.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium">{peptide.name}</td>
                  <td className="px-4 py-3 text-muted">{peptide.slug}</td>
                  <td className="px-4 py-3 text-muted">{peptide.rating_count}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/peptides/${peptide.id}/edit`}
                        className="text-primary hover:underline text-sm"
                      >
                        Edit
                      </Link>
                      <DeletePeptideButton peptideId={peptide.id} peptideName={peptide.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-muted text-center py-12">No peptides yet.</p>
      )}
    </div>
  );
}
