
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  req: NextRequest
) {
  // This endpoint is just for redirecting the user.
  // The actual fulfillment should happen via the IPN endpoint for security.
  const protocol = req.headers.get('x-forwarded-proto') || 'http';
  const host = req.headers.get('host');
  const baseUrl = `${protocol}://${host}`;
  return NextResponse.redirect(`${baseUrl}/payment/success`);
}
