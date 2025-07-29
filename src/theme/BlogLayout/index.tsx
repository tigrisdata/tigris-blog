import React, { type ReactNode } from "react";
import clsx from "clsx";
import Layout from "@theme/Layout";
import type { Props } from "@theme/BlogLayout";
import { useLocation } from "@docusaurus/router";
import Navigation from "@site/src/components/Navigation/Navigation";

export default function BlogLayout(props: Props): ReactNode {
  const { toc, children, ...layoutProps } = props;

  const location = useLocation();
  const isHomePage =
    location.pathname.endsWith("/blog/") ||
    location.pathname.includes("/blog/page") ||
    location.pathname.includes("/blog/tags/");

  return (
    <Layout {...layoutProps}>
      <div className="container margin-vert--lg">
        <div className="row">
          {isHomePage && <Navigation />}
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
