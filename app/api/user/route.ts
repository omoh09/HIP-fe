import { NextResponse } from 'next/server';
import { mockUsers } from '@/app/data/mockUsers';

export async function GET(req: Request) {
  try {
    const cookie = req.headers.get('cookie') ?? ''; // Get cookies from the request
    const authHeader = req.headers.get('authorization') ?? ''; // Get Authorization header

    // const res = await fetch(`${process.env.BACKEND_API_URL}/me`, {
    //   headers: {
    //     Cookie: cookie,
    //     Authorization: authHeader,
    //   },
    //   cache: 'no-store', // Prevent caching to always fetch fresh data
    // });

    // if (!res.ok) {
    //   // If response status is 401, redirect to the sign-in page
    //   return NextResponse.redirect(new URL('/sign-in', req.url));
    // }

    // If response is OK, parse user data
    // const user = await res.json();
    // return NextResponse.json(user);
    const defaultUser = mockUsers[0];
    
    return NextResponse.json({
        success: true,
        user: defaultUser,
      });

  } catch (error) {
    console.error('Error fetching user data:', error);
    // If there's an error, redirect to the sign-in page
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }
}
