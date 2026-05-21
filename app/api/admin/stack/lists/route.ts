import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = getServiceSupabase();
    const { data, error } = await supabase
      .from('stack_lists')
      .select('*, stack_techs(*)')
      .order('display_order', { ascending: true });

    if (error) {
      console.error("Error fetching stack lists:", error);
      return NextResponse.json({ error: "Failed to fetch lists" }, { status: 500 });
    }

    // sort techs within lists
    data?.forEach(list => {
      if (list.stack_techs) {
        list.stack_techs.sort((a: any, b: any) => a.display_order - b.display_order);
      }
    });

    return NextResponse.json(data || []);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const supabase = getServiceSupabase();
    
    // Get max display_order
    const { data: maxOrderData } = await supabase
      .from('stack_lists')
      .select('display_order')
      .order('display_order', { ascending: false })
      .limit(1)
      .single();

    const display_order = maxOrderData ? maxOrderData.display_order + 1 : 0;

    const { data: newList, error } = await supabase
      .from('stack_lists')
      .insert([{ ...data, display_order }])
      .select()
      .single();

    if (error) {
      console.error("Error creating stack list:", error);
      return NextResponse.json({ error: "Failed to create list" }, { status: 500 });
    }

    return NextResponse.json(newList);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const supabase = getServiceSupabase();
    
    // Check if it is a reorder operation or a regular update
    if (Array.isArray(data)) {
      // Reordering
      const updates = data.map((item, index) => ({
        id: item.id,
        name_es: item.name_es,
        name_en: item.name_en,
        display_order: index,
        created_at: item.created_at || new Date().toISOString()
      }));

      const { error } = await supabase
        .from('stack_lists')
        .upsert(updates);

      if (error) throw error;
      return NextResponse.json({ success: true });
    } else {
      const { id, ...updateData } = data;
      const { data: updatedList, error } = await supabase
        .from('stack_lists')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json(updatedList);
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
      .from('stack_lists')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
