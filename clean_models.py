import json

# ===== 1. opencode.json =====
path1 = r"C:\Users\thatg\.config\opencode\opencode.json"
with open(path1, "r", encoding="utf-8") as f:
    cfg = json.load(f)

# 删掉 MiniMax 付费 provider，设置默认免费模型
cfg.pop("provider", None)
cfg["model"] = "opencode/minimax-m3-free"

with open(path1, "w", encoding="utf-8") as f:
    json.dump(cfg, f, indent=2, ensure_ascii=False)
print("opencode.json: cleaned (removed MiniMax provider)")

# ===== 2. model.json =====
path2 = r"C:\Users\thatg\.local\state\opencode\model.json"
with open(path2, "r", encoding="utf-8") as f:
    cfg2 = json.load(f)

# 只保留 opencode provider 的（免费模型）
cfg2["recent"] = [m for m in cfg2["recent"] if m["providerID"] == "opencode"]
# 只保留 variant 中 opencode 的（免费）
cfg2["variant"] = {k: v for k, v in cfg2["variant"].items() if k.startswith("opencode/")}

with open(path2, "w", encoding="utf-8") as f:
    json.dump(cfg2, f, indent=2, ensure_ascii=False)
print("model.json: cleaned (kept only free opencode models)")
