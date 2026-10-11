import { NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';

const API_BASE_URL = process.env.API_BASE_URL?.replace(/\/$/, '');
const GOOGLE_AUTH_ENDPOINT = process.env.GOOGLE_AUTH_ENDPOINT || '/api/v1/auth/social/google';

export async function POST(req: Request) {
  if (!API_BASE_URL) return NextResponse.json({ message: 'Authentication service is not configured.' }, { status: 500 });
  try {
    const { credential, country_code } = await req.json();
    if (typeof credential !== 'string' || credential.length < 20) {
      return NextResponse.json({ message: 'Google credential is required.' }, { status: 400 });
    }
    const endpoint = `${API_BASE_URL}${GOOGLE_AUTH_ENDPOINT.startsWith('/') ? GOOGLE_AUTH_ENDPOINT : `/${GOOGLE_AUTH_ENDPOINT}`}`;
    const response = await axios.post(endpoint, { credential, ...(country_code ? { country_code } : {}) }, {
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      timeout: 15_000,
    });
    const token = response.data?.token ?? response.data?.access_token;
    if (!token) return NextResponse.json({ message: 'Google authentication succeeded but no session token was returned.' }, { status: 502 });
    const cookieStore = await cookies();
    cookieStore.set('auth', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 7,
    });
    return NextResponse.json({ message: 'Google authentication successful', user: response.data?.user ?? null });
  } catch (error: any) {
    return NextResponse.json({ message: error?.response?.data?.detail || error?.response?.data?.message || 'Unable to authenticate with Google.' }, { status: error?.response?.status || 401 });
  }
}
