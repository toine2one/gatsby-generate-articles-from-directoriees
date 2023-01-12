const path = require("path");

exports.createPages = async ({ graphql, actions }) => {
  const queryResult = await graphql(`
    {
      directories: allDirectory(
        filter: { sourceInstanceName: { eq: "wiki-data" } }
      ) {
        edges {
          node {
            base
            relativeDirectory
          }
        }
      }
    }
  `);

  const navMenuItems = queryResult.data.directories.edges.filter(
    (edge) => edge.node.relativeDirectory !== ""
  );

  // Generate pages for all menu items
  navMenuItems.forEach((edge) => {
    actions.createPage({
      path: `/${edge.node.relativeDirectory.split("-")[1]}/${edge.node.base}`,
      component: path.resolve("./src/templates/ArticleTemplate.js"),
      context: {
        regexFilter: `/(${`${edge.node.relativeDirectory}/${edge.node.base}`})/`,
      },
    });
  });
};
