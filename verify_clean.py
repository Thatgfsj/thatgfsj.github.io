import json

print("=== opencode.json ===")
cfg = json.load(open(r"C:\Users\thatg\.config\opencode\opencode.json"))
print(json.dumps(cfg, indent=2, ensure_ascii=False))

print("\n=== model.json ===")
cfg2 = json.load(open(r"C:\Users\thatg\.local\state\opencode\model.json"))
print(json.dumps(cfg2, indent=2, ensure_ascii=False))
