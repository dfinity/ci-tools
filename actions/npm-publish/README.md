# NPM publish

This action publishes a package to the npm registry. It assumes that `npm` and `pnpm` is already setup, see the [setup PNPM action](../setup-pnpm/README.md) for a ready to use action to do this. Starting from npm version 11.5.1, OIDC is supported.

## Action inputs

| Input               | Description.                                                                  | Default   |
| ------------------- | ----------------------------------------------------------------------------- | --------- |
| `token`             | The npm token to authenticate with the npm registry.                          | `''`      |
| `is_beta`           | Publish the package as a beta version. Expects a stringified boolean.         | `'false'` |
| `package_manager`   | The package manager to use for publishing.                                    | `'npm'`   |
| `enable_provenance` | Enable the generation and publication of NPM's package provenance statements. | `'true'`  |

## Action outputs

- `artifact_filepath`: The path to the published package artifact.

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

      - name: Setup PNPM
        uses: dfinity/ci-tools/actions/setup-pnpm@main

      - name: Is beta tag
        id: is_beta_tag
        uses: dfinity/ci-tools/actions/is-beta-tag@main

      - name: Release @dfinity/cns NPM package
        working-directory: lib/cns-js
        id: publish_dfinity_cns
        uses: dfinity/ci-tools/actions/npm-publish@main
        with:
          token: ${{ secrets.NPM_ACCESS_TOKEN }}
          is_beta: ${{ steps.is_beta_tag.outputs.is_beta_tag }}

      - name: Create Github release
        uses: ncipollo/release-action@bcfe5470707e8832e12347755757cec0eb3c22af # v1.18.0
        with:
          artifacts: ${{  steps.publish_dfinity_cns.outputs.artifact_filepath }}
          tag: '${{ github.ref_name }}'
          commit: 'main'
          prerelease: ${{ steps.is_beta_tag.outputs.is_beta_tag == 'true' }}
          makeLatest: ${{ steps.is_beta_tag.outputs.is_beta_tag == 'false' }}
```
