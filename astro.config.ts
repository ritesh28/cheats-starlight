import starlight from "@astrojs/starlight";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import rehypeDocument from "rehype-document";
import { pluginAccordionCode } from "./src/plugin-accordion-code";
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
        plugins: [pluginAccordionCode()],
        defaultProps: {
          wrap: true,
          title: "my-code.ext",
        },
      },
      prerender: false,
    }),
  ],
  markdown: {
    rehypePlugins: [
      rehypeImageZoom,
      [
        rehypeDocument,
        {
          js: ["/image-zoom.js", "/accordion.js"],
        },
      ],
    ],
  },
  vite: {
    plugins: [tailwindcss()],
  },
  output: "server",
  adapter: vercel({}),
  session: {
    driver: "lru-cache",
  },
});
