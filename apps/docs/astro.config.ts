import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'
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
        alt: 'Two green shields looking like chat bubbles',
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
          items: [
            { label: 'Getting Started', link: 'guides' },
            { label: 'Writing Middleware', link: 'guides/middleware' },
            { label: 'Writing Servers', link: 'guides/servers' },
            { label: 'Deploy your Application', link: 'guides/deployment' },
          ],
        },
        {
          label: 'Reference',
          items: [
            {
              label: 'Core',
              items: [
                { label: 'Overview', link: 'reference/core' },
                { label: 'Application', link: 'reference/core/application' },
                { label: 'Middleware', link: 'reference/core/middleware' },
                {
                  label: 'Context',
                  link: 'reference/core/context',
                },
                { label: 'Messages', link: 'reference/core/messages' },
                { label: 'Logger', link: 'reference/core/logger' },
              ],
            },
            {
              label: 'Middleware',
              collapsed: true,
              autogenerate: {
                directory: 'reference/middleware',
                collapsed: true,
              },
            },
            {
              label: 'Servers',
              collapsed: true,
              autogenerate: {
                directory: 'reference/servers',
                collapsed: true,
              },
            },
          ],
        },
        {
          label: 'Examples',
          collapsed: true,
          items: [
            { label: 'Overview', link: 'examples' },
            { label: 'Console Chat', link: 'examples/console-chat' },
            { label: 'nlp.js Web Chat', link: 'examples/nlpjs-web-chat' },
            // {
            //   label: "Group Moderation with TensorFlow",
            //   link: "examples/group-moderation",
            // },
          ],
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
