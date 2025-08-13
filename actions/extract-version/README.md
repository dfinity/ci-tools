# Extract version action

This action extracts semantic version parts using the Commitizen CLI, or directly from a supported file if provided.

Supported files when `file` is provided:

- `package.json` (`version`)
- `Cargo.toml` (`version = "x.y.z"`)

If `file` is omitted, the action runs `cz version -p` to obtain the version. This requires `cz` to be installed and available in `PATH`.

## Action inputs

| Input  | Description                                                                      | Default |
| ------ | -------------------------------------------------------------------------------- | ------- |
| `file` | Optional path to a file to parse. Supported files: `package.json`, `Cargo.toml`. | `''`    |

## Action outputs

- `major`: The major version (e.g., `1`).
- `minor`: The minor version (e.g., `2`).
- `patch`: The patch version (e.g., `3`).
- `prerelease`: Everything after the patch (may include pre-release and/or build), e.g., `-beta.1`, `+build.5`, or `-rc.1+build.sha`.

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
          echo "minor=${{ steps.ver.outputs.minor }}"
          echo "patch=${{ steps.ver.outputs.patch }}"
          echo "prerelease=${{ steps.ver.outputs.prerelease }}"

      # Or, if there's a Commitizen config file in the repo:
      - name: Extract version using Commitizen (cz)
        id: ver_cz
        uses: dfinity/ci-tools/actions/extract-version@main

      - name: Print (cz)
        run: |
          echo "major=${{ steps.ver_cz.outputs.major }}"
          echo "minor=${{ steps.ver_cz.outputs.minor }}"
          echo "patch=${{ steps.ver_cz.outputs.patch }}"
          echo "prerelease=${{ steps.ver_cz.outputs.prerelease }}"
```
