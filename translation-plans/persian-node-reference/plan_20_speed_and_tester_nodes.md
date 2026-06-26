# Plan 20: Speed And Tester Nodes

## Goal

Translate docs for speed limiting, speed testing, and deterministic tester nodes.

## Repository Context

Work in:

```text
WaterWall/WaterWall-Docs
```

Use English MDX docs as source.

## Source And Target Files

| English source | Persian target |
|---|---|
| `docs/02-noderefs/SpeedLimit.mdx` | `i18n/fa/docusaurus-plugin-content-docs/current/02-noderefs/SpeedLimit.mdx` |
| `docs/02-noderefs/SpeedTestClient.mdx` | `i18n/fa/docusaurus-plugin-content-docs/current/02-noderefs/SpeedTestClient.mdx` |
| `docs/02-noderefs/SpeedTestServer.mdx` | `i18n/fa/docusaurus-plugin-content-docs/current/02-noderefs/SpeedTestServer.mdx` |
| `docs/02-noderefs/TesterClient.mdx` | `i18n/fa/docusaurus-plugin-content-docs/current/02-noderefs/TesterClient.mdx` |
| `docs/02-noderefs/TesterServer.mdx` | `i18n/fa/docusaurus-plugin-content-docs/current/02-noderefs/TesterServer.mdx` |

Create missing targets and replace existing Persian docs.

## Translation Rules

- Keep node names exactly.
- Preserve throughput units, rate limits, payload sizes, generated traffic behavior, validation behavior, and test-only warnings.
- Keep JSON keys, numeric values, and units unchanged.
- Translate client/server pairing for speed-test and tester nodes carefully.
- Preserve frontmatter `sidebar_position`; set `title` and `sidebar_label` to exact node names.
- Translate `description` frontmatter to Persian if present.
- Do not copy hidden English sync-note comments.

## Quality Checklist

- Persian users can distinguish production `SpeedLimit` from test/validation nodes.
- Units and rates are not mistranslated.
- Test warnings remain visible.
- Examples are valid.

## Validation

Run:

```bash
export NVM_DIR="$HOME/.nvm"
. "$NVM_DIR/nvm.sh"
yarn typecheck && yarn build
```

