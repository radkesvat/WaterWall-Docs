# Plan 22: Debug, Policy, And Miscellaneous Nodes

## Goal

Translate docs for debug, policy, disturbance, and datagram helper nodes.

## Repository Context

Work in:

```text
WaterWall/WaterWall-Docs
```

Use English MDX docs as source.

## Source And Target Files

| English source | Persian target |
|---|---|
| `docs/02-noderefs/BlackHole.mdx` | `i18n/fa/docusaurus-plugin-content-docs/current/02-noderefs/BlackHole.mdx` |
| `docs/02-noderefs/Disturber.mdx` | `i18n/fa/docusaurus-plugin-content-docs/current/02-noderefs/Disturber.mdx` |
| `docs/02-noderefs/JunkDatagramSender.mdx` | `i18n/fa/docusaurus-plugin-content-docs/current/02-noderefs/JunkDatagramSender.mdx` |
| `docs/02-noderefs/LoggerTunnel.mdx` | `i18n/fa/docusaurus-plugin-content-docs/current/02-noderefs/LoggerTunnel.mdx` |

Create missing targets and replace existing Persian docs.

## Translation Rules

- Keep node names exactly.
- For `BlackHole`, preserve whether it drops, blocks, or terminates traffic according to the English source.
- For `Disturber`, preserve testing/simulation wording and avoid presenting it as a production security feature.
- For `JunkDatagramSender`, preserve datagram association behavior and any TCP-control relationship.
- For `LoggerTunnel`, preserve mode names, output modes, file naming, log levels, and privacy/debug warnings.
- Keep all config keys, mode names, log levels, and filenames unchanged.
- Preserve frontmatter `sidebar_position`; set `title` and `sidebar_label` to exact node names.
- Translate `description` frontmatter to Persian if present.
- Do not copy hidden English sync-note comments.

## Quality Checklist

- Persian readers understand which nodes are for tests/debugging.
- Log/privacy warnings are not weakened.
- Mode names and filenames remain exact.
- Examples stay valid.

## Validation

Run:

```bash
export NVM_DIR="$HOME/.nvm"
. "$NVM_DIR/nvm.sh"
yarn typecheck && yarn build
```

