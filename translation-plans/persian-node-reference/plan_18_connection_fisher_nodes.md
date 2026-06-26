# Plan 18: Connection Fisher Nodes

## Goal

Translate docs for `ConnectionFisherClient` and `ConnectionFisherServer`.

These nodes may not have older Persian docs, so create the Persian target files if needed.

## Repository Context

Work in:

```text
WaterWall/WaterWall-Docs
```

Use English MDX docs as source.

## Source And Target Files

| English source | Persian target |
|---|---|
| `docs/02-noderefs/ConnectionFisherClient.mdx` | `i18n/fa/docusaurus-plugin-content-docs/current/02-noderefs/ConnectionFisherClient.mdx` |
| `docs/02-noderefs/ConnectionFisherServer.mdx` | `i18n/fa/docusaurus-plugin-content-docs/current/02-noderefs/ConnectionFisherServer.mdx` |

Create missing targets and replace existing docs.

## Translation Rules

- Keep node names exactly.
- Preserve connection racing/fishing behavior, selected path, client/server pairing, and failure handling.
- Keep all config keys and code identifiers unchanged.
- Translate lifecycle and close behavior carefully.
- Preserve frontmatter `sidebar_position`; set `title` and `sidebar_label` to exact node names.
- Translate `description` frontmatter to Persian if present.
- Do not copy hidden English sync-note comments.

## Quality Checklist

- Persian docs explain why these nodes exist.
- Client/server roles are distinct.
- No unsupported behavior is implied.
- Examples remain valid.

## Validation

Run:

```bash
export NVM_DIR="$HOME/.nvm"
. "$NVM_DIR/nvm.sh"
yarn typecheck && yarn build
```

