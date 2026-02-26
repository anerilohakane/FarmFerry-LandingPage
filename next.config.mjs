/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'cdn.example.com',
            },
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
            },
            {
                protocol: 'https',
                hostname: 'encrypted-tbn0.gstatic.com',
            },
            {
                protocol: 'https',
                hostname: 'beejwala.com',
            },
            {
                protocol: 'https',
                hostname: 'www.bbassets.com',
            },
            {
                protocol: 'https',
                hostname: 'via.placeholder.com',
            },
            {
                protocol: 'https',
                hostname: 'placehold.co',
            },
            {
                protocol: 'http',
                hostname: 'example.com',
            },
        ],
        dangerouslyAllowSVG: true,
        contentDispositionType: 'attachment',
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    },
    // ADD THIS REWRITES SECTION
    async rewrites() {
        return [
            {
                source: '/api/auth/:path*',
                destination: 'https://farm-ferry-backend-new.vercel.app/api/v1/auth/:path*',
            },
            {
                source: '/api/products',
                destination: 'https://farm-ferry-backend-new.vercel.app/api/v1/supplier/products',
            },
            {
                source: '/api/cart/:path*',
                destination: 'https://farm-ferry-backend-new.vercel.app/api/v1/cart/:path*',
            },
            {
                source: '/api/customer/:path*',
                destination: 'https://farm-ferry-backend-new.vercel.app/api/v1/customer/:path*',
            },
            {
                source: '/api/orders/:path*',
                destination: 'https://farm-ferry-backend-new.vercel.app/api/v1/orders/:path*',
            },
            {
                source: '/uploads/:path*',
                destination: 'https://farm-ferry-backend-new.vercel.app/uploads/:path*',
            },
            {
                source: '/api/:path*',
                destination: 'https://farm-ferry-backend-new.vercel.app/api/v1/:path*',
            },
        ];
    }
};

export default nextConfig;
