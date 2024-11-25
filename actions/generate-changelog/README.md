# Generate changelog

This action generates changelog based on the repository's commit messages written according to the [Conventional Commits specification](https://www.conventionalcommits.org/en/v1.0.0/). It assumes [Python](https://www.python.org/), [pip](https://pip.pypa.io/en/stable/) and [Commitizen](https://commitizen-tools.github.io/commitizen/) are already setup, see the [setup Python action](../setup-python/README.md) and [setup Commitizen action](../setup-commitizen/README.md) for ready to use actions to do this.

There is also a ready-to-use [workflow](../../workflows/generate-changelog/README.md) that uses this action.

## Action inputs

| Input       | Description                                     | Default          |
| ----------- | ----------------------------------------------- | ---------------- |
| `file_name` | The name of the file to write the changelog to. | `'CHANGELOG.md'` |

## Example usage

```yaml
name: 'Generate changelog'

on:
  push:
    branches:
      - main

jobs:
  generate_changelog:
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

      - name: 'Generate changelog'
        uses: dfinity/ci-tools/actions/generate-changelog@main
        with:
          file_name: 'CHANGES.md'
```
