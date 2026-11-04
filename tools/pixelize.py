#!/usr/bin/env python3
"""Turn generated images into BarbarAIn's 16-bit pixel art.

Every image goes through one shared master palette (game/assets/palette.png),
so pictures from nanogen and imagegen2 look like one game.

  pixelize.py palette                          # (re)build the master palette
  pixelize.py scene  IN OUT [--w 320 --h 180]  # opaque scene, dithered
  pixelize.py sprite IN OUT --h 80 [--w 120]   # transparent sprite, fit in box, outline
  pixelize.py portrait IN OUT [--size 96]      # transparent bust, square, outline
  pixelize.py icon IN OUT [--size 32]          # transparent icon
  pixelize.py face PORTRAIT96 OUT [--at 24,8]   # 48x48 integer crop for the party strip
  pixelize.py sheet IN OUTDIR --cols C --rows R --names a,b,c... [--size 32]
  Options: --key '#00ff00' remove a chroma-key background first; --no-outline; --dither
"""
import argparse, os, sys
from PIL import Image, ImageFilter, ImageEnhance

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PALETTE_PATH = os.path.join(ROOT, 'game', 'assets', 'palette.png')
INK = (14, 12, 18)

# Ramps built from the design's key colours plus skin, sea, foliage and stone.
RAMPS = [
    # ink / night indigo
    ['#0e0c12', '#1c1f3a', '#2b2f57', '#3d4478', '#5a64a0'],
    # lamplight gold / amber
    ['#3a2412', '#6b3f1c', '#a8622c', '#c9773a', '#e8b04b', '#f6d98a'],
    # blood red
    ['#2e0d10', '#5c1418', '#a3262a', '#d0503f', '#ef8a6a'],
    # verdigris / jungle green
    ['#0f2a26', '#1f4d42', '#3e8c7a', '#6cbf9e', '#a9e6c4'],
    ['#1d2a12', '#34501f', '#5a7f2e', '#8fb04a'],
    # bone / parchment
    ['#7a6a52', '#a8977a', '#cdbf9f', '#e9dec4', '#fbf6ea'],
    # skin
    ['#4a2a1e', '#653a28', '#7d4a33', '#9a5e42', '#b07552', '#c48a63', '#d9a07a', '#e6b48c', '#f0c9a4'],
    # sea / sky / starheart blue
    ['#0b2236', '#16466b', '#2f78a8', '#5fb4d9', '#bdf1ff'],
    # stone greys
    ['#2a2a30', '#47474f', '#6c6c75', '#9a9aa3'],
    # violet (sorcery, void)
    ['#2a1238', '#4f2466', '#8a4aa8'],
]


def hex2rgb(h):
    h = h.lstrip('#')
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def build_palette():
    cols = [hex2rgb(c) for ramp in RAMPS for c in ramp]
    img = Image.new('RGB', (len(cols), 1))
    img.putdata(cols)
    os.makedirs(os.path.dirname(PALETTE_PATH), exist_ok=True)
    img.save(PALETTE_PATH)
    print(f'palette: {len(cols)} colours -> {PALETTE_PATH}')
    return cols


def pal_image():
    if not os.path.exists(PALETTE_PATH):
        build_palette()
    pim = Image.open(PALETTE_PATH).convert('RGB')
    cols = [pim.getpixel((i, 0)) for i in range(pim.width)]
    flat = [v for c in cols for v in c]
    flat += flat[:3] * (256 - len(cols))  # pad with the first colour
    p = Image.new('P', (1, 1))
    p.putpalette(flat)
    return p


def quantize_rgb(rgb, dither):
    q = rgb.quantize(palette=pal_image(), dither=Image.Dither.FLOYDSTEINBERG if dither else Image.Dither.NONE)
    return q.convert('RGB')


def downscale(img, w, h):
    """LANCZOS to 2x, then nearest to 1x: crisp, without mushy box averaging."""
    return img.resize((w * 2, h * 2), Image.LANCZOS).resize((w, h), Image.NEAREST)


def chroma_key(img, key, tol=90):
    kr, kg, kb = hex2rgb(key)
    img = img.convert('RGBA')
    px = img.load()
    for y in range(img.height):
        for x in range(img.width):
            r, g, b, a = px[x, y]
            if abs(r - kr) + abs(g - kg) + abs(b - kb) < tol:
                px[x, y] = (0, 0, 0, 0)
    return img


def scene(src, dst, w=320, h=180, dither=True):
    img = Image.open(src).convert('RGB')
    # crop to the target aspect, centred
    ar = w / h
    if img.width / img.height > ar:
        nw = int(img.height * ar); x0 = (img.width - nw) // 2
        img = img.crop((x0, 0, x0 + nw, img.height))
    else:
        nh = int(img.width / ar); y0 = (img.height - nh) // 2
        img = img.crop((0, y0, img.width, y0 + nh))
    out = quantize_rgb(downscale(img, w, h), dither)
    out.save(dst, optimize=True)
    print(f'scene {dst} {w}x{h}')


def trim_alpha(img):
    bbox = img.getchannel('A').point(lambda a: 255 if a > 40 else 0).getbbox()
    return img.crop(bbox) if bbox else img


def sprite(src, dst, box_w, box_h, outline=True, key=None, dither=False, square=False, anchor='bottom', smooth=False):
    img = Image.open(src).convert('RGBA')
    if key:
        img = chroma_key(img, key)
    img = trim_alpha(img)
    pad = 1 if outline else 0
    bw, bh = box_w - 2 * pad, box_h - 2 * pad
    s = min(bw / img.width, bh / img.height)
    nw, nh = max(1, round(img.width * s)), max(1, round(img.height * s))
    # premultiply-ish: bleed colour into transparent pixels so edges don't go dark
    rgb = Image.new('RGB', img.size, (0, 0, 0))
    rgb.paste(img.convert('RGB'), mask=img.getchannel('A'))
    small_rgb = rgb.resize((nw * 2, nh * 2), Image.LANCZOS)
    small_a = img.getchannel('A').resize((nw * 2, nh * 2), Image.LANCZOS)
    # un-premultiply against the alpha so semi-transparent edge pixels keep their colour
    small_rgb = Image.composite(small_rgb, small_rgb.filter(ImageFilter.MaxFilter(3)), small_a.point(lambda a: 255 if a > 200 else 0))
    if smooth:
        # small sprites: one smooth downscale, then a touch of sharpening and colour
        small_rgb = rgb.resize((nw, nh), Image.LANCZOS).filter(ImageFilter.UnsharpMask(1, 60, 2))
        small_rgb = ImageEnhance.Color(small_rgb).enhance(1.15)
        small_a = img.getchannel('A').resize((nw, nh), Image.LANCZOS).point(lambda a: 255 if a >= 128 else 0)
    else:
        small_rgb = small_rgb.resize((nw, nh), Image.NEAREST)
        small_a = small_a.resize((nw, nh), Image.NEAREST).point(lambda a: 255 if a >= 128 else 0)
    q = quantize_rgb(small_rgb, dither)
    W, H = (box_w, box_h) if square else (nw + 2 * pad, nh + 2 * pad)
    out = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    ox = (W - nw) // 2
    oy = (H - nh - pad) if anchor == 'bottom' else (H - nh) // 2
    piece = q.convert('RGBA'); piece.putalpha(small_a)
    out.paste(piece, (ox, oy), piece)
    if outline:
        a = out.getchannel('A')
        grown = a.filter(ImageFilter.MaxFilter(3))
        ring = Image.new('RGBA', out.size, INK + (255,))
        ring.putalpha(grown)
        ring.alpha_composite(out)
        out = ring
    out.save(dst, optimize=True)
    print(f'sprite {dst} {out.width}x{out.height}')


def sheet(src, outdir, cols, rows, names, size, key=None, outline=True):
    img = Image.open(src).convert('RGBA')
    if key:
        img = chroma_key(img, key)
    cw, ch = img.width / cols, img.height / rows
    os.makedirs(outdir, exist_ok=True)
    tmp = os.path.join(outdir, '.cell.png')
    boxes = components(img)
    use_comp = len(boxes) == len(names)
    print(f'sheet: {len(boxes)} objects found for {len(names)} names -> ' + ('cutting by objects' if use_comp else 'FIXED GRID fallback (check results!)'))
    for i, name in enumerate(names):
        if not name or name == '-':
            continue
        c, r = i % cols, i // cols
        box = boxes[i] if use_comp else (int(c * cw), int(r * ch), int((c + 1) * cw), int((r + 1) * ch))
        cell = img.crop(tuple(box))
        cell.save(tmp)
        sprite(tmp, os.path.join(outdir, name + '.png'), size, size, outline=outline, square=True, anchor='center', smooth=True)
    if os.path.exists(tmp):
        os.remove(tmp)


def face(src, dst, at=(24, 8), size=48):
    """48x48 integer crop from a 96x96 portrait (no scaling)."""
    img = Image.open(src).convert('RGBA')
    x, y = at
    img.crop((x, y, x + size, y + size)).save(dst, optimize=True)
    print(f'face {dst} at {x},{y}')


def components(img, min_area=400):
    """Bounding boxes of separate opaque objects (8-connected on a downsampled mask), row-major."""
    a = img.getchannel('A')
    scale = 4
    small = a.resize((a.width // scale, a.height // scale), Image.BILINEAR).point(lambda v: 255 if v > 40 else 0)
    w, h = small.size
    px = small.load()
    seen = [[False] * w for _ in range(h)]
    boxes = []
    for y in range(h):
        for x in range(w):
            if px[x, y] and not seen[y][x]:
                stack = [(x, y)]; seen[y][x] = True
                x0 = x1 = x; y0 = y1 = y; n = 0
                while stack:
                    cx, cy = stack.pop(); n += 1
                    x0 = min(x0, cx); x1 = max(x1, cx); y0 = min(y0, cy); y1 = max(y1, cy)
                    for dx in (-1, 0, 1):
                        for dy in (-1, 0, 1):
                            nx, ny = cx + dx, cy + dy
                            if 0 <= nx < w and 0 <= ny < h and px[nx, ny] and not seen[ny][nx]:
                                seen[ny][nx] = True; stack.append((nx, ny))
                if n * scale * scale >= min_area:
                    boxes.append([x0 * scale, y0 * scale, (x1 + 1) * scale, (y1 + 1) * scale])
    # merge boxes that overlap (pieces of one object)
    merged = True
    while merged:
        merged = False
        for i in range(len(boxes)):
            for j in range(i + 1, len(boxes)):
                A, B = boxes[i], boxes[j]
                if A[0] - 8 < B[2] and B[0] - 8 < A[2] and A[1] - 8 < B[3] and B[1] - 8 < A[3]:
                    boxes[i] = [min(A[0], B[0]), min(A[1], B[1]), max(A[2], B[2]), max(A[3], B[3])]
                    del boxes[j]; merged = True; break
            if merged: break
    # row-major: group by rows using centre y
    boxes.sort(key=lambda b: (b[1] + b[3]) / 2)
    rows = []
    for b in boxes:
        cy = (b[1] + b[3]) / 2
        if rows and abs(cy - rows[-1][0]) < img.height / 10:
            rows[-1][1].append(b)
        else:
            rows.append([cy, [b]])
    out = []
    for _, rb in rows:
        out += sorted(rb, key=lambda b: b[0])
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('mode')
    ap.add_argument('src', nargs='?')
    ap.add_argument('dst', nargs='?')
    ap.add_argument('--w', type=int)
    ap.add_argument('--h', type=int)
    ap.add_argument('--size', type=int)
    ap.add_argument('--cols', type=int)
    ap.add_argument('--rows', type=int)
    ap.add_argument('--names')
    ap.add_argument('--key')
    ap.add_argument('--no-outline', action='store_true')
    ap.add_argument('--dither', action='store_true')
    ap.add_argument('--no-dither', action='store_true')
    ap.add_argument('--at', default='24,8')
    ap.add_argument('--crisp', action='store_true', help='sprites: 2x-then-nearest instead of smooth downscale')
    a = ap.parse_args()
    if a.mode == 'palette':
        build_palette(); return
    if not a.src or not a.dst:
        sys.exit('need IN and OUT')
    if a.mode == 'scene':
        scene(a.src, a.dst, a.w or 320, a.h or 180, dither=not a.no_dither)
    elif a.mode == 'sprite':
        h = a.h or 72
        caps = {48: 64, 72: 80, 100: 100, 140: 150}
        sprite(a.src, a.dst, a.w or caps.get(h, int(h * 1.1)), h, outline=not a.no_outline, key=a.key, dither=a.dither, smooth=not a.crisp)
    elif a.mode == 'portrait':
        s = a.size or 96
        sprite(a.src, a.dst, s, s, outline=not a.no_outline, key=a.key, dither=a.dither, square=True)
    elif a.mode == 'icon':
        s = a.size or 32
        sprite(a.src, a.dst, s, s, outline=not a.no_outline, key=a.key, square=True, anchor='center', smooth=True)
    elif a.mode == 'face':
        face(a.src, a.dst, tuple(int(v) for v in a.at.split(',')), a.size or 48)
    elif a.mode == 'sheet':
        sheet(a.src, a.dst, a.cols, a.rows, a.names.split(','), a.size or 32, key=a.key, outline=not a.no_outline)
    else:
        sys.exit('unknown mode ' + a.mode)


if __name__ == '__main__':
    main()
