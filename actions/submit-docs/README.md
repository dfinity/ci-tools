# Submit Documentation Action

This action triggers the `pull-projects-docs` workflow on a destination repository to sync the documentation files. An example of this workflow is available [here](https://github.com/dfinity/icp-js-sdk-docs/blob/ad33d389694f4e746473ccd9506aee55740456a7/.github/workflows/pull-project-docs.yml).

## Action inputs

| Input              | Description                                                                      | Required | Default                     |
| ------------------ | -------------------------------------------------------------------------------- | -------- | --------------------------- |
| `destination_repo` | The destination repository to trigger the workflow on                            | No       | `'dfinity/icp-js-sdk-docs'` |
| `event_type`       | The event type to trigger on the destination repository                          | No       | `'submit-project-docs'`     |
| `token`            | GitHub token with permissions to trigger workflows on the destination repository | Yes      | _required_                  |

## Example usage

```yaml
name: Submit Docs

on:
  push:
    branches: [main]

jobs:
  submit-docs:
    runs-on: ubuntu-latest
    steps:
      - name: Create GitHub App Token
        uses: actions/create-github-app-token@df432ceedc7162793a195dd1713ff69aefc7379e # v2.0.6
        id: generate_token
        with:
          app-id: ${{ vars.PR_AUTOMATION_BOT_PUBLIC_APP_ID }}
          private-key: ${{ secrets.PR_AUTOMATION_BOT_PUBLIC_PRIVATE_KEY }}
          owner: dfinity
          repo: icp-js-sdk-docs

      # Build your docs and commit them to the `icp-pages` branch.
      # Use the assemble-docs action for convenience.

      - name: Submit Documentation
        uses: dfinity/ci-tools/actions/submit-docs@main
        with:
          token: ${{ steps.generate_token.outputs.token }}
```
