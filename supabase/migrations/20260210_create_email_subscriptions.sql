-- Create email_subscriptions table
CREATE TABLE IF NOT EXISTS email_subscriptions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  type text NOT NULL CHECK (type IN ('salary-alerts', 'negotiation-tips')),
  active boolean DEFAULT true,
  subscribed_at timestamp with time zone DEFAULT now(),
  unsubscribed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(email, type)
);

-- Enable RLS
ALTER TABLE email_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policy for public inserts
CREATE POLICY "Allow public inserts" ON email_subscriptions
  FOR INSERT
  WITH CHECK (true);

-- Create policy for authenticated reads
CREATE POLICY "Allow authenticated reads" ON email_subscriptions
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_email_subscriptions_email ON email_subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_email_subscriptions_type ON email_subscriptions(type);
CREATE INDEX IF NOT EXISTS idx_email_subscriptions_active ON email_subscriptions(active) WHERE active = true;

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_email_subscriptions_updated_at
  BEFORE UPDATE ON email_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
