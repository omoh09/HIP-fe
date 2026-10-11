import axios from 'axios';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_BASE_URL?.replace(/\/$/, '');
const OTP_VERIFY_ENDPOINT = process.env.OTP_VERIFY_ENDPOINT || '/api/v1/auth/otp/verify';

export async function POST(req: Request) {
  if (!API_BASE_URL) {
    return NextResponse.json({ message: 'Authentication service is not configured.' }, { status: 500 });
  }

  try {
    const body = await req.json();
    const email = String(body?.email || '').trim().toLowerCase();
    const otp = String(body?.otp || '').replace(/\D/g, '').slice(0, 8);
    const remember = body?.remember !== false;

    if (!/^\S+@\S+\.\S+$/.test(email) || otp.length < 4) {
      return NextResponse.json({ message: 'Enter the email address and the code we sent you.' }, { status: 400 });
    }

    const response = await axios.post(
      `${API_BASE_URL}${OTP_VERIFY_ENDPOINT}`,
      { email, otp },
      { headers: { Accept: 'application/json', 'Content-Type': 'application/json' }, timeout: 12_000 },
    );

    const token = response.data?.token ?? response.data?.access_token ?? response.data?.access;
    if (!token) {
      return NextResponse.json({ message: 'The sign-in service did not return a session token.' }, { status: 502 });
    }

    const cookieStore = await cookies();
    cookieStore.set('auth', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24,
    });

    return NextResponse.json({ message: 'Signed in successfully.' });
  } catch (error: any) {
    const status = error?.response?.status || 401;
    const message = error?.response?.data?.detail || error?.response?.data?.message || 'That code is invalid or has expired.';
    return NextResponse.json({ message }, { status });
  }
}
