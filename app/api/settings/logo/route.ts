import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';

const API_BASE_URL = process.env.API_BASE_URL;

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('logo');

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ message: 'No logo file provided' }, { status: 400 });
    }

    const uploadData = new FormData();
    uploadData.append('logo', file);

    const res = await axios.post(`${API_BASE_URL}/api/v1/settings/logo`, uploadData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    return NextResponse.json(res.data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.response?.data?.message || error.response?.data?.detail || 'Failed to upload logo' },
      { status: error.response?.status || 500 }
    );
  }
}
