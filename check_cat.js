const https = require('https');

https.get('https://farm-ferry-backend-new.vercel.app/api/v1/supplier/products', (resp) => {
    let data = '';
    resp.on('data', (chunk) => { data += chunk; });
    resp.on('end', () => {
        try {
            const json = JSON.parse(data);
            if (json.success) {
                const items = json.data.items || [];
                if (items.length > 0) {
                    console.log("Category Field:", JSON.stringify(items[0].categoryId, null, 2));
                }
            }
        } catch (e) { }
    });
});
