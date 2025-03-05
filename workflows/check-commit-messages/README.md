# Check commit messages

This workflow checks the commit messages on a branch to ensure they follow the [Conventional Commits specification](https://www.conventionalcommits.org/en/v1.0.0/).

## Workflow inputs

| Input           | Description                                                                                                       | Default  |
| --------------- | ----------------------------------------------------------------------------------------------------------------- | -------- |
| `target_branch` | The branch to check against. All commits on the current branch that are not on the target branch will be checked. | `'main'` |

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
    uses: dfinity/ci-tools/.github/workflows/check-commit-messages.yaml@main
    with:
      target_branch: 'develop'
```
