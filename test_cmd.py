import subprocess, os

# Simulate a fresh cmd without any inherited PATH tricks
# Launch cmd with /C and a simple command that prints PATH and tries opencode
cmd_script = """
@echo off
echo === PATH entries with npm ===
for %%p in ("%PATH:;=" "%") do (
    echo %%p | findstr /i npm >nul && echo %%p
)
echo === where opencode ===
where opencode 2>&1
echo === try opencode directly ===
opencode --version 2>&1
"""

result = subprocess.run(
    ["cmd", "/c", cmd_script],
    capture_output=True, text=True,
    env={**os.environ}
)
print(result.stdout)
print(result.stderr)
