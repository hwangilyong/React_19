import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path";
import babel from "vite-plugin-babel";
import sassDts from "vite-plugin-sass-dts";

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    babel({
      include: ["app/**/*", "src/**/*"],
      filter: (name) => name.endsWith(".ts") || name.endsWith(".tsx"),
      babelConfig: {
        presets: ["@babel/preset-typescript"],
      },
    }),
    react(),
    tailwindcss(),
    sassDts({ legacyFileFormat: true }),
  ],
  oxc: false,
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@tanstack": path.resolve(__dirname, "./node_modules/@tanstack"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
  },
  esbuild: mode === "production" ? { pure: ["console.debug"] } : undefined,
}))
