from PIL import Image

def colorize(path, hex_color):
    try:
        img = Image.open(path).convert("RGBA")
        pixels = img.load()
        # Parse hex color
        hex_color = hex_color.lstrip('#')
        r_target, g_target, b_target = tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

        for y in range(img.height):
            for x in range(img.width):
                r, g, b, a = pixels[x, y]
                # If pixel is not transparent, colorize it
                if a > 0:
                    pixels[x, y] = (r_target, g_target, b_target, a)
        
        img.save(path)
        print(f"Successfully colorized {path}")
    except Exception as e:
        print(f"Error processing {path}: {e}")

# Colorize the icon
colorize(r"c:\Users\HP\Desktop\Clothing\tailors-app\src\app\icon.png", "#C6A87C")
