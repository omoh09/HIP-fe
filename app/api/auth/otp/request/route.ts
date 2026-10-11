import axios from 'axios';
import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_BASE_URL?.replace(/\/$/, '');
const OTP_REQUEST_ENDPOINT = process.env.OTP_REQUEST_ENDPOINT || '/api/v1/auth/otp/request';

export async function POST(req: Request) {
  if (!API_BASE_URL) {
    return NextResponse.json({ message: 'Authentication service is not configured.' }, { status: 500 });
  }

  try {
    const body = await req.json();
    const email = String(body?.email || '').trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ message: 'Enter a valid email address.' }, { status: 400 });
    }

    const response = await axios.post(
      `${API_BASE_URL}${OTP_REQUEST_ENDPOINT}`,
      { email },
      { headers: { Accept: 'application/json', 'Content-Type': 'application/json' }, timeout: 12_000 },
    );

    return NextResponse.json(
      { message: response.data?.message || 'We sent a sign-in code to your email.' },
      { status: response.status },
    );
  } catch (error: any) {
    const status = error?.response?.status || 400;
    const message = error?.response?.data?.detail || error?.response?.data?.message || 'Unable to send a sign-in code.';
    return NextResponse.json({ message }, { status });
  }
}
