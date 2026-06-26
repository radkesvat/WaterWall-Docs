# Plan 12: HTTP Nodes

## Goal

Translate the docs for HTTP client/server tunnel nodes.

## Repository Context

Work in:

```text
WaterWall/WaterWall-Docs
```

Use English MDX docs as the source of truth.

## Source And Target Files

| English source | Persian target |
|---|---|
| `docs/02-noderefs/HttpClient.mdx` | `i18n/fa/docusaurus-plugin-content-docs/current/02-noderefs/HttpClient.mdx` |
| `docs/02-noderefs/HttpServer.mdx` | `i18n/fa/docusaurus-plugin-content-docs/current/02-noderefs/HttpServer.mdx` |

Create missing Persian files and replace existing ones.

## Translation Rules

- Keep node names exactly.
- Preserve HTTP/1.x, HTTP/2, h2c, WebSocket, custom upgrade, header, body, stream, and chunk terminology precisely.
- Keep all method names, header names, pseudo-header names, and protocol tokens unchanged.
- Translate lifecycle and finish/final-byte behavior carefully.
- Preserve limitations such as single-stream behavior if present in the English source.
- Preserve frontmatter `sidebar_position`; set `title` and `sidebar_label` to the exact node name.
- Translate `description` frontmatter to Persian if present.
- Do not copy hidden English sync-note comments.

## Quality Checklist

- Client and server roles remain distinct.
- HTTP/2/h2c details are not simplified incorrectly.
- JSON examples and header examples remain valid.
- No long English paragraphs remain outside protocol tokens/code.

## Validation

Run:

```bash
export NVM_DIR="$HOME/.nvm"
. "$NVM_DIR/nvm.sh"
yarn typecheck && yarn build
```

