"""Build the hero background reel from the four uploaded clips.

Each clip is cropped to remove watermarks (CapCut, RALSON badge, Blacklion/UT
logo), trimmed to its best moment, joined with short cross-fades, and exported
in Full HD: a wide 1920x1080 (desktop) and a tall 1080x1440 (mobile) version,
compressed as AV1 + H.264.

Usage (needs ffmpeg with libx264 and libsvtav1):
    python3 scripts/build-hero-reel.py <folder with UT01.mp4..UT04.mp4 and ut2.mp4> public/videos

Clip times and crops below are tuned for the original UT01–UT04 files; adjust
them if the source clips change.
"""
import os, subprocess, sys, tempfile
SRC_DIR = sys.argv[1]
DEST = sys.argv[2]
OUT = tempfile.mkdtemp(prefix="hero-reel-")
SRC = {
    "UT01": f"{SRC_DIR}/UT01.mp4",   # 496x368 letterboxed, 120fps, logo top-left
    "UT02": f"{SRC_DIR}/UT02.mp4",   # 848x478, CapCut top-right, RALSON bottom-right
    "UT03": f"{SRC_DIR}/UT03.mp4",   # 848x478, CapCut top-right, RALSON bottom-right
    "UT04": f"{SRC_DIR}/UT04.mp4",   # 464x832 portrait, UT mobile van
    "ut2": f"{SRC_DIR}/ut2.mp4",     # 1024x576, branded UT service truck, no watermarks
}
# (source, start, duration, wide crop w:h:x:y (2:1), tall crop w:h:x:y (3:4))
# Crops are 16:9 (wide/desktop) and 3:4 (tall/mobile) windows that avoid the watermarks.
CLIPS = [
    ("ut2", 9.0, 9.0, "1024:576:0:0", "432:576:296:0"),     # UT service truck (9s-18s)
    ("UT02", 0.3, 4.0, "680:382:0:48", "255:340:170:58"),   # tyre racks in the shop
    ("UT03", 0.3, 4.0, "608:342:0:56", "225:300:330:56"),   # prime mover wheels
    ("UT01", 4.0, 4.0, "426:240:40:84", "180:240:110:84"),  # tyre on the fitting machine
    ("UT02", 17.5, 2.0, "680:382:0:48", "255:340:0:58"),    # fitter with impact wrench
    ("UT04", 1.0, 4.0, "464:260:0:292", "464:619:0:150"),   # UT mobile service van
    ("UT03", 7.2, 2.0, "608:342:0:56", "225:300:150:56"),   # fitter lifting a tyre
    ("UT02", 6.0, 3.5, "680:382:0:48", "255:340:260:58"),   # wheel on the machine
    ("UT02", 10.0, 2.2, "680:382:0:48", "255:340:300:58"),  # truck rolling out
    ("UT03", 12.6, 3.4, "608:342:0:56", "225:300:200:56"),  # Ralson tread close-up
]
FADE = 0.6

def build(name, size, crop_index):
    w, h = size
    inputs, chains = [], []
    for i, clip in enumerate(CLIPS):
        src, start, dur = clip[0], clip[1], clip[2]
        crop = clip[3 + crop_index]
        inputs += ["-ss", str(start), "-t", str(dur), "-i", SRC[src]]
        chains.append(
            f"[{i}:v]fps=24,crop={crop},hqdn3d=2:2:6:6,scale={w}:{h}:flags=lanczos,"
            f"unsharp=5:5:0.6:5:5:0,setsar=1,"
            f"format=yuv420p,settb=AVTB[c{i}]"
        )
    # cross-fade chain
    prev, total = "c0", CLIPS[0][2]
    for i in range(1, len(CLIPS)):
        offset = total - FADE
        out = f"x{i}"
        chains.append(f"[{prev}][c{i}]xfade=transition=fade:duration={FADE}:offset={offset:.3f}[{out}]")
        prev, total = out, offset + CLIPS[i][2]
    # soft fade at the loop point
    chains.append(f"[{prev}]fade=t=in:st=0:d=0.5,fade=t=out:st={total-0.5:.3f}:d=0.5[v]")
    cmd = ["ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex", ";".join(chains),
           "-map", "[v]", "-an", "-c:v", "libx264", "-crf", "12", "-preset", "fast",
           f"{OUT}/master-{name}.mp4"]
    subprocess.run(cmd, check=True)
    print(f"master-{name}.mp4  {w}x{h}  {total:.1f}s")

DENOISE = "null"  # denoise is done per clip, before upscaling

def encode(master, base):
    common = ["-vf", DENOISE, "-an", "-pix_fmt", "yuv420p", "-g", "48", "-movflags", "+faststart"]
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", master, *common, "-c:v", "libsvtav1",
                    "-crf", "48", "-preset", "6", f"{DEST}/{base}.av1.mp4"], check=True)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", master, *common, "-c:v", "libx264", "-crf", "34",
                    "-preset", "slow", "-tune", "film", "-profile:v", "high", "-level", "4.0",
                    f"{DEST}/{base}.h264.mp4"], check=True)

def poster(master, name):
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", "1.5", "-i", master, "-frames:v", "1",
                    "-q:v", "9", f"{DEST}/{name}"], check=True)

os.makedirs(DEST, exist_ok=True)
build("wide", (1920, 1080), 0)   # Full HD 16:9
build("tall", (1080, 1440), 1)   # Full HD width, 3:4 for phones
encode(f"{OUT}/master-wide.mp4", "hero-reel")
encode(f"{OUT}/master-tall.mp4", "hero-reel-mobile")
poster(f"{OUT}/master-wide.mp4", "hero-reel-poster.jpg")
poster(f"{OUT}/master-tall.mp4", "hero-reel-poster-mobile.jpg")
print("Done ->", DEST)
