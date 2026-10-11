import { NextResponse } from 'next/server';
import { backendError, backendRequest } from '@/app/api/_lib/backend';

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const response = await backendRequest({
      url: `/api/v1/reviews/${encodeURIComponent(id)}`,
      method: 'PATCH',
      data: body,
      headers: { 'Content-Type': 'application/json' },
    });
    return NextResponse.json(response);
  } catch (error) {
    const result = backendError(error, 'Unable to update review');
    return NextResponse.json({ error: result.message }, { status: result.status });
  }
}
