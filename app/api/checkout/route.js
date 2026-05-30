import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const { amount, orderId, email, products } = await request.json();

    const lineItems = products.map((product) => ({
      price_data: {
        currency: 'inr', // 1. UPI requires Indian Rupees (INR)
        product_data: {
          name: product.title,
        },
        unit_amount: Math.round(product.price * 100), 
      },
      quantity: product.amount,
    }));

    const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'upi'], // 2. Add 'upi' to accept payments via apps like GPay or PhonePe
      line_items: lineItems,
      mode: 'payment',
      customer_email: email,
      success_url: `${siteUrl}/?payment=success`,
      cancel_url: `${siteUrl}/cart`,
      metadata: { orderId: orderId },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
