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
        ],
    },
    // ADD THIS REWRITES SECTION
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'https://farm-ferry-backend-new.vercel.app/api/v1/:path*',
            },
        ];
    }
};

export default nextConfig;
