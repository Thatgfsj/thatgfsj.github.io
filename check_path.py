import subprocess, sys

# Check System PATH
r = subprocess.run(
    ["reg", "query", r"HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Environment", "/v", "PATH"],
    capture_output=True, text=True
)
print("=== SYSTEM PATH ===")
print(r.stdout)
print(r.stderr)

# Check User PATH
r = subprocess.run(
    ["reg", "query", "HKCU\\Environment", "/v", "PATH"],
    capture_output=True, text=True
)
print("=== USER PATH ===")
print(r.stdout)
print(r.stderr)

# Check actual combined PATH from current process
import os
path = os.environ.get("PATH", "")
print("=== CURRENT PROCESS PATH ===")
for p in path.split(";"):
    if "npm" in p.lower() or "opencode" in p.lower():
        print(f"  >>> {p}")
