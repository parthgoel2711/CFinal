import os
import re

replacements = {
    # Backgrounds
    r"bg-\[\#F4F0EB\]": "bg-white",
    r"bg-\[\#EAE4D9\]": "bg-[#FAFAFA]",
    r"bg-\[\#E4DBCB\]": "bg-[#F3F4F6]",
    
    # Text
    r"text-\[\#2A2A2A\]": "text-[#111111]",
    r"hover:text-\[\#2A2A2A\]": "hover:text-[#111111]",
    
    # Gold Accents -> Charcoal (Option 1)
    r"text-\[\#C6A87C\]": "text-[#2A2A2A]",
    r"bg-\[\#C6A87C\]": "bg-[#2A2A2A]",
    r"border-\[\#C6A87C\]": "border-[#2A2A2A]",
    r"from-\[\#C6A87C\]": "from-[#2A2A2A]",
    r"via-\[\#C6A87C\]": "via-[#2A2A2A]",
    r"hover:text-\[\#C6A87C\]": "hover:text-[#2A2A2A]",
    r"hover:bg-\[\#C6A87C\]": "hover:bg-[#111111]",
    r"hover:border-\[\#C6A87C\]": "hover:border-[#111111]",
    
    # Navbar specific background
    r"bg-\[\#FDFBF7\]/90": "bg-white/90",
    
    # Borders
    r"border-\[\#D1CCC5\]": "border-[#E5E5E5]",
    r"border-\[\#EAEAEA\]": "border-[#E5E5E5]",
    
    # Subtext
    r"text-\[\#5C564D\]": "text-[#4B5563]",
    r"text-\[\#7A746B\]": "text-[#6B7280]",
    
    # globals.css specific
    r"\#F4F0EB": "#FFFFFF",
    r"\#2A2A2A": "#111111",
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
print("Done Option 1 conversion.")
