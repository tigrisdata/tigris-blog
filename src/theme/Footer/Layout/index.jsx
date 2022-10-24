/* eslint-disable react/prop-types */
import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";

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
          Tigris is the data platform built for developers. Use it as a
          scalable, ACID transactional, real-time backend for your serverless
          applications. Build data-rich features without worrying about slow
          queries or missing indexes. Seamlessly implement search within your
          applications with its embedded search engine. Connect serverless
          functions with its event streams to build highly responsive
          applications that scale automatically.
        </p>
        <div className="footer__row">
          <div className="footer__data">
            <div className="footer__cta">
              <p>Signup to get get early access!</p>
              <Link href="https://www.tigrisdata.com/beta#signup-form">
                Sign Up
              </Link>
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
