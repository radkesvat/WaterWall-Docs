# Plan 16: BGP4 Nodes

## Goal

Translate docs for the BGP4-style client/server tunnel pair.

## Repository Context

Work in:

```text
WaterWall/WaterWall-Docs
```

Use English MDX files as source.

## Source And Target Files

| English source | Persian target |
|---|---|
| `docs/02-noderefs/Bgp4Client.mdx` | `i18n/fa/docusaurus-plugin-content-docs/current/02-noderefs/Bgp4Client.mdx` |
| `docs/02-noderefs/Bgp4Server.mdx` | `i18n/fa/docusaurus-plugin-content-docs/current/02-noderefs/Bgp4Server.mdx` |

Create missing targets and replace old Persian docs.

## Translation Rules

- Keep node names exactly.
- Preserve BGP4-style wording from the English source; do not invent real BGP routing behavior if the doc describes a tunnel protocol style.
- Keep field names, frame names, JSON keys, and numeric values unchanged.
- Translate client/server placement and behavior carefully.
- Preserve frontmatter `sidebar_position`; set `title` and `sidebar_label` to the exact node name.
- Translate `description` frontmatter to Persian if present.
- Do not copy hidden English sync-note comments.

## Quality Checklist

- The Persian docs do not overstate actual BGP functionality.
- Client/server pairing is obvious.
- Examples remain valid.
- New files are created if missing.

## Validation

Run:

```bash
export NVM_DIR="$HOME/.nvm"
. "$NVM_DIR/nvm.sh"
yarn typecheck && yarn build
```

