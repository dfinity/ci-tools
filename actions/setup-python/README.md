# Setup Python action

This action sets up [Python](https://www.python.org/) and [pip](https://pip.pypa.io/en/stable/) for use in actions.

## Example usage

```yaml
name: Setup Python

on:
  push:
    branches:
      - main
    pull_request:

jobs:
  setup_python:
    runs-on: ubuntu-latest
    steps:
      - name: 'Checkout repository'
        uses: actions/checkout@v4

      - name: Setup Python
        uses: dfinity/ci-tools/actions/setup-python@main
```
