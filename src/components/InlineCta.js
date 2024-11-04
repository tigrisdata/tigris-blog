import tigrisConfig from "@site/tigris.config.js";
import React from "react";
import PropTypes from "prop-types";

function InlineCta(props) {
  return (
    <div>
      <div>
        <div className="is--color_gradient_back">
          <div className="sl_card_m-2 card_static cta-flex">
            <div className="cta-margin-left">
              <h1 className="sl_title_m fix-1px">{props.title}</h1>
              <p>{props.subtitle}</p>
            </div>
            <div className="cta-flex-item cta-margin-right">
              <div style={{ "white-space": "nowrap" }}>
                <a href={tigrisConfig.getStartedUrl} className="cta-link">
                  <div>
                    {props.button}
                    <svg
                      width="13.5"
                      height="13.5"
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="iconExternalLink_node_modules-@docusaurus-theme-classNameic-lib-theme-Icon-ExternalLink-styles-module"
                    >
                      <path
                        fill="currentColor"
                        d="M21 13v10h-21v-19h12v2h-10v15h17v-8h2zm3-12h-10.988l4.035 4-6.977 7.07 2.828 2.828 6.977-7.07 4.125 4.172v-11z"
                      ></path>
                    </svg>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

InlineCta.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  button: PropTypes.string,
};

export default InlineCta;
