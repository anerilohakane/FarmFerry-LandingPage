const https = require('https');

https.get('https://farm-ferry-backend-new.vercel.app/api/v1/supplier/products', (resp) => {
    let data = '';

    // A chunk of data has been received.
    resp.on('data', (chunk) => {
        data += chunk;
    });

    // The whole response has been received.
    resp.on('end', () => {
        try {
            const json = JSON.parse(data);
            if (json.success) {
                const items = json.data.items || json.data.products || [];
                console.log("Items found:", items.length);
                if (items.length > 0) {
                    console.log("Sample structure:", JSON.stringify(items[0], null, 2));

                    // extract categories
                    const cats = {};
                    items.forEach(i => {
                        if (i.categoryId) {
                            const catId = i.categoryId._id || i.categoryId;
                            const catName = i.categoryId.name || "Unknown";
                            if (!cats[catId]) {
                                cats[catId] = { id: catId, name: catName, count: 0 };
                            }
                            cats[catId].count++;
                        }
                    });
                    console.log("Derived Categories:", JSON.stringify(cats, null, 2));
                }
            } else {
                console.log("Success false");
            }
        } catch (e) {
            console.error("Parse error:", e.message);
        }
    });

}).on("error", (err) => {
    console.log("Error: " + err.message);
});
