import { NextResponse } from "next/server";
import axios from "axios";

const API_BASE = "http://127.0.0.1:8000";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const res = await axios.post(`${API_BASE}/auth/register`, body);

    return NextResponse.json(res.data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.response?.data?.detail || "Registration failed" },
      { status: 400 }
    );
  }
}
