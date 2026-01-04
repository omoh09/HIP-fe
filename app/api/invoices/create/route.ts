import { NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';

const API_BASE = 'http://127.0.0.1:8000';

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth')?.value;

    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();

    const res = await axios.post(
      `${API_BASE}/invoices`,
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return NextResponse.json(res.data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      {
        message:
          error?.response?.data?.detail ??
          'Invoice creation failed',
      },
      { status: 400 }
    );
  }
}
