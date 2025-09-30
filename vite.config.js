import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
/*export default defineConfig({
  plugins: [react()],
})
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
*/


export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // ثبت البورت على 5173
    strictPort: true, // لو البورت مش فاضي رح يعطي Error بدل ما يغيّره
  },
});