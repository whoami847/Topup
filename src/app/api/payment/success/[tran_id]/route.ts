
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  req: NextRequest
) {
  // This endpoint is just for redirecting the user.
  // The actual fulfillment should happen via the IPN endpoint for security.
  return NextResponse.redirect(`${process.env.CLIENT_URL}/payment/success`);
}
