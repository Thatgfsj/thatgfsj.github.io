import os

target = r"C:\Users\thatg\.claude\CLAUDE.md"
out = r"O:\dswork\claude_check_result.txt"

with open(out, "w", encoding="utf-8") as log:
    log.write("File exists: " + str(os.path.exists(target)) + "\n")
    if os.path.exists(target):
        log.write("Size: " + str(os.path.getsize(target)) + " bytes\n")
        with open(target, "r", encoding="utf-8") as f:
            content = f.read()
        log.write("Lines: " + str(content.count("\n")) + "\n")
        log.write("---FIRST 10 LINES---\n")
        for line in content.split("\n")[:10]:
            log.write(line + "\n")
        log.write("---LAST 5 LINES---\n")
        for line in content.split("\n")[-5:]:
            log.write(line + "\n")
    else:
        log.write("File DOES NOT EXIST - need to create it\n")
