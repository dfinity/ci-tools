# Extract version action

This action extracts version parts from a specified file and exposes them as outputs.

Supported files:
- `package.json` (`version`)
- `Cargo.toml` (`version = "x.y.z"`)
- `cz.json` (`commitizen.version`)

## Action inputs

| Input | Description | Default |
| ----- | ----------- | ------- |
| `file` | Path to the file to parse. Supported file types: `package.json`, `Cargo.toml`, `cz.json`. | — |

## Action outputs

- `major`: The major version (e.g., `1`).
- `major_minor`: The major.minor version (e.g., `1.2`).
- `major_minor_patch`: The major.minor.patch version (e.g., `1.2.3`).

## Example usage

```yaml
name: Extract version

on:
  push:
    branches:
      - main

jobs:
  extract:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2

      - name: Extract version from package.json
        id: ver
        uses: dfinity/ci-tools/actions/extract-version@main
        with:
          file: package.json

      - name: Print
        run: |
          echo "major=${{ steps.ver.outputs.major }}"
          echo "major_minor=${{ steps.ver.outputs.major_minor }}"
          echo "major_minor_patch=${{ steps.ver.outputs.major_minor_patch }}"
```
