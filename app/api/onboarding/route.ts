import { NextResponse } from 'next/server';
import { backendError, backendRequest } from '@/app/api/_lib/backend';

export async function GET() {
  try {
    const response = await backendRequest({ url: '/api/v1/onboarding', method: 'GET' });
    return NextResponse.json(response);
  } catch (error) {
    const result = backendError(error, 'Unable to load onboarding progress');
    return NextResponse.json({ error: result.message }, { status: result.status });
  }
}
