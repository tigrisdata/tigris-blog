FROM mcr.microsoft.com/devcontainers/base:bookworm

RUN mkdir -p /home/vscode/.local/share/fish \
  && chown -R vscode:vscode /home/vscode/.local \
  && apt-get update \
  && apt-get -y install ffmpeg

VOLUME /workspaces/tigris-blog/.docusaurus
VOLUME /workspaces/tigris-blog/node_modules