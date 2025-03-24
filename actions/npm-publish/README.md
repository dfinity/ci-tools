# NPM publish

This action publishes a package to the npm registry. It assumes that `npm` is already setup, see the [setup PNPM action](../setup-pnpm/README.md) for a ready to use action to do this.

## Action inputs

| Input     | Description                                          | Default    |
| --------- | ---------------------------------------------------- | ---------- |
| `token`   | The npm token to authenticate with the npm registry. | _required_ |
| `is_beta` | Publish the package as a beta version.               | `false`    |

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
        uses: actions/checkout@v4

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
        uses: ncipollo/release-action@v1
        with:
          artifacts: ${{  steps.publish_dfinity_cns.outputs.artifact_filepath }}
          tag: '${{ github.ref_name }}'
          commit: 'main'
          prerelease: ${{ steps.is_beta_tag.outputs.is_beta_tag == true }}
          makeLatest: ${{ steps.is_beta_tag.outputs.is_beta_tag == false }}
```
