import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

async function isAuthenticated() {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  return session && session.value === process.env.ADMIN_PASSWORD;
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    const keyToUse = (serviceKey && serviceKey !== 'AQUI_PON_TU_SERVICE_ROLE_KEY_SECRETA') ? serviceKey : anonKey;

    const supabase = createClient(supabaseUrl, keyToUse, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const ext = file.name.split('.').pop()?.toLowerCase() || 'png';
    const filename = `logo-${Date.now()}.${ext}`;

    // Determine correct content type, especially for SVGs
    let contentType = file.type;
    if (ext === 'svg') contentType = 'image/svg+xml';
    if (!contentType || contentType === 'application/octet-stream') {
      const mimeMap: Record<string, string> = {
        png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg',
        gif: 'image/gif', webp: 'image/webp', svg: 'image/svg+xml', ico: 'image/x-icon',
      };
      contentType = mimeMap[ext] || 'image/png';
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from('logos')
      .upload(filename, buffer, {
        contentType,
        upsert: true,
        cacheControl: '3600',
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return NextResponse.json({ error: uploadError.message }, { status: 400 });
    }

    const { data: urlData } = supabase.storage
      .from('logos')
      .getPublicUrl(filename);

    return NextResponse.json({ url: urlData.publicUrl });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
