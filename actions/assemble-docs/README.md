# Assemble docs action

Packages documentation assets for a specific version and updates the `versions.json` file on the `icp-pages` branch.

This action:

- Zips the folder named after the requested `docs_version` inside `docs_output_dir`
- If a `latest` folder is present, zips that as well and ensures an entry exists in `versions.json`
- Checks out the `icp-pages` branch, upserts entries in `versions.json`, commits, and pushes the changes
- **Note**: Only stable versions (starting with `v`) are added to `versions.json`; non-stable versions like `beta`, `dev`, `next`, `nightly` are packaged but not tracked in versions

## Action inputs

| Input                  | Description                                                                                            | Default     |
| ---------------------- | ------------------------------------------------------------------------------------------------------ | ----------- |
| `docs_output_dir`      | Directory containing per-version documentation folders. Zips are written next to these folders.        | _required_  |
| `docs_version`         | The docs version to package. Allowed values: `vX`, `vX.Y`, `vX.Y.Z`, `beta`, `dev`, `next`, `nightly`. | _required_  |
| `docs_version_label`   | Optional label value to set for the docs version entry label. Defaults to `docs_version`.              | `''`        |
| `latest_version_label` | Optional label value to set for the latest entry in `versions.json`.                                   | `'latest'`  |
| `icp_pages_dir`        | The name of the folder where the icp-pages branch has been cloned.                                     | `icp-pages` |

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

      # Add your own steps to build doc assets and output them to dist/docs/v1.2.3
      # (and optionally dist/docs/latest if you want to publish docs under the latest URL)

      - name: Checkout icp-pages branch
        uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
        with:
          ref: icp-pages
          path: icp-pages

      - name: Assemble docs
        uses: dfinity/ci-tools/actions/assemble-docs@main
        with:
          docs_output_dir: dist/docs/
          docs_version: v1.2.3
          docs_version_label: 'Version 1.2.3'
          latest_version: v1 # optional; can be different from docs_version
          icp_pages_dir: icp-pages # optional; must be the same as the path in the checkout step
          github_token: ${{ secrets.GITHUB_TOKEN }}
```

In this example, the action will:

1. **Package the version**: Zip the `dist/docs/v1.2.3` folder
2. **Package latest** (if exists): Zip the `dist/docs/latest` folder
3. **Update versions.json**: Add entries for both folders:
   ```json
   {
     "path": "latest",
     "label": "latest (v1)"
   },
   {
     "path": "v1.2.3",
     "label": "Version 1.2.3"
   }
   ```
4. **Deploy**: Commit and push the changes to the `icp-pages` branch

## Prerequisites

- The `icp-pages` branch must exist in the repository and be checked out in the `icp_pages_dir`
- The `docs_output_dir` must contain a subfolder matching `docs_version`
- If a `latest` subfolder exists, it will be processed automatically

## Notes

- If `versions.json` does not exist on `icp-pages`, it will be created automatically
- All zip files are placed in the `icp-pages` directory for deployment
- Commit messages are automatically generated with the format: "Update static assets for docs version {docs_version}"
