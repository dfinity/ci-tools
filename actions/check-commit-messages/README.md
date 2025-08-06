# Check commit messages

This action checks the commit messages on a branch to ensure they follow the [Conventional Commits specification](https://www.conventionalcommits.org/en/v1.0.0/). It assumes [Python](https://www.python.org/), [pip](https://pip.pypa.io/en/stable/) and [Commitizen](https://commitizen-tools.github.io/commitizen/) are already setup, see the [setup Python action](../setup-python/README.md) and [setup Commitizen action](../setup-commitizen/README.md) for ready to use actions to do this.

There is also a ready-to-use [workflow](../../workflows/check-commit-messages/README.md) that uses this action.

## Action inputs

| Input           | Description                                                                                                       | Default  |
| --------------- | ----------------------------------------------------------------------------------------------------------------- | -------- |
| `target_branch` | The branch to check against. All commits on the current branch that are not on the target branch will be checked. | `'main'` |

## Example usage

```yaml
name: Check commit messages

on:
  push:
    branches:
      - main
    pull_request:

jobs:
  check_commit_messages:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
        with:
          fetch-depth: 0

      - name: Setup Python
        uses: dfinity/ci-tools/actions/setup-python@main

      - name: Setup Commitizen
        uses: dfinity/ci-tools/actions/setup-commitizen@main

      - name: Check commit messages
        uses: dfinity/ci-tools/actions/check-commit-messages@main
        with:
          target_branch: 'develop'
```
