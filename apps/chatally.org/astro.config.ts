import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

// https://astro.build/config
export default defineConfig({
  site: "https://chatally.org",
  integrations: [
    starlight({
      title: "ChatAlly",
      description: "Your toolbox for self-hosted chat services",
      favicon: "/favicon.svg",
      logo: {
        alt: "Two green shields looking like chat bubbles",
        src: "./public/logo.svg",
        replacesTitle: true,
      },
      social: {
        github: "https://github.com/chatally/chatally",
        mastodon: "https://mastodon.social/@chatally",
      },
      customCss: ["./src/styles/index.css"],
      sidebar: [
        {
          label: "Guides",
          autogenerate: { directory: "guides" },
        },
        {
          label: "Reference",
          autogenerate: { directory: "reference" },
        },
      ],
    }),
  ],
});
