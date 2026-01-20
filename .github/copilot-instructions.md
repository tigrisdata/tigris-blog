# Copilot Instructions

When undertaking a task, take a moment to pause and ask the user what the intent
of the task is. Use this to write the best code to fix the problem or implement
the feature.

## Blogposts

When writing a blogpost or converting from one format to the other, use
[MDX](https://mdxjs.com/). After the first paragraph, insert a truncate
instruction:

```
{/* truncate */}
```

Here are some components that may help you:

### Tabs

Some drafts will include sections like this:

```markdown
Tabs:

Shell:

Contents of the shell tab

.env file:

Contents of the env-file tab

End tabs
```

Use
[Docusaurus' tabs component](https://docusaurus.io/docs/markdown-features/tabs)
to write these:

1. If the `Tabs` and `TabItem` components are not imported, add this to the top
   of the file under the front matter:

   ```mdx
   import Tabs from "@theme/Tabs";
   import TabItem from "@theme/TabItem";

   ...
   ```

2. Wrap the tabbed content in `<Tabs>` and `<TabItem>` components:

   ```mdx
   <Tabs>
     <TabItem value="shell" label="Shell" default>
       Contents of the shell tab
     </TabItem>
     <TabItem value="env-file" label=".env file">
       Contents of the env-file tab
     </TabItem>
   </Tabs>
   ```

Notice how only the first TabItem is labeled default.

## Commit Message Format

Always use conventional commit format for all commit messages. The format should
be:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (white-space,
  formatting, missing semi-colons, etc)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `build`: Changes that affect the build system or external dependencies
- `ci`: Changes to our CI configuration files and scripts
- `chore`: Other changes that don't modify src or test files
- `revert`: Reverts a previous commit

### Examples

- `feat: add user authentication`
- `fix: resolve memory leak in data processing`
- `docs: update API documentation`
- `ci: update GitHub Actions workflows`
- `refactor: simplify user service logic`

### Breaking Changes

For breaking changes, add `!` after the type/scope:

- `feat!: change API response format`
- `fix(api)!: remove deprecated endpoint`

Or add `BREAKING CHANGE:` in the footer:

```
feat: add new user service

BREAKING CHANGE: User API now requires authentication tokens
```

### Additional Guidelines

- Keep the description concise and in imperative mood.
- Use lowercase for the description.
- Do not end the description with a period.
- Reference issues and pull requests in the footer when applicable.
- Add an additional footer to your commits:
  `Made-with-help-from: GitHub Copilot`. This MUST be included.
