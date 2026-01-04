import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const res = await fetch(`${process.env.BACKEND_API_URL}/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    if (!res.ok) {
      const data = await res.json();
      return NextResponse.json({ error: data.message || 'Request failed' }, { status: res.status });
    }

    return NextResponse.json({ success: true, message: 'Password reset email sent' });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
