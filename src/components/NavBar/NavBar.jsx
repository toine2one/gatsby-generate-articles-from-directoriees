import React from "react";
import { useStaticQuery, graphql, Link } from "gatsby";

export default function NavBar() {
  const data = useStaticQuery(graphql`
    query {
      allDirectory(filter: { sourceInstanceName: { eq: "wiki-data" } }) {
        edges {
          node {
            base
            relativeDirectory
          }
        }
      }
    }
  `);

  console.log(data);

  const getMenuContents = () => {
    //Remove redundant root dir edge
    delete data.allDirectory.edges[0];

    const menuGroupEdges = data.allDirectory.edges.filter(
      (edge) => edge.node.relativeDirectory === ""
    );

    const menuItemEdges = data.allDirectory.edges.filter(
      (edge) => edge.node.relativeDirectory !== ""
    );

    const menuContents = [];

    menuGroupEdges.forEach((groupEdge) => {
      menuContents.push({
        group: groupEdge,
        groupItems: menuItemEdges.filter(
          (item) => item.node.relativeDirectory === groupEdge.node.base
        ),
      });
    });

    return menuContents;
  };

  return (
    <div>
      <ul>
        {getMenuContents().map((content) => {
          return (
            <li key={content.group.node.base}>
              {content.group.node.base.split("-")[1]}
              <ul>
                {content.groupItems.map((item) => (
                  <li key={`/${content.group.node.base}/${item.node.base}`}>
                    <Link
                      to={`/${content.group.node.base.split("-")[1]}/${
                        item.node.base
                      }`}
                    >
                      {item.node.base}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
