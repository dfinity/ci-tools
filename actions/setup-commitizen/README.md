# Setup Commitizen action

This actions sets up [Commitizen](https://commitizen-tools.github.io/commitizen/) for use in actions. It assumes [Python](https://www.python.org/) and [pip](https://pip.pypa.io/en/stable/) are already setup, see the [setup Python action](../setup-python/README.md) for a ready to use action to do this.

The Commitizen version is pinned in `action.yaml`, the same way the [setup Python action](../setup-python/README.md) pins Python. The [generate changelog workflow](../../workflows/generate-changelog/README.md) treats specific Commitizen exit codes as a no-op rather than a failure, so the version it runs against should change deliberately. Bump the pin in `action.yaml` to upgrade.

## Example usage

```yaml
name: Setup Commitizen

on:
  push:
    branches:
      - main
    pull_request:

jobs:
  setup_commitizen:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2

      - name: Setup Python
        uses: dfinity/ci-tools/actions/setup-python@main

      - name: Setup Commitizen
        uses: dfinity/ci-tools/actions/setup-commitizen@main
```
