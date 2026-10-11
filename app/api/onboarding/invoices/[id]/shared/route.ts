import { NextResponse } from 'next/server';
import { backendError, backendRequest } from '@/app/api/_lib/backend';

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const response = await backendRequest({ url: `/api/v1/onboarding/invoices/${encodeURIComponent(id)}/shared`, method: 'POST' });
    return NextResponse.json(response);
  } catch (error) {
    const result = backendError(error, 'Unable to record invoice share');
    return NextResponse.json({ error: result.message }, { status: result.status });
  }
}
