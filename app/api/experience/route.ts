import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

async function isAuthenticated() {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  return session && session.value === process.env.ADMIN_PASSWORD;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const graphType = searchParams.get('graph');

  let query = supabase.from('experience_nodes').select('*').order('display_order', { ascending: true });
  if (graphType && graphType !== 'all') query = query.eq('graph_type', graphType);

  const { data: nodes, error: nodesError } = await query;
  if (nodesError) return NextResponse.json({ error: nodesError.message }, { status: 400 });

  // Get edges only for the node IDs returned
  const nodeIds = (nodes || []).map((n: any) => n.id);
  let edges: any[] = [];
  if (nodeIds.length > 0) {
    const { data, error } = await supabase
      .from('experience_edges')
      .select('*')
      .or(`source_node_id.in.(${nodeIds.join(',')}),target_node_id.in.(${nodeIds.join(',')})`);
    if (!error) edges = data || [];
  }

  return NextResponse.json({ nodes: nodes || [], edges });
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();

    if (body.source_node_id && body.target_node_id) {
      const { data, error } = await supabase
        .from('experience_edges')
        .insert({ source_node_id: body.source_node_id, target_node_id: body.target_node_id })
        .select().single();
      if (error) throw error;
      return NextResponse.json(data);
    }

    const { data: maxOrder } = await supabase
      .from('experience_nodes').select('display_order')
      .order('display_order', { ascending: false }).limit(1);

    const nextOrder = maxOrder && maxOrder.length > 0 ? maxOrder[0].display_order + 1 : 0;

    let posX = body.position_x;
    let posY = body.position_y;

    if (posX === undefined || posY === undefined) {
      const { data: existingNodes } = await supabase
        .from('experience_nodes')
        .select('position_x, position_y')
        .eq('graph_type', body.graph_type || 'professional');
      
      if (existingNodes && existingNodes.length > 0) {
        // Space out by placing it 160px below the lowest node
        const maxY = existingNodes.reduce((max, n) => Math.max(max, n.position_y), 0);
        posX = 100;
        posY = maxY + 160;
      } else {
        posX = 100;
        posY = 100;
      }
    }

    const { data, error } = await supabase
      .from('experience_nodes')
      .insert({
        node_type: body.node_type || 'work',
        graph_type: body.graph_type || 'professional',
        company_name: body.company_name || '',
        logo_url: body.logo_url || null,
        role_es: body.role_es || '',
        role_en: body.role_en || '',
        description_es: body.description_es || '',
        description_en: body.description_en || '',
        date_start: body.date_start || '',
        date_end: body.date_end || null,
        position_x: posX,
        position_y: posY,
        display_order: nextOrder,
        techs: body.techs || [],
        related_project_id: body.related_project_id || null,
        study_name_es: body.study_name_es || '',
        study_name_en: body.study_name_en || '',
      })
      .select().single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();

    if (Array.isArray(body)) {
      for (const item of body) {
        await supabase.from('experience_nodes')
          .update({ position_x: item.position_x, position_y: item.position_y })
          .eq('id', item.id);
      }
      return NextResponse.json({ success: true });
    }

    const { id, created_at, ...updates } = body;
    if (!id) throw new Error('ID is required');

    const { data, error } = await supabase
      .from('experience_nodes').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const nodeId = searchParams.get('nodeId');
    const edgeId = searchParams.get('edgeId');

    if (edgeId) {
      const { error } = await supabase.from('experience_edges').delete().eq('id', edgeId);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }
    if (nodeId) {
      // Delete edges first to avoid foreign key constraint errors
      await supabase.from('experience_edges').delete().or(`source_node_id.eq.${nodeId},target_node_id.eq.${nodeId}`);
      const { error } = await supabase.from('experience_nodes').delete().eq('id', nodeId);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }
    throw new Error('nodeId or edgeId required');
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
