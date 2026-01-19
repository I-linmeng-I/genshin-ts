# 常见编写模式

## 条件与类型
- 条件统一用 `bool(...)` 转换。
- `number` -> float，`bigint` -> int。

## 列表与字典
- 空数组请使用 `list('int', [])` 明确类型。
- 参数需要空置可用 `list('int', null)` / `list(null)` / `list(0)` 或 `dict('str', 'int', null)` / `dict(null)` / `dict(0)`（类型无法推断时请用显式类型）。
- `dict(...)` 为只读，需可写字典请用节点图变量。

## 实体占位
- `entity(0)` / `entity(null)` 可用于占位，让编辑器参数保持为空。

## 调试输出
- 推荐 `print(str(...))` 或 `console.log(x)`（单参）。
