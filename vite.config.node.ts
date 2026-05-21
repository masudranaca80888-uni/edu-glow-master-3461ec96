/**
 * Node SSR build config — for self-hosted deployment (VPS / Render / Docker).
 *
 * Usage:
 *   npm run build:node           # builds .output/ with node-server preset
 *   node .output/server/index.mjs # runs the standalone Node SSR server
 *
 * This config is SEPARATE from vite.config.ts (which targets Cloudflare
 * Workers for Lovable hosting). The Lovable preview is unaffected.
 *
 * Notes:
 * - Does NOT use @lovable.dev/vite-tanstack-config, because that preset
 *   bundles the Cloudflare Vite plugin. We compose the same pieces manually.
 * - Does NOT override tanstackStart.server.entry — the custom src/server.ts
 *   wrapper is Workers-shaped ({ fetch }). For Node, we let Nitro build its
 *   standard standalone HTTP server.
 */
import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tsConfigPaths(),
    tailwindcss(),
    tanstackStart({
      target: "node-server",
    }),
    viteReact(),
  ],
  resolve: {
    dedupe: ["react", "react-dom", "@tanstack/react-router", "@tanstack/react-start"],
  },
});
