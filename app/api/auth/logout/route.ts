import { NextResponse } from 'next/server';
import { COOKIE_NAME } from '@/lib/auth';

export async function POST() {
  const response = NextResponse.json({ message: 'Sesión cerrada correctamente.' });
  response.cookies.set(COOKIE_NAME, '', { maxAge: 0, path: '/' });
  return response;
}
