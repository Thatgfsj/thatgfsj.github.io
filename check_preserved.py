import json

path = r"C:\Users\thatg\.cache\opencode\models.json"
with open(path, "r", encoding="utf-8") as f:
    cache = json.load(f)

print(f"保留的提供商 ({len(cache)}):")
for pid, pdata in cache.items():
    models = pdata.get("models", {})
    env = pdata.get("env", [])
    print(f"  {pid}: {len(models)} 个模型, API key 需要: {env}")
    for mid, mdata in list(models.items())[:3]:
        cost = mdata.get("cost", {})
        print(f"    - {mid}: cost={cost}")
