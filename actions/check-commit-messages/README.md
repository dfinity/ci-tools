# Check commit messages

This action checks the commit messages on a branch to ensure they follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification. It assumes [Python](https://www.python.org/), [pip](https://pip.pypa.io/en/stable/) and [Commitizen](https://commitizen-tools.github.io/commitizen/) are already setup, see the [setup Python action](../setup-python/README.md) and [setup Commitizen action](../setup-commitizen/README.md) for ready to use actions to do this.

## Action inputs

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

jobs:
  check_commit_messages:
    runs-on: ubuntu-latest
    steps:
      - name: 'Checkout repository'
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: 'Setup Python'
        uses: dfinity/ci-tools/actions/setup-python@main

      - name: 'Setup Commitizen'
        uses: dfinity/ci-tools/actions/setup-commitizen@main

      - name: 'Check commit messages'
        uses: dfinity/ci-tools/actions/check-commit-messages@main
        with:
          starting_commit: 'c8ecbc19b8c4a482e55907d37554d66f2f2f9a8f'
```
