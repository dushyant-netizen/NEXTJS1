import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(request) {
  // Initialize Stripe inside the handler to prevent build-time environment errors
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-10-29', // Use the latest stable API version
  });

  try {
    const { amount, orderId, email, products } = await request.json();

    const lineItems = products.map((product) => ({
      price_data: {
        currency: 'inr',
        product_data: {
          name: product.title,
        },
        unit_amount: Math.round(product.price * 100),
      },
      quantity: product.amount,
    }));

    const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Stripe automatically enables UPI for INR transactions if Link is enabled 
    // in your Dashboard. Removing 'payment_method_types' is the 2026 best practice.
    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: 'payment',
      customer_email: email,
      success_url: `${siteUrl}/?payment=success`,
      cancel_url: `${siteUrl}/cart`,
      metadata: { orderId: orderId },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe Checkout Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}