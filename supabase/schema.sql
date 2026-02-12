-- Create vendors table for Supabase
CREATE TABLE IF NOT EXISTS vendors (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    state TEXT NOT NULL,
    address TEXT,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    jason_score DECIMAL(3, 1) NOT NULL CHECK (jason_score >= 0 AND jason_score <= 10),
    keypoints TEXT[] DEFAULT '{}',
    tiktok_url TEXT,
    image_url TEXT,
    review_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index on state for faster filtering
CREATE INDEX IF NOT EXISTS idx_vendors_state ON vendors(state);

-- Create index on jason_score for faster sorting
CREATE INDEX IF NOT EXISTS idx_vendors_score ON vendors(jason_score DESC);

-- Create index on review_date for faster sorting
CREATE INDEX IF NOT EXISTS idx_vendors_date ON vendors(review_date DESC);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON vendors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" ON vendors
    FOR SELECT USING (true);

-- Allow service role full access (for admin operations)
CREATE POLICY "Allow service role full access" ON vendors
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Optional: If you want to allow authenticated users to modify
-- CREATE POLICY "Allow authenticated users to insert" ON vendors
--     FOR INSERT WITH CHECK (auth.role() = 'authenticated');
-- 
-- CREATE POLICY "Allow authenticated users to update" ON vendors
--     FOR UPDATE USING (auth.role() = 'authenticated');
-- 
-- CREATE POLICY "Allow authenticated users to delete" ON vendors
--     FOR DELETE USING (auth.role() = 'authenticated');
