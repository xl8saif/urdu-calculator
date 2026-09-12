"""
Generate all app icons for the Urdu Calculator PWA.

Draws a rounded emerald square with a subtle gradient and the 🧮 emoji centered,
then exports: 512, maskable 512, 192, apple-touch 180, and favicon 64/32/16.

Run from anywhere:  python urdu-calculator/tools/make_icons.py
"""
import os
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ICON_DIR = os.path.join(ROOT, "icons")
os.makedirs(ICON_DIR, exist_ok=True)

# ---- colors (match css/style.css) ----
BG_TOP = (26, 74, 51)      # #1a4a33
BG_BOTTOM = (13, 31, 23)   # #0d1f17
BORDER = (44, 90, 68)      # #2c5a44

EMOJI = "\N{ABACUS}"       # 🧮


def rounded_gradient(size: int, radius_ratio: float = 0.18) -> Image.Image:
    """Rounded-square vertical gradient tile."""
    scale = 4  # supersample for smooth edges
    s = size * scale
    img = Image.new("RGB", (s, s), BG_BOTTOM)
    d = ImageDraw.Draw(img)
    # vertical gradient
    for y in range(s):
        t = y / max(1, s - 1)
        r = int(BG_TOP[0] * (1 - t) + BG_BOTTOM[0] * t)
        g = int(BG_TOP[1] * (1 - t) + BG_BOTTOM[1] * t)
        b = int(BG_TOP[2] * (1 - t) + BG_BOTTOM[2] * t)
        d.line([(0, y), (s, y)], fill=(r, g, b))
    # rounded mask
    mask = Image.new("L", (s, s), 0)
    md = ImageDraw.Draw(mask)
    md.rounded_rectangle([0, 0, s - 1, s - 1], radius=int(s * radius_ratio), fill=255)
    out = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    out.paste(img, (0, 0), mask)
    return out.resize((size, size), Image.LANCZOS)


def load_font(size: int):
    """Find a font that can render the abacus emoji on Windows."""
    candidates = [
        r"C:\Windows\Fonts\seguiemj.ttf",   # Segoe UI Emoji
        r"C:\Windows\Fonts\seguiemj.ttf".replace("seguiemj", "seguisym"),
        "/usr/share/fonts/truetype/noto/NotoColorEmoji.ttf",
    ]
    for path in candidates:
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size)
            except Exception:
                continue
    return ImageFont.load_default()


def draw_emoji(base: Image.Image, size: int) -> Image.Image:
    """Paste the emoji centered, at ~62% of tile size."""
    font = load_font(int(size * 0.62))
    # measure
    tmp = Image.new("RGBA", (size * 2, size * 2), (0, 0, 0, 0))
    td = ImageDraw.Draw(tmp)
    try:
        bbox = td.textbbox((0, 0), EMOJI, font=font)
        w, h = bbox[2] - bbox[0], bbox[3] - bbox[1]
    except Exception:
        w = h = int(size * 0.62)
    layer = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    ld = ImageDraw.Draw(layer)
    x = (size - w) // 2 - (bbox[0] if 'bbox' in dir() else 0)
    y = (size - h) // 2 - (bbox[1] if 'bbox' in dir() else 0)
    try:
        ld.text((x, y), EMOJI, font=font, embedded_color=True)
    except TypeError:
        # older Pillow: no embedded_color
        ld.text((x, y), EMOJI, font=font)
    return Image.alpha_composite(base.convert("RGBA"), layer)


def export(img: Image.Image, name: str, size: int):
    out = img.resize((size, size), Image.LANCZOS) if img.size[0] != size else img
    path = os.path.join(ICON_DIR, name)
    if name.endswith(".ico"):
        out.save(path, format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])
    else:
        out.save(path, format="PNG")
    print("wrote", os.path.relpath(path, ROOT))


def main():
    tile = rounded_gradient(512)
    with_emoji = draw_emoji(tile, 512)
    # maskable: same art, but emoji smaller and on full-bleed square (no rounded corners)
    maskable = Image.new("RGBA", (512, 512), BG_BOTTOM)
    md = ImageDraw.Draw(maskable)
    for y in range(512):
        t = y / 511
        md.line([(0, y), (512, y)], fill=(
            int(BG_TOP[0] * (1 - t) + BG_BOTTOM[0] * t),
            int(BG_TOP[1] * (1 - t) + BG_BOTTOM[1] * t),
            int(BG_TOP[2] * (1 - t) + BG_BOTTOM[2] * t),
        ))
    mfont = load_font(int(512 * 0.5))
    tmp = Image.new("RGBA", (1024, 1024), (0, 0, 0, 0))
    td = ImageDraw.Draw(tmp)
    try:
        bbox = td.textbbox((0, 0), EMOJI, font=mfont)
        w, h = bbox[2] - bbox[0], bbox[3] - bbox[1]
        ox, oy = bbox[0], bbox[1]
    except Exception:
        w = h = int(512 * 0.5)
        ox = oy = 0
    layer = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
    ld = ImageDraw.Draw(layer)
    ld.text(((512 - w) // 2 - ox, (512 - h) // 2 - oy), EMOJI, font=mfont, embedded_color=True)
    maskable = Image.alpha_composite(maskable, layer)

    export(with_emoji, "icon-512.png", 512)
    export(maskable, "icon-512-maskable.png", 512)
    export(with_emoji, "icon-192.png", 192)
    export(with_emoji, "icon-180.png", 180)   # apple-touch-icon
    export(with_emoji, "favicon.ico", 64)

    print("done.")


if __name__ == "__main__":
    main()
