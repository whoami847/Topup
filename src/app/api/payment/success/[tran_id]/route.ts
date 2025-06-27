
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  req: NextRequest
) {
  // This endpoint is just for redirecting the user.
  // The actual fulfillment should happen via the IPN endpoint for security.
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
  return NextResponse.redirect(`${clientUrl}/payment/success`);
}
