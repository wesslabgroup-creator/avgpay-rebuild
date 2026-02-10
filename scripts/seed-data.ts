
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// ------------------------------------------------------------------
// COPY OF DATA FROM src/lib/data.ts (Full Dataset)
// ------------------------------------------------------------------
const MARKET_DATA: Record<string, Record<string, Record<string, Record<string, any>>>> = {
    // Google
    "Google": {
        "Software Engineer": {
            "San Francisco, CA": {
                "Junior (L1-L2)": { median: 180000, blsMedian: 135000, min: 120000, max: 240000, p10: 150000, p25: 165000, p75: 200000, p90: 230000 },
                "Mid (L3-L4)": { median: 280000, blsMedian: 180000, min: 230000, max: 380000, p10: 220000, p25: 250000, p75: 320000, p90: 380000 },
                "Senior (L5-L6)": { median: 400000, blsMedian: 260000, min: 350000, max: 500000, p10: 350000, p25: 380000, p75: 480000, p90: 580000 },
                "Staff+ (L7+)": { median: 600000, blsMedian: 380000, min: 550000, max: 700000, p10: 500000, p25: 550000, p75: 700000, p90: 850000 },
            },
            "New York, NY": {
                "Junior (L1-L2)": { median: 170000, blsMedian: 128000, min: 120000, max: 270000, p10: 140000, p25: 155000, p75: 190000, p90: 220000 },
                "Mid (L3-L4)": { median: 260000, blsMedian: 170000, min: 210000, max: 360000, p10: 210000, p25: 235000, p75: 300000, p90: 350000 },
                "Senior (L5-L6)": { median: 380000, blsMedian: 240000, min: 330000, max: 480000, p10: 330000, p25: 360000, p75: 450000, p90: 550000 },
                "Staff+ (L7+)": { median: 560000, blsMedian: 360000, min: 510000, max: 660000, p10: 480000, p25: 520000, p75: 650000, p90: 800000 },
            },
            "Seattle, WA": {
                "Junior (L1-L2)": { median: 175000, blsMedian: 132000, min: 125000, max: 275000, p10: 145000, p25: 160000, p75: 195000, p90: 225000 },
                "Mid (L3-L4)": { median: 270000, blsMedian: 175000, min: 220000, max: 370000, p10: 215000, p25: 245000, p75: 310000, p90: 365000 },
                "Senior (L5-L6)": { median: 390000, blsMedian: 250000, min: 340000, max: 490000, p10: 340000, p25: 365000, p75: 460000, p90: 560000 },
                "Staff+ (L7+)": { median: 580000, blsMedian: 370000, min: 530000, max: 680000, p10: 490000, p25: 535000, p75: 675000, p90: 825000 },
            },
        },
        "Product Manager": {
            "San Francisco, CA": {
                "Junior (L1-L2)": { median: 160000, blsMedian: 125000, min: 110000, max: 210000, p10: 130000, p25: 145000, p75: 180000, p90: 210000 },
                "Mid (L3-L4)": { median: 250000, blsMedian: 170000, min: 200000, max: 300000, p10: 200000, p25: 225000, p75: 285000, p90: 340000 },
                "Senior (L5-L6)": { median: 350000, blsMedian: 245000, min: 300000, max: 450000, p10: 300000, p25: 325000, p75: 400000, p90: 500000 },
                "Staff+ (L7+)": { median: 500000, blsMedian: 350000, min: 450000, max: 600000, p10: 420000, p25: 460000, p75: 580000, p90: 700000 },
            },
            "New York, NY": {
                "Junior (L1-L2)": { median: 150000, blsMedian: 118000, min: 100000, max: 200000, p10: 120000, p25: 135000, p75: 170000, p90: 200000 },
                "Mid (L3-L4)": { median: 230000, blsMedian: 160000, min: 180000, max: 280000, p10: 185000, p25: 210000, p75: 265000, p90: 320000 },
                "Senior (L5-L6)": { median: 330000, blsMedian: 225000, min: 280000, max: 380000, p10: 280000, p25: 305000, p75: 380000, p90: 470000 },
                "Staff+ (L7+)": { median: 470000, blsMedian: 330000, min: 420000, max: 570000, p10: 400000, p25: 435000, p75: 550000, p90: 660000 },
            },
        },
    },
    // Meta
    "Meta": {
        "Software Engineer": {
            "San Francisco, CA": {
                "Junior (L1-L2)": { median: 175000, blsMedian: 135000, min: 125000, max: 225000, p10: 145000, p25: 160000, p75: 195000, p90: 225000 },
                "Mid (L3-L4)": { median: 275000, blsMedian: 180000, min: 225000, max: 375000, p10: 215000, p25: 245000, p75: 315000, p90: 375000 },
                "Senior (L5-L6)": { median: 390000, blsMedian: 260000, min: 340000, max: 500000, p10: 340000, p25: 365000, p75: 465000, p90: 565000 },
                "Staff+ (L7+)": { median: 580000, blsMedian: 380000, min: 530000, max: 680000, p10: 490000, p25: 535000, p75: 675000, p90: 825000 },
            },
            "New York, NY": {
                "Junior (L1-L2)": { median: 165000, blsMedian: 128000, min: 115000, max: 215000, p10: 135000, p25: 150000, p75: 185000, p90: 215000 },
                "Mid (L3-L4)": { median: 255000, blsMedian: 170000, min: 205000, max: 305000, p10: 205000, p25: 230000, p75: 295000, p90: 345000 },
                "Senior (L5-L6)": { median: 370000, blsMedian: 240000, min: 320000, max: 470000, p10: 320000, p25: 345000, p75: 440000, p90: 540000 },
                "Staff+ (L7+)": { median: 550000, blsMedian: 360000, min: 500000, max: 650000, p10: 470000, p25: 510000, p75: 640000, p90: 790000 },
            },
            "Seattle, WA": {
                "Junior (L1-L2)": { median: 170000, blsMedian: 132000, min: 120000, max: 220000, p10: 140000, p25: 155000, p75: 190000, p90: 220000 },
                "Mid (L3-L4)": { median: 265000, blsMedian: 175000, min: 215000, max: 315000, p10: 210000, p25: 240000, p75: 305000, p90: 360000 },
                "Senior (L5-L6)": { median: 380000, blsMedian: 250000, min: 330000, max: 480000, p10: 330000, p25: 355000, p75: 450000, p90: 550000 },
                "Staff+ (L7+)": { median: 565000, blsMedian: 370000, min: 515000, max: 665000, p10: 480000, p25: 522000, p75: 658000, p90: 808000 },
            },
        },
        "Product Manager": {
            "San Francisco, CA": {
                "Junior (L1-L2)": { median: 155000, blsMedian: 125000, min: 105000, max: 205000, p10: 125000, p25: 140000, p75: 175000, p90: 205000 },
                "Mid (L3-L4)": { median: 245000, blsMedian: 170000, min: 195000, max: 295000, p10: 195000, p25: 220000, p75: 280000, p90: 335000 },
                "Senior (L5-L6)": { median: 340000, blsMedian: 245000, min: 290000, max: 440000, p10: 290000, p25: 315000, p75: 390000, p90: 490000 },
                "Staff+ (L7+)": { median: 490000, blsMedian: 350000, min: 440000, max: 590000, p10: 410000, p25: 450000, p75: 570000, p90: 690000 },
            },
            "New York, NY": {
                "Junior (L1-L2)": { median: 145000, blsMedian: 118000, min: 95000, max: 195000, p10: 115000, p25: 130000, p75: 165000, p90: 195000 },
                "Mid (L3-L4)": { median: 225000, blsMedian: 160000, min: 175000, max: 275000, p10: 180000, p25: 205000, p75: 260000, p90: 315000 },
                "Senior (L5-L6)": { median: 320000, blsMedian: 225000, min: 270000, max: 370000, p10: 270000, p25: 295000, p75: 370000, p90: 460000 },
                "Staff+ (L7+)": { median: 460000, blsMedian: 330000, min: 410000, max: 560000, p10: 390000, p25: 425000, p75: 540000, p90: 650000 },
            },
        },
    },
    // Amazon
    "Amazon": {
        "Software Engineer": {
            "San Francisco, CA": {
                "Junior (L1-L2)": { median: 160000, blsMedian: 135000, min: 110000, max: 210000, p10: 130000, p25: 145000, p75: 180000, p90: 210000 },
                "Mid (L3-L4)": { median: 250000, blsMedian: 180000, min: 200000, max: 300000, p10: 200000, p25: 225000, p75: 290000, p90: 340000 },
                "Senior (L5-L6)": { median: 350000, blsMedian: 260000, min: 300000, max: 450000, p10: 300000, p25: 325000, p75: 400000, p90: 500000 },
                "Staff+ (L7+)": { median: 520000, blsMedian: 380000, min: 470000, max: 620000, p10: 440000, p25: 480000, p75: 600000, p90: 740000 },
            },
            "New York, NY": {
                "Junior (L1-L2)": { median: 155000, blsMedian: 128000, min: 105000, max: 205000, p10: 125000, p25: 140000, p75: 175000, p90: 205000 },
                "Mid (L3-L4)": { median: 240000, blsMedian: 170000, min: 190000, max: 290000, p10: 190000, p25: 215000, p75: 275000, p90: 325000 },
                "Senior (L5-L6)": { median: 340000, blsMedian: 240000, min: 290000, max: 440000, p10: 290000, p25: 315000, p75: 390000, p90: 490000 },
                "Staff+ (L7+)": { median: 500000, blsMedian: 360000, min: 450000, max: 600000, p10: 420000, p25: 460000, p75: 580000, p90: 700000 },
            },
            "Seattle, WA": {
                "Junior (L1-L2)": { median: 165000, blsMedian: 132000, min: 115000, max: 215000, p10: 135000, p25: 150000, p75: 185000, p90: 215000 },
                "Mid (L3-L4)": { median: 255000, blsMedian: 175000, min: 205000, max: 305000, p10: 205000, p25: 230000, p75: 295000, p90: 345000 },
                "Senior (L5-L6)": { median: 360000, blsMedian: 250000, min: 310000, max: 460000, p10: 310000, p25: 335000, p75: 415000, p90: 515000 },
                "Staff+ (L7+)": { median: 540000, blsMedian: 370000, min: 490000, max: 640000, p10: 460000, p25: 500000, p75: 630000, p90: 770000 },
            },
        },
        "Product Manager": {
            "San Francisco, CA": {
                "Junior (L1-L2)": { median: 140000, blsMedian: 125000, min: 90000, max: 190000, p10: 110000, p25: 125000, p75: 160000, p90: 190000 },
                "Mid (L3-L4)": { median: 220000, blsMedian: 170000, min: 170000, max: 270000, p10: 175000, p25: 200000, p75: 255000, p90: 305000 },
                "Senior (L5-L6)": { median: 310000, blsMedian: 245000, min: 260000, max: 360000, p10: 260000, p25: 285000, p75: 360000, p90: 450000 },
                "Staff+ (L7+)": { median: 450000, blsMedian: 350000, min: 400000, max: 550000, p10: 380000, p25: 415000, p75: 530000, p90: 640000 },
            },
            "New York, NY": {
                "Junior (L1-L2)": { median: 130000, blsMedian: 118000, min: 80000, max: 180000, p10: 100000, p25: 115000, p75: 150000, p90: 180000 },
                "Mid (L3-L4)": { median: 200000, blsMedian: 160000, min: 150000, max: 250000, p10: 160000, p25: 180000, p75: 235000, p90: 280000 },
                "Senior (L5-L6)": { median: 290000, blsMedian: 225000, min: 240000, max: 340000, p10: 240000, p25: 265000, p75: 340000, p90: 420000 },
                "Staff+ (L7+)": { median: 420000, blsMedian: 330000, min: 370000, max: 520000, p10: 355000, p25: 390000, p75: 495000, p90: 600000 },
            },
        },
    },
    // Apple
    "Apple": {
        "Software Engineer": {
            "San Francisco, CA": {
                "Junior (L1-L2)": { median: 170000, blsMedian: 135000, min: 120000, max: 220000, p10: 140000, p25: 155000, p75: 190000, p90: 220000 },
                "Mid (L3-L4)": { median: 260000, blsMedian: 180000, min: 210000, max: 310000, p10: 210000, p25: 235000, p75: 300000, p90: 350000 },
                "Senior (L5-L6)": { median: 370000, blsMedian: 260000, min: 320000, max: 420000, p10: 320000, p25: 345000, p75: 430000, p90: 530000 },
                "Staff+ (L7+)": { median: 550000, blsMedian: 380000, min: 500000, max: 650000, p10: 470000, p25: 510000, p75: 640000, p90: 790000 },
            },
            "New York, NY": {
                "Junior (L1-L2)": { median: 160000, blsMedian: 128000, min: 110000, max: 210000, p10: 130000, p25: 145000, p75: 180000, p90: 210000 },
                "Mid (L3-L4)": { median: 250000, blsMedian: 170000, min: 200000, max: 300000, p10: 200000, p25: 225000, p75: 290000, p90: 340000 },
                "Senior (L5-L6)": { median: 350000, blsMedian: 240000, min: 300000, max: 400000, p10: 300000, p25: 325000, p75: 400000, p90: 500000 },
                "Staff+ (L7+)": { median: 530000, blsMedian: 360000, min: 480000, max: 630000, p10: 450000, p25: 490000, p75: 620000, p90: 760000 },
            },
            "Seattle, WA": {
                "Junior (L1-L2)": { median: 165000, blsMedian: 132000, min: 115000, max: 215000, p10: 135000, p25: 150000, p75: 185000, p90: 215000 },
                "Mid (L3-L4)": { median: 255000, blsMedian: 175000, min: 205000, max: 305000, p10: 205000, p25: 230000, p75: 295000, p90: 345000 },
                "Senior (L5-L6)": { median: 360000, blsMedian: 250000, min: 310000, max: 410000, p10: 310000, p25: 335000, p75: 415000, p90: 515000 },
                "Staff+ (L7+)": { median: 540000, blsMedian: 370000, min: 490000, max: 640000, p10: 460000, p25: 500000, p75: 630000, p90: 770000 },
            },
        },
        "Product Manager": {
            "San Francisco, CA": {
                "Junior (L1-L2)": { median: 150000, blsMedian: 125000, min: 100000, max: 200000, p10: 120000, p25: 135000, p75: 170000, p90: 200000 },
                "Mid (L3-L4)": { median: 230000, blsMedian: 170000, min: 180000, max: 280000, p10: 185000, p25: 210000, p75: 265000, p90: 320000 },
                "Senior (L5-L6)": { median: 320000, blsMedian: 245000, min: 270000, max: 370000, p10: 270000, p25: 295000, p75: 370000, p90: 460000 },
                "Staff+ (L7+)": { median: 470000, blsMedian: 350000, min: 420000, max: 570000, p10: 395000, p25: 435000, p75: 550000, p90: 660000 },
            },
            "New York, NY": {
                "Junior (L1-L2)": { median: 140000, blsMedian: 118000, min: 90000, max: 190000, p10: 110000, p25: 125000, p75: 160000, p90: 190000 },
                "Mid (L3-L4)": { median: 210000, blsMedian: 160000, min: 160000, max: 260000, p10: 170000, p25: 190000, p75: 245000, p90: 295000 },
                "Senior (L5-L6)": { median: 300000, blsMedian: 225000, min: 250000, max: 350000, p10: 250000, p25: 275000, p75: 350000, p90: 435000 },
                "Staff+ (L7+)": { median: 440000, blsMedian: 330000, min: 390000, max: 540000, p10: 375000, p25: 410000, p75: 520000, p90: 625000 },
            },
        },
    },
    // Microsoft
    "Microsoft": {
        "Software Engineer": {
            "San Francisco, CA": {
                "Junior (L1-L2)": { median: 165000, blsMedian: 135000, min: 115000, max: 215000, p10: 135000, p25: 150000, p75: 185000, p90: 215000 },
                "Mid (L3-L4)": { median: 255000, blsMedian: 180000, min: 205000, max: 305000, p10: 205000, p25: 230000, p75: 295000, p90: 345000 },
                "Senior (L5-L6)": { median: 360000, blsMedian: 260000, min: 310000, max: 410000, p10: 310000, p25: 335000, p75: 415000, p90: 515000 },
                "Staff+ (L7+)": { median: 530000, blsMedian: 380000, min: 480000, max: 630000, p10: 450000, p25: 490000, p75: 620000, p90: 760000 },
            },
            "New York, NY": {
                "Junior (L1-L2)": { median: 155000, blsMedian: 128000, min: 105000, max: 205000, p10: 125000, p25: 140000, p75: 175000, p90: 205000 },
                "Mid (L3-L4)": { median: 240000, blsMedian: 170000, min: 190000, max: 290000, p10: 190000, p25: 215000, p75: 275000, p90: 325000 },
                "Senior (L5-L6)": { median: 340000, blsMedian: 240000, min: 290000, max: 390000, p10: 290000, p25: 315000, p75: 390000, p90: 490000 },
                "Staff+ (L7+)": { median: 510000, blsMedian: 360000, min: 460000, max: 560000, p10: 435000, p25: 475000, p75: 600000, p90: 735000 },
            },
            "Seattle, WA": {
                "Junior (L1-L2)": { median: 170000, blsMedian: 132000, min: 120000, max: 220000, p10: 140000, p25: 155000, p75: 190000, p90: 220000 },
                "Mid (L3-L4)": { median: 260000, blsMedian: 175000, min: 210000, max: 310000, p10: 210000, p25: 235000, p75: 300000, p90: 350000 },
                "Senior (L5-L6)": { median: 370000, blsMedian: 250000, min: 320000, max: 420000, p10: 320000, p25: 345000, p75: 430000, p90: 530000 },
                "Staff+ (L7+)": { median: 550000, blsMedian: 370000, min: 500000, max: 600000, p10: 470000, p25: 510000, p75: 640000, p90: 790000 },
            },
        },
        "Product Manager": {
            "San Francisco, CA": {
                "Junior (L1-L2)": { median: 145000, blsMedian: 125000, min: 95000, max: 195000, p10: 115000, p25: 130000, p75: 165000, p90: 195000 },
                "Mid (L3-L4)": { median: 225000, blsMedian: 170000, min: 175000, max: 275000, p10: 180000, p25: 205000, p75: 260000, p90: 315000 },
                "Senior (L5-L6)": { median: 315000, blsMedian: 245000, min: 265000, max: 365000, p10: 265000, p25: 290000, p75: 365000, p90: 455000 },
                "Staff+ (L7+)": { median: 460000, blsMedian: 350000, min: 410000, max: 510000, p10: 390000, p25: 425000, p75: 540000, p90: 650000 },
            },
            "New York, NY": {
                "Junior (L1-L2)": { median: 135000, blsMedian: 118000, min: 85000, max: 185000, p10: 105000, p25: 120000, p75: 155000, p90: 185000 },
                "Mid (L3-L4)": { median: 205000, blsMedian: 160000, min: 155000, max: 255000, p10: 165000, p25: 185000, p75: 240000, p90: 290000 },
                "Senior (L5-L6)": { median: 295000, blsMedian: 225000, min: 245000, max: 345000, p10: 245000, p25: 270000, p75: 345000, p90: 430000 },
                "Staff+ (L7+)": { median: 430000, blsMedian: 330000, min: 380000, max: 480000, p10: 365000, p25: 400000, p75: 505000, p90: 610000 },
            },
        },
    },
};


import { randomUUID } from 'crypto';

async function seed() {
    console.log('🌱 Starting seed...');

    // Helper to get or insert Company
    async function getOrInsertCompany(name: string, slug: string) {
        const { data: existing } = await supabase
            .from('Company')
            .select('id')
            .eq('slug', slug)
            .single();

        if (existing) return existing.id;

        const { data: created, error } = await supabase
            .from('Company')
            .insert({
                id: randomUUID(),
                name,
                slug,
                domain: `${slug}.com`,
                updatedAt: new Date()
            })
            .select('id')
            .single();

        if (error) throw error;
        return created.id;
    }

    // Helper to get or insert Role
    async function getOrInsertRole(title: string, slug: string) {
        const { data: existing } = await supabase
            .from('Role')
            .select('id')
            .eq('slug', slug)
            .single();

        if (existing) return existing.id;

        const { data: created, error } = await supabase
            .from('Role')
            .insert({
                id: randomUUID(),
                title,
                canonicalTitle: title,
                slug
            })
            .select('id')
            .single();

        if (error) throw error;
        return created.id;
    }

    // Helper to get or insert Location
    async function getOrInsertLocation(city: string, state: string, slug: string) {
        const { data: existing } = await supabase
            .from('Location')
            .select('id')
            .eq('slug', slug)
            .single();

        if (existing) return existing.id;

        const { data: created, error } = await supabase
            .from('Location')
            .insert({
                id: randomUUID(),
                city,
                state,
                metro: city,
                slug
            })
            .select('id')
            .single();

        if (error) throw error;
        return created.id;
    }

    // Clean up old verified data to prevent duplicates on re-run
    await supabase.from('Salary').delete().eq('source', 'avgpay-verified-v1');

    for (const [companyName, roles] of Object.entries(MARKET_DATA)) {
        try {
            // 1. Company
            const companySlug = companyName.toLowerCase().replace(/\s+/g, '-');
            const companyId = await getOrInsertCompany(companyName, companySlug);

            for (const [roleTitle, locations] of Object.entries(roles)) {
                // 2. Role
                const roleSlug = roleTitle.toLowerCase().replace(/\s+/g, '-');
                const roleId = await getOrInsertRole(roleTitle, roleSlug);

                for (const [locationName, levels] of Object.entries(locations)) {
                    // 3. Location
                    const locationSlug = locationName.toLowerCase().split(',')[0].replace(/\s+/g, '-');
                    const [city, state] = locationName.split(',').map(s => s.trim());
                    const locationId = await getOrInsertLocation(city, state, locationSlug);

                    for (const [level, data] of Object.entries(levels)) {
                        // 4. Insert Salary Record
                        const { error: salaryError } = await supabase
                            .from('Salary')
                            .insert({
                                id: randomUUID(),
                                baseSalary: Math.round(data.median * 0.6),
                                equity: Math.round(data.median * 0.3),
                                bonus: Math.round(data.median * 0.1),
                                totalComp: data.median,
                                level: level,
                                companyId: companyId,
                                roleId: roleId,
                                locationId: locationId,
                                source: 'avgpay-verified-v1',
                                verified: true
                            });

                        if (salaryError) {
                            console.error(`Error creating salary for ${companyName} - ${level}:`, salaryError);
                        } else {
                            console.log(`✅ Seeded: ${companyName} - ${roleTitle} - ${locationName} - ${level}`);
                        }
                    }
                }
            }
        } catch (err) {
            console.error(`Error processing ${companyName}:`, err);
        }
    }
}

seed().catch(console.error);
