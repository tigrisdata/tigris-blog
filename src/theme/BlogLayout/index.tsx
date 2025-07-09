import React, { type ReactNode } from "react";
import clsx from "clsx";
import Layout from "@theme/Layout";
import type { Props } from "@theme/BlogLayout";
import Link from "@docusaurus/Link";
import { useLocation } from "@docusaurus/router";

export default function BlogLayout(props: Props): ReactNode {
  const { toc, children, ...layoutProps } = props;

  const location = useLocation();
  const isHomePage = location.pathname.endsWith("/blog/");

  return (
    <Layout {...layoutProps}>
      <div className="container margin-vert--lg">
        <div className="row">
          {isHomePage && (
            <div className="row col col--12" style={{ marginBottom: "1rem" }}>
              <ul
                className="button-group col col--8"
                style={{
                  listStyle: "none",
                  padding: "0 0 0 1.5rem",
                  margin: "0 0 1rem 0",
                }}
              >
                <li style={{ marginRight: "0.5rem" }}>
                  <Link to="/blog/" className="button button--secondary">
                    Engineering
                  </Link>
                </li>
                <li style={{ marginRight: "0.5rem" }}>
                  <Link to="/blog/" className="button button--secondary">
                    Product & Design
                  </Link>
                </li>
                <li>
                  <Link to="/blog/" className="button button--secondary">
                    Updates
                  </Link>
                </li>
              </ul>

              <div className="col col--4">
                <div className="search-bar align-right">
                  <input type="text" placeholder="Search" />
                </div>
              </div>
            </div>
          )}
          <main className={clsx("row row--no-gutters", "col", "col--12")}>
            {children}
          </main>
          {toc && <div className="col col--2">{toc}</div>}
        </div>
      </div>
    </Layout>
  );
}
