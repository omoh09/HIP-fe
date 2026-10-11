import { NextResponse } from 'next/server';
import axios from 'axios';
import { backendError, backendHeaders, requireAuthToken, requireBackendConfig } from '@/app/api/_lib/backend';

export async function GET() {
  try {
    const token = await requireAuthToken();
    const baseUrl = requireBackendConfig();

    const response = await axios.get(`${baseUrl}/api/v1/auth/me`, {
      headers: backendHeaders(token),
      timeout: 10_000,
    });

    const user = response.data?.user ?? response.data;
    return NextResponse.json({ success: true, user }, {
      headers: { 'Cache-Control': 'private, no-store' },
    });
  } catch (error) {
    const result = backendError(error, 'Unable to load your account');
    return NextResponse.json({ message: result.message }, { status: result.status });
  }
}
