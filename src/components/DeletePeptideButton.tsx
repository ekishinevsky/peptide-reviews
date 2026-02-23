"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeletePeptideButton({
  peptideId,
  peptideName,
}: {
  peptideId: string;
  peptideName: string;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (!confirm(`Delete "${peptideName}"? This will also delete all threads, comments, and ratings for this peptide.`)) {
      return;
    }

    setLoading(true);
    const supabase = createClient();
    await supabase.from("peptides").delete().eq("id", peptideId);
    router.refresh();
    setLoading(false);
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="text-red-500 hover:text-red-700 text-sm disabled:opacity-50"
    >
      {loading ? "..." : "Delete"}
    </button>
  );
}
