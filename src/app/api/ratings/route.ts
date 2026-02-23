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

  const { peptide_id, stars } = await request.json();

  if (!peptide_id || !stars || stars < 1 || stars > 5) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const { error } = await supabase.rpc("upsert_rating", {
    p_peptide_id: peptide_id,
    p_user_id: user.id,
    p_stars: stars,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
