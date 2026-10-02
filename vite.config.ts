import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";

export default defineConfig(({ command }) => ({
  server: { port: 3000, strictPort: true },
  plugins: [
    tailwindcss(),
    tanstackStart(),
    // Nitro only builds the standalone server in .output/ for the packaged app.
    // Skipping it in dev avoids its flaky dev worker.
    ...(command === "build" ? [nitro()] : []),
    viteReact(),
  ],
}));
