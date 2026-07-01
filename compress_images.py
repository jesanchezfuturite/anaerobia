import os
from PIL import Image

folder_path = 'public/images/proyectos/galeria_industria'
max_size = 400 * 1024  # 400KB
max_dimension = 1600

def compress_image(filepath):
    original_size = os.path.getsize(filepath)
    if original_size <= max_size:
        return  # Already small enough

    try:
        with Image.open(filepath) as img:
            # Convert RGBA to RGB for JPEG if needed
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")
            
            # Resize if too large
            width, height = img.size
            if width > max_dimension or height > max_dimension:
                if width > height:
                    new_width = max_dimension
                    new_height = int((max_dimension / width) * height)
                else:
                    new_height = max_dimension
                    new_width = int((max_dimension / height) * width)
                img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
            
            # Save it optimized
            # Since some are PNGs, we might overwrite as JPEG to save space, but if we change extensions, links might break.
            # So let's keep original extension but compress well.
            ext = os.path.splitext(filepath)[1].lower()
            if ext in ['.jpg', '.jpeg']:
                img.save(filepath, 'JPEG', optimize=True, quality=80)
            elif ext == '.png':
                img.save(filepath, 'PNG', optimize=True)
            
            # Check size again, if still > 400KB, compress more for JPEG
            if ext in ['.jpg', '.jpeg']:
                current_size = os.path.getsize(filepath)
                quality = 75
                while current_size > max_size and quality > 30:
                    img.save(filepath, 'JPEG', optimize=True, quality=quality)
                    current_size = os.path.getsize(filepath)
                    quality -= 5

    except Exception as e:
        print(f"Failed to process {filepath}: {e}")

if not os.path.exists(folder_path):
    print(f"Folder not found: {folder_path}")
else:
    for filename in os.listdir(folder_path):
        filepath = os.path.join(folder_path, filename)
        if os.path.isfile(filepath):
            ext = os.path.splitext(filename)[1].lower()
            if ext in ['.jpg', '.jpeg', '.png']:
                original_size = os.path.getsize(filepath)
                print(f"Processing {filename} (Original: {original_size / 1024:.1f}KB)")
                compress_image(filepath)
                new_size = os.path.getsize(filepath)
                print(f"  -> New size: {new_size / 1024:.1f}KB")
