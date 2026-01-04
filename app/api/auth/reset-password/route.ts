import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    const res = await fetch(`${process.env.BACKEND_API_URL}/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password })
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data.message || 'Reset failed' }, { status: res.status });
    }

    return NextResponse.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
