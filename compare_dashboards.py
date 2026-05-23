#!/usr/bin/env python3
from PIL import Image
import os

# Load images
ref_path = 'reference.png'
current_path = 'dashboard_full.png'

if not os.path.exists(ref_path):
    print(f"Error: {ref_path} not found")
    exit(1)

if not os.path.exists(current_path):
    print(f"Error: {current_path} not found")
    exit(1)

ref_img = Image.open(ref_path)
current_img = Image.open(current_path)

print(f"Reference: {ref_img.size}")
print(f"Current: {current_img.size}")

# Resize current to match reference height for better comparison
ref_w, ref_h = ref_img.size
cur_w, cur_h = current_img.size

# Scale current to match reference height
scale = ref_h / cur_h
new_cur_w = int(cur_w * scale)
current_resized = current_img.resize((new_cur_w, ref_h), Image.Resampling.LANCZOS)

# Create side-by-side comparison
total_width = ref_w + new_cur_w + 20  # 20px gap
max_height = ref_h
comparison = Image.new('RGB', (total_width, max_height), color='#1a1a1a')

# Paste images
comparison.paste(ref_img, (0, 0))
comparison.paste(current_resized, (ref_w + 20, 0))

# Save
comparison.save('comparison.png')
print(f"✓ Saved side-by-side comparison to comparison.png ({total_width}x{max_height})")
