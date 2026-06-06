import json
cfg = json.load(open(r"C:\Users\thatg\.config\opencode\opencode.json"))
print("permission:", cfg.get("permission"))
