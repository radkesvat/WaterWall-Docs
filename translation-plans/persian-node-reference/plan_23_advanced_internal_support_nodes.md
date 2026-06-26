# Plan 23: Advanced Internal Support Nodes

## Goal

Translate docs for advanced/internal support nodes that are documented in the normal node reference but should be used directly only by expert users.

## Repository Context

Work in:

```text
WaterWall/WaterWall-Docs
```

Use English MDX docs as the source of truth.

## Source And Target Files

| English source | Persian target |
|---|---|
| `docs/02-noderefs/DomainResolver.mdx` | `i18n/fa/docusaurus-plugin-content-docs/current/02-noderefs/DomainResolver.mdx` |
| `docs/02-noderefs/UserController.mdx` | `i18n/fa/docusaurus-plugin-content-docs/current/02-noderefs/UserController.mdx` |

Create missing targets and replace existing Persian docs.

## Translation Rules

- Keep node names exactly.
- These docs must stay in the same node reference folder, not in an internal subsection.
- Translate the warning that these nodes are advanced and are used by other nodes; normal users should avoid direct use unless they know exactly what they are doing.
- For `DomainResolver`, preserve DNS resolution, pending line queue, destination context, failure, and overflow behavior.
- For `UserController`, preserve authenticated user limits, `AuthenticationClient` relationship, user handles, traffic accounting, and internal control behavior.
- Keep C type names, config keys, and code identifiers unchanged.
- Preserve frontmatter `sidebar_position`; set `title` and `sidebar_label` to exact node names.
- Translate `description` frontmatter to Persian if present.
- Do not copy hidden English sync-note comments.

## Quality Checklist

- The advanced/internal warning is obvious near the top of each page.
- Persian docs do not encourage normal users to configure these casually.
- Technical details remain precise.
- Examples and tables remain valid.

## Validation

Run:

```bash
export NVM_DIR="$HOME/.nvm"
. "$NVM_DIR/nvm.sh"
yarn typecheck && yarn build
```

