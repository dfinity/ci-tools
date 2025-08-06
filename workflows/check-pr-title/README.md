# Check PR title

This workflow checks the title of a pull request to ensure it follows the [Conventional Commits specification](https://www.conventionalcommits.org/en/v1.0.0/).

## Example usage

```yaml
name: Check PR title

on:
  pull_request:

concurrency:
  group: pr-${{ github.workflow }}-${{ github.head_ref }}
  cancel-in-progress: true

jobs:
  check_pr_title:
    uses: dfinity/ci-tools/.github/workflows/check-pr-title.yaml@main
```
