import { NextResponse } from 'next/server';
import { backendError, publicBackendRequest } from '@/app/api/_lib/backend';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const limit = url.searchParams.get('limit') || '12';
    const response = await publicBackendRequest({
      url: `/api/v1/public/reviews?limit=${encodeURIComponent(limit)}`,
      method: 'GET',
    });
    return NextResponse.json(response);
  } catch (error) {
    const result = backendError(error, 'Unable to load reviews');
    return NextResponse.json({ error: result.message }, { status: result.status });
  }
}
