import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Esto permite acceso desde la red local
    port: 5173, // o el puerto que uses
  },
});
