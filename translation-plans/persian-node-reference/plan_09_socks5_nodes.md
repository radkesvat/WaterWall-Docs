# Plan 09: SOCKS5 Nodes

## Goal

Translate the docs for SOCKS5 client and server nodes.

## Repository Context

Work in:

```text
WaterWall/WaterWall-Docs
```

Use English docs as source.

## Source And Target Files

| English source | Persian target |
|---|---|
| `docs/02-noderefs/Socks5Client.mdx` | `i18n/fa/docusaurus-plugin-content-docs/current/02-noderefs/Socks5Client.mdx` |
| `docs/02-noderefs/Socks5Server.mdx` | `i18n/fa/docusaurus-plugin-content-docs/current/02-noderefs/Socks5Server.mdx` |

Create missing Persian files and replace existing ones.

## Translation Rules

- Keep node names exactly.
- Keep SOCKS5 method names, address types, username/password fields, and protocol status names precise.
- Preserve all JSON examples and config keys.
- Translate client-side upstream proxy behavior separately from server-side accepted SOCKS requests.
- Preserve limitations and authentication notes.
- Preserve frontmatter `sidebar_position`; set `title` and `sidebar_label` to the exact node name.
- Translate `description` frontmatter to Persian if present.
- Do not copy hidden English sync-note comments.

## Quality Checklist

- Client and server behavior are not mixed.
- Persian readers understand how destination context is set or consumed.
- Authentication text is clear and does not imply unsupported methods.

## Validation

Run:

```bash
export NVM_DIR="$HOME/.nvm"
. "$NVM_DIR/nvm.sh"
yarn typecheck && yarn build
```

