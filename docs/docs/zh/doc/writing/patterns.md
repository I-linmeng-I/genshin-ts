# 常见编写模式

## 条件与类型
- 条件统一用 `bool(...)` 转换。
- `number` -> float，`bigint` -> int。

## 列表与字典
- 空数组请使用 `list(t, [])` 明确类型。
- 需要类型占位且保持引脚不连线时用 `list(t, 0)` / `list(t, null)` 或 `dict(k, v, 0)`。
- 仅在可推断类型时使用 `list(0)` / `list(null)` / `dict(0)` / `dict(null)`。
- `dict(...)` 为只读，需可写字典请用节点图变量。

## 实体占位
- `entity(0)` / `entity(null)` 可用于占位，保持节点参数引脚为空不连接。

## 调试输出
- 推荐 `print(str(...))` 或 `console.log(x)`（单参）。
