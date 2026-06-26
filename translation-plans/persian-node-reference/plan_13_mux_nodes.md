# Plan 13: Mux Nodes

## Goal

Translate the docs for WaterWall multiplexing nodes.

## Repository Context

Work in:

```text
WaterWall/WaterWall-Docs
```

Use the English docs as source.

## Source And Target Files

| English source | Persian target |
|---|---|
| `docs/02-noderefs/MuxClient.mdx` | `i18n/fa/docusaurus-plugin-content-docs/current/02-noderefs/MuxClient.mdx` |
| `docs/02-noderefs/MuxServer.mdx` | `i18n/fa/docusaurus-plugin-content-docs/current/02-noderefs/MuxServer.mdx` |

Create missing Persian files and replace existing ones.

## Translation Rules

- Keep node names exactly.
- Preserve details about logical lines, shared transport connections, stream IDs, frames, payload forwarding, pause/resume, finish, and lifecycle.
- Preserve Mermaid diagrams. Translate diagram labels only if the Mermaid syntax remains valid.
- Keep all config keys and numeric values unchanged.
- Preserve frontmatter `sidebar_position`; set `title` and `sidebar_label` to the exact node name.
- Translate `description` frontmatter to Persian if present.
- Do not copy hidden English sync-note comments.

## Quality Checklist

- Persian docs explain why mux is useful and how client/server pair.
- Logical line behavior is clear.
- Backpressure and close semantics are not lost.
- Existing useful Persian diagram context may be retained only if it matches the English source.

## Validation

Run:

```bash
export NVM_DIR="$HOME/.nvm"
. "$NVM_DIR/nvm.sh"
yarn typecheck && yarn build
```

