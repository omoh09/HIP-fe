import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

const API_BASE = "http://127.0.0.1:8000";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const res = await axios.post(`${API_BASE}/api/auth/login`, body);

    const { access_token } = res.data;

    console.log("access_token:", access_token);

    // Save token in HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set("auth", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json(
      { message: "Login successful" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.response?.data?.detail || "Login failed" },
      { status: 401 }
    );
  }
}
