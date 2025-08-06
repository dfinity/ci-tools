# Contributing

Thank you for your interest in contributing to DFINITY's CI Tools.
By participating in this project, you agree to abide by our [Code of Conduct](./CODE_OF_CONDUCT.md).

As a member of the community, you are invited and encouraged to contribute by submitting issues, offering suggestions for improvements, adding review comments to existing pull requests, or creating new pull requests to fix issues.

All contributions to DFINITY documentation and the developer community are respected and appreciated.
Your participation is an important factor in the success of the Internet Computer.

## Prerequisites

Before contributing, please take a few minutes to review these contributor guidelines.
The contributor guidelines are intended to make the contribution process easy and effective for everyone involved in addressing your issue, assessing changes, and finalizing your pull requests.

Before contributing, consider the following:

- If you want to report an issue, click [issues](https://github.com/dfinity/ci-tools/issues).
- If you have more general questions related to this package and its use, post a message to the [community forum](https://forum.dfinity.org/).
- If you are reporting a bug, provide as much information about the problem as possible.
- If you want to contribute directly to this repository, typical fixes might include any of the following:
  - Fixes to resolve bugs or documentation errors
  - Code improvements
  - Feature requests
  - Note that any contribution to this repository must be submitted in the form of a **pull request**.
- If you are creating a pull request, be sure that the pull request only implements one fix or suggestion.

If you are new to working with GitHub repositories and creating pull requests, consider exploring [First Contributions](https://github.com/firstcontributions/first-contributions) or [How to Contribute to an Open Source Project on GitHub](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github).

## Reporting an issue

To open a new issue:

1. Click [create a new issue](https://github.com/dfinity/ci-tools/issues/new).
2. Type a title and description, then click **Submit new issue**.
   - Be as clear and descriptive as possible.
   - For any problem, describe it in detail, including details about the crate, the version of the code you are using, the results you expected, and how the actual results differed from your expectations.

## Submitting a pull request

If you want to submit a pull request to fix an issue or add a feature, here's a summary of what you need to do:

### Forking the repository

1. Make sure you have a GitHub account, an internet connection, and access to a terminal shell or GitHub Desktop application for running commands.
2. Navigate to the [repository's homepage](https://github.com/dfinity/ci-tools) in a web browser.
3. Click **Fork** to create a copy of the repository under your GitHub account or organization name.
4. Clone the forked repository to your local machine.
   ```shell
   git clone "https://github.com/$YOUR_USERNAME/ci-tools.git"
   ```
5. Change into the directory of the cloned repository:
   ```shell
   cd ci-tools
   ```
6. Create a new branch for your fix by running a command similar to the
   following:
   ```shell
   git checkout -b $YOUR_BRANCH_NAME
   ```

### Install dependencies

- Install [`fnm`](https://github.com/Schniz/fnm).
  ```bash
  curl -fsSL https://get.pnpm.io/install.sh | sh -
  ```
- Install the correct version of [`nodejs`](https://nodejs.org).
  ```bash
  fnm install
  ```
- Enable the correct version of `nodejs`.
  ```bash
  fnm use
  ```
- Set up the correct version of [`pnpm`](https://pnpm.io/).
  ```bash
  corepack enable
  ```
- Install dependencies:
  ```bash
  pnpm i
  ```

### Making a pull request

1. Open the file you want to fix in a text editor and make the appropriate changes for the issue you are trying to address.
2. Add the file contents of the changed files to the index `git` uses to manage the state of the project by running a command similar to the following:
   ```shell
   git add $PATH_TO_CHANGED_FILE
   ```
3. Make sure to have [Commitizen](https://commitizen-tools.github.io/commitizen/#installation) installed.
4. Commit your changes to store the contents you added to the index along with a descriptive message by running the following:
   ```shell
   cz commit
   ```
5. Push the changes to the remote repository by running a command similar to the following:
   ```shell
   git push origin $YOUR_BRANCH_NAME
   ```
6. Create a new pull request (PR) for the branch you pushed to the upstream GitHub repository.
   - The PR title should be auto-populated based on your commit message.
   - Provide a PR message that includes a short description of the changes made.
7. Wait for the pull request to be reviewed.
8. Make changes to the pull request, if requested. When making subsequent commits, you no longer need to follow conventional commits. Only the first commit message will be used.
9. Celebrate your success after your pull request is merged!

## Updating `pnpm`

To update the version of `pnpm` that is used:

```bash
corepack use pnpm@9.x
```

## Building

Actions are built locally and the built files are committed to the repository. To build the actions, run:

```bash
pnpm build
```

The GitHub actions pipeline will attempt to build the actions and check if there are any differences between the built files and those that are committed to the repository. If there are any differences, the pipeline will fail.
