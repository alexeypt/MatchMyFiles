/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        staleTimes: {
            dynamic: 0
        },
        serverExternalPackages: ['@prisma/client', '@prisma/adapter-pg']
    }
};

export default nextConfig;
