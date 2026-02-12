import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        if (req.method === 'GET') {
            // Get all vendors
            const { data, error } = await supabase
                .from('vendors')
                .select('*')
                .order('review_date', { ascending: false });

            if (error) throw error;
            return res.status(200).json(data);
        }

        if (req.method === 'POST') {
            // Create new vendor
            const newVendor = req.body;

            const { data, error } = await supabase
                .from('vendors')
                .insert([newVendor])
                .select()
                .single();

            if (error) throw error;
            return res.status(201).json({ message: 'Vendor added successfully', vendor: data });
        }

        if (req.method === 'PUT') {
            // Update vendor (expects ID in body)
            const { id, ...updates } = req.body;

            if (!id) {
                return res.status(400).json({ error: 'Vendor ID is required' });
            }

            const { data, error } = await supabase
                .from('vendors')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return res.status(200).json({ message: 'Vendor updated successfully', vendor: data });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ error: error.message || 'Internal server error' });
    }
}
