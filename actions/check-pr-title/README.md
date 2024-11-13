# Check pull request title

This action checks the title of a pull request to ensure it follows the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification. It assumes [Python](https://www.python.org/), [pip](https://pip.pypa.io/en/stable/) and [Commitizen](https://commitizen-tools.github.io/commitizen/) are already setup, see the [setup Python action](../setup-python/README.md) and [setup Commitizen action](../setup-commitizen/README.md) for ready to use actions to do this.

## Example usage

```yaml
name: 'Check pull request title'

on:
  pull_request:

jobs:
  check_pr_title:
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

      - name: 'Check pull request title'
        uses: dfinity/ci-tools/actions/check-pr-title@main
```
