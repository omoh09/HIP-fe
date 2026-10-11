import { NextResponse } from 'next/server';
import { backendError, backendRequest } from '@/app/api/_lib/backend';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const status = url.searchParams.get('status');
    const query = status ? `?status=${encodeURIComponent(status)}&per_page=100` : '?per_page=100';
    const response = await backendRequest({ url: `/api/v1/reviews${query}`, method: 'GET' });
    return NextResponse.json(response);
  } catch (error) {
    const result = backendError(error, 'Unable to load reviews');
    return NextResponse.json({ error: result.message }, { status: result.status });
  }
}
