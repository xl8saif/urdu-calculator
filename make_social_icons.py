"""
About-modal assets generator.

- Injects brand colors into the downloaded simple-icons SVGs (icons/*.svg)
  so they render correctly on the dark theme.
- Draws the ProZ tile (P + red rounded square) -> icons/s-proz.png
- Draws the portrait placeholder (initials avatar)   -> icons/portrait.png
  Replace icons/portrait.png with a real photo anytime (square PNG).
"""
import os
import re

from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
ICON_DIR = os.path.join(os.path.dirname(HERE), "icons")

GOLD = (232, 184, 75)       # #e8b84b
CARD = (29, 66, 51)         # #1d4233
INK = (244, 239, 227)       # #f4efe3
RED = (220, 60, 60)

BRAND_COLORS = {
    "linkedin.svg":    "#0A66C2",
    "github.svg":      "#f4efe3",
    "githubpages.svg": "#f4efe3",
    "facebook.svg":    "#1877F2",
    "whatsapp.svg":    "#25D366",
    "gmail.svg":       "#EA4335",
    "upwork.svg":      "#6FDA44",
}


def inject_fill(svg_name, color):
    """Add fill=color to the <svg> root tag if not already present."""
    path = os.path.join(ICON_DIR, svg_name)
    if not os.path.exists(path):
        print("missing:", svg_name)
        return
    with open(path, "r", encoding="utf-8") as f:
        text = f.read()
    if "fill=" in text.split(">", 1)[0]:
        # already has fill on root — replace its value
        text = re.sub(r'(<svg[^>]*?)fill="[^"]*"', r'\1fill="' + color + '"', text, count=1)
    else:
        text = text.replace("<svg ", '<svg fill="' + color + '" ', 1)
    with open(path, "w", encoding="utf-8") as f:
        f.write(text)
    print("colored:", svg_name, "->", color)


def load_font(size):
    for p in [r"C:\Windows\Fonts\seguisb.ttf", r"C:\Windows\Fonts\arialbd.ttf",
              r"C:\Windows\Fonts\calibrib.ttf"]:
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()


def make_proz_tile(size=64):
    s = size * 4
    img = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    pad = int(s * 0.06)
    d.rounded_rectangle([pad, pad, s - pad, s - pad], radius=int(s * 0.18), fill=RED)
    font = load_font(int(s * 0.55))
    bbox = d.textbbox((0, 0), "P", font=font)
    w, h = bbox[2] - bbox[0], bbox[3] - bbox[1]
    d.text(((s - w) / 2 - bbox[0], (s - h) / 2 - bbox[1]), "P", font=font, fill=(255, 255, 255))
    return img.resize((size, size), Image.LANCZOS)


def make_portrait(size=512):
    """Initials avatar placeholder — replace icons/portrait.png with a real photo."""
    s = size
    img = Image.new("RGB", (s, s), CARD)
    d = ImageDraw.Draw(img)
    for y in range(s):
        t = y / (s - 1)
        d.line([(0, y), (s, y)], fill=tuple(int(c * (1 - t * 0.25)) for c in CARD))
    d.ellipse([s * 0.14, s * 0.10, s * 0.86, s * 0.82], outline=GOLD, width=int(s * 0.025))
    font = load_font(int(s * 0.22))
    bbox = d.textbbox((0, 0), "SJ", font=font)
    w, h = bbox[2] - bbox[0], bbox[3] - bbox[1]
    d.text(((s - w) / 2 - bbox[0], (s * 0.46 - h / 2) - bbox[1]), "SJ", font=font, fill=INK)
    d.rounded_rectangle([s * 0.2, s * 0.86, s * 0.8, s * 0.96], radius=int(s * 0.05),
                        fill=(44, 90, 68))
    return img


def main():
    os.makedirs(ICON_DIR, exist_ok=True)
    for svg, color in BRAND_COLORS.items():
        inject_fill(svg, color)

    proz = make_proz_tile(64)
    proz.save(os.path.join(ICON_DIR, "s-proz.png"), format="PNG")
    print("wrote icons/s-proz.png")

    portrait = make_portrait(512)
    portrait.save(os.path.join(ICON_DIR, "portrait.png"), format="PNG")
    print("wrote icons/portrait.png (placeholder — replace with real photo)")


if __name__ == "__main__":
    main()
