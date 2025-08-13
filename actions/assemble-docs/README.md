# Assemble docs action

This action packages documentation assets for a specific version and updates the `versions.json` file on the `icp-pages` branch. It is typically used in conjunction with the [submit-docs](../submit-docs/README.md) action.

This action:

- Zips the `assets_dir` directory into `{target_dir}/{version}.zip`
- Upserts the entry to `versions.json` for the `version`

## Action inputs

| Input           | Description                                                                                                                                                      | Default            |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| `assets_dir`    | Path to the directory containing the documentation assets to be assembled.                                                                                       | _required_         |
| `version`       | The subpath at which the assembled docs will be published. Allowed values: `vX` , `vX.Y` , `vX.Y.Z` , `latest` , `beta` , `dev` , `next` , `nightly` , `canary`. | _required_         |
| `version_label` | Optional label value to set for this version's option in the website sidebar version dropdown.                                                                   | `{inputs.version}` |
| `target_dir`    | The folder where the assembled docs must be saved.                                                                                                               | _required_         |

## Example usage

```yaml
name: Publish docs

on:
  workflow_dispatch:

jobs:
  publish_docs:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
          uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2

      - name: Create GitHub App Token
        uses: actions/create-github-app-token@df432ceedc7162793a195dd1713ff69aefc7379e # v2.0.6
        id: generate_token
        with:
          app-id: ${{ vars.PR_AUTOMATION_BOT_PUBLIC_APP_ID }}
          private-key: ${{ secrets.PR_AUTOMATION_BOT_PUBLIC_PRIVATE_KEY }}
          owner: dfinity
          repo: icp-js-sdk-docs

      # Add your own steps to build doc assets and output them to dist/docs/v1.2.3
      # (and optionally dist/docs/latest if you want to publish docs under the latest URL)

      # Checkout a dedicated branch where to push the assembled docs
      - name: Checkout icp-pages branch
        uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
        with:
          ref: icp-pages
          path: icp-pages

      - name: Assemble docs
        uses: dfinity/ci-tools/actions/assemble-docs@main
        with:
          assets_dir: dist/docs/v1.2.3
          target_dir: icp-pages # must match the `path` in the checkout step
          version: v1.2.3
          version_label: 'Version 1.2.3'

      - name: Submit docs
        uses: dfinity/ci-tools/actions/submit-docs@main
        with:
          destination_repo: dfinity/icp-js-sdk-docs
          event_type: submit-project-docs
          token: ${{ secrets.GITHUB_TOKEN }}
          target_dir: icp-pages # must match the `path` in the checkout step
          target_branch: icp-pages # must match the `ref` in the checkout step
```
