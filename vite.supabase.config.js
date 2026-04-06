import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    outDir: resolve(__dirname, "../extension/vendor"),
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, "src/supabase-client-main.js"),
      formats: ["iife"],
      name: "BatchGenSupabaseBundle",
      fileName: () => "supabase-client.js",
    },
    rollupOptions: {
      output: {
        extend: true,
      },
    },
  },
});
