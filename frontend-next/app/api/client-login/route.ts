import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.API_URL || 'http://localhost:5000';

export async function POST(req: NextRequest) {
  try {
    const { inn, password } = await req.json();

    const backendRes = await fetch(`${API_URL}/api/clients/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inn, password }),
    });

    const data = await backendRes.json();

    if (!backendRes.ok) {
      return NextResponse.json(
        { success: false, error: data.message || 'Неверный ИНН или пароль' },
        { status: backendRes.status }
      );
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set('clientToken', data.token, {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === 'true',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Client login route error:', error);
    return NextResponse.json(
      { success: false, error: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}
