# Work Rules (for Codex)

## 0) Source of truth
- Do not read `AGENTS.ko.md`. It is a human-only translation.

## 1) Component-first workflow
- Before building UI, check for existing components in `src/shared/ui`.
- Prefer reuse if a component already exists.
- If a new shared component is needed, follow existing patterns and add it to `src/shared/ui`.

## 2) Color usage rules
- **Do not hardcode RGB/Hex colors.**
- Use only `--mws-*` tokens defined in `src/app/globals.css` and registered in `tailwind.config.js`.
- If a required color is missing:
  1) Add a new `--mws-*` token in `globals.css` (both light and dark)
  2) Register the same token in `tailwind.config.js`
  3) Apply the new token in code instead of a raw color

## 3) Figma MCP asset handling
- When extracting images/assets via Figma MCP, **save them to `src/assets/images/`**.
- Reference the saved path directly in code.

## 4) Pre-flight checklist
- Did I check `src/shared/ui` for an existing component?
- Are all colors using `--mws-*` tokens only?
- If I added colors, did I update both light and dark tokens?
- Did I store Figma assets in `src/assets/images/`?
