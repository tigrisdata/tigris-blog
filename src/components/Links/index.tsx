import React from "react";

import tigrisConfig from "../../../tigris.config.js";

export type LinkProps = {
  text?: string;
};

export const CloudLink = ({ text = "Tigris Cloud" }: LinkProps) => {
  return <a href={tigrisConfig.signupUrl}>{text}</a>;
};

export const DiscordLink = ({ text = "Tigris Discord" }: LinkProps) => {
  return <a href={tigrisConfig.discordUrl}>{text}</a>;
};

export const TwitterLink = ({ text = "@TigrisData on Twitter" }: LinkProps) => {
  return <a href={tigrisConfig.twitterUrl}>{text}</a>;
};

export const GitHubLink = ({ text = "Tigris on GitHub" }: LinkProps) => {
  return <a href={tigrisConfig.gitHubUrl}>{text}</a>;
};
