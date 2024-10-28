# Create pull request action

This action creates a pull request from a branch to a target branch.

## Action inputs

| Input                | Description                                                   | Default                                                               |
| -------------------- | ------------------------------------------------------------- | --------------------------------------------------------------------- |
| `branch_name`        | The name of the branch to create the pull request from.       | `'patch'`                                                             |
| `base_branch_name`   | The name of the base branch to create a pull request against. | `'main'`                                                              |
| `pull_request_title` | The title of the pull request.                                | `'chore: automated by GitHub actions'`                                |
| `pull_request_body`  | The body of the pull request.                                 | `'This pull request was automatically created by a GitHub Action'`    |
| `author_name`        | The name of the author of the pull request and commit.        | `${{ github.actor }}`                                                 |
| `author_email`       | The email of the author of the pull request and commit.       | `${{ github.actor_id }}+${{ github.actor }}@users.noreply.github.com` |
| `commit_message`     | The message of the commit.                                    | `'chore: automated by GitHub actions'`                                |
| `token`              | Access token to manage the pull request.                      | `${{ GITHUB_TOKEN }}`                                                 |

## Action outputs

- `pull_request_number`: The number of the created pull request.

## Example usage

```yaml
name: Create pull request

on:
  push:
    branches:
      - main

jobs:
  create_pr:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v2

      - name: Create pull request
        id: create_pr
        uses: dfinity/actions/actions/create-pr
        with:
          branch_name: 'chore/update-changelog'
          base_branch_name: 'main'
          pull_request_title: 'chore: update changelog'
          pull_request_body: 'This pull request was automatically created by a GitHub Action to update changelogs.'
          commit_message: 'chore: update changelog'
```
