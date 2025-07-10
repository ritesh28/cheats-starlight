// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import { pluginCollapsibleCode } from "./src/plugins/collapsible-code.ts";

import tailwindcss from "@tailwindcss/vite";

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
});
