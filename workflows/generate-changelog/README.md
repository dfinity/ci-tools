# Generate changelog

This workflow generates a changelog based on the repository's commit messages written according to the [Conventional Commits specification](https://www.conventionalcommits.org/en/v1.0.0/) and creates a pull request to update the repository.

Any files that will be changed and committed to the pull request must be listed in the `.github/repo_policies/BOT_APPROVED_FILES` file of the repository. For example:

```
CHANGELOG.md
```

Release commits are skipped. A release bumps the project version without adding anything a changelog entry could be generated from, so Commitizen has nothing to do and exits non-zero. Both that and an empty changelog are treated as a no-op rather than a failure.

This workflow sets its own `concurrency`, keyed on `branch_name`, so callers do not need to add one for this purpose. Concurrent runs that would push the same branch are cancelled in favour of the most recent one, which is what keeps them from racing when `reuse_branch` has them sharing one branch.

## Workflow inputs

| Input                    | Description                                                                                                                                                                                                          | Default                                                                                    |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `branch_name`            | The name of the branch to create the pull request from.                                                                                                                                                              | `'chore/generate-changelog'`                                                               |
| `base_branch_name`       | The name of the base branch to create a pull request against.                                                                                                                                                        | `'main'`                                                                                   |
| `reuse_branch`           | Keep a single self-updating changelog pull request instead of opening a new one on every run. The changelog branch is reset and force pushed each run, so it must not hold anything but generated changelog commits. | `true`                                                                                     |
| `pull_request_title`     | The title of the pull request.                                                                                                                                                                                       | `'chore: generate changelog'`                                                              |
| `pull_request_body`      | The body of the pull request.                                                                                                                                                                                        | `'This pull request was automatically created by a GitHub Action to generate changelogs.'` |
| `author_name`            | The name of the author of the pull request and commit.                                                                                                                                                               | `${{ github.actor }}`                                                                      |
| `author_email`           | The email of the author of the pull request and commit.                                                                                                                                                              | `${{ github.actor_id }}+${{ github.actor }}@users.noreply.github.com`                      |
| `commit_message`         | The message of the commit.                                                                                                                                                                                           | `'chore: generate changelog'`                                                              |
| `release_commit_pattern` | Skip changelog generation when the head commit subject matches this extended regular expression. Set to an empty string to disable the check.                                                                        | `'^chore:[[:space:]]release([[:space:]]\|$)'`                                              |
| `token_app_id`           | A GitHub App ID used to generate an access token to create a pull request.                                                                                                                                           | _required_                                                                                 |

## Workflow secrets

| Input               | Description                                                                         | Default    |
| ------------------- | ----------------------------------------------------------------------------------- | ---------- |
| `token_private_key` | A GitHub App private key used to generate an access token to create a pull request. | _required_ |

## Example usage

```yaml
name: Generate changelog

on:
  push:
    branches:
      - main

concurrency:
  group: main-${{ github.workflow }}
  cancel-in-progress: true

jobs:
  generate_changelog:
    uses: dfinity/ci-tools/.github/workflows/generate-changelog.yaml@main
    with:
      token_app_id: ${{ vars.PR_AUTOMATION_BOT_PUBLIC_APP_ID }}
    secrets:
      token_private_key: ${{ secrets.PR_AUTOMATION_BOT_PUBLIC_PRIVATE_KEY }}
```
