// import { NextResponse } from 'next/server';
// import jwt from 'jsonwebtoken';  // You'll need to install this to decode the JWT token
// import { NextRequest } from 'next/server';

// // This function will run for each request to check for authentication
// export async function middleware(req: NextRequest) {
//   // Get the cookie from the request headers
//   const authCookie = req.cookies.get('auth');

//   // If no cookie is found, redirect to the login page
//   if (!authCookie) {
//     console.log('No auth cookie found. Redirecting to login...');
//     return NextResponse.redirect(new URL('/login', req.url));
//   }

// //   try {
// //     // Validate the token if the cookie exists
// //     const decodedToken = jwt.verify(authCookie, process.env.JWT_SECRET as string);

// //     // Optionally, check if the token has expired
// //     const currentTime = Math.floor(Date.now() / 1000); // Get the current time in seconds
// //     if (decodedToken.exp < currentTime) {
// //       console.log('Token expired. Redirecting to login...');
// //       return NextResponse.redirect(new URL('/login', req.url));
// //     }

// //     // If valid, pass the request along
// //     return NextResponse.next();
// //   } catch (error) {
// //     console.log('Invalid auth token. Redirecting to login...');
// //     return NextResponse.redirect(new URL('/login', req.url));
// //   }
// // }

// export const config = {
//   matcher: ['/api/protected/*', '/dashboard/*'], // Adjust the paths you want to protect
// };
