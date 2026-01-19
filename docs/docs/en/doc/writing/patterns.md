# Common Patterns

## Conditions and types
- Use `bool(...)` for conditions.
- `number` -> float, `bigint` -> int.

## Lists and dicts
- Use `list('int', [])` for empty lists.
- To keep a param empty, use `list('int', null)` / `list(null)` / `list(0)` or `dict('str', 'int', null)` / `dict(null)` / `dict(0)` (use explicit types if inference fails).
- `dict(...)` is read-only; use graph variables for writable dicts.

## Entity placeholders
- `entity(0)` / `entity(null)` keeps entity params empty in the editor.

## Debug output
- Prefer `print(str(...))` or `console.log(x)` (single arg).
