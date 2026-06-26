# Plan 21: IP Manipulation Nodes

## Goal

Translate docs for packet-level IP manipulation nodes.

## Repository Context

Work in:

```text
WaterWall/WaterWall-Docs
```

Use English docs as source.

## Source And Target Files

| English source | Persian target |
|---|---|
| `docs/02-noderefs/IpManipulator.mdx` | `i18n/fa/docusaurus-plugin-content-docs/current/02-noderefs/IpManipulator.mdx` |
| `docs/02-noderefs/IpOverrider.mdx` | `i18n/fa/docusaurus-plugin-content-docs/current/02-noderefs/IpOverrider.mdx` |

Create missing targets and replace existing Persian docs.

## Translation Rules

- Keep node names exactly.
- Preserve packet-level terminology: IPv4, TCP, UDP, TLS/SNI manipulation, source/destination IP, port rewrite, checksum recalculation, routing context.
- Keep config keys and protocol field names unchanged.
- Translate warnings and limitations carefully.
- Preserve any useful Persian conceptual explanation only if it matches the current English source.
- Preserve frontmatter `sidebar_position`; set `title` and `sidebar_label` to exact node names.
- Translate `description` frontmatter to Persian if present.
- Do not copy hidden English sync-note comments.

## Quality Checklist

- Persian docs make clear these are packet-oriented nodes.
- Checksum and routing-context behavior is not omitted.
- Examples stay valid.
- No outdated Persian behavior remains.

## Validation

Run:

```bash
export NVM_DIR="$HOME/.nvm"
. "$NVM_DIR/nvm.sh"
yarn typecheck && yarn build
```

