import { getServiceSupabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = getServiceSupabase();
  const { data, error } = await supabase
    .from('certifications')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const supabase = getServiceSupabase();
  const certification = await request.json();

  const { data, error } = await supabase
    .from('certifications')
    .insert([certification])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  const supabase = getServiceSupabase();
  const body = await request.json();

  // Support batch update (array) or single update (object)
  const certs = Array.isArray(body) ? body : [body];

  for (const cert of certs) {
    const { id, ...updateData } = cert;
    if (!id) continue;

    // Remove fields that shouldn't be updated
    delete updateData.created_at;

    const { error } = await supabase
      .from('certifications')
      .update(updateData)
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const supabase = getServiceSupabase();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }

  const { error } = await supabase
    .from('certifications')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
