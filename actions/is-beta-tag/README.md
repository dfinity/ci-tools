# Is beta tag

This action checks if the current git tag uses the beta release format. The expected format is `${majorVersion}.${minorVersion}.${patchVersion}b${betaVersion}`.

## Action outputs

- `is_beta_tag`: A stringified boolean indicating whether the current git tag uses the beta release format.

## Example usage

```yaml
name: release

on:
  push:
    tags:
      - '[0-9]+.[0-9]+.[0-9]+'
      - '[0-9]+.[0-9]+.[0-9]+b[0-9]+'

jobs:
  release:
    name: release
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2

      - name: Is beta tag
        id: is_beta_tag
        uses: dfinity/ci-tools/actions/is-beta-tag@main

      - name: Create Github release
        uses: ncipollo/release-action@bcfe5470707e8832e12347755757cec0eb3c22af # v1.18.0
        with:
          tag: '${{ github.ref_name }}'
          commit: 'main'
          prerelease: ${{ steps.is_beta_tag.outputs.is_beta_tag == 'true' }}
          makeLatest: ${{ steps.is_beta_tag.outputs.is_beta_tag == 'false' }}
```
