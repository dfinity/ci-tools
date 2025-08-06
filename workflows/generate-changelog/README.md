# Generate changelog

This workflow generates a changelog based on the repository's commit messages written according to the [Conventional Commits specification](https://www.conventionalcommits.org/en/v1.0.0/) and creates a pull request to update the repository.

Any files that will be changed and committed to the pull request must be listed in the `.github/repo_policies/BOT_APPROVED_FILES` file of the repository. For example:

```
CHANGELOG.md
```

## Workflow inputs

| Input                | Description                                                                | Default                                                               |
| -------------------- | -------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `branch_name`        | The name of the branch to create the pull request from.                    | `'patch'`                                                             |
| `base_branch_name`   | The name of the base branch to create a pull request against.              | `'main'`                                                              |
| `pull_request_title` | The title of the pull request.                                             | `'chore: automated by GitHub actions'`                                |
| `pull_request_body`  | The body of the pull request.                                              | `'This pull request was automatically created by a GitHub Action.'`   |
| `author_name`        | The name of the author of the pull request and commit.                     | `${{ github.actor }}`                                                 |
| `author_email`       | The email of the author of the pull request and commit.                    | `${{ github.actor_id }}+${{ github.actor }}@users.noreply.github.com` |
| `commit_message`     | The message of the commit.                                                 | `'chore: automated by GitHub actions'`                                |
| `token_app_id`       | A GitHub App ID used to generate an access token to create a pull request. | _required_                                                            |

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

jobs:
  generate_changelog:
    uses: dfinity/ci-tools/.github/workflows/generate-changelog.yaml@main
    with:
      token_app_id: ${{ vars.PR_AUTOMATION_BOT_PUBLIC_APP_ID }}
    secrets:
      token_private_key: ${{ secrets.PR_AUTOMATION_BOT_PUBLIC_PRIVATE_KEY }}
```
