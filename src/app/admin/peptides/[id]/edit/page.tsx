"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function EditPeptidePage() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    async function fetchPeptide() {
      const supabase = createClient();
      const { data } = await supabase
        .from("peptides")
        .select("*")
        .eq("id", id)
        .single();

      if (data) {
        setName(data.name);
        setSlug(data.slug);
        setDescription(data.description || "");
      }
      setFetching(false);
    }
    fetchPeptide();
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("peptides")
      .update({
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim() || null,
      })
      .eq("id", id);

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    router.push("/admin");
  }

  if (fetching) {
    return <p className="text-muted text-center py-12">Loading...</p>;
  }

  return (
    <div className="max-w-lg mx-auto">
      <Link
        href="/admin"
        className="text-sm text-muted hover:text-foreground inline-flex items-center gap-1 mb-4"
      >
        &larr; Back to Admin
      </Link>

      <h1 className="text-2xl font-bold mb-6">Edit Peptide</h1>

      {error && (
        <div className="bg-red-900/30 text-red-400 text-sm p-3 rounded-md mb-4 border border-red-800">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label htmlFor="slug" className="block text-sm font-medium mb-1">
            Slug (URL)
          </label>
          <input
            id="slug"
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Description <span className="text-muted">(optional)</span>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-y"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-primary text-black px-6 py-2 rounded-md hover:bg-primary-hover disabled:opacity-50 text-sm font-medium"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
