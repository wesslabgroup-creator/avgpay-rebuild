
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing Supabase credentials in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function testConnection() {
  console.log('Testing Supabase connection...');
  
  try {
    const { data, error } = await supabase.from('Company').select('count', { count: 'exact', head: true });
    
    if (error) {
      // If table doesn't exist, error code might be '42P01' (undefined_table)
      console.error('Connection failed or table missing:', error.message);
      
      if (error.code === '42P01') {
        console.log('It seems the tables are not created yet. Please run the migration script in your SQL editor.');
        console.log('Migration script located at: prisma/migrations/001_init_schema.sql');
      }
    } else {
      console.log('Connection successful! Company table exists.');
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

testConnection();
