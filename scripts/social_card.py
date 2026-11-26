"""Builds static/img/social-card-v2.png, the image link previews show (Discord, GitHub, ...).

It reuses the mod's own store-page look instead of a generic web banner: the four red bands,
the gold fret frame and the 3D title lettering. The title banner, the frame corners and the
pixel font come from the trailer assets in the mod repo (docs/trailer/v7/mc), which only exist
locally, so run this from a machine that has both checkouts side by side.
"""
from pathlib import Path

from PIL import Image

WIKI = Path(__file__).resolve().parent.parent
MC = WIKI.parent / "History-Stages" / "docs" / "trailer" / "v7" / "mc"

W, H = 1200, 630
BANDS = [(234, 50, 60), (196, 36, 48), (137, 30, 43), (87, 28, 39)]
FRAME = [(255, 235, 87), (255, 200, 37), (255, 162, 20), (237, 118, 20)]
WHITE = (255, 255, 255)
CREAM = (255, 232, 170)
SHADOW = (63, 18, 24)

card = Image.new("RGB", (W, H))
px = card.load()
band_h = H / 4


def band(y):
    return min(int(y // band_h), 3)


for y in range(H):
    c = BANDS[band(y)]
    for x in range(W):
        px[x, y] = c

# Frame: same proportions as the store images, just at half scale (they are 2560 wide).
store = Image.open(MC / "store_pedestals.png").convert("RGB")
CORNER = 180  # corner motif size in the store image
INSET, THICK = 11, 11
for y in range(H):
    c = FRAME[band(y)]
    for x in list(range(INSET, INSET + THICK)) + list(range(W - INSET - THICK, W - INSET)):
        px[x, y] = c
for x in range(W):
    for y in range(INSET, INSET + THICK):
        px[x, y] = FRAME[0]
    for y in range(H - INSET - THICK, H - INSET):
        px[x, y] = FRAME[3]

sw, sh = store.size
half = CORNER // 2
corners = {
    (0, 0): (0, 0),
    (sw - CORNER, 0): (W - half, 0),
    (0, sh - CORNER): (0, H - half),
    (sw - CORNER, sh - CORNER): (W - half, H - half),
}
for (sx, sy), dest in corners.items():
    piece = store.crop((sx, sy, sx + CORNER, sy + CORNER)).resize((half, half), Image.NEAREST)
    card.paste(piece, dest)

# Logo: pixel art, so whole-number nearest-neighbour scaling only. A dark outline keeps its
# own red frame from melting into the background bands.
icon = Image.open(WIKI / "static" / "img" / "icon.png").convert("RGBA")
ix, iy = 110, (H - 256) // 2
outline = Image.new("RGBA", (256 + 16, 256 + 16), SHADOW + (255,))
card.paste(outline, (ix - 8 + 6, iy - 8 + 8))
card.paste(outline, (ix - 8, iy - 8))
card.paste(icon, (ix, iy), icon)

# Title: the 3D lettering from the trailer and store art.
banner = Image.open(MC / "title_banner.png").convert("RGBA")
tw = 690
th = round(banner.height * tw / banner.width)
banner = banner.resize((tw, th), Image.LANCZOS)
tx = 430
TOP = 222
card.paste(banner, (tx, TOP), banner)


# Subtitle in the vanilla pixel font, read from the 16x16 glyph sheet.
font = Image.open(MC / "ascii.png").convert("RGBA")


def glyph(ch):
    code = ord(ch)
    g = font.crop(((code % 16) * 8, (code // 16) * 8, (code % 16) * 8 + 8, (code // 16) * 8 + 8))
    if ch == " ":
        return g, 4
    alpha = g.getchannel("A")
    width = 0
    for x in range(8):
        if any(alpha.getpixel((x, y)) for y in range(8)):
            width = x + 1
    return g, width + 1


def text_width(s, scale):
    return sum(glyph(ch)[1] for ch in s) * scale - scale


def draw_text(s, x, y, scale, color):
    for dx, dy, col in ((scale, scale, SHADOW), (0, 0, color)):
        cx = x + dx
        for ch in s:
            g, adv = glyph(ch)
            alpha = g.getchannel("A").resize((8 * scale, 8 * scale), Image.NEAREST)
            card.paste(Image.new("RGB", alpha.size, col), (cx, y + dy), alpha)
            cx += adv * scale


def center_x(s, scale):
    return tx + (tw - text_width(s, scale)) // 2


line1 = "Documentation for modpack authors"
line2 = "Stages, locks, research and the editor"
draw_text(line1, center_x(line1, 3), TOP + th + 34, 3, WHITE)
draw_text(line2, center_x(line2, 3), TOP + th + 34 + 40, 3, CREAM)

card.save(WIKI / "static" / "img" / "social-card-v2.png", optimize=True)
print("written", card.size)
