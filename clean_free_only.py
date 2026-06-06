import json

# ===== 1. models.json: 只保留 opencode 中 cost=0 的免费模型 =====
path = r"C:\Users\thatg\.cache\opencode\models.json"
with open(path, "r", encoding="utf-8") as f:
    cache = json.load(f)

# 只保留 opencode 提供商
opencode_data = cache.get("opencode", {})
free_models = {}
for mid, mdata in opencode_data.get("models", {}).items():
    cost = mdata.get("cost", {})
    # 检查是否全部 cost 字段都是 0 或空
    all_zero = True
    if isinstance(cost, dict):
        for v in cost.values():
            if v and v > 0:
                all_zero = False
                break
    elif isinstance(cost, (int, float)) and cost > 0:
        all_zero = False
    if all_zero:
        free_models[mid] = mdata

opencode_data["models"] = free_models
result = {"opencode": opencode_data}

with open(path, "w", encoding="utf-8") as f:
    json.dump(result, f, indent=2, ensure_ascii=False)

total_opencode = len(opencode_data.get("models", {}))
print(f"models.json: 删除了 opencode 中的 {total_opencode - len(free_models)} 个付费模型")
print(f"models.json: 保留 {len(free_models)} 个免费模型")

# 列出保留的免费模型
for mid in sorted(free_models.keys()):
    print(f"  - {mid}")

# ===== 2. model.json: 只保留 free 模型 =====
path2 = r"C:\Users\thatg\.local\state\opencode\model.json"
with open(path2, "r", encoding="utf-8") as f:
    cfg2 = json.load(f)

# 只保留 opencode provider 且 modelID 包含 "free" 的
cfg2["recent"] = [m for m in cfg2["recent"] if "free" in m.get("modelID", "").lower()]
cfg2["variant"] = {k: v for k, v in cfg2["variant"].items() if "free" in k.lower()}

with open(path2, "w", encoding="utf-8") as f:
    json.dump(cfg2, f, indent=2, ensure_ascii=False)
print(f"\nmodel.json: 清理完成, 保留 {len(cfg2['recent'])} 个最近模型")
