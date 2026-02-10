import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: NextRequest) {
  try {
    const { email, type } = await request.json();

    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    if (!type || !['salary-alerts', 'negotiation-tips'].includes(type)) {
      return NextResponse.json(
        { error: 'Valid subscription type is required' },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Insert into email_subscriptions table
    const { data, error } = await supabase
      .from('email_subscriptions')
      .insert({
        email,
        type,
        subscribed_at: new Date().toISOString(),
        active: true,
      })
      .select()
      .single();

    if (error) {
      // Handle duplicate email gracefully
      if (error.code === '23505') {
        return NextResponse.json(
          { message: 'You are already subscribed!' },
          { status: 200 }
        );
      }

      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to subscribe. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: 'Successfully subscribed!',
        data
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Subscribe error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
