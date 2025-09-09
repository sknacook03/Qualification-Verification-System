import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: '/eduverify/',
  build: { 
    cssMinify: 'esbuild',
    outDir: 'build',
    copyPublicDir: true
  },
  publicDir: 'public'
});