import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  base: "",
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
    "process.env": JSON.stringify({ NODE_ENV: "production" }),
  },
  build: {
    outDir: resolve(__dirname, "../extension/popup-ui"),
    emptyOutDir: true,
    cssCodeSplit: false,
    lib: {
      entry: resolve(__dirname, "src/popup-main.jsx"),
      formats: ["es"],
      fileName: () => "index.js",
    },
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === "style.css") {
            return "index.css";
          }
          return "assets/[name][extname]";
        },
      },
    },
  },
});
