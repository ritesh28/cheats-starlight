// @ts-check
import starlight from "@astrojs/starlight";
import vercelServerless from "@astrojs/vercel/serverless";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import { pluginCollapsibleCode } from "./src/plugins/collapsible-code.ts";

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: "My Docs",
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/withastro/starlight",
        },
      ],
      routeMiddleware: "./src/routeData.ts",
      customCss: ["./src/styles/global.css", "./src/styles/local.css"],
      expressiveCode: {
        plugins: [pluginCollapsibleCode()],
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  output: "server",
  adapter: vercelServerless({}),
});
