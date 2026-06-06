import os
target = r"C:\Users\thatg\.claude\CLAUDE.md"
print("File exists:", os.path.exists(target))
if os.path.exists(target):
    print("Size:", os.path.getsize(target), "bytes")
    with open(target, "r", encoding="utf-8") as f:
        lines = f.readlines()
    print("Lines:", len(lines))
    for l in lines[:3]:
        print(repr(l))
