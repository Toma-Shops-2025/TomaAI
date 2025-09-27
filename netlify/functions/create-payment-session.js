const Stripe = require('stripe');
const { createClient } = require('@supabase/supabase-js');

// Initialize Stripe
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Initialize Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://irzzehvrytkunrxqniuo.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

exports.handler = async (event, context) => {
  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { priceId, userId, userEmail, mode = 'payment' } = JSON.parse(event.body);

    if (!priceId || !userId || !userEmail) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required parameters' }),
      };
    }

    console.log('Creating payment session for:', { priceId, userId, userEmail, mode });

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: mode,
      success_url: `${process.env.URL || 'https://tomaai.online'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.URL || 'https://tomaai.online'}/cancel`,
      customer_email: userEmail,
      metadata: {
        userId,
        priceId,
      },
    });

    console.log('Stripe session created:', session.id);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        sessionId: session.id,
        url: session.url,
      }),
    };

  } catch (error) {
    console.error('Payment session creation error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error.message,
      }),
    };
  }
};