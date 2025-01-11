/** @type {import('next').NextConfig} */
const nextConfig = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // Убедитесь, что пути указаны правильно
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default nextConfig;
