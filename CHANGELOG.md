## Unreleased

### Feat

- support `versionInTitle` input in assemble-docs action (#52)
- `install_allow_scripts` input in `setup-deno` action (#50)
- assemble-docs action (#46)
- extract version action (#45)
- submit-docs action (#47)
- add setup-deno action, and add use_pnpm option to pnpm-publish action
- add node version input to setup pnpm action
- add major version zero attribute to bump version action
- add npm publish and is beta tag actions
- include pr description in commitizen message check
- use target branch for cz check
- add optional prerelease input to bump version action
- remove auto pr approval and add support for github app token generation
- add check pr title workflow
- add generate release notes action
- add version output to bump version action
- add check commit messages workflow
- add bump version and generate changelog actions & workflow
- add actions to check commit messages and pr title
- add actions to setup python and commitizen
- **create-pr-action**: do not fail if there are no changes to commit
- **create-pr**: add create-pr action
- add approve pr action
- initial commit

### Fix

- only add `versionInTitle` to new entry if it's not empty (#54)
- the self-generate-changelog workflow (#56)
- make sure path is absolute in assemble-docs zip (#53)
- versions.json correct path
- update versions.json entry by index
- concat PR title and PR description in file (#40)
- concat strings without `printf` (#39)
- parse inputs from environment (#38)
- add missing shell prop to is beta tag, and npm publish actions
- bump version not outputting beta version and is beta outputting string boolean
- check commit messages target branch ref
- map bump version output correctly
- set bump version output correctly
- incorrect bump version output label
- remove useless inputs
- add missing merge method input
- use the same branch name for creating the commit as the pr
- push branch to repo before creating pr
- configure user name and email correctly
- incorrect type in generate changelog workflow
- move workflows to correct location
- resuable workflows
- check pr title action parameter
- do not cache pip project dependencies for python
