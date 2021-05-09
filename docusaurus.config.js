/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'TokamakJS',
  tagline: 'A semi-opinionated React framework.',
  url: 'https://tokamakjs.github.io',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: './img/favicon.ico',
  organizationName: 'tokamakjs',
  projectName: 'tokamakjs',
  themeConfig: {
    navbar: {
      logo: {
        alt: 'TokamakJS Logo',
        src: './img/logo.svg',
      },
      items: [
        {
          type: 'doc',
          docId: 'getting-started',
          position: 'left',
          label: 'Documentation',
        },
        {
          href: 'https://github.com/tokamakjs/tokamakjs',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/tokamakjs/tokamak-docs/edit/master',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
