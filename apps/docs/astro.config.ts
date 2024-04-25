import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import blog from "starlight-blog";

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
      plugins: [
        blog({
          title: "Blog",
          authors: {
            christian: {
              name: "Christian Fuss",
            },
          },
          postCount: 5,
          recentPostCount: 5,
        }),
      ],
    }),
  ],
});
