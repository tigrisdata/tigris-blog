/* eslint-disable react/prop-types */
import React from "react";
import clsx from "clsx";

// import Link from "@docusaurus/Link";
// import tigrisConfig from "@site/tigris.config.js";

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
          Tigris is a globally available, S3 compatible object storage service
          that provides low-latency anywhere in the world. Tigris enables
          developers to quickly and easily store and access any amount of data
          for a wide range of use cases.
        </p>
        <div className="footer__row">
          {/* <div className="footer__data">
            <div className="footer__cta">
              <p>Signup to get get early access!</p>
              <Link href={tigrisConfig.signupUrl}>Sign Up</Link>
            </div>
          </div> */}
          <div className="links">{links}</div>
        </div>
        {copyright && (
          <div className="footer__bottom text--center">{copyright}</div>
        )}
      </div>
    </footer>
  );
}
