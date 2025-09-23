import starlight from "@astrojs/starlight";
import vercelServerless from "@astrojs/vercel/serverless";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import rehypeDocument from "rehype-document";
import { pluginCollapsibleCode } from "./src/plugin-collapsible-code";
import rehypeImageZoom from "./src/rehype-image-zoom";

export default defineConfig({
  integrations: [
    starlight({
      title: "Cheats",
      logo: {
        src: "./src/assets/logo_blue_small.png",
      },
      social: [
        {
          icon: "laptop",
          label: "Portfolio",
          href: "https://ritesh-raj-portfolio.vercel.app/",
        },
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/ritesh28",
        },
      ],
      favicon: "favicon.ico",
      customCss: ["./src/global.css"],
      expressiveCode: {
        plugins: [pluginCollapsibleCode()],
      },
      prerender: false,
    }),
  ],
  markdown: {
    rehypePlugins: [
      rehypeImageZoom,
      [rehypeDocument, { js: "/image-zoom.js" }],
      [
        rehypeDocument,
        {
          js: "https://cdn.jsdelivr.net/npm/flowbite@3.1.2/dist/flowbite.min.js",
        },
      ],
    ],
  },
  vite: {
    plugins: [tailwindcss()],
  },
  output: "server",
  adapter: vercelServerless({}),
  session: {
    driver: "lru-cache",
  },
});
