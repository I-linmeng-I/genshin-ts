# Lists and Dicts

## list
- `list(t, [])` defines empty list types.
- For placeholders that keep the pin unconnected, use `list(t, 0)` / `list(t, null)`.
- Use `list(0)` / `list(null)` only when the target pin can infer the list type.
- List methods (`map`/`filter`/`find`) are supported.

## dict
- `dict(...)` creates a read-only dict.
- For placeholders that keep the pin unconnected, use `dict(k, v, 0)`.
- Use `dict(0)` / `dict(null)` only when the target pin can infer the dict type.
- Dict literals can include up to 50 pairs.
- For mutable dicts, use graph variables via `f.get` / `f.set`.
