const https = require('https');

https.get('https://farm-ferry-backend-new.vercel.app/api/v1/supplier/products?limit=50', (resp) => {
    let data = '';
    resp.on('data', (chunk) => { data += chunk; });
    resp.on('end', () => {
        try {
            const json = JSON.parse(data);
            const products = json.data?.items || [];
            const cats = products.map(p => p.categoryId).filter(c => c && typeof c === 'object');

            // Find any category with a parent
            const withParent = cats.find(c => c.parent);

            console.log("Total Categories scanned from products:", cats.length);
            if (withParent) {
                console.log("Found category WITH parent:", JSON.stringify(withParent, null, 2));
            } else {
                console.log("No categories had a 'parent' field populated.");
                if (cats.length > 0) console.log("Sample Category:", JSON.stringify(cats[0], null, 2));
            }

        } catch (e) { console.error(e); }
    });
});
