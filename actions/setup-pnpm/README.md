# Setup PNPM action

This action sets up [pnpm](https://pnpm.io/) for use in actions. The version of `pnpm` to install is read from the `packageManager` field in the `package.json` file. See the [corepack documentation](https://nodejs.org/api/corepack.html) for more information.

## Action inputs

| Input               | Description                                                 | Default           |
| ------------------- | ----------------------------------------------------------- | ----------------- |
| `node_version_file` | The path to the file containing the Node.js version to use. | `'.node-version'` |

## Example usage

```yaml
name: 'Setup PNPM'

on:
  push:
    branches:
      - main

jobs:
  setup_pnpm:
    runs-on: ubuntu-latest
    steps:
      - name: 'Checkout repository'
        uses: actions/checkout@v4

      - name: 'Setup PNPM'
        uses: dfinity/ci-tools/actions/setup-pnpm@main
        with:
          node_version_file: '.nvmrc'
```
