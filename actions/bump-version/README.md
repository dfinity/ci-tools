# Bump version

This action bumps package versions based on the repository's commit messages written according to the [Conventional Commits specification](https://www.conventionalcommits.org/en/v1.0.0/). It assumes [Python](https://www.python.org/), [pip](https://pip.pypa.io/en/stable/) and [Commitizen](https://commitizen-tools.github.io/commitizen/) are already setup, see the [setup Python action](../setup-python/README.md) and [setup Commitizen action](../setup-commitizen/README.md) for ready to use actions to do this.

## Action inputs

| Input                | Description                                                                         | Default |
| -------------------- | ----------------------------------------------------------------------------------- | ------- |
| `prerelease`         | Optional prerelease identifier, supported values include `alpha`, `beta`, and `rc`. | `''`    |
| `major_version_zero` | Set to true to keep the major version at zero, even for breaking changes.           | `false` |

## Action outputs

- `version`: The new version that packages were bumped to.

## Example usage

```yaml
name: Bump version

on:
  push:
    branches:
      - main

jobs:
  bump_version:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
        with:
          fetch-depth: 0

      - name: Setup Python
        uses: dfinity/ci-tools/actions/setup-python@main

      - name: Setup Commitizen
        uses: dfinity/ci-tools/actions/setup-commitizen@main

      - name: Bump version
        id: bump_version
        uses: dfinity/ci-tools/actions/bump-version@main

      - name: Print version
        run: |
          echo "New version: ${{ steps.bump_version.outputs.version }}"
```
