import { NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';

const API_BASE_URL = process.env.API_BASE_URL?.replace(/\/$/, '');

export async function POST(req: Request) {
  if (!API_BASE_URL) return NextResponse.json({ message: 'Authentication service is not configured.' }, { status: 500 });
  try {
    const body = await req.json();
    const res = await axios.post(`${API_BASE_URL}/api/v1/auth/register`, body, { headers: { Accept: 'application/json', 'Content-Type': 'application/json' }, timeout: 15_000 });
    const token = res.data?.token ?? res.data?.access_token;
    if (token) {
      const cookieStore = await cookies();
      cookieStore.set('auth', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 7 });
    }
    return NextResponse.json(res.data, { status: res.status });
  } catch (error: any) {
    return NextResponse.json({ message: error?.response?.data?.detail || error?.response?.data?.message || 'Registration failed' }, { status: error?.response?.status || 400 });
  }
}
