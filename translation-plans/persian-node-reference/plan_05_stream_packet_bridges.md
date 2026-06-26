# Plan 05: Stream/Packet Bridge Nodes

## Goal

Translate the docs for nodes that bridge packet-oriented traffic and stream-oriented WaterWall lines.

These nodes are important and should be translated with expert-level care.

## Repository Context

Work in:

```text
WaterWall/WaterWall-Docs
```

Use the current English docs as the source of truth.

## Source And Target Files

| English source | Persian target |
|---|---|
| `docs/02-noderefs/PacketsToStream.mdx` | `i18n/fa/docusaurus-plugin-content-docs/current/02-noderefs/PacketsToStream.mdx` |
| `docs/02-noderefs/StreamToPackets.mdx` | `i18n/fa/docusaurus-plugin-content-docs/current/02-noderefs/StreamToPackets.mdx` |
| `docs/02-noderefs/PacketsToConnection.mdx` | `i18n/fa/docusaurus-plugin-content-docs/current/02-noderefs/PacketsToConnection.mdx` |
| `docs/02-noderefs/PacketSplitStream.mdx` | `i18n/fa/docusaurus-plugin-content-docs/current/02-noderefs/PacketSplitStream.mdx` |

Create missing targets and replace existing Persian docs.

## Translation Rules

- Keep current node names exactly. Do not use old names `PacketAsData` or `DataAsPacket` as current names.
- If the English source mentions old names, translate that note as legacy-name context only.
- Preserve the difference between persistent packet lines and normal connection lines.
- Translate lifecycle sections carefully: packet-line bootstrap, worker-local state, stream-facing line creation, pause/resume, finish, and checksum behavior.
- Keep constants, byte counts, and protocol field names exact.
- Preserve Mermaid diagrams and code fences. You may translate diagram labels if the Mermaid syntax remains valid.
- Preserve frontmatter `sidebar_position`; set `title` and `sidebar_label` to the exact node name.
- Translate `description` frontmatter to Persian if present.
- Do not copy hidden English sync-note comments.

## Quality Checklist

- The Persian docs make clear that packet lines are not ordinary per-connection lines.
- `PacketsToStream` and `StreamToPackets` are described as opposite bridge directions.
- `PacketsToConnection` is detailed enough for expert users.
- No target file keeps stale old Persian behavior that conflicts with the English source.

## Validation

Run:

```bash
export NVM_DIR="$HOME/.nvm"
. "$NVM_DIR/nvm.sh"
yarn typecheck && yarn build
```

