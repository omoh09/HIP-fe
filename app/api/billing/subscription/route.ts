import { NextResponse } from 'next/server';
import { backendError, backendRequest } from '@/app/api/_lib/backend';

export async function GET() {
  try {
    const response = await backendRequest({ url: '/api/v1/billing/subscription', method: 'GET' });
    return NextResponse.json(response, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    const result = backendError(error, 'Unable to load subscription');
    return NextResponse.json({ error: result.message }, { status: result.status });
  }
}
