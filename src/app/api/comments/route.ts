import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { thread_id, parent_id, body } = await request.json();

  if (!thread_id || !body?.trim()) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("comments")
    .insert({
      thread_id,
      user_id: user.id,
      parent_id: parent_id || null,
      body: body.trim(),
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Increment comment count on the thread
  await supabase.rpc("increment_comment_count", { p_thread_id: thread_id });

  return NextResponse.json(data);
}
