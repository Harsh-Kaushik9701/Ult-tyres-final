"""Build the short looping background videos used at the top of inner pages.

Each theme is a few seconds of matching footage (watermarks cropped out, no
audio), exported in Full HD for desktop and 960x540 for phones, as AV1 + H.264,
plus a poster image.

Usage (needs ffmpeg with libx264 and libsvtav1):
    python3 scripts/build-page-backdrops.py <folder with UT01-UT03.mp4 and ut2.mp4> public/videos/backdrops
"""
import os, subprocess, sys, tempfile

SRC_DIR, DEST = sys.argv[1], sys.argv[2]
TMP = tempfile.mkdtemp(prefix="backdrops-")
SRC = {k: f"{SRC_DIR}/{k}.mp4" for k in ["UT01", "UT02", "UT03", "ut2"]}

# 16:9 crop windows that avoid the CapCut / RALSON / Blacklion watermarks.
CROP = {
    "UT01": "426:240:40:84",
    "UT02": "680:382:0:48",
    "UT03": "608:342:0:56",
    "ut2": "1024:576:0:0",
}

# theme -> list of (source, start, duration)
THEMES = {
    "truck":   [("ut2", 9.0, 7.0)],                                    # branded service truck
    "fitting": [("UT01", 4.0, 4.0), ("UT02", 6.0, 3.5)],               # tyre fitting machines
    "trucks":  [("UT03", 0.3, 4.0), ("UT02", 17.5, 2.0), ("UT02", 10.0, 2.2)],  # prime movers, fitter
    "shop":    [("UT02", 0.3, 4.0), ("UT03", 12.6, 3.4)],              # tyre racks, Ralson tread
    "tread":   [("UT03", 12.6, 3.4), ("UT03", 7.2, 2.0)],              # tread close-up, fitter
}
FADE = 0.6


def master(theme, clips):
    inputs, chains = [], []
    for i, (src, start, dur) in enumerate(clips):
        inputs += ["-ss", str(start), "-t", str(dur), "-i", SRC[src]]
        chains.append(
            f"[{i}:v]fps=24,crop={CROP[src]},hqdn3d=2:2:6:6,scale=1920:1080:flags=lanczos,"
            f"unsharp=5:5:0.6:5:5:0,setsar=1,format=yuv420p,settb=AVTB[c{i}]"
        )
    prev, total = "c0", clips[0][2]
    for i in range(1, len(clips)):
        offset = total - FADE
        chains.append(f"[{prev}][c{i}]xfade=transition=fade:duration={FADE}:offset={offset:.3f}[x{i}]")
        prev, total = f"x{i}", offset + clips[i][2]
    chains.append(f"[{prev}]fade=t=in:st=0:d=0.4,fade=t=out:st={total - 0.4:.3f}:d=0.4[v]")
    out = f"{TMP}/{theme}.mp4"
    subprocess.run(["ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex", ";".join(chains),
                    "-map", "[v]", "-an", "-c:v", "libx264", "-crf", "12", "-preset", "fast", out], check=True)
    return out, total


def encode(src, dest, scale, codec):
    vf = ["-vf", f"scale={scale}:flags=lanczos"] if scale else []
    common = ["-an", "-pix_fmt", "yuv420p", "-g", "48", "-movflags", "+faststart"]
    if codec == "av1":
        args = ["-c:v", "libsvtav1", "-crf", "48", "-preset", "6"]
    else:
        args = ["-c:v", "libx264", "-crf", "34", "-preset", "slow", "-tune", "film",
                "-profile:v", "high", "-level", "4.0"]
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src, *vf, *common, *args, dest],
                   check=True, stderr=subprocess.DEVNULL if codec == "av1" else None)


os.makedirs(DEST, exist_ok=True)
for theme, clips in THEMES.items():
    m, total = master(theme, clips)
    encode(m, f"{DEST}/{theme}.av1.mp4", None, "av1")
    encode(m, f"{DEST}/{theme}.h264.mp4", None, "h264")
    encode(m, f"{DEST}/{theme}-mobile.av1.mp4", "960:540", "av1")
    encode(m, f"{DEST}/{theme}-mobile.h264.mp4", "960:540", "h264")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", "1.0", "-i", m, "-frames:v", "1",
                    "-vf", "scale=1280:720", "-q:v", "8", f"{DEST}/{theme}.jpg"], check=True)
    print(f"{theme}: {total:.1f}s", flush=True)
print("BACKDROPS-DONE")
