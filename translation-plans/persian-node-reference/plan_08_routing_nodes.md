# Plan 08: Routing Nodes

## Goal

Translate the docs for user-facing routing nodes.

These pages should be very understandable because users build complex WaterWall layouts around them.

## Repository Context

Work in:

```text
WaterWall/WaterWall-Docs
```

English MDX files are the source of truth.

## Source And Target Files

| English source | Persian target |
|---|---|
| `docs/02-noderefs/Router.mdx` | `i18n/fa/docusaurus-plugin-content-docs/current/02-noderefs/Router.mdx` |
| `docs/02-noderefs/SniffRouter.mdx` | `i18n/fa/docusaurus-plugin-content-docs/current/02-noderefs/SniffRouter.mdx` |

Create missing targets and replace existing Persian docs.

## Translation Rules

- Keep node names exactly.
- Translate route/rule/branch/filter/fallback concepts clearly.
- Preserve examples and diagrams. Mermaid labels may be translated if syntax stays valid.
- For `Router`, carefully explain multi-branch capabilities and default/fallback behavior.
- For `SniffRouter`, preserve the distinction between sniffed metadata and normal routing context.
- Preserve all config keys and type names exactly.
- Preserve frontmatter `sidebar_position`; set `title` and `sidebar_label` to the exact node name.
- Translate `description` frontmatter to Persian if present.
- Do not copy hidden English sync-note comments.

## Quality Checklist

- A Persian reader should know how traffic chooses a branch.
- Filter priority and fallback behavior should be clear.
- GeoIP or context-based routing should not be described as listener behavior.
- No stale old Persian data contradicts the English source.

## Validation

Run:

```bash
export NVM_DIR="$HOME/.nvm"
. "$NVM_DIR/nvm.sh"
yarn typecheck && yarn build
```

