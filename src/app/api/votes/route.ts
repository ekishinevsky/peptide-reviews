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

  const { target_type, target_id, value } = await request.json();

  if (
    !target_type ||
    !target_id ||
    !["thread", "comment"].includes(target_type) ||
    ![1, -1].includes(value)
  ) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const { error } = await supabase.rpc("upsert_vote", {
    p_user_id: user.id,
    p_target_type: target_type,
    p_target_id: target_id,
    p_value: value,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
