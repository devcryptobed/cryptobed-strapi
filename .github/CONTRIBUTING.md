# Welcome to CryptoBed Frontend Contributing Guide <!-- omit in toc -->

Thank you for investing your time in contributing to CryptoBed! Any contribution you make will be integral to the project. Read our [Code of Conduct](./CODE_OF_CONDUCT.md) to maintain a respectful and open community.

This guide provides an overview of the contribution workflow from opening an issue, creating a PR, reviewing, and merging it.

## New Contributor Guide

To get an overview of CryptoBed, read our [README](README.md). Here are some helpful resources to kick-start your contributions to open source:

- [Understanding GitHub flow](https://docs.github.com/en/get-started/quickstart/github-flow)
- [Collaborating with pull requests](https://docs.github.com/en/github/collaborating-with-pull-requests)

## Getting Started

For an introduction to working with CryptoBed's frontend, see our [development guidelines](/contributing/README.md). Our markdown files are written following these [Markdown guidelines](https://docs.github.com/en/contributing/writing-for-github-docs/using-markdown-and-liquid-in-github-docs).

Before making changes, see what [types of contributions](/contributing/types-of-contributions.md) we accept.

### Issues

#### Create a New Issue

If you spot a problem or have a feature suggestion, [search if an issue already exists](https://github.com/CryptoBed/frontend/issues). If not, open a new issue using a [relevant issue form](https://github.com/CryptoBed/frontend/issues/new/choose).

#### Solve an Issue

Look through our [existing issues](https://github.com/CryptoBed/frontend/issues) to find one that interests you. You can narrow your search using `labels`. If you find an issue to work on, you are welcome to open a PR with a fix.

### Make Changes

#### Fork the Repository

Fork CryptoBed's frontend repository and create a working branch for your changes.

### Branch Naming Conventions

When working on a new feature or fixing an issue, it's important to create a new branch that reflects the work you're doing. We follow the GitFlow naming conventions:

- For a new feature, name your branch as `feat/issue-<issue_number>-<brief_description>`. For example, if you're working on issue number 123 related to a test feature, name your branch `feat/issue-123-test`.
- For a bug fix, use `fix/issue-<issue_number>-<brief_description>`. For instance, for fixing issue number 45 related to a login bug, the branch name would be `fix/issue-45-login-bug`.

Ensure that your branch names are descriptive and reflect the issue they're addressing, making it easier for others to understand the purpose of your branch at a glance.

### Commit Message Guidelines

Your commit messages play a crucial role in documenting the history of your changes. They should be clear and follow these guidelines:

- Start your commit message with a concise summary of the changes made. This summary should be in imperative mood, as if giving a command or instruction.
- If the commit is related to an issue, include the issue number at the beginning of the commit message. For example, `#123: Add new authentication feature`.
- Provide a detailed description of the changes in the body of the commit message. The description should explain why the change was made and how it addresses the issue.
- Keep your commit messages to a maximum of 50 characters for the summary and 72 characters per line in the body, for better readability.

Following these guidelines will ensure a clear and consistent history for the project, making it easier for others to follow and contribute.

### Pull Request

Once your changes are ready and committed to your branch, create a Pull Request (PR) to the main repository:

- In the PR description, link to the issue your changes are addressing. Use phrases like 'Closes #123' to automatically link the PR to the issue.
- Describe your changes in detail and why they are necessary.
- Ensure that your PR title also follows the same format as your commit messages.

Your PR will be reviewed by the CryptoBed team, and we may ask for changes or additional information. Once approved, your changes will be merged into the main branch.

Congratulations on your contribution to CryptoBed! 🎉

#### Local Development

1. Fork and clone the repository.
2. Install Node.js as specified in `.node-version`.
3. Create a new branch and start with your changes.

### Commit Your Update

Once satisfied with your changes, commit them. Don't forget to self-review to ensure quality and consistency.

### Pull Request

Create a PR once you're ready.

- Fill in the PR template to explain your changes and their purpose.
- Link your PR to the related issue, if applicable.
- Allow maintainer edits for easier merging.

Your PR will be reviewed by the CryptoBed team. We may request changes or further information to ensure quality.

### Your PR is Merged!

Congratulations 🎉! Your contribution is now part of CryptoBed. It will be visible in the [CryptoBed frontend](https://github.com/CryptoBed/frontend).

Keep contributing and stay involved in our community!

## Development on Windows

CryptoBed can be developed on Windows, but keep these points in mind:

1. Line Endings: Use `\r?\n` in Regular Expressions to support both Unix and Windows environments.
2. Paths: Windows uses `\` as a path separator. Ensure your code is compatible with this.
3. Scripts: Prefer writing scripts in JavaScript instead of Bash for better compatibility with Windows environments.
4. Filename Length: Windows has a character limit for filenames. Configure Git to handle long paths: `git config --system core.longpaths true`.
