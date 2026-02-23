import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim();

  if (!q) {
    return NextResponse.json({ peptides: [], threads: [] });
  }

  const supabase = await createClient();
  const pattern = `%${q}%`;

  const [peptideResult, threadResult] = await Promise.all([
    supabase
      .from("peptides")
      .select("id, name, slug, description")
      .ilike("name", pattern)
      .limit(5),
    supabase
      .from("threads")
      .select("id, title, body, upvotes, downvotes, comment_count, created_at, profiles(username), peptides(name, slug)")
      .or(`title.ilike.${pattern},body.ilike.${pattern}`)
      .limit(10),
  ]);

  return NextResponse.json({
    peptides: peptideResult.data || [],
    threads: threadResult.data || [],
  });
}
