#!/usr/bin/env python3
"""Export crisp pixel-art sprites, portraits, and clean map plates from ref-pil/ to public/sprites/."""
import os
import sys
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REF_PIL = os.path.join(ROOT, "ref-pil")
OUT_DIR = os.path.join(ROOT, "public", "sprites")
os.makedirs(OUT_DIR, exist_ok=True)

sys.path.insert(0, REF_PIL)
import assets  # noqa: E402
import world as world_mod  # noqa: E402


def save_nearest(img: Image.Image, path: str, scale: int) -> None:
    if scale > 1:
        w, h = img.size
        img = img.resize((w * scale, h * scale), Image.NEAREST)
    img.save(path)


def export_walk_frames() -> None:
    sets = {
        "kevin": assets.kevin_frames(),
        "mulyadi": assets.mulyadi_frames(),
        "sari": assets.sari_frames(),
        "ujang": assets.ujang_frames(),
        "villager_red": assets.villager_frames((30, 24, 20), (220, 60, 50)),
        "villager_blue": assets.villager_frames((96, 60, 32), (60, 120, 220)),
        "villager_yellow": assets.villager_frames((180, 180, 180), (240, 200, 60)),
        "villager_green": assets.villager_frames((150, 60, 40), (90, 190, 90)),
    }
    for name, frames in sets.items():
        for i, fr in enumerate(frames):
            save_nearest(fr, os.path.join(OUT_DIR, f"{name}_walk_{i}.png"), 4)


def export_props() -> None:
    save_nearest(assets.PUMP, os.path.join(OUT_DIR, "pump.png"), 8)
    save_nearest(assets.MILL, os.path.join(OUT_DIR, "mill.png"), 4)
    save_nearest(assets.TREE, os.path.join(OUT_DIR, "tree.png"), 6)
    save_nearest(assets.make_tree(fruit=True), os.path.join(OUT_DIR, "tree_fruit.png"), 6)
    save_nearest(assets.HOUSE_THATCH, os.path.join(OUT_DIR, "house_thatch.png"), 4)
    save_nearest(assets.HOUSE_TILE, os.path.join(OUT_DIR, "house_tile.png"), 4)
    save_nearest(assets.HOUSE_ABAND, os.path.join(OUT_DIR, "house_aband.png"), 4)
    save_nearest(assets.STALL_RED, os.path.join(OUT_DIR, "stall_red.png"), 4)
    save_nearest(assets.STALL_BLUE, os.path.join(OUT_DIR, "stall_blue.png"), 4)


def export_portraits() -> None:
    def render_portrait(draw_fn, **kwargs) -> Image.Image:
        # Remove ground shadow ellipse by cropping or drawing on clean RGBA with transparent bg
        im = Image.new("RGBA", (64, 132), (0, 0, 0, 0))
        d = ImageDraw.Draw(im)
        draw_fn(d, 10, 126, **kwargs)
        # Replace opaque SHADOW ellipse at feet with soft translucent shadow
        px = im.load()
        for y in range(123, 132):
            for x in range(64):
                if px[x, y][:3] == assets.SHADOW and px[x, y][3] == 255:
                    px[x, y] = (0, 0, 0, 75)
        return im

    variants = [
        ("kevin_happy", assets.draw_kevin, dict(mouth="closed", blink=False, expr="happy")),
        ("kevin_neutral", assets.draw_kevin, dict(mouth="closed", blink=False, expr="neutral")),
        ("kevin_sad", assets.draw_kevin, dict(mouth="closed", blink=False, expr="sad")),
        ("kevin_open", assets.draw_kevin, dict(mouth="open", blink=False, expr="neutral")),
        ("kevin_blink", assets.draw_kevin, dict(mouth="closed", blink=True, expr="happy")),
        ("mulyadi_stern", assets.draw_mulyadi, dict(mouth="closed", blink=False, expr="stern")),
        ("mulyadi_neutral", assets.draw_mulyadi, dict(mouth="closed", blink=False, expr="neutral")),
        ("mulyadi_sad", assets.draw_mulyadi, dict(mouth="closed", blink=False, expr="sad")),
        ("mulyadi_blink", assets.draw_mulyadi, dict(mouth="closed", blink=True, expr="stern")),
        ("sari_neutral", assets.draw_sari, dict(mouth="closed", blink=False, expr="neutral")),
        ("sari_happy", assets.draw_sari, dict(mouth="closed", blink=False, expr="happy")),
    ]
    for name, fn, kw in variants:
        im = render_portrait(fn, **kw)
        save_nearest(im, os.path.join(OUT_DIR, f"portrait_{name}.png"), 4)


def export_plates() -> None:
    # 1. Year 1 clean map (two frames for river shimmer / subtle life)
    w1 = world_mod.World(seed=23, start_year=1)
    for f_idx, tag in [(0, "plate_map_y1_a.png"), (18, "plate_map_y1_b.png")]:
        grid = w1.render_grid(f_idx, 1.0)
        save_nearest(grid, os.path.join(OUT_DIR, tag), 2)

    # 2. Year 2 clean map (Sinarbaru has pumps installed)
    w2 = world_mod.World(seed=23, start_year=2)
    grid2 = w2.render_grid(60, 2.0)
    save_nearest(grid2, os.path.join(OUT_DIR, "plate_map_y2.png"), 2)

    # 3. Drought / dry fields contrast plate (Year 9 right-side dry fields vs left green)
    w9 = world_mod.World(seed=23, start_year=9)
    grid9 = w9.render_grid(120, 9.0)
    save_nearest(grid9, os.path.join(OUT_DIR, "plate_map_drought.png"), 2)

    # 4. Dry Tanjungsari fields close-up crop (from Year 9 right village, crisp 1280x720)
    crop_dry = grid9.crop((332, 30, 628, 196)).resize((1280, 720), Image.NEAREST)
    crop_dry.save(os.path.join(OUT_DIR, "plate_sawah_kering.png"))

    # 5. River strip (horizontal crop around river for Beat 12 vignette bottom strip)
    river_patch = grid.crop((292, 60, 348, 220)).resize((112, 320), Image.NEAREST)
    river_patch.save(os.path.join(OUT_DIR, "river_patch.png"))

    # 6. Sunset backdrop (from v2_effects / render_full sunset palette, clean no chars)
    gw, gh = world_mod.GW, world_mod.GH
    sun = Image.new("RGB", (gw, gh))
    px = sun.load()
    top, mid, bot = (42, 26, 74), (180, 89, 42), (242, 165, 74)
    for y in range(gh):
        if y < 150:
            t = y / 150
            c = tuple(int(top[i] + (mid[i] - top[i]) * t) for i in range(3))
        else:
            t = (y - 150) / 90
            c = tuple(int(mid[i] + (bot[i] - mid[i]) * min(1, t)) for i in range(3))
        for x in range(gw):
            px[x, y] = c
    d = ImageDraw.Draw(sun)
    d.ellipse([290, 110, 370, 190], fill=(255, 226, 150))
    d.ellipse([298, 118, 362, 182], fill=(255, 240, 190))
    for (cx, cy) in [(120, 60), (310, 44)]:
        d.ellipse([cx, cy, cx + 44, cy + 12], fill=(255, 220, 200))
        d.ellipse([cx + 10, cy - 6, cx + 34, cy + 8], fill=(255, 230, 210))
    d.rectangle([0, 240, gw, gh], fill=(74, 96, 52))
    d.rectangle([0, 240, gw, 248], fill=(92, 116, 62))
    for (hx, hy) in [(60, 200), (560, 205)]:
        d.rectangle([hx, hy, hx + 34, hy + 40], fill=(52, 40, 34))
        d.polygon([(hx - 4, hy), (hx + 17, hy - 16), (hx + 38, hy)], fill=(40, 30, 26))
    for (tx, ty) in [(430, 195), (90, 195)]:
        d.rectangle([tx + 6, ty + 18, tx + 9, ty + 50], fill=(40, 30, 26))
        d.ellipse([tx, ty, tx + 26, ty + 26], fill=(44, 66, 36))
    save_nearest(sun, os.path.join(OUT_DIR, "bg_sunset.png"), 2)


def main() -> None:
    export_walk_frames()
    export_props()
    export_portraits()
    export_plates()
    files = sorted(os.listdir(OUT_DIR))
    print(f"Exported {len(files)} sprite/plate files to {OUT_DIR}")


if __name__ == "__main__":
    main()
