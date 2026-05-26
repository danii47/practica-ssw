import { NextResponse } from 'next/server';
import { AppError } from './api-error';

type ApiSuccessBody<T> = T;
type ApiErrorBody = { error: string; fields?: Record<string, string> };

export function ok<T>(data: T, status = 200): NextResponse<ApiSuccessBody<T>> {
  return NextResponse.json(data, { status });
}

export function created<T>(data: T): NextResponse<ApiSuccessBody<T>> {
  return NextResponse.json(data, { status: 201 });
}

export function noContent(): NextResponse {
  return new NextResponse(null, { status: 204 });
}

export function apiError(status: number, message: string, fields?: Record<string, string>): NextResponse<ApiErrorBody> {
  const body: ApiErrorBody = { error: message };
  if (fields) body.fields = fields;
  return NextResponse.json(body, { status });
}

export function handleError(error: unknown): NextResponse<ApiErrorBody> {
  if (error instanceof AppError) {
    return apiError(error.statusCode, error.message, error.fields);
  }
  console.error('[API Error]', error);
  return apiError(500, 'Error interno del servidor.');
}
