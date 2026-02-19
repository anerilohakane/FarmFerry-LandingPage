const fs = require('fs');
try {
    const raw = fs.readFileSync('temp_products.json', 'utf8'); // or try reading without encoding if binary
    // Powershell redirection might have made it UCS-2. 
    // Let's rely on node to handle BOM if present or just try to parse.
    const cleanRaw = raw.replace(/^\uFEFF/, '');
    const data = JSON.parse(cleanRaw);
    if (data.success && data.data && data.data.items) {
        console.log("Found " + data.data.items.length + " items.");
        if (data.data.items.length > 0) {
            console.log("Sample Item:", JSON.stringify(data.data.items[0], null, 2));

            // Check for categories
            const categories = new Set();
            data.data.items.forEach(item => {
                if (item.categoryId) {
                    categories.add(JSON.stringify(item.categoryId));
                }
            });
            console.log("Unique Categories:", Array.from(categories));
        }
    } else {
        console.log("Structure unexpected:", Object.keys(data));
    }
} catch (e) {
    console.error("Error:", e.message);
}
