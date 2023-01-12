import React from "react";
import { graphql } from "gatsby";
import parse from "html-react-parser";

export default function ArticleTemplate({ data }) {
  const articles = data.articles.edges;

  const getH2ElementTextsFromArticle = (article) => {
    let parser = new DOMParser();
    const doc = parser.parseFromString(
      article.node.childMarkdownRemark.html,
      "text/html"
    );

    const h2Elements = Array.from(doc.getElementsByTagName("h2"));
    const h2Texts = h2Elements.map((el) => el.innerHTML);

    return h2Texts;
  };

  return (
    <div>
      <h1>------ARTICLES------</h1>
      <ul>
        {articles.map((article, index) => (
          <li key={`name-${article.node.name}`}>
            {article.node.name.split("-")[1]}
            <ul>
              {getH2ElementTextsFromArticle(article).map((h2Text) => {
                return <li key={h2Text}>{h2Text}</li>;
              })}
            </ul>
          </li>
        ))}
      </ul>
      <h1>------ARTICLE CONTENTS------</h1>
      {articles.map((article) => (
        <article key={article.node.name}>
          {parse(article.node.childMarkdownRemark.html)}
        </article>
      ))}
    </div>
  );
}

export const query = graphql`
  query article($regexFilter: String) {
    articles: allFile(filter: { relativePath: { regex: $regexFilter } }) {
      edges {
        node {
          childMarkdownRemark {
            html
          }
          name
        }
      }
    }
  }
`;
