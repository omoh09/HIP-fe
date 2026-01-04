// import { NextResponse } from 'next/server';

// export async function GET(req: Request) {
//   // Retrieve cookies from the request headers
//   const cookies = req.headers.get('cookie') || '';

//   // Generate mock invoices (50 invoices with random data)
//   const invoices = Array.from({ length: 50 }, (_, i) => ({
//     id: `INV-${1000 + i}`,
//     client: i % 2 === 0 ? 'Elon Musk' : 'Jeff Bezos',
//     amount: Math.floor(Math.random() * 5000) + 100, // Random amount between 100 and 5000
//     status: i % 3 === 0 ? 'Paid' : 'Pending',
//     date: new Date(Date.now() - i * 86400000).toISOString(), // Random date within the last 50 days
//   }));

//   // Log received cookies and the generated invoices for debugging purposes
//   console.log('Fetched invoices with cookies:', cookies);
// //   console.log('Invoices:', invoices);

//   // Return the generated invoices as JSON response
// //   return invoices;
//   return NextResponse.json({ invoices });
// }
