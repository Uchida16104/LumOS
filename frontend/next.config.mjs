const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'cdn.glitch.global'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://lumos-faoy.onrender.com',
    NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL || 'wss://lumos-faoy.onrender.com/ws',
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://db.lxwracacdahhfxrfchtu.supabase.co',
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://lumos-faoy.onrender.com/:path*',
      },
    ];
  },
};

export default nextConfig;
