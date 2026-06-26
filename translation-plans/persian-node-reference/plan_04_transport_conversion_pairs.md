# Plan 04: TCP/UDP Transport Conversion Pairs

## Goal

Translate the docs for transport conversion tunnel pairs that carry one traffic model over another.

## Repository Context

Work in:

```text
WaterWall/WaterWall-Docs
```

Use the English docs as the source of truth.

## Source And Target Files

| English source | Persian target |
|---|---|
| `docs/02-noderefs/TcpOverUdpClient.mdx` | `i18n/fa/docusaurus-plugin-content-docs/current/02-noderefs/TcpOverUdpClient.mdx` |
| `docs/02-noderefs/TcpOverUdpServer.mdx` | `i18n/fa/docusaurus-plugin-content-docs/current/02-noderefs/TcpOverUdpServer.mdx` |
| `docs/02-noderefs/UdpOverTcpClient.mdx` | `i18n/fa/docusaurus-plugin-content-docs/current/02-noderefs/UdpOverTcpClient.mdx` |
| `docs/02-noderefs/UdpOverTcpServer.mdx` | `i18n/fa/docusaurus-plugin-content-docs/current/02-noderefs/UdpOverTcpServer.mdx` |

Create missing Persian files and replace existing ones.

## Translation Rules

- Keep node names exactly.
- Translate client/server direction and framing behavior very carefully.
- Preserve all warning text about buffering, overflow, packet/stream boundaries, and close behavior.
- Keep `Client` and `Server` pairing language clear in Persian.
- Preserve frontmatter `sidebar_position`; set `title` and `sidebar_label` to the exact node name.
- Translate `description` frontmatter to Persian if present.
- Do not copy the English hidden sync-note comment.
- Preserve code blocks, diagrams, JSON, and numeric constants exactly unless the English source itself is changed first.

## Quality Checklist

- A Persian reader can tell which side belongs on the client and which side belongs on the server.
- Stream-vs-packet framing is not described backwards.
- The docs do not imply a generic reliable transport unless the English source says so.
- All current node names are CamelCase.

## Validation

Run:

```bash
export NVM_DIR="$HOME/.nvm"
. "$NVM_DIR/nvm.sh"
yarn typecheck && yarn build
```

