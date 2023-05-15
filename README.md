[![Code Style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

# tigrisdata.com/blog

This website is built using [Docusaurus 2](https://docusaurus.io/), a modern
static website generator.

## Prerequisites

[Node.js](https://nodejs.org/en/download/) version >= 14 or above (which can be
checked by running node -v).

## Installation

```shell
npm install
```

## Configuration

Copy `.env.local.example` to `.env.local`:

```shell
cp .env.local.example .env.local
```

## Local Development

```shell
npm run start
```

This command starts a local development server and opens up a browser window.
Most changes are reflected live without having to restart the server.

### Creating a blog post

To scaffold a blog post run:

```sh
npm run blog:new --slug={slug for your post}
```

This will create a directory in the format `{current date}-{slug}` with a
`index.mdx`. Update `index.mdx` with your blog post content.

### Testing newsletter subscription

Newsletters subscriptions make a POST request to
http://www.tigrisdata.com/api/newsletter/

This works in production because the blog is served from the same
www.tigrisdata.com domain. It will not work in other scenarios where a
cross-domain request is attempted since CORS is not enabled on the newsletter
subscription API endpoint.

So to test this locally, you'll need to use a local proxy. To support this, you
can change the base URL of the newsletter subscription API endpoint using
`NEXT_NEWSLETTER_API_BASE_URL` in the `.env.local` file.

If you use <https://github.com/garmeeh/local-cors-proxy>, you can then set
`NEXT_NEWSLETTER_API_BASE_URL` to `http://localhost:8010/proxy`.

## Build

```shell
npm run build
```

## Serve

```shell
npm run serve
```

This command generates static content into the `build` directory and can be
served using any static contents hosting service.

# # Code Quality

## 1. Linting

The coding style rules are defined by [Prettier](https://prettier.io/) and
enforced by [Eslint](https://eslint.org)

## 2. Git Hooks

We use [pre-commit](https://pre-commit.com/index.html) to automatically setup
and run git hooks.

On every `git commit` we check the code quality using prettier and eslint.

Install pre-commit and initialize it with the included commit hooks as follows:

```shell
brew install pre-commit
pre-commit install
```
