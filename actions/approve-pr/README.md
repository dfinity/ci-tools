# Approve pull request action

This action approves a pull request and optionally enables automerge.

## Action inputs

| Input                 | Description                                | Default               |
| --------------------- | ------------------------------------------ | --------------------- |
| `pull_request_number` | The number of the pull request to approve. | _required_            |
| `auto_merge`          | Enable auto-merge for the pull request.    | `false`               |
| `token`               | Access token to manage the pull request.   | `${{ GITHUB_TOKEN }}` |

## Example usage

```yaml
name: 'Create and approve pull request'

on:
  push:
    branches:
      - main

jobs:
  create_and_approve_pr:
    runs-on: ubuntu-latest
    steps:
      - name: 'Checkout repository'
        uses: actions/checkout@v4

      - name: 'Create pull request'
        id: create_pr
        uses: dfinity/actions/actions/create-pr@main
        with:
          branch_name: 'chore/update-changelog'
          base_branch_name: 'main'
          pull_request_title: 'chore: update changelog'
          pull_request_body: 'This pull request was automatically created by a GitHub Action to update changelogs.'
          commit_message: 'chore: update changelog'

      - name: 'Approve pull request'
        uses: dfinity/actions/actions/approve-pr@main
        with:
          pull_request_number: ${{ steps.create_pr.outputs.pull_request_number }}
          auto_merge: true
```
