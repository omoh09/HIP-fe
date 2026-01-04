import { NextResponse } from 'next/server';
import { mockUsers } from '@/app/data/mockUsers';

export async function GET() {
  try {
    // Normally, you'd check cookies/session and fetch the user from DB
    // const res = await fetch(`${process.env.BACKEND_API_URL}/me`, { credentials: 'include' });
    // const data = await res.json();

    // For now, we just return the first mock user as the logged-in user
    const defaultUser = mockUsers[0];

    return NextResponse.json({
      success: true,
      user: defaultUser,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Unable to get user' }, { status: 500 });
  }
}



