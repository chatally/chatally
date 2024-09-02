import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'
import blog from 'starlight-blog'

// https://astro.build/config
export default defineConfig({
  site: 'https://chatally.org',
  integrations: [
    starlight({
      title: 'ChatAlly',
      description: 'Your toolbox for self-hosted chat services',
      favicon: '/favicon.svg',
      logo: {
        alt: 'Two green building blocks looking like chat bubbles',
        src: './public/logo.svg',
        replacesTitle: true,
      },
      social: {
        github: 'https://github.com/chatally/chatally',
        mastodon: 'https://mastodon.social/@chatally',
      },
      customCss: ['./src/styles/index.css'],
      sidebar: [
        {
          label: 'Guides',
          autogenerate: {
            directory: 'guides',
          },
        },
        {
          label: 'Reference',
          collapsed: true,
          items: [
            {
              label: 'Core',
              autogenerate: {
                directory: 'reference/core',
              },
            },
            {
              label: 'Middleware',
              collapsed: true,
              autogenerate: {
                directory: 'reference/middleware',
              },
            },
            {
              label: 'Servers',
              collapsed: true,
              autogenerate: {
                directory: 'reference/servers',
              },
            },
          ],
        },
        {
          label: 'Examples',
          collapsed: true,
          autogenerate: {
            directory: 'examples',
          },
        },
      ],
      plugins: [
        blog({
          title: 'Blog',
          authors: {
            christian: {
              name: 'Christian Fuss',
            },
          },
          postCount: 5,
          recentPostCount: 5,
        }),
      ],
      components: {
        ThemeSelect: './src/overrides/ThemeSelect.astro',
      },
    }),
  ],
})
