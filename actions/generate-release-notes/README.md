# Generate release notes

This action generates release notes based on the repository's commit messages according to the [Conventional Commits specification](https://www.conventionalcommits.org/en/v1.0.0/). It assumes [Python](https://www.python.org/), [pip](https://pip.pypa.io/en/stable/) and [Commitizen](https://commitizen-tools.github.io/commitizen/) are already setup, see the [setup Python action](../setup-python/README.md) and [setup Commitizen action](../setup-commitizen/README.md) for ready to use actions to do this.

## Action inputs

| Input       | Description                                         | Default                  |
| ----------- | --------------------------------------------------- | ------------------------ |
| `file_name` | The name of the file to write the release notes to. | `'RELEASE_NOTES.md'`     |
| `version`   | The version to generate release notes for.          | `${{ github.ref_name }}` |

## Example usage

```yaml
name: Generate release notes

on:
  push:
    tags:
      - '[0-9]+.[0-9]+.[0-9]+'

jobs:
  generate_release_notes:
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

      - name: Generate release notes
        uses: dfinity/ci-tools/actions/generate-release-notes@main
        with:
          file_name: 'RELEASE.md'
```
