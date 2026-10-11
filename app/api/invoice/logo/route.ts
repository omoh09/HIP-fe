import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';
import { API_BASE_URL, backendHeaders } from '@/app/api/_lib/backend';

function resolveAssetUrl(raw: string) {
  if (!raw) return null;
  try {
    const base = new URL(API_BASE_URL || 'http://localhost:8000');
    const url = new URL(raw, base);
    if (url.hostname !== base.hostname) return null;
    return url.toString();
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get('url') || '';
  const assetUrl = resolveAssetUrl(raw);
  if (!assetUrl || !API_BASE_URL) {
    return NextResponse.json({ message: 'Invalid invoice logo URL.' }, { status: 400 });
  }

  try {
    const token = (await cookies()).get('auth')?.value;
    const response = await axios.get<ArrayBuffer>(assetUrl, {
      responseType: 'arraybuffer',
      timeout: 10_000,
      headers: token ? backendHeaders(token) : undefined,
      validateStatus: () => true,
    });

    if (response.status < 200 || response.status >= 300) {
      return NextResponse.json({ message: 'Unable to load invoice logo.' }, { status: 404 });
    }

    const contentType = String(response.headers['content-type'] || 'image/png');
    if (!contentType.toLowerCase().startsWith('image/')) {
      return NextResponse.json({ message: 'Invoice branding asset is not an image.' }, { status: 415 });
    }

    return new NextResponse(response.data, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'private, max-age=300',
      },
    });
  } catch {
    return NextResponse.json({ message: 'Unable to load invoice logo.' }, { status: 502 });
  }
}
