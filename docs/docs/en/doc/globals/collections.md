# Lists and Dicts

## list
- `list('int', [])` defines empty list types.
- To keep a param empty, use `list('int', null)` / `list(null)` / `list(0)` (use explicit types if inference fails).
- List methods (`map`/`filter`/`find`) are supported.

## dict
- `dict(...)` creates a read-only dict.
- To keep a param empty, use `dict('str', 'int', null)` / `dict(null)` / `dict(0)` (use explicit types if inference fails).
- For mutable dicts, use graph variables via `f.get` / `f.set`.
