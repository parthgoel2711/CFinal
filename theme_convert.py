import os
import re

replacements = {
    r"bg-\[\#050505\]": "bg-[#FDFBF7]",
    r"bg-black/80": "bg-[#1A1A1A]/50",
    r"bg-black/95": "bg-[#1A1A1A]/50",
    r"bg-black/90": "bg-[#1A1A1A]/80",
    r"bg-black/40": "bg-[#1A1A1A]/40",
    r"bg-black/60": "bg-[#1A1A1A]/60",
    r"bg-black": "bg-white",
    r"bg-\[\#0A0A0A\]": "bg-white",
    r"bg-\[\#111\]": "bg-[#F5F5F0]",
    r"bg-\[\#1a1a1a\]": "bg-[#EAEAEA]",
    r"border-\[\#222\]": "border-[#EAEAEA]",
    r"border-\[\#333\]": "border-[#D6D6D6]",
    r"border-\[\#444\]": "border-[#CCCCCC]",
    r"text-white": "text-[#1A1A1A]",
    r"hover:text-white": "hover:text-black",
    r"text-zinc-400": "text-zinc-600",
    r"bg-zinc-900": "bg-zinc-200",
    r"bg-zinc-800": "bg-zinc-100",
    r"hover:bg-\[\#111\]": "hover:bg-[#F5F5F0]",
    r"text-black": "text-white",
    r"hover:bg-white": "hover:bg-[#1A1A1A]",
}

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = content
    for pattern, repl in replacements.items():
        new_content = re.sub(pattern, repl, new_content)
        
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

def walk_dir(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(('.tsx', '.ts')):
                process_file(os.path.join(root, file))

walk_dir(r"c:\Users\HP\Desktop\Clothing\tailors-app\src")
print("Done.")
