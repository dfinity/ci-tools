## Assemble docs action

Packages documentation assets for a specific version and updates the `versions.json` file on the `icp-pages` branch.

This action:

- Zips the folder named after the requested `docs_version` inside `docs_output_dir`.
- If a `latest` folder is present, zips that as well and ensures an entry exists in `versions.json`.
- Checks out the `icp-pages` branch, upserts entries in `versions.json`, commits, and pushes the changes.

## Action inputs

| Input                | Description                                                                                             | Required | Default    |
| -------------------- | ------------------------------------------------------------------------------------------------------- | -------- | ---------- |
| `docs_output_dir`    | Directory containing per-version documentation folders. Zips are written next to these folders.         | Yes      | _required_ |
| `docs_version`       | The docs version to package. Allowed values: `vX`, `vX.Y`, `vX.Y.Z`, `beta`, `dev`, `next`, `nightly`.  | Yes      | _required_ |
| `docs_version_label` | Optional label value to set for the docs version entry label.                                           | No       | `''`       |
| `latest_version`     | If provided and a `latest` folder exists, sets the label for that entry to `latest (<latest_version>)`. | No       | `''`       |
| `github_token`       | GitHub token used to push to the `icp-pages` branch.                                                    | Yes      | _required_ |

## Action outputs

This action does not set any outputs.

## Example usage

```yaml
name: Assemble docs

on:
  workflow_dispatch:

jobs:
  assemble_docs:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2

      # build docs assets and output them to dist/docs/v1.2.3 (and optionally dist/docs/latest if you want to publish docs under the latest url)

      - name: Assemble docs
        uses: dfinity/ci-tools/actions/assemble-docs@main
        with:
          docs_output_dir: dist/docs/
          docs_version: v1.2.3
          docs_version_label: 'Version 1'
          latest_version: v1 # optional; can be different from docs_version
          github_token: ${{ secrets.GITHUB_TOKEN }}
```

In this example, the action will:

- Zip the `dist/docs/v1.2.3` folder and add the following entry to `versions.json`:
  ```json
  {
    "path": "v1.2.3",
    "label": "Version 1"
  }
  ```
- Zip the `dist/docs/latest` folder and add the following entry to `versions.json`:
  ```json
  {
    "path": "latest",
    "label": "latest (v1)"
  }
  ```
- Commit and push the changes to the `icp-pages` branch

## Notes

- The action assumes the `icp-pages` branch exists in the repository.
- If `versions.json` does not exist on `icp-pages`, it will be created.
- The `docs_output_dir` must contain a subfolder matching `docs_version`. If a `latest` subfolder exists, it will be processed too.
