import { NextResponse } from 'next/server';
import { backendError, publicBackendRequest } from '@/app/api/_lib/backend';

export async function GET(
  _req: Request,
  context: { params: Promise<{ token: string }> },
) {
  try {
    const { token } = await context.params;
    const response = await publicBackendRequest({
      url: `/api/v1/public/invoices/${encodeURIComponent(token)}`,
      method: 'GET',
    });
    return NextResponse.json(response);
  } catch (error) {
    const result = backendError(error, 'Unable to load this invoice');
    return NextResponse.json({ error: result.message }, { status: result.status });
  }
}
