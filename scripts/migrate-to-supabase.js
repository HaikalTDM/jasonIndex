import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Error: Missing Supabase environment variables');
    console.error('Please set VITE_SUPABASE_URL and SUPABASE_SERVICE_KEY in your .env file');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function migrateData() {
    try {
        // Read vendors.json
        const dataPath = path.join(__dirname, '../src/data/vendors.json');
        const fileData = fs.readFileSync(dataPath, 'utf8');
        const vendors = JSON.parse(fileData);

        console.log(`Found ${vendors.length} vendors to migrate`);

        // Insert vendors one by one
        let successCount = 0;
        let errorCount = 0;

        for (const vendor of vendors) {
            try {
                const { error } = await supabase
                    .from('vendors')
                    .insert([vendor]);

                if (error) {
                    console.error(`Error inserting ${vendor.name}:`, error.message);
                    errorCount++;
                } else {
                    console.log(`✓ Migrated: ${vendor.name}`);
                    successCount++;
                }
            } catch (err) {
                console.error(`Error inserting ${vendor.name}:`, err.message);
                errorCount++;
            }
        }

        console.log('\n=== Migration Complete ===');
        console.log(`Success: ${successCount}`);
        console.log(`Errors: ${errorCount}`);
        console.log(`Total: ${vendors.length}`);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrateData();
