export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = getServiceSupabase();
    const { data, error } = await supabase
      .from('main_config')
      .select('*')
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error("Error fetching main config:", error);
      return NextResponse.json({ error: "Failed to fetch config" }, { status: 500 });
    }

    return NextResponse.json(data || {});
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const supabase = getServiceSupabase();
    
    // Check if entry exists
    const { data: existing } = await supabase
      .from('main_config')
      .select('id')
      .limit(1)
      .single();

    let result;
    if (existing) {
      result = await supabase
        .from('main_config')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', existing.id)
        .select()
        .single();
    } else {
      result = await supabase
        .from('main_config')
        .insert([{ ...data, updated_at: new Date().toISOString() }])
        .select()
        .single();
    }

    if (result.error) {
      console.error("Error updating main config:", result.error);
      return NextResponse.json({ error: "Failed to update config" }, { status: 500 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
