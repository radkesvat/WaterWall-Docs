# Plan 10: VLESS And Trojan Nodes

## Goal

Translate the docs for VLESS and Trojan protocol client/server pairs.

## Repository Context

Work in:

```text
WaterWall/WaterWall-Docs
```

Use current English MDX docs as source.

## Source And Target Files

| English source | Persian target |
|---|---|
| `docs/02-noderefs/VlessClient.mdx` | `i18n/fa/docusaurus-plugin-content-docs/current/02-noderefs/VlessClient.mdx` |
| `docs/02-noderefs/VlessServer.mdx` | `i18n/fa/docusaurus-plugin-content-docs/current/02-noderefs/VlessServer.mdx` |
| `docs/02-noderefs/TrojanClient.mdx` | `i18n/fa/docusaurus-plugin-content-docs/current/02-noderefs/TrojanClient.mdx` |
| `docs/02-noderefs/TrojanServer.mdx` | `i18n/fa/docusaurus-plugin-content-docs/current/02-noderefs/TrojanServer.mdx` |

Create missing targets and replace existing Persian content.

## Translation Rules

- Keep node names exactly.
- Preserve protocol names `VLESS` and `Trojan`.
- Keep UUIDs, passwords, command names, destination fields, and protocol bytes exactly as the English docs show.
- Translate authentication, request parsing, destination selection, and server rejection behavior carefully.
- Preserve notes about typical TLS/Reality placement.
- Preserve frontmatter `sidebar_position`; set `title` and `sidebar_label` to the exact node name.
- Translate `description` frontmatter to Persian if present.
- Do not copy hidden English sync-note comments.

## Quality Checklist

- Client and server docs read as a matched pair.
- Security/authentication wording remains precise.
- Examples remain syntactically valid.
- Old or legacy composition notes are translated only if present in the English source.

## Validation

Run:

```bash
export NVM_DIR="$HOME/.nvm"
. "$NVM_DIR/nvm.sh"
yarn typecheck && yarn build
```

