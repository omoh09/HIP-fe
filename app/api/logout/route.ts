import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // Check if the 'auth' cookie exists before deletion
  const cookies = req.headers.get('cookie') ?? '';
  console.log('Before Deleting Cookie - Cookies:', cookies);

  // Delete the 'auth' cookie securely
  const response = NextResponse.json({ success: true });

  // Check if cookie exists before deletion
  if (cookies.includes('auth')) {
    console.log('Auth cookie exists before deletion');
  } else {
    console.log('Auth cookie does not exist before deletion');
  }

  response.cookies.set({
    name: 'auth',
    value: '',
    maxAge: 0,           // Immediately expire the cookie
    httpOnly: true,      // Only accessible by the server
    secure: process.env.NODE_ENV === 'production',
    path: '/'
  });

  // Check if the cookie is successfully deleted after setting maxAge = 0
  const cookiesAfterDeletion = response.headers.get('Set-Cookie') ?? '';
  console.log('After Deleting Cookie - Cookies:', cookiesAfterDeletion);

  // Check if the cookie exists after deletion
  if (cookiesAfterDeletion.includes('auth=;')) {
    console.log('Auth cookie is deleted successfully');
  } else {
    console.log('Auth cookie deletion failed');
  }

  return response;
}
