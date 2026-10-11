import { NextResponse } from 'next/server';
import { backendError, backendRequest } from '@/app/api/_lib/backend';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const response = await backendRequest({
      url: '/api/v1/payment-accounts/stripe/onboarding',
      method: 'POST',
      data: body,
      headers: { 'Content-Type': 'application/json' },
    });
    return NextResponse.json(response);
  } catch (error) {
    const result = backendError(error, 'Unable to start Stripe onboarding');
    return NextResponse.json({ error: result.message }, { status: result.status });
  }
}
