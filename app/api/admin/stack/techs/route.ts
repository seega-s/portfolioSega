import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const supabase = getServiceSupabase();
    
    const { data: maxOrderData } = await supabase
      .from('stack_techs')
      .select('display_order')
      .eq('list_id', data.list_id)
      .order('display_order', { ascending: false })
      .limit(1)
      .single();

    const display_order = maxOrderData ? maxOrderData.display_order + 1 : 0;

    const { data: newTech, error } = await supabase
      .from('stack_techs')
      .insert([{ ...data, display_order }])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(newTech);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const supabase = getServiceSupabase();
    
    if (Array.isArray(data)) {
      // Reordering multiple techs
      const updates = data.map((item, index) => ({
        id: item.id,
        list_id: item.list_id,
        name: item.name,
        icon_url: item.icon_url,
        display_order: index,
        created_at: item.created_at || new Date().toISOString()
      }));

      const { error } = await supabase
        .from('stack_techs')
        .upsert(updates);

      if (error) throw error;
      return NextResponse.json({ success: true });
    } else {
      const { id, ...updateData } = data;
      const { data: updatedTech, error } = await supabase
        .from('stack_techs')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json(updatedTech);
    }
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    const supabase = getServiceSupabase();
    const { error } = await supabase
      .from('stack_techs')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
