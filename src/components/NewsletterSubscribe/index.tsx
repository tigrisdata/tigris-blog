/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import styles from "./styles.module.css";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    posthog: any;
  }
}

type FormData = {
  email: string;
};

const ERRORS: { [field: string]: string } = {
  email_required: "Email is required",
  email_pattern: "Email seems invalid",
};

interface NewsletterSubscribeProps {
  headerText?: string;
  ctaMessage?: string;
}

export default function NewsletterSubscribe(
  props: NewsletterSubscribeProps
): JSX.Element {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, isSubmitSuccessful, errors },
  } = useForm<FormData>({ mode: "onChange" });

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    setShowSuccessModal(isSubmitSuccessful);
  }, [isSubmitSuccessful]);

  const {
    siteConfig: { customFields },
  } = useDocusaurusContext();

  const onSubmit = handleSubmit((data) =>
    // This is a submission to https://www.tigrisdata.com/api/newsletter
    // in production
    fetch(`${customFields?.newsletterApiBaseUrl}/api/newsletter/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: data.email,
      }),
    })
      .then(() => {
        const posthog = window.posthog;
        if (!posthog) {
          posthog.capture("subscribed-newsletter-blog");
          return;
        }

        reset();
      })
      .catch(() => {
        // console.error(err);
        // eslint-disable-next-line @typescript-eslint/comma-dangle
      })
  );

  return (
    <div>
      {showSuccessModal ? (
        <div>👍 Thanks for subscribing to the Tigris newsletter</div>
      ) : (
        <>
          {props.headerText === undefined && <h3>Stay connected</h3>}
          {props.headerText !== "" && <h3>{props.headerText}</h3>}
          <p>{props.ctaMessage ?? "Subscribe to the Tigris Newsletter:"}</p>
          <form onSubmit={onSubmit}>
            <input
              placeholder="Your email"
              type="email"
              aria-label="--ifm-color-primary-lightest CSS variable name"
              className={styles.input}
              disabled={isSubmitting}
              width="100%"
              defaultValue=""
              required={true}
              {...register("email", {
                required: true,
                pattern:
                  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i,
              })}
            />
          </form>
          {errors.email && (
            <div className={styles.errors}>
              {ERRORS[`email_${errors.email?.type}`]}
            </div>
          )}
        </>
      )}
    </div>
  );
}
