import os
import re

replacements = {
    r"\#FDFBF7": "#F4F0EB",
    r"\#1A1A1A": "#2A2A2A",
    r"bg-white": "bg-[#EAE4D9]",
    r"\#F5F5F0": "#E4DBCB",
    r"\#EAEAEA": "#D1CCC5",
    r"text-zinc-600": "text-[#5C564D]",
    r"text-zinc-500": "text-[#7A746B]",
    r"hover:text-black": "hover:text-[#2A2A2A]",
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
            if file.endswith(('.tsx', '.ts', '.css')):
                process_file(os.path.join(root, file))

walk_dir(r"c:\Users\HP\Desktop\Clothing\tailors-app\src")
print("Done Option A conversion.")
