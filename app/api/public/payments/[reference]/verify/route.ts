import { NextResponse } from 'next/server';
import { backendError, publicBackendRequest } from '@/app/api/_lib/backend';

export async function POST(
  _req: Request,
  context: { params: Promise<{ reference: string }> },
) {
  try {
    const { reference } = await context.params;
    const response = await publicBackendRequest({
      url: `/api/v1/public/payments/${encodeURIComponent(reference)}/verify`,
      method: 'POST',
      data: {},
      headers: { 'Content-Type': 'application/json' },
    });
    return NextResponse.json(response);
  } catch (error) {
    const result = backendError(error, 'Unable to verify payment');
    return NextResponse.json({ error: result.message }, { status: result.status });
  }
}
