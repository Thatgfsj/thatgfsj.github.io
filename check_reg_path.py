import subprocess

# Get system PATH
r = subprocess.run(
    ["reg", "query", r"HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Environment", "/v", "PATH"],
    capture_output=True, text=True
)
print("=== SYSTEM PATH ===")
print(r.stdout)
if "npm" in r.stdout.lower():
    print(">>> npm IS in system PATH")
else:
    print(">>> npm is NOT in system PATH")

# Get user PATH
r = subprocess.run(
    ["reg", "query", "HKCU\\Environment", "/v", "PATH"],
    capture_output=True, text=True
)
print("=== USER PATH ===")
print(r.stdout)
if "npm" in r.stdout.lower():
    print(">>> npm IS in user PATH")
else:
    print(">>> npm is NOT in user PATH")
