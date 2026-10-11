import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';
import { backendError, backendRequest, publicBackendRequest } from '@/app/api/_lib/backend';

type Context = { params: Promise<{ segments: string[] }> };
const patterns: Record<string, RegExp[]> = {
  GET: [
    /^bills$/, /^bills\/\d+$/, /^shop\/manage$/, /^shop\/account\/(orders|addresses|wishlist)$/,
    /^public\/shops\/[a-z0-9-]+$/, /^public\/shops\/[a-z0-9-]+\/products\/[a-z0-9-]+$/,
    /^public\/shop-orders\/[A-Za-z0-9]+$/,
  ],
  POST: [
    /^bills\/\d+\/respond$/, /^shop\/products$/, /^shop\/content$/,
    /^shop\/account\/addresses$/, /^shop\/account\/wishlist\/\d+$/,
    /^public\/shops\/[a-z0-9-]+\/checkout$/,
  ],
  PUT: [/^shop\/products\/\d+$/, /^shop\/content\/\d+$/],
  PATCH: [/^shop\/manage$/, /^shop\/orders\/[0-9a-f-]+$/],
  DELETE: [/^shop\/products\/\d+$/, /^shop\/content\/\d+$/, /^shop\/account\/addresses\/\d+$/],
};

async function handle(req: NextRequest, context: Context) {
  const { segments } = await context.params;
  const path = segments.join('/');
  if (!patterns[req.method]?.some(pattern => pattern.test(path))) {
    return NextResponse.json({ message: 'Not found.' }, { status: 404 });
  }
  const isPublic = path.startsWith('public/');
  try {
    const data = req.method === 'GET' || req.method === 'DELETE' ? undefined : await req.json();
    const config = { method: req.method, url: `/api/v1/${path}`, data };
    const token = (await cookies()).get('auth')?.value;
    // Optional account association for a signed-in shopper; guests need no account.
    const result = isPublic
      ? await publicBackendRequest({ ...config, headers: token ? { Authorization: `Bearer ${token}` } : {} })
      : await backendRequest(config);
    return req.method === 'DELETE' ? new NextResponse(null, { status: 204 }) : NextResponse.json(result);
  } catch (error) {
    const parsed = backendError(error, 'Unable to complete request.');
    const errors = axios.isAxiosError(error) ? error.response?.data?.errors : undefined;
    const first = errors && typeof errors === 'object'
      ? Object.values(errors).flat().find(v => typeof v === 'string')
      : undefined;
    return NextResponse.json({ message: typeof first === 'string' ? first : parsed.message }, { status: parsed.status });
  }
}
export { handle as GET, handle as POST, handle as PUT, handle as PATCH, handle as DELETE };
