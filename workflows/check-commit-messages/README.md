# Check commit messages

This workflow checks the commit messages on a branch to ensure they follow the [Conventional Commits specification](https://www.conventionalcommits.org/en/v1.0.0/).

## Workflow inputs

| Input             | Description                                                             | Default                                           |
| ----------------- | ----------------------------------------------------------------------- | ------------------------------------------------- |
| `starting_commit` | The commit to start checking from. By default, all commits are checked. | `'${GITHUB_HEAD_REF:-${GITHUB_REF#refs/heads/}}'` |

## Example usage

```yaml
name: 'Check commit messages'

on:
  push:
    branches:
      - main
  pull_request:

jobs:
  check_commit_messages:
    uses: dfinity/ci-tools/workflows/check-commit-messages/workflow.yaml@main
    with:
      starting_commit: 'c8ecbc19b8c4a482e55907d37554d66f2f2f9a8f'
```
