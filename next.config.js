/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['avatars.githubusercontent.com', 'localhost'] // <== Domain name
  }
}

module.exports = nextConfig
