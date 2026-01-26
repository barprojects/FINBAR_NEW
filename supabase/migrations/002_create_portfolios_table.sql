-- Create handle_updated_at function if not exists
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create portfolios table
CREATE TABLE IF NOT EXISTS public.portfolios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  account_number TEXT NOT NULL,
  fee DECIMAL(10, 2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries by user_id
CREATE INDEX IF NOT EXISTS portfolios_user_id_idx ON public.portfolios(user_id);

-- Enable Row Level Security
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own portfolios
CREATE POLICY "Users can view own portfolios"
  ON public.portfolios
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own portfolios
CREATE POLICY "Users can insert own portfolios"
  ON public.portfolios
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own portfolios
CREATE POLICY "Users can update own portfolios"
  ON public.portfolios
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own portfolios
CREATE POLICY "Users can delete own portfolios"
  ON public.portfolios
  FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger to auto-update updated_at
CREATE TRIGGER on_portfolio_updated
  BEFORE UPDATE ON public.portfolios
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
