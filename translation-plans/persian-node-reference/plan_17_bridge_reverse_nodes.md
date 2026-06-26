# Plan 17: Bridge And Reverse Nodes

## Goal

Translate docs for branch-joining and reverse-tunnel nodes.

## Repository Context

Work in:

```text
WaterWall/WaterWall-Docs
```

Use the English docs as source.

## Source And Target Files

| English source | Persian target |
|---|---|
| `docs/02-noderefs/Bridge.mdx` | `i18n/fa/docusaurus-plugin-content-docs/current/02-noderefs/Bridge.mdx` |
| `docs/02-noderefs/ReverseClient.mdx` | `i18n/fa/docusaurus-plugin-content-docs/current/02-noderefs/ReverseClient.mdx` |
| `docs/02-noderefs/ReverseServer.mdx` | `i18n/fa/docusaurus-plugin-content-docs/current/02-noderefs/ReverseServer.mdx` |

Create missing targets and replace existing Persian content.

## Translation Rules

- Keep node names exactly.
- For `Bridge`, preserve the conceptual explanation of why the node exists and how it joins separate chain branches.
- For reverse nodes, preserve NAT/firewall traversal, control path, accepted lines, and pairing semantics.
- Preserve diagrams and examples. Translate diagram labels only if Mermaid syntax remains valid.
- Keep all config keys and type values unchanged.
- Preserve frontmatter `sidebar_position`; set `title` and `sidebar_label` to exact node names.
- Translate `description` frontmatter to Persian if present.
- Do not copy hidden English sync-note comments.

## Quality Checklist

- Persian readers understand the problem `Bridge` solves.
- Reverse client/server responsibilities are not swapped.
- Old Persian explanations may inspire wording only if they match the English source.
- Examples stay valid.

## Validation

Run:

```bash
export NVM_DIR="$HOME/.nvm"
. "$NVM_DIR/nvm.sh"
yarn typecheck && yarn build
```

