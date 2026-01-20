# Common Patterns

## Conditions and types
- Use `bool(...)` for conditions.
- `number` -> float, `bigint` -> int.

## Lists and dicts
- Use `list(t, [])` for empty lists.
- Use `list(t, 0)` / `list(t, null)` or `dict(k, v, 0)` as typed placeholders that keep pins unconnected.
- Use `list(0)` / `list(null)` / `dict(0)` / `dict(null)` only when the target pin can infer the type.
- `dict(...)` is read-only; use graph variables for writable dicts.

## Entity placeholders
- `entity(0)` / `entity(null)` keeps entity pins unconnected (empty).

## Debug output
- Prefer `print(str(...))` or `console.log(x)` (single arg).
