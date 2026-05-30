import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe without the invalid API version string
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request) {
  // 1. Capture the raw body text and Stripe security signature safely
  const rawBody = await request.text();
  const sig = request.headers.get('stripe-signature');

  let event;

  try {
    // 2. Cryptographically verify that the request came directly from Stripe
    event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
  } catch (err) {
    console.error(`❌ Webhook signature verification failed:`, err.message);
    return NextResponse.json({ error: `Signature verification failed: ${err.message}` }, { status: 400 });
  }

  // 3. Handle the verified event type
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const completedOrderId = session.metadata?.orderId;

    console.log(`✅ Success callback! Order ID ${completedOrderId} paid safely.`);
    
    // TODO: Put your database updating strings here (e.g., set status to 'PAID')
  }

  // 4. Return a 200 OK response to acknowledge receipt of the event
  return NextResponse.json({ received: true }, { status: 200 });
}
