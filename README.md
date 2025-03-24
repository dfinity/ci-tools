# DFINITY GitHub CI Tools

Shared GitHub workflows and actions for DFINITY repositories.

## Workflows

- [Check commit messages](./workflows//check-commit-messages/README.md)
- [Check pull request title](./workflows/check-pr-title/README.md)
- [Generate changelog](./workflows/generate-changelog/README.md)

## Actions

- [Bump version](./actions//bump-version/README.md)
- [Check commit messages](./actions/check-commit-messages/README.md)
- [Check pull request title](./actions/check-pr-title/README.md)
- [Create pull request](./actions/create-pr/README.md)
- [Generate changelog](./actions/generate-changelog/README.md)
- [Generate release notes](./actions/generate-release-notes/README.md)
- [Is beta tag](./actions/is-beta-tag/README.md)
- [NPM publish](./actions/npm-publish/README.md)
- [Setup Commitizen](./actions/setup-commitizen/README.md)
- [Setup pnpm](./actions/setup-pnpm/README.md)
- [Setup Python](./actions/setup-python/README.md)

## Conventions

### Filenames

Name files using `kebab-case` and use the `.yaml` extension instead of `.yml`.

### Workflow and job names

Name jobs and workflows using `snake_case`.

### Step names

Name steps using natural language. Do not use quotes for the step name.

Explicitly name every step, even if it's a reusable action.

### Required actions

Suffix required actions with `:required` to make it easier to determine which actions are required and which aren't.

Example:

```yaml
name: my_action:required
```

## Using Commitizen

### Configuration

Create a `.cz.yaml` file and add the following content, replacing `0.11.0` with the current version of your repo:

```yaml
---
commitizen:
  name: cz_conventional_commits
  tag_format: $version
  version: 0.11.0
  version_files:
    - Cargo.toml
    - packages/example/package.json:version
```

The root `Cargo.toml` file holds the version number for each crate in the repo. Packages within the repo should reference the root workspace:

```toml
[package]
name = "example_crate"

version.workspace = true
```

`package.json` files cannot share versions with their corresponding workspace, so they must be listed individually.

### Bot approved files

Create the `.github/repo_policies/BOT_APPROVED_FILES` file and add the following content:

```plaintext
.cz.yaml
CHANGELOG.md
Cargo.lock
Cargo.toml
packages/example/package.json
```

### Repo settings

Disallow merge commits and rebase merging. Enable squash merging and set the default commit message to be `Pull request title and description`. This setting can alternatively be set to one of the other available options depending on the project's requirements, but take care to make sure that the rest of the recommendations here are adjusted to suit the chosen setting.

To support developers creating PR descriptions with the correct format, a pull request template can be used. This is not necessary if the PR description is not included in the merged commit message.

Create the `.github/PULL_REQUEST_TEMPLATE.md` file and add the following content:

```markdown
<!-- Provide additional contextual information about the code changes below this line, then remove this line. -->

<!-- If relevant, provide additional information about breaking changes after the `BREAKING CHANGE` prefix on the following line, then remove this line. Remove the following line if there are no breaking changes. -->

<!--
BREAKING CHANGE:
-->

<!-- If relevant, add a reference to an issue on the following line, then remove this line. Remove the following line if there are no relevant issues. -->

<!--
Ref: #<issue number>
-->
```

### Repo ruleset

**Branch targetting criteria**:

- `Default`.
- `main`.
- `master`.

**Merge queue settings**:

- Enable `Require merge queue`.
- Set the `Merge method` to be `Squash and merge`.
- Enable `Require all queue entries to pass required checks`.

**Status checks**:

- Enable `Require status checks to pass`.
- Add all required status checks in the `Status checks that are required` section.

### Pipeline

Merge queues are currently not picking up the status report from reusable workflows on GitHub correctly. To work around this, we need to add an additional job to the pipeline that checks if the reusable workflows have passed or were skipped.

On PRs, the [Check pull request title](./workflows/check-pr-title/README.md) workflow is run. On merge groups, the [Check commit messages](./workflows/check-commit-messages/README.md) workflow is run. The `commitizen` job is run after both of these jobs have completed. The `commitizen` job checks if the previous jobs have passed or were skipped. If they have, the `commitizen` job runs. If they haven't, the `commitizen` job fails.

```yaml
name: commitizen

on:
  merge_group:
  pull_request:

jobs:
  check_pr_title:
    name: check_pr_title
    if: github.event_name == 'pull_request'
    uses: dfinity/ci-tools/.github/workflows/check-pr-title.yaml@main

  check_commit_messages:
    name: check_commit_messages
    if: github.event_name == 'merge_group'
    uses: dfinity/ci-tools/.github/workflows/check-commit-messages.yaml@main

  commitizen:
    name: commitizen:required
    runs-on: ubuntu-latest
    needs: [check_pr_title, check_commit_messages]
    if: always()
    steps:
      - name: Check previous jobs
        run: |
          if [[ "${{ needs.check_pr_title.result }}" == "success" || "${{ needs.check_pr_title.result }}" == "skipped" ]] &&
             [[ "${{ needs.check_commit_messages.result }}" == "success" || "${{ needs.check_commit_messages.result }}" == "skipped" ]]; then
            echo "All required jobs passed or were skipped."
          else
            echo "One or more jobs failed."
            exit 1
          fi
```

## Contributing

Check out the [contribution guidelines](./.github/CONTRIBUTING.md).

## Setup

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

### Updating `pnpm`

To update the version of `pnpm` that is used:

```bash
corepack use pnpm@9.x
```

### Building

Actions are built locally and the built files are committed to the repository. To build the actions, run:

```bash
pnpm build
```

The GitHub actions pipeline will attempt to build the actions and check if there are any differences between the built files and those that are committed to the repository. If there are any differences, the pipeline will fail.
