# Plan 11: TLS And Reality Nodes

## Goal

Translate the docs for TLS and Reality protocol nodes.

These docs are security-sensitive and should preserve the exact meaning of handshake, verification, routing, and authentication behavior.

## Repository Context

Work in:

```text
WaterWall/WaterWall-Docs
```

Use English MDX pages as source.

## Source And Target Files

| English source | Persian target |
|---|---|
| `docs/02-noderefs/TlsClient.mdx` | `i18n/fa/docusaurus-plugin-content-docs/current/02-noderefs/TlsClient.mdx` |
| `docs/02-noderefs/TlsServer.mdx` | `i18n/fa/docusaurus-plugin-content-docs/current/02-noderefs/TlsServer.mdx` |
| `docs/02-noderefs/RealityClient.mdx` | `i18n/fa/docusaurus-plugin-content-docs/current/02-noderefs/RealityClient.mdx` |
| `docs/02-noderefs/RealityServer.mdx` | `i18n/fa/docusaurus-plugin-content-docs/current/02-noderefs/RealityServer.mdx` |

Create missing targets and replace existing Persian docs.

## Translation Rules

- Keep node names exactly.
- Keep TLS, SNI, ALPN, certificate, handshake, visitor, protected branch, and Reality terminology precise.
- Preserve all warnings and security notes.
- Keep field names, config keys, hostnames, and examples unchanged.
- Translate routing behavior in `RealityServer` very carefully: ordinary visitor traffic versus authenticated Reality clients.
- Preserve frontmatter `sidebar_position`; set `title` and `sidebar_label` to the exact node name.
- Translate `description` frontmatter to Persian if present.
- Do not copy hidden English sync-note comments.

## Quality Checklist

- The Persian text should not imply weaker or stronger security than the English source.
- TLS and Reality roles must not be confused.
- Examples remain valid.
- No old Persian information is kept if it conflicts with current English docs.

## Validation

Run:

```bash
export NVM_DIR="$HOME/.nvm"
. "$NVM_DIR/nvm.sh"
yarn typecheck && yarn build
```

