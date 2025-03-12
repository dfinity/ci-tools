# Check pull request title

This action checks the title of a pull request to ensure it follows the [Conventional Commits specification](https://www.conventionalcommits.org/en/v1.0.0/). It assumes [Python](https://www.python.org/), [pip](https://pip.pypa.io/en/stable/) and [Commitizen](https://commitizen-tools.github.io/commitizen/) are already setup, see the [setup Python action](../setup-python/README.md) and [setup Commitizen action](../setup-commitizen/README.md) for ready to use actions to do this.

There is also a ready-to-use [workflow](../../workflows/check-pr-title/README.md) that uses this action.

## Action inputs

| Input                 | Description                                                 | Default |
| --------------------- | ----------------------------------------------------------- | ------- |
| `include_description` | Include the pull request description in the commit message. | `true`  |

## Example usage

```yaml
name: 'Check pull request title'

on:
  pull_request:

jobs:
  check_pr_title:
    runs-on: ubuntu-latest
    steps:
      - name: 'Setup Python'
        uses: dfinity/ci-tools/actions/setup-python@main

      - name: 'Setup Commitizen'
        uses: dfinity/ci-tools/actions/setup-commitizen@main

      - name: 'Check pull request title'
        uses: dfinity/ci-tools/actions/check-pr-title@main
        with:
          include_description: false
```
