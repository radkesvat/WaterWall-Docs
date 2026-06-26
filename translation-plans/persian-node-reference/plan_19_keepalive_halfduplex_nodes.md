# Plan 19: KeepAlive And HalfDuplex Nodes

## Goal

Translate docs for keepalive/heartbeat and half-duplex tunnel pairs.

## Repository Context

Work in:

```text
WaterWall/WaterWall-Docs
```

Use English MDX docs as source.

## Source And Target Files

| English source | Persian target |
|---|---|
| `docs/02-noderefs/KeepAliveClient.mdx` | `i18n/fa/docusaurus-plugin-content-docs/current/02-noderefs/KeepAliveClient.mdx` |
| `docs/02-noderefs/KeepAliveServer.mdx` | `i18n/fa/docusaurus-plugin-content-docs/current/02-noderefs/KeepAliveServer.mdx` |
| `docs/02-noderefs/HalfDuplexClient.mdx` | `i18n/fa/docusaurus-plugin-content-docs/current/02-noderefs/HalfDuplexClient.mdx` |
| `docs/02-noderefs/HalfDuplexServer.mdx` | `i18n/fa/docusaurus-plugin-content-docs/current/02-noderefs/HalfDuplexServer.mdx` |

Create missing targets and replace existing docs.

## Translation Rules

- Keep node names exactly.
- Preserve heartbeat, interval, timeout, half-duplex direction, upload/download, and pairing behavior.
- Keep JSON keys and numeric units unchanged.
- Translate lifecycle, finish, and failure behavior carefully.
- Preserve frontmatter `sidebar_position`; set `title` and `sidebar_label` to exact node names.
- Translate `description` frontmatter to Persian if present.
- Do not copy hidden English sync-note comments.

## Quality Checklist

- Persian readers can tell what each pair does and where it belongs.
- Timers and failure behavior are clear.
- Half-duplex behavior is not described as full-duplex.
- Examples stay valid.

## Validation

Run:

```bash
export NVM_DIR="$HOME/.nvm"
. "$NVM_DIR/nvm.sh"
yarn typecheck && yarn build
```

