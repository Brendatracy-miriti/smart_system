import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Conditionally load PWA plugin to avoid hard dependency during local dev
let plugins = [react()];
try {
  if (process.env.VITE_ENABLE_PWA === "true") {
    // only require when explicitly enabled
    // eslint-disable-next-line @typescript-eslint/no-var-requires, node/no-extraneous-require
    const { VitePWA } = require("vite-plugin-pwa");
    plugins.push(
      VitePWA({
        injectRegister: "auto",
        registerType: "autoUpdate",
        devOptions: { enabled: true },
        workbox: {
          globPatterns: ["**/*.{js,css,html,png,svg,ico,json}"],
        },
      })
    );
  }
} catch (e) {
  // ignore: plugin not installed or require failed
}

// https://vite.dev/config/
export default defineConfig({
  plugins,
});
