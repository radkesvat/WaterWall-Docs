# Plan 15: Authentication Nodes

## Goal

Translate docs for the authentication protocol pair.

These nodes are new compared with some older Persian documentation, so create Persian pages if they are missing.

## Repository Context

Work in:

```text
WaterWall/WaterWall-Docs
```

Use English MDX pages as source.

## Source And Target Files

| English source | Persian target |
|---|---|
| `docs/02-noderefs/AuthenticationClient.mdx` | `i18n/fa/docusaurus-plugin-content-docs/current/02-noderefs/AuthenticationClient.mdx` |
| `docs/02-noderefs/AuthenticationServer.mdx` | `i18n/fa/docusaurus-plugin-content-docs/current/02-noderefs/AuthenticationServer.mdx` |

Create missing Persian targets and replace existing content.

## Translation Rules

- Keep node names exactly.
- Preserve authentication, users table, traffic counters, internal control line, worker `0`, keepalive, and server-side authorization behavior.
- Keep API names, type names, JSON keys, username/password fields, and code identifiers unchanged.
- Make clear whether a node is a data tunnel or an internal/control-plane participant.
- Preserve frontmatter `sidebar_position`; set `title` and `sidebar_label` to the exact node name.
- Translate `description` frontmatter to Persian if present.
- Do not copy hidden English sync-note comments.

## Quality Checklist

- Persian readers understand how `AuthenticationClient` and `AuthenticationServer` pair.
- The docs do not imply that normal traffic passes through `AuthenticationClient` unless the English source says so.
- New pages are created if absent.
- Security and accounting wording is precise.

## Validation

Run:

```bash
export NVM_DIR="$HOME/.nvm"
. "$NVM_DIR/nvm.sh"
yarn typecheck && yarn build
```

