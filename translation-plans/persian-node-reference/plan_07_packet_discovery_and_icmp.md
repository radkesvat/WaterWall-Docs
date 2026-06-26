# Plan 07: Packet Discovery And ICMP-Style Nodes

## Goal

Translate the docs for packet sender/receiver discovery nodes and ping-style packet encapsulation nodes.

## Repository Context

Work in:

```text
WaterWall/WaterWall-Docs
```

Use the current English node docs as source.

## Source And Target Files

| English source | Persian target |
|---|---|
| `docs/02-noderefs/PacketSender.mdx` | `i18n/fa/docusaurus-plugin-content-docs/current/02-noderefs/PacketSender.mdx` |
| `docs/02-noderefs/PacketReceiver.mdx` | `i18n/fa/docusaurus-plugin-content-docs/current/02-noderefs/PacketReceiver.mdx` |
| `docs/02-noderefs/PingClient.mdx` | `i18n/fa/docusaurus-plugin-content-docs/current/02-noderefs/PingClient.mdx` |
| `docs/02-noderefs/PingServer.mdx` | `i18n/fa/docusaurus-plugin-content-docs/current/02-noderefs/PingServer.mdx` |

Create missing targets and replace existing Persian docs.

## Translation Rules

- Keep node names exactly.
- Preserve the explanation that `PacketSender` and `PacketReceiver` are built to find good/white-listed source IPs in IP-restricted environments.
- Translate packet direction carefully. Do not reverse `PingClient` and `PingServer` behavior.
- Preserve packet/ICMP/IPv4 terminology and all field names.
- Keep diagrams, JSON, and code blocks valid.
- Preserve frontmatter `sidebar_position`; set `title` and `sidebar_label` to the exact node name.
- Translate `description` frontmatter to Persian if present.
- Do not copy hidden English sync-note comments.

## Quality Checklist

- The Persian docs should make it clear that these are packet-oriented nodes.
- Directional examples should stay consistent with the English source.
- Restricted-environment/source-IP discovery use case must be explicit.
- No long English prose remains outside identifiers/code.

## Validation

Run:

```bash
export NVM_DIR="$HOME/.nvm"
. "$NVM_DIR/nvm.sh"
yarn typecheck && yarn build
```

