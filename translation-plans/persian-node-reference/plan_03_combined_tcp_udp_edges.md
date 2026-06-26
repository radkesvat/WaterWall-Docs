# Plan 03: Combined TCP/UDP Edge Nodes

## Goal

Translate the Persian docs for combined TCP/UDP edge nodes. These nodes expose both TCP and UDP listener/connector behavior behind one configured node.

## Repository Context

Work in:

```text
WaterWall/WaterWall-Docs
```

The English MDX pages are the source of truth.

## Source And Target Files

| English source | Persian target |
|---|---|
| `docs/02-noderefs/TcpUdpListener.mdx` | `i18n/fa/docusaurus-plugin-content-docs/current/02-noderefs/TcpUdpListener.mdx` |
| `docs/02-noderefs/TcpUdpConnector.mdx` | `i18n/fa/docusaurus-plugin-content-docs/current/02-noderefs/TcpUdpConnector.mdx` |

Create missing Persian files and replace existing Persian files.

## Translation Rules

- Keep node names exactly: `TcpUdpListener`, `TcpUdpConnector`.
- Keep configuration keys and values exactly, especially protocol-related options and `type` values.
- Preserve frontmatter `sidebar_position`; use exact node names for `title` and `sidebar_label`.
- Translate any `description` frontmatter to Persian.
- Do not copy hidden English documentation-version/sync comments into Persian localized files.
- Translate the distinction between TCP connection lines and UDP peer/datagram behavior clearly.
- Preserve notes about when these nodes are useful compared with separate TCP and UDP chains.

## Quality Checklist

- Persian readers should understand why these nodes exist and when to prefer them.
- TCP and UDP behavior must not be mixed up.
- All examples still use valid JSON.
- No old filename aliases or kebab-case page names appear.

## Validation

Run:

```bash
export NVM_DIR="$HOME/.nvm"
. "$NVM_DIR/nvm.sh"
yarn typecheck && yarn build
```

