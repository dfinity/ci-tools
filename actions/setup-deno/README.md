# Setup Deno action

This action sets up [Deno](https://deno.com/) for use in actions. The version of
`deno` defaults to `v2.x`.

## Action inputs

| Input               | Description                                              | Default  |
| ------------------- | -------------------------------------------------------- | -------- |
| `deno_version_file` | The path to the file containing the Deno version to use. | `''`     |
| `deno_version`      | The specific Deno version to use.                        | `'v2.x'` |

## Example usage

```yaml
name: Setup Deno

on:
  push:
    branches:
      - main
    pull_request:

jobs:
  setup_pnpm:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2

      - name: Setup Deno
        uses: dfinity/ci-tools/actions/setup-deno@main
```
