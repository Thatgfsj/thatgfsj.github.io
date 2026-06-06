import json

# ===== 1. models.json 缓存：只保留免费提供商的模型 =====
path = r"C:\Users\thatg\.cache\opencode\models.json"
with open(path, "r", encoding="utf-8") as f:
    cache = json.load(f)

# 只保留 opencode 提供商（opencode 自己提供的都是免费模型）
free_providers = {}
for pid, pdata in cache.items():
    if pid == "opencode":
        free_providers[pid] = pdata
        continue
    # 如果有 cost 全部为 0 的提供商，也保留
    all_free = True
    for mid, mdata in pdata.get("models", {}).items():
        cost = mdata.get("cost", {})
        if isinstance(cost, dict):
            if any(v and v > 0 for v in cost.values()):
                all_free = False
                break
        elif isinstance(cost, (int, float)) and cost > 0:
            all_free = False
            break
    if all_free:
        free_providers[pid] = pdata

removed = set(cache.keys()) - set(free_providers.keys())
with open(path, "w", encoding="utf-8") as f:
    json.dump(free_providers, f, indent=2, ensure_ascii=False)

print(f"models.json: 删除了 {len(removed)} 个付费提供商: {', '.join(sorted(removed))}")
print(f"models.json: 保留了 {len(free_providers)} 个提供商")

# ===== 2. 确认 opencode.json 已干净 =====
path1 = r"C:\Users\thatg\.config\opencode\opencode.json"
cfg = json.load(open(path1, "r", encoding="utf-8"))
print(f"\nopencode.json: 默认模型 = {cfg.get('model', '未设置')}")
print(f"opencode.json: provider 配置 = {'无（干净）' if 'provider' not in cfg else '有残留!'}")
