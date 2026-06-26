# Plan 06: Packet Device And Packet Socket Nodes

## Goal

Translate the docs for packet-edge nodes and packet-device integration.

## Repository Context

Work in:

```text
WaterWall/WaterWall-Docs
```

Use the English MDX files as source.

## Source And Target Files

| English source | Persian target |
|---|---|
| `docs/02-noderefs/TunDevice.mdx` | `i18n/fa/docusaurus-plugin-content-docs/current/02-noderefs/TunDevice.mdx` |
| `docs/02-noderefs/RawSocket.mdx` | `i18n/fa/docusaurus-plugin-content-docs/current/02-noderefs/RawSocket.mdx` |
| `docs/02-noderefs/UdpStatelessSocket.mdx` | `i18n/fa/docusaurus-plugin-content-docs/current/02-noderefs/UdpStatelessSocket.mdx` |
| `docs/02-noderefs/WireGuardDevice.mdx` | `i18n/fa/docusaurus-plugin-content-docs/current/02-noderefs/WireGuardDevice.mdx` |

Create missing Persian docs and replace existing docs.

## Translation Rules

- Keep node names exactly.
- Keep OS/network terms precise: TUN, raw socket, UDP stateless socket, WireGuard, peer, allowed IPs, routing context, checksum.
- Preserve warnings about privileges, packet-line semantics, and packet injection/capture behavior.
- Preserve all JSON keys and values exactly.
- Preserve frontmatter `sidebar_position`; set `title` and `sidebar_label` to the exact node name.
- Translate `description` frontmatter to Persian if present.
- Do not copy hidden English sync-note comments.

## Quality Checklist

- The Persian docs must not describe these as normal TCP/stream tunnel nodes.
- Packet-line lifetime must be understandable.
- Readers should know when to use `TunDevice` versus `RawSocket` versus `UdpStatelessSocket`.
- `WireGuardDevice` docs must preserve security-sensitive wording.

## Validation

Run:

```bash
export NVM_DIR="$HOME/.nvm"
. "$NVM_DIR/nvm.sh"
yarn typecheck && yarn build
```

