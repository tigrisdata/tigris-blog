#!/usr/bin/env bash

sudo chown vscode:vscode /workspaces/tigris-blog/.docusaurus
sudo chown vscode:vscode /workspaces/tigris-blog/node_modules

npm ci &

wait