import os, shutil

target = r"C:\Users\thatg\.claude\CLAUDE.md"
backup = r"O:\dswork\CLAUDE_BACKUP.md"

if os.path.exists(target):
    shutil.copy2(target, backup)
    print("BACKUP CREATED from existing file")
else:
    print("FILE DOES NOT EXIST, will create new one")
    # Create minimal content
    content = r"""# 强制记忆文件
"""
    with open(target, "w", encoding="utf-8") as f:
        f.write(content)
    shutil.copy2(target, backup)
    print("NEW FILE CREATED")
