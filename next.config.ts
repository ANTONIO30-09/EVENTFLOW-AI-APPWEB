import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. Autoriza tu red local para probar en el celular
  allowedDevOrigins: ['192.168.1.6', 'localhost:3000'],
  
  // 2. Le dice a Turbopack cuál es la raíz exacta del proyecto
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
