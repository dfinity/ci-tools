## Assemble docs action

Zips each subfolder in a provided `docs_output_dir`, then checks out the `icp-pages` branch, upserts entries in `versions.json` by discovered zip names, and pushes changes.

Inputs:

- `docs_output_dir` (required): Directory containing per-version doc folders. Output zips will be created next to them.
- `docs_version_label` (optional): Label to set for matching version entries. If empty, existing labels are kept.
- `author_name` / `author_email` / `commit_message` (optional): Git commit metadata for changes pushed to `icp-pages`.
