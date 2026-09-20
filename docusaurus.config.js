// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  // The site's name, which is what a page title and a link preview show. The navbar keeps
  // the mod's own name below, and so does the hero -- "Wiki" belongs in the title bar, not
  // on the brand.
  title: 'History Stages Wiki',
  tagline: 'Documentation for the History Stages modpack framework',
  favicon: 'img/icon.png',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  url: 'https://historystages.github.io',
  // The repo is named historystages.github.io, so GitHub serves it as the organisation's
  // own site: no repo path in the address.
  baseUrl: '/',

  // GitHub pages deployment config.
  organizationName: 'HistoryStages', // GitHub org/user name.
  projectName: 'historystages.github.io', // Repo name.

  onBrokenLinks: 'throw', // migration safety net — build fails on any bad internal link
  // Anchors only break when a heading is renamed, which is exactly the edit nobody rechecks.
  onBrokenAnchors: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: 'wiki',
          sidebarPath: './sidebars.js',
          editUrl: 'https://github.com/HistoryStages/historystages.github.io/edit/main/',
          // Needs the full history in CI (fetch-depth: 0), otherwise every page claims
          // to have been written on the day of the last deploy.
          showLastUpdateTime: true,
          // The live tree is the current release, not an unreleased "next" -- cutting it into a
          // frozen folder once buried the whole site under /next/. It gets cut when 6.1 ships.
          lastVersion: 'current',
          versions: {
            current: {label: '6.0.x'},
            // Archives stay out of search engines so nobody lands on a two-year-old page from Google.
            '5.6.x': {noIndex: true},
            '5.5.x': {noIndex: true},
            '5.4.x': {noIndex: true},
            '5.3.x': {noIndex: true},
            '5.2.x': {noIndex: true},
            '5.0.x': {noIndex: true},
          },
        },
        // No blog. Release notes live on GitHub, CurseForge and Modrinth already, and a
        // fourth place saying the same thing is a place that goes stale. Migration notes
        // belong in the versioned docs instead — see wiki/server/upgrading-from-5x.
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      /** @type {import('@docusaurus/plugin-content-docs').Options} */
      ({
        id: 'api',
        path: 'api',
        routeBasePath: 'api',
        sidebarPath: './sidebarsApi.js',
        editUrl: 'https://github.com/HistoryStages/historystages.github.io/edit/main/',
        showLastUpdateTime: true,
      }),
    ],
    [
      '@docusaurus/plugin-client-redirects',
      // The 6.0.x rewrite moved every page. These are the addresses from the first
      // Docusaurus layout, which were live and are what an older link points at.
      /** @type {import('@docusaurus/plugin-client-redirects').Options} */
      ({
        redirects: [
          {from: '/wiki/general/intro', to: '/wiki/'},
          {from: '/wiki/general/getting-started', to: '/wiki/start-here/installation'},
          {
            from: '/wiki/general/global-vs-individual-stages',
            to: '/wiki/start-here/global-vs-individual',
          },
          {
            from: '/wiki/modpack-developers/stage-basics/stage-configuration',
            to: '/wiki/stage-file/anatomy',
          },
          {
            from: '/wiki/modpack-developers/stage-basics/stage-modes',
            to: '/wiki/stage-file/stage-modes',
          },
          {
            from: [
              '/wiki/modpack-developers/stage-basics/stage-examples',
              '/wiki/modpack-developers/stage-basics/examples-basic',
              '/wiki/modpack-developers/stage-basics/examples-entities-and-world',
              '/wiki/modpack-developers/stage-basics/recipe-examples',
            ],
            to: '/wiki/stage-file/complete-examples',
          },
          {
            from: '/wiki/modpack-developers/locking-zones/lock-types',
            to: '/wiki/locking/items-and-recipes/items-tags-mods',
          },
          {
            from: '/wiki/modpack-developers/locking-zones/world-locks',
            to: '/wiki/locking/world/dimensions-and-structures',
          },
          {
            from: '/wiki/modpack-developers/locking-zones/entity-and-trade-locks',
            to: '/wiki/locking/creatures-and-trade/entities-and-spawns',
          },
          {from: '/wiki/modpack-developers/locking-zones/zones', to: '/wiki/locking/world/zones'},
          {
            from: '/wiki/modpack-developers/locking-zones/stage-behavior',
            to: '/wiki/stage-file/hidden-display',
          },
          {
            from: '/wiki/modpack-developers/in-game-tools/in-game-editor',
            to: '/wiki/in-game-tools/in-game-editor',
          },
          {
            from: '/wiki/modpack-developers/in-game-tools/stage-graph',
            to: '/wiki/in-game-tools/stage-graph',
          },
          {
            from: '/wiki/modpack-developers/in-game-tools/research-system',
            to: '/wiki/in-game-tools/research/pedestal',
          },
          {
            from: '/wiki/modpack-developers/server-integration/configuration',
            to: '/wiki/server/config-files',
          },
          {
            from: '/wiki/modpack-developers/server-integration/gameplay-toml',
            to: '/wiki/server/config-files/gameplay-toml',
          },
          {
            from: '/wiki/modpack-developers/server-integration/visual-toml',
            to: '/wiki/server/config-files/visual-toml',
          },
          {
            from: '/wiki/modpack-developers/server-integration/commands-and-permissions',
            to: '/wiki/server/commands',
          },
          {
            from: '/wiki/modpack-developers/server-integration/mod-compatibility',
            to: '/wiki/server/mod-compatibility',
          },
          {
            from: [
              '/wiki/modpack-developers/server-integration/scripting-with-kubejs-and-crafttweaker',
              '/wiki/modpack-developers/server-integration/scripting-kubejs',
            ],
            to: '/wiki/server/scripting/kubejs',
          },
          {
            from: '/wiki/modpack-developers/server-integration/scripting-crafttweaker',
            to: '/wiki/server/scripting/crafttweaker',
          },
          {from: '/wiki/project/porting-history-stages', to: '/wiki/about/porting'},
        ],
      }),
    ],
    // Screenshots are small enough to sit in the flow of a page and too small to read
    // there; clicking one opens it full size instead of sending people to a raw image URL.
    require.resolve('docusaurus-plugin-image-zoom'),
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      /** @type {import('@easyops-cn/docusaurus-search-local').PluginOptions} */
      ({
        hashed: true,
        indexDocs: true,
        indexBlog: false,
        indexPages: false,
        docsRouteBasePath: ['/wiki', '/api'],
        // Archived versions are noIndex so Google keeps sending people to the current docs.
        // The search box would otherwise skip them too, leaving old versions unsearchable.
        forceIgnoreNoIndex: true,
      }),
    ],
  ],

  // Cookie-free visit counting: no banner, no personal data, and it skips localhost by
  // itself, so a dev server does not show up in the numbers.
  scripts: [
    {
      src: 'https://gc.zgo.at/count.js',
      async: true,
      'data-goatcounter': 'https://historystages.goatcounter.com/count',
    },
  ],

  clientModules: [require.resolve('./src/clientModules/searchTerms.js')],

  themes: ['@docusaurus/theme-mermaid'],
  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    },
  },

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/social-card.png',
      mermaid: {
        theme: {light: 'neutral', dark: 'dark'},
      },
      zoom: {
        selector: '.markdown img',
        background: {
          light: 'rgba(255, 255, 255, 0.92)',
          dark: 'rgba(15, 15, 17, 0.94)',
        },
      },
      colorMode: {
        respectPrefersColorScheme: true,
      },
      // For something that stops being true, not for a standing note -- a bar nobody can
      // get rid of stops being read and still sits on all 52 pages. The id is what a
      // dismissal is remembered against, so a new message needs a new id to come back.
      announcementBar: {
        id: 'version_notice_6_0_x_forge',
        content:
          'These pages describe <strong>6.0.x</strong>, which now runs on ' +
          '<strong>NeoForge 1.21.1</strong> and <strong>Forge 1.20.1</strong>. Playing on ' +
          '<strong>Fabric</strong>? That build is still on 5.2.x — use the version picker, or see ' +
          '<a href="/wiki/about/versions-and-platforms">Versions &amp; Platforms</a>.',
        isCloseable: true,
      },
      navbar: {
        title: 'History Stages',
        logo: {
          alt: 'History Stages Logo',
          src: 'img/icon.png',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'wikiSidebar',
            position: 'left',
            label: 'Wiki',
          },
          {
            type: 'docSidebar',
            sidebarId: 'apiSidebar',
            docsPluginId: 'api',
            position: 'left',
            label: 'API',
          },
          {
            type: 'docsVersionDropdown',
            position: 'right',
            dropdownItemsAfter: [
              {
                href: 'https://github.com/Flix100000/History-Stages/releases',
                label: 'All releases',
              },
            ],
          },
          {
            type: 'dropdown',
            label: 'Download',
            position: 'left',
            items: [
              {
                label: 'CurseForge',
                href: 'https://www.curseforge.com/minecraft/mc-mods/history-stages',
              },
              {
                label: 'Modrinth',
                href: 'https://modrinth.com/mod/history-stages',
              },
              {
                label: 'GitHub Releases',
                href: 'https://github.com/Flix100000/History-Stages/releases',
              },
            ],
          },
          {
            href: 'https://discord.gg/BeZzxyZ9c4',
            position: 'right',
            className: 'header-icon-link header-discord-link',
            'aria-label': 'Discord',
          },
          {
            href: 'https://github.com/Flix100000/History-Stages',
            position: 'right',
            className: 'header-icon-link header-github-link',
            'aria-label': 'GitHub',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Wiki',
            items: [
              {
                // Same name and same target as the button on the front page. Two links to
                // the same section that call themselves different things read as two places.
                label: 'Start Here',
                to: '/wiki/',
              },
              {
                label: 'Addon API',
                to: '/api/addon-development',
              },
            ],
          },
          {
            title: 'Download',
            items: [
              {
                label: 'CurseForge',
                href: 'https://www.curseforge.com/minecraft/mc-mods/history-stages',
              },
              {
                label: 'Modrinth',
                href: 'https://modrinth.com/mod/history-stages',
              },
              {
                label: 'GitHub Releases',
                href: 'https://github.com/Flix100000/History-Stages/releases',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Discord',
                href: 'https://discord.gg/BeZzxyZ9c4',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/Flix100000/History-Stages',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'License',
                href: 'https://github.com/Flix100000/History-Stages/blob/neoforge-1.21.X/LICENSE.txt',
              },
              {
                label: 'Contributing',
                href: 'https://github.com/Flix100000/History-Stages/blob/neoforge-1.21.X/CONTRIBUTING.md',
              },
              {
                label: 'Security Policy',
                href: 'https://github.com/Flix100000/History-Stages/blob/neoforge-1.21.X/SECURITY.md',
              },
              {
                label: 'Report a Bug',
                href: 'https://github.com/Flix100000/History-Stages/issues',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} History Stages. Built with Docusaurus.<br />
          This is an unofficial, fan-made project. Not affiliated with Mojang Studios or Microsoft.
          Minecraft is a trademark of Mojang Synergies AB.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
