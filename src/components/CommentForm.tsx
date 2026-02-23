"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface CommentFormProps {
  threadId: string;
  parentId?: string;
  onCancel?: () => void;
  placeholder?: string;
}

export default function CommentForm({
  threadId,
  parentId,
  onCancel,
  placeholder = "Write a comment...",
}: CommentFormProps) {
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    setLoading(true);
    setError("");

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("You must be logged in to comment.");
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from("comments").insert({
      thread_id: threadId,
      user_id: user.id,
      parent_id: parentId || null,
      body: body.trim(),
    });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    // Increment comment count
    await supabase.rpc("increment_comment_count", {
      p_thread_id: threadId,
    });

    setBody("");
    setLoading(false);
    onCancel?.();
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      {error && (
        <p className="text-red-600 text-sm">{error}</p>
      )}
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-y"
      />
      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={loading || !body.trim()}
          className="bg-primary text-black px-4 py-1.5 rounded-md text-sm hover:bg-primary-hover disabled:opacity-50"
        >
          {loading ? "Posting..." : "Comment"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-sm text-muted hover:text-foreground"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
