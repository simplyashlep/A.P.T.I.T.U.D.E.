import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Vite exposes import.meta.env.VITE_* to the client bundle.
  // Set VITE_BACKEND_URL in your Cloudflare build environment (or .env) if you have a live API.
  // The frontend code now uses import.meta.env.VITE_BACKEND_URL (with "" fallback for static/local data).
  build: {
    outDir: "_site",
  },
});
