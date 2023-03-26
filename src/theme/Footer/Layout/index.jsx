/* eslint-disable react/prop-types */
import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";

import tigrisConfig from "@site/tigris.config.js";

export default function FooterLayout({ style, links, logo, copyright }) {
  return (
    <footer
      className={clsx("footer", {
        "footer--dark": style === "dark",
      })}
    >
      <div className="container container-fluid">
        {logo && <div className="margin-bottom--sm">{logo}</div>}
        <p className="footer__description">
          Tigris is a Serverless NoSQL Database and Search Platform that offers
          a modern open source alternative to MongoDB and DynamoDB. Tigris
          allows developers to rapidly build applications with a NoSQL platform
          that combines database, full-text search, and sync mechanism. Tigris
          simplifies operations by automatically scaling throughput and storage
          as application traffic grows, at fraction of the cost of MongoDB and
          DynamoDB, while providing high availability and data security.
        </p>
        <div className="footer__row">
          <div className="footer__data">
            <div className="footer__cta">
              <p>Signup to get get early access!</p>
              <Link href={tigrisConfig.signupUrl}>Sign Up</Link>
            </div>
          </div>
          <div className="links">{links}</div>
        </div>
        {copyright && (
          <div className="footer__bottom text--center">{copyright}</div>
        )}
      </div>
    </footer>
  );
}
