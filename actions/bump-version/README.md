# Bump version

This action bumps package versions based on the repository's commit messages written according to the Conventional Commits specification. It assumes [Python](https://www.python.org/), [pip](https://pip.pypa.io/en/stable/) and [Commitizen](https://commitizen-tools.github.io/commitizen/) are already setup, see the [setup Python action](../setup-python/README.md) and [setup Commitizen action](../setup-commitizen/README.md) for ready to use actions to do this.

## Example usage

```yaml
name: 'Bump version'

on:
  push:
    branches:
      - main

jobs:
  bump_version:
    runs-on: ubuntu-latest
    steps:
      - name: 'Checkout repository'
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: 'Setup Python'
        uses: dfinity/actions/actions/setup-python@main

      - name: 'Setup Commitizen'
        uses: dfinity/actions/actions/setup-commitizen@main

      - name: 'Bump version'
        uses: dfinity/actions/actions/bump-version@main
```
