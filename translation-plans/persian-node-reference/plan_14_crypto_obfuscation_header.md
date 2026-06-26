# Plan 14: Encryption, Obfuscation, And Header Nodes

## Goal

Translate docs for payload transformation protocol pairs: encryption, obfuscation, and fixed-header wrappers.

## Repository Context

Work in:

```text
WaterWall/WaterWall-Docs
```

Use English MDX pages as source.

## Source And Target Files

| English source | Persian target |
|---|---|
| `docs/02-noderefs/EncryptionClient.mdx` | `i18n/fa/docusaurus-plugin-content-docs/current/02-noderefs/EncryptionClient.mdx` |
| `docs/02-noderefs/EncryptionServer.mdx` | `i18n/fa/docusaurus-plugin-content-docs/current/02-noderefs/EncryptionServer.mdx` |
| `docs/02-noderefs/ObfuscatorClient.mdx` | `i18n/fa/docusaurus-plugin-content-docs/current/02-noderefs/ObfuscatorClient.mdx` |
| `docs/02-noderefs/ObfuscatorServer.mdx` | `i18n/fa/docusaurus-plugin-content-docs/current/02-noderefs/ObfuscatorServer.mdx` |
| `docs/02-noderefs/HeaderClient.mdx` | `i18n/fa/docusaurus-plugin-content-docs/current/02-noderefs/HeaderClient.mdx` |
| `docs/02-noderefs/HeaderServer.mdx` | `i18n/fa/docusaurus-plugin-content-docs/current/02-noderefs/HeaderServer.mdx` |

Create missing targets and replace existing Persian docs.

## Translation Rules

- Keep node names exactly.
- Preserve AEAD/encryption/key/nonce/tag terminology precisely.
- For obfuscation, avoid implying cryptographic security unless the English source says so.
- For header nodes, preserve exact header matching/add/removal behavior.
- Keep binary framing, byte counts, and padding notes exact.
- Preserve JSON examples and field names.
- Preserve frontmatter `sidebar_position`; set `title` and `sidebar_label` to the exact node name.
- Translate `description` frontmatter to Persian if present.
- Do not copy hidden English sync-note comments.

## Quality Checklist

- Client/server transformations are described in opposite directions correctly.
- Security wording remains accurate.
- Code examples stay valid.
- No stale Persian content from old docs is kept if it conflicts.

## Validation

Run:

```bash
export NVM_DIR="$HOME/.nvm"
. "$NVM_DIR/nvm.sh"
yarn typecheck && yarn build
```

