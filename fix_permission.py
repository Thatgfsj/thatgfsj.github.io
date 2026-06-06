import json, os

path = r"C:\Users\thatg\.config\opencode\opencode.json"
with open(path, "r", encoding="utf-8") as f:
    cfg = json.load(f)

cfg["permission"] = {"task": "allow"}

with open(path, "w", encoding="utf-8") as f:
    json.dump(cfg, f, indent=2, ensure_ascii=False)

print("DONE: permission.task set to allow")
