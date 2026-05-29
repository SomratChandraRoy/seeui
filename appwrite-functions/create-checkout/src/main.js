import Stripe from 'stripe';

export default async ({ req, res, log, error }) => {
  // Setup CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': process.env.FRONTEND_URL || '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Handle preflight (OPTIONS) request
  if (req.method === 'OPTIONS') {
    return res.send('', 204, corsHeaders);
  }

  // Ensure it's a POST request
  if (req.method !== 'POST') {
    return res.json({ error: 'Method not allowed' }, 405, corsHeaders);
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16', // use a pinned version
    });

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { amount } = body; // amount in cents

    if (!amount || amount < 500) {
      return res.json({ error: 'Minimum donation amount is $5.00' }, 400, corsHeaders);
    }

    const frontendUrl = process.env.FRONTEND_URL || 'https://seeui.app';

    // Create a Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Support SeeUI',
              description: 'Thank you for supporting the development of SeeUI!',
              images: [`${frontendUrl}/icon-512.png`],
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${frontendUrl}/donate/success`,
      cancel_url: `${frontendUrl}/donate/cancel`,
    });

    log(`Created Stripe checkout session for amount: ${amount}`);

    return res.json({ url: session.url }, 200, corsHeaders);
  } catch (err) {
    error('Stripe error:', err);
    return res.json({ error: err.message || 'Internal server error' }, 500, corsHeaders);
  }
};
