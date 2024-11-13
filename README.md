# DFINITY GitHub CI Tools

Shared GitHub actions and workflows for DFINITY repositories.

## Actions

- [Approve pull request](./actions/approve-pr/README.md)
- [Bump version](./actions//bump-version/README.md)
- [Check commit messages](./actions/check-commit-messages/README.md)
- [Check pull request title](./actions/check-pr-title/README.md)
- [Create pull request](./actions/create-pr/README.md)
- [Generate changelog](./actions/generate-changelog/README.md)
- [Setup Commitizen](./actions/setup-commitizen/README.md)
- [Setup pnpm](./actions/setup-pnpm/README.md)
- [Setup Python](./actions/setup-python/README.md)

## Workflows

- [Generate changelog](./workflows/generate-changelog/README.md)

## Conventions

### Required actions

Suffix required actions with `:required` to make it easier to determine which actions are required and which aren't.

Example:

```yaml
name: 'My Action:required'
```

## Contributing

Check out the [contribution guidelines](./.github/CONTRIBUTING.md).

## Setup

- Install [`fnm`](https://github.com/Schniz/fnm).
  ```bash
  curl -fsSL https://get.pnpm.io/install.sh | sh -
  ```
- Install the correct version of [`nodejs`](https://nodejs.org).
  ```bash
  fnm install
  ```
- Enable the correct version of `nodejs`.
  ```bash
  fnm use
  ```
- Set up the correct version of [`pnpm`](https://pnpm.io/).
  ```bash
  corepack enable
  ```
- Install dependencies:
  ```bash
  pnpm i
  ```

### Updating `pnpm`

To update the version of `pnpm` that is used:

```bash
corepack use pnpm@9.x
```

### Building

Actions are built locally and the built files are committed to the repository. To build the actions, run:

```bash
pnpm build
```

The GitHub actions pipeline will attempt to build the actions and check if there are any differences between the built files and those that are committed to the repository. If there are any differences, the pipeline will fail.
