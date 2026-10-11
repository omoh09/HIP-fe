import { NextResponse } from 'next/server';
import { backendError, backendRequest } from '@/app/api/_lib/backend';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const country = url.searchParams.get('country');
    const suffix = country ? `?country=${encodeURIComponent(country)}` : '';
    const response = await backendRequest({
      url: `/api/v1/payment-accounts/paystack/banks${suffix}`, 
      method: 'GET',
    });
    return NextResponse.json(response);
  } catch (error) {
    const result = backendError(error, 'Unable to load settlement banks');
    return NextResponse.json({ error: result.message }, { status: result.status });
  }
}
