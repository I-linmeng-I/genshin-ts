# 列表与字典

## list
- `list('int', [])` 明确空列表类型。
- 参数需要空置可用 `list('int', null)` / `list(null)` / `list(0)`（类型无法推断时请用显式类型）。
- 列表方法（`map`/`filter`/`find` 等）有编译支持。

## dict
- `dict(...)` 生成只读字典。
- 参数需要空置可用 `dict('str', 'int', null)` / `dict(null)` / `dict(0)`（类型无法推断时请用显式类型）。
- 可写字典请声明节点图变量并通过 `f.get` / `f.set`。
