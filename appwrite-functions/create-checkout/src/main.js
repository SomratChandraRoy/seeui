import Stripe from 'stripe';

/*
 * Appwrite Cloud Function: create-stripe-session
 * 
 * Environment Variables (set in Appwrite Console → Function → Settings → Variables):
 *   STRIPE_SECRET_KEY  → Your Stripe SECRET key (sk_live_... or sk_test_...)
 *   CLIENT_URL         → Your website URL (e.g. https://seeui.app)
 *
 * Called from frontend via Appwrite SDK: functions.createExecution(...)
 * Receives: { amount: number } where amount is in DOLLARS (minimum 5)
 * Returns:  { url: string } — a Stripe Checkout page URL
 */
export default async ({ req, res, log, error }) => {
  // ── CORS (needed for browser requests) ────────────────────────────────────
  const headers = {
    'Access-Control-Allow-Origin': process.env.CLIENT_URL || '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (req.method === 'OPTIONS') {
    return res.send('', 204, headers);
  }

  if (req.method !== 'POST') {
    return res.json({ error: 'Method not allowed' }, 405, headers);
  }

  try {
    // Parse the request body
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const amount = Number(body.amount);

    // ── Validate: minimum $5 ───────────────────────────────────────────────
    if (!amount || isNaN(amount) || amount < 5) {
      return res.json(
        { error: 'Minimum donation amount is $5 USD.' },
        400,
        headers
      );
    }

    // ── Create Stripe Checkout Session ──────────────────────────────────────
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Support SeeUI',
              description: 'Thank you for supporting SeeUI development!',
            },
            unit_amount: Math.round(amount * 100), // Convert dollars → cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/donate/success`,
      cancel_url: `${process.env.CLIENT_URL}/donate/cancel`,
    });

    log(`✅ Created checkout session for $${amount} → ${session.url}`);

    return res.json({ url: session.url }, 200, headers);
  } catch (err) {
    error(`❌ Stripe error: ${err.message}`);
    return res.json(
      { error: 'Failed to create payment session. Please try again.' },
      500,
      headers
    );
  }
};
