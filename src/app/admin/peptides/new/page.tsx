"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { slugify } from "@/lib/utils";

export default function NewPeptidePage() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function handleNameChange(value: string) {
    setName(value);
    setSlug(slugify(value));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: insertError } = await supabase.from("peptides").insert({
      name: name.trim(),
      slug: slug.trim(),
      description: description.trim() || null,
    });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    router.push("/admin");
  }

  return (
    <div className="max-w-lg mx-auto">
      <Link
        href="/admin"
        className="text-sm text-muted hover:text-foreground inline-flex items-center gap-1 mb-4"
      >
        &larr; Back to Admin
      </Link>

      <h1 className="text-2xl font-bold mb-6">Add New Peptide</h1>

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
            onChange={(e) => handleNameChange(e.target.value)}
            required
            placeholder="e.g., BPC-157"
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
            placeholder="Short description of the peptide..."
            className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-y"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-primary text-black px-6 py-2 rounded-md hover:bg-primary-hover disabled:opacity-50 text-sm font-medium"
        >
          {loading ? "Creating..." : "Add Peptide"}
        </button>
      </form>
    </div>
  );
}
