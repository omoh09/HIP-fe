import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

const API_BASE_URL = process.env.API_BASE_URL?.replace(/\/$/, '');

export async function POST(req: Request) {
  if (!API_BASE_URL) return NextResponse.json({ message: "Authentication service is not configured." }, { status: 500 });
  try {
    const body = await req.json();
    const remember = body?.remember !== false;

    const res = await axios.post(
      `${API_BASE_URL}/api/v1/auth/login`,
      { email: body?.email, password: body?.password },
      { headers: { Accept: 'application/json', 'Content-Type': 'application/json' }, timeout: 12_000 },
    );

    // const { access } = res.data;
    const access_token = res.data?.token ?? res.data?.access_token;
    const name = res.data.user?.name || "";
    const logo = res.data.user?.logo || "";

    if (!access_token) {
      return NextResponse.json({ message: 'Login succeeded but the authentication service did not return a session token.' }, { status: 502 });
    }

    // Save token in HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set("auth", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24,
    });

    return NextResponse.json(
      { message: "Login successful", business_name: name, business_logo: logo },
      { status: 200 }
    );
  } catch (error: any) {
    const backendStatus = Number(error?.response?.status) || 500;
    const backendData = error?.response?.data;
    const backendMessage =
      (backendData && typeof backendData === 'object' && (backendData.detail || backendData.message)) ||
      (backendStatus === 404
        ? 'The configured Laravel login endpoint was not found.'
        : backendStatus >= 500
          ? 'The authentication service is temporarily unavailable.'
          : 'Email or password is incorrect.');

    return NextResponse.json(
      {
        message: backendMessage,
        ...(backendData && typeof backendData === 'object' && backendData.requires_verification
          ? { requires_verification: true, email: backendData.email }
          : {}),
      },
      { status: backendStatus === 404 ? 502 : backendStatus }
    );
  }
}
