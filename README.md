# Actions

Shared GitHub actions for DFINITY repositories.

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
