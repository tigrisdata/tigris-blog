import React, { type ReactNode } from "react";
import clsx from "clsx";
import Layout from "@theme/Layout";
import type { Props } from "@theme/BlogLayout";
import Link from "@docusaurus/Link";
import { useLocation } from "@docusaurus/router";

export default function BlogLayout(props: Props): ReactNode {
  const { toc, children, ...layoutProps } = props;

  const location = useLocation();
  const isHomePage =
    location.pathname.endsWith("/blog/") ||
    location.pathname.includes("/blog/page");

  return (
    <Layout {...layoutProps}>
      <div className="container margin-vert--lg">
        <div className="row">
          {isHomePage && (
            <div className="row col col--12" style={{ marginBottom: "1rem" }}>
              <ul
                className="button-group col col--12"
                style={{
                  listStyle: "none",
                  padding: "0 0 0 1rem",
                  margin: "0.5rem 0 1rem 0",
                }}
              >
                <li style={{ marginRight: "0.5rem" }}>
                  <Link
                    to="/blog/tags/engineering"
                    className="button button--lg button--secondary"
                  >
                    Engineering
                  </Link>
                </li>
                <li style={{ marginRight: "0.5rem" }}>
                  <Link
                    to="/blog/tags/product-and-design"
                    className="button button--lg button--secondary"
                  >
                    Product & Design
                  </Link>
                </li>
                <li style={{ marginRight: "0.5rem" }}>
                  <Link
                    to="/blog/tags/case-studies"
                    className="button button--lg button--secondary"
                  >
                    Case Studies
                  </Link>
                </li>
                <li>
                  <Link
                    to="/blog/tags/updates"
                    className="button button--lg button--secondary"
                  >
                    Updates
                  </Link>
                </li>
              </ul>
            </div>
          )}
          <main
            className={clsx("row", "col", {
              "col--12": !toc,
              "col--10": toc,
            })}
          >
            {children}
          </main>

          {toc && <div className="col col--2">{toc}</div>}
        </div>
      </div>
    </Layout>
  );
}
