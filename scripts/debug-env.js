const path = require('path');
const fs = require('fs');

console.log('Current directory:', process.cwd());
const envPath = path.resolve(process.cwd(), '.env');

try {
    if (fs.existsSync(envPath)) {
        console.log('.env file FOUND at', envPath);
        const content = fs.readFileSync(envPath, 'utf8');
        console.log('Content length:', content.length);
        console.log('First 50 chars:', content.substring(0, 50));
        console.log('First 10 bytes:', Buffer.from(content).slice(0, 10));

        if (content.includes('[YOUR-PASSWORD]')) {
            console.log('WARNING: Placeholder [YOUR-PASSWORD] found in .env!');
        } else {
            console.log('No [YOUR-PASSWORD] placeholder found.');
        }

        // Manual parsing test
        const lines = content.split('\n');
        console.log('Line count:', lines.length);
        lines.forEach((line, i) => {
            if (line.includes('DATABASE_URL')) {
                console.log(`Line ${i}: ${line.substring(0, 20)}...`);
            }
        });

    } else {
        console.log('.env file NOT FOUND at', envPath);
    }
} catch (e) {
    console.log('Error reading .env:', e.message);
}

try {
    require('dotenv').config();
    console.log('dotenv loaded');
    console.log('DATABASE_URL from process.env:', process.env.DATABASE_URL ? 'FOUND' : 'MISSING');
} catch (e) {
    console.log('dotenv load failed:', e.message);
}
