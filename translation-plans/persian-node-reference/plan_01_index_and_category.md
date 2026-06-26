# Plan 01: Persian Node Reference Index

## Goal

Translate the English node-reference index into Persian and make sure the Persian category landing page remains consistent with the current English documentation set.

This plan covers only the inventory/index page, not the individual node pages.

## Repository Context

Work in:

```text
WaterWall/WaterWall-Docs
```

Do not edit files in the main `WaterWall` source repo for this plan.

## Source And Target

Translate from:

```text
docs/02-noderefs/all-nodes.mdx
```

Write or replace:

```text
i18n/fa/docusaurus-plugin-content-docs/current/02-noderefs/all-nodes.mdx
```

Also inspect, but only edit if needed for the generated category title/description:

```text
i18n/fa/docusaurus-plugin-content-docs/current/02-noderefs/_category_.json
```

## Translation Rules

- Use the English `all-nodes.mdx` as the authoritative content.
- Translate all prose into natural Persian.
- Keep WaterWall node names exactly as code identifiers, for example `TcpListener`, `PacketsToStream`, `RealityServer`, and `UserController`.
- Keep config keys, JSON names, file paths, command names, and code identifiers inside backticks unchanged.
- Keep the page filename `all-nodes.mdx`; do not rename it.
- The Persian frontmatter should use a Persian title/sidebar label:

```md
---
sidebar_position: 1
title: "فهرست نودها"
sidebar_label: "فهرست نودها"
description: "فهرست نودهای قابل تنظیم WaterWall."
---
```

- Do not copy hidden English sync-note comments into the Persian localized page.
- If the English index has a `Scaffold Node Type` section, translate it and make clear that `Template` is only a developer scaffold, not a normal user-facing node.

## Quality Checklist

- The table lists all current nodes from the English index.
- The old aliases `PacketAsData` and `DataAsPacket` are not presented as current node names.
- `PacketsToStream` and `StreamToPackets` appear with their current names.
- `DomainResolver` and `UserController` remain in the same general node reference, with wording that says they are advanced/internal support nodes.
- No long English prose remains outside code blocks or identifiers.

## Validation

Run from `WaterWall/WaterWall-Docs`:

```bash
export NVM_DIR="$HOME/.nvm"
. "$NVM_DIR/nvm.sh"
yarn typecheck && yarn build
```

Existing blog warnings are acceptable if the build succeeds.

