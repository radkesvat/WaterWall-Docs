# Plan 02: TCP And UDP Edge Nodes

## Goal

Translate the Persian docs for the basic TCP and UDP edge nodes. These are listener/connector nodes that usually sit at the beginning or end of a chain.

## Repository Context

Work in:

```text
WaterWall/WaterWall-Docs
```

Use the English MDX files as the source of truth. Do not edit the English docs or the main `WaterWall/tunnels/*/description.md` files.

## Source And Target Files

Translate each English source into the matching Persian target:

| English source | Persian target |
|---|---|
| `docs/02-noderefs/TcpListener.mdx` | `i18n/fa/docusaurus-plugin-content-docs/current/02-noderefs/TcpListener.mdx` |
| `docs/02-noderefs/TcpConnector.mdx` | `i18n/fa/docusaurus-plugin-content-docs/current/02-noderefs/TcpConnector.mdx` |
| `docs/02-noderefs/UdpListener.mdx` | `i18n/fa/docusaurus-plugin-content-docs/current/02-noderefs/UdpListener.mdx` |
| `docs/02-noderefs/UdpConnector.mdx` | `i18n/fa/docusaurus-plugin-content-docs/current/02-noderefs/UdpConnector.mdx` |

Create a target file if it is missing. Otherwise replace the old Persian content with a fresh translation of the current English source.

## Translation Rules

- Keep node names exactly: `TcpListener`, `TcpConnector`, `UdpListener`, `UdpConnector`.
- Preserve frontmatter `sidebar_position`; set `title` and `sidebar_label` to the exact node name.
- Translate `description` frontmatter to Persian if present.
- Do not copy hidden English sync-note comments into Persian localized files.
- Preserve JSON examples exactly except for user-facing placeholder values where translation would not change semantics. Keep keys like `address`, `port`, `nodelay`, `multiport`, `whitelist`, and `blacklist` unchanged.
- Translate prose about lifecycle, accepted sockets, UDP peer lines, connection establishment, multiport behavior, filters, and DNS/resolution carefully.
- For `TcpListener` multiport priority, explicitly preserve the detail that filtered listeners have priority over a no-filter listener, and that the no-filter listener behaves like a default path.
- Make clear that GeoIP-style decisions require routing nodes such as `Router`.

## Quality Checklist

- Persian text is fluent and technical, not word-for-word machine Persian.
- `upstream`, `downstream`, `line`, `worker`, `payload`, and `chain` may remain as English technical terms if that is clearer, but explain them naturally in Persian sentences.
- Tables stay readable in Persian.
- Code blocks and JSON remain valid.
- No old Persian content contradicts the English source.

## Validation

Run from `WaterWall/WaterWall-Docs`:

```bash
export NVM_DIR="$HOME/.nvm"
. "$NVM_DIR/nvm.sh"
yarn typecheck && yarn build
```

