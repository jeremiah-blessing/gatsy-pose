const tailwindConfig = require("./tailwind.config.js");

module.exports = {
  siteMetadata: {
    title: `Esatta Fit`,
    description: `Kick off your next, great Gatsby project with this default starter. This barebones starter ships with the main Gatsby configuration files you might need.`,
    author: `@gatsbyjs`,
  },
  plugins: [
    // `gatsby-plugin-eslint`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `esatta-fit`,
        short_name: `esatta-fit`,
        start_url: `/`,
        background_color: `#EC165B`,
        theme_color: `#EC165B`,
        icon: `src/images/esatta-logo.png`, // This path is relative to the root of the site.
        display:`standalone`,
        orientation:`portrait`
      },
    },
    {
      resolve: `gatsby-plugin-postcss`,
      options: {
        postCssPlugins: [
          require(`tailwindcss`)(tailwindConfig),
          require(`autoprefixer`),
          ...(process.env.NODE_ENV === `production`
            ? [require(`cssnano`)]
            : []),
        ],
      },
    },
    // {
    //   resolve: `gatsby-plugin-purgecss`,
    //   options: { tailwind: true }
    // },
    `gatsby-plugin-offline`,
  ],
};
