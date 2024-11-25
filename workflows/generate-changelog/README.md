# Generate changelog

This workflow generates a changelog based on the repository's commit messages written according to the [Conventional Commits specification](https://www.conventionalcommits.org/en/v1.0.0/) and creates a pull request to update the repository.

## Workflow inputs

| Input                | Description                                                   | Default                                                               |
| -------------------- | ------------------------------------------------------------- | --------------------------------------------------------------------- |
| `branch_name`        | The name of the branch to create the pull request from.       | `'patch'`                                                             |
| `base_branch_name`   | The name of the base branch to create a pull request against. | `'main'`                                                              |
| `pull_request_title` | The title of the pull request.                                | `'chore: automated by GitHub actions'`                                |
| `pull_request_body`  | The body of the pull request.                                 | `'This pull request was automatically created by a GitHub Action.'`   |
| `author_name`        | The name of the author of the pull request and commit.        | `${{ github.actor }}`                                                 |
| `author_email`       | The email of the author of the pull request and commit.       | `${{ github.actor_id }}+${{ github.actor }}@users.noreply.github.com` |
| `commit_message`     | The message of the commit.                                    | `'chore: automated by GitHub actions'`                                |
| `auto_merge`         | Enable auto-merge for the pull request.                       | `false`                                                               |

## Workflow secrets

| Input   | Description                              | Default               |
| ------- | ---------------------------------------- | --------------------- |
| `token` | Access token to manage the pull request. | `${{ GITHUB_TOKEN }}` |

## Example usage

```yaml
name: 'Generate changelog'

on:
  push:
    branches:
      - main

jobs:
  generate_changelog:
    uses: dfinity/ci-tools/workflows/generate-changelog/workflow.yaml@main
      with:
        auto_merge: true
      secrets:
        token: ${{ secrets.GITHUB_TOKEN }}
```
