"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter, useParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function NewThreadPage() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("You must be logged in to create a thread.");
      setLoading(false);
      return;
    }

    // Get peptide ID from slug
    const { data: peptide } = await supabase
      .from("peptides")
      .select("id")
      .eq("slug", slug)
      .single();

    if (!peptide) {
      setError("Peptide not found.");
      setLoading(false);
      return;
    }

    const { data: thread, error: insertError } = await supabase
      .from("threads")
      .insert({
        peptide_id: peptide.id,
        user_id: user.id,
        title,
        body: body || null,
      })
      .select("id")
      .single();

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    router.push(`/peptides/${slug}/threads/${thread.id}`);
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        href={`/peptides/${slug}`}
        className="text-sm text-muted hover:text-foreground inline-flex items-center gap-1 mb-4"
      >
        &larr; Back
      </Link>

      <h1 className="text-2xl font-bold mb-6">New Discussion Thread</h1>

      {error && (
        <div className="bg-red-900/30 text-red-400 text-sm p-3 rounded-md mb-4 border border-red-800">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="e.g., Side effects I experienced with BPC-157"
            className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label htmlFor="body" className="block text-sm font-medium mb-1">
            Body <span className="text-muted">(optional)</span>
          </label>
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={6}
            placeholder="Share your thoughts, experiences, questions..."
            className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-y"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-primary text-black px-6 py-2 rounded-md hover:bg-primary-hover disabled:opacity-50 text-sm font-medium"
        >
          {loading ? "Creating..." : "Create Thread"}
        </button>
      </form>
    </div>
  );
}
