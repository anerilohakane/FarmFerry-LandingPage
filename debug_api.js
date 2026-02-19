
// const fetch = require('node-fetch'); // Using global fetch in Node 22

// If not, I'll rely on the standard http module, but fetch is cleaner.
// Given Next.js environment, it likely has a recent Node version.

async function testEndpoints() {
    const cookie = 'farmferry-tokens=...'; // I don't have the token handy, but I can try without or let it fail with 401.
    // Actually, I want to see if the endpoint EXISTS (401/500/400) vs NOT EXISTS (404/405).

    const candidates = [
        // Confirmed GET exists (401), checking if POST exists
        { method: 'POST', url: 'http://localhost:3000/api/customer/addresses' },
        { method: 'GET', url: 'http://localhost:3000/api/customer/addresses' },

        // Cart Probes
        { method: 'GET', url: 'http://localhost:3000/api/cart' },
        { method: 'POST', url: 'http://localhost:3000/api/cart' },
        { method: 'POST', url: 'http://localhost:3000/api/cart/items' },
        { method: 'PUT', url: 'http://localhost:3000/api/cart' },
        { method: 'POST', url: 'http://localhost:3000/api/customer/cart' },
    ];

    for (const c of candidates) {
        try {
            console.log(`Testing ${c.method} ${c.url}...`);
            const res = await fetch(c.url, {
                method: c.method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: ['POST', 'PUT'].includes(c.method) ? JSON.stringify({}) : undefined
            });
            console.log(`Status: ${res.status} ${res.statusText}`);
            // console.log('Headers:', res.headers.raw());
            if (res.status !== 404 && res.status !== 405) {
                console.log('>>> POTENTIAL HIT!');
            }
            const text = await res.text();
            console.log('Body Preview:', text.substring(0, 100));
            console.log('---');
        } catch (e) {
            console.error(`Error testing ${c.url}:`, e.message);
        }
    }
}

testEndpoints();
