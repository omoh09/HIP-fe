import { NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';
import {
  API_BASE_URL,
  backendError,
  backendHeaders,
} from '@/app/api/_lib/backend';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth')?.value;

  if (!token) {
    return NextResponse.json({ message: 'You are not authenticated.' }, { status: 401 });
  }

  if (!API_BASE_URL) {
    return NextResponse.json(
      { message: 'The application is not configured correctly.' },
      { status: 500 },
    );
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/api/v1/auth/me`, {
      headers: backendHeaders(token),
      timeout: 10_000,
      validateStatus: () => true,
    });

    if (response.status === 401 || response.status === 403) {
      const result = NextResponse.json(
        { message: 'Your session has expired. Please sign in again.' },
        { status: 401, headers: { 'Cache-Control': 'private, no-store' } },
      );

      result.cookies.set({
        name: 'auth',
        value: '',
        maxAge: 0,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      });

      return result;
    }

    if (response.status < 200 || response.status >= 300) {
      const message =
        response.data?.detail ??
        response.data?.message ??
        'Unable to load your account.';
      return NextResponse.json(
        { message: typeof message === 'string' ? message : 'Unable to load your account.' },
        { status: response.status, headers: { 'Cache-Control': 'private, no-store' } },
      );
    }

    const payload = response.data?.user ?? response.data;

    return NextResponse.json(payload, {
      headers: { 'Cache-Control': 'private, no-store' },
    });
  } catch (error) {
    const result = backendError(error, 'Unable to load your account.');
    return NextResponse.json(
      { message: result.message },
      { status: result.status, headers: { 'Cache-Control': 'private, no-store' } },
    );
  }
}
