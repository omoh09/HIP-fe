import { NextResponse } from 'next/server';
import { backendError, backendRequest } from '@/app/api/_lib/backend';

export async function GET() {
  try {
    const response = await backendRequest({ url: '/api/v1/billing/subscription/manage', method: 'GET' });
    return NextResponse.json(response);
  } catch (error) {
    const result = backendError(error, 'Unable to open subscription management');
    return NextResponse.json({ error: result.message }, { status: result.status });
  }
}
