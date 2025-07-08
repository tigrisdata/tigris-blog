import React, { type ReactNode } from "react";
import clsx from "clsx";
import Layout from "@theme/Layout";
import type { Props } from "@theme/BlogLayout";
import {
  useAllPluginInstancesData,
  usePluginData,
} from "@docusaurus/useGlobalData";

export default function BlogLayout(props: Props): ReactNode {
  console.log({ props });
  const { toc, children, ...layoutProps } = props;
  const blogData = useAllPluginInstancesData("blog");
  console.log({ blogData });

  return (
    <Layout {...layoutProps}>
      <div className="container margin-vert--lg">
        <div className="row">
          <main className={clsx("row", "col", "col--12")}>{children}</main>
          {toc && <div className="col col--2">{toc}</div>}
        </div>
      </div>
    </Layout>
  );
}
