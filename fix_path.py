import subprocess, os

# Check what the current effective PATH has for npm
# and add npm explicitly to user PATH

npm_path = r"C:\Users\thatg\AppData\Roaming\npm"

# Get current user PATH value
r = subprocess.run(
    ["reg", "query", "HKCU\\Environment", "/v", "PATH"],
    capture_output=True, text=True
)
print("Current user PATH reg value:")
print(r.stdout)

# The user PATH is: %PATH%;O:\go\bin
# Let's just add npm explicitly before %PATH%
# New value: C:\Users\thatg\AppData\Roaming\npm;%PATH%;O:\go\bin

new_path = f"{npm_path};%PATH%;O:\\go\\bin"
print(f"New user PATH: {new_path}")

# Set it
r = subprocess.run(
    ["setx", "PATH", new_path],
    capture_output=True, text=True
)
print("setx result:", r.stdout, r.stderr)
