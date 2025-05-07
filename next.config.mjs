/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['edamam-product-images.s3.amazonaws.com'],
  },
};

export default nextConfig;
