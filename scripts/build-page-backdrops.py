"""Build the short looping background videos used at the top of inner pages.

Every theme uses footage that is NOT in the home page reel
(scripts/build-hero-reel.py) and not in any other theme, so each tab looks
different. Watermarks are cropped out and there is no audio. Exported in Full HD
for desktop and 960x540 for phones, as AV1 + H.264, plus a poster image.

Usage (needs ffmpeg with libx264 and libsvtav1):
    python3 scripts/build-page-backdrops.py <folder with UT01-UT03.mp4 and ut2.mp4> public/videos/backdrops

Footage already used by the home reel (keep themes clear of these ranges):
    ut2 9.0-14.5 | UT03 1.0-6.5, 12.6-15.1 | UT01 4.0-8.2, 11.0-14.0 | UT02 0.3-4.3, 10.0-11.5, 18.25-19.55
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

# theme -> list of (source, start, seconds of source, speed); speed < 1 = slow motion
THEMES = {
    "about":     [("ut2", 35.0, 5.5, 1.0)],                            # front of the Ultimate service truck
    "branch":    [("ut2", 20.0, 5.5, 1.0)],                            # pan: logo + "Our locations"
    "contact":   [("ut2", 25.5, 4.3, 1.0)],                            # truck graphics + phone panel
    "services":  [("UT03", 15.4, 3.6, 1.0), ("UT03", 19.5, 1.3, 1.0)], # fitter at machine, wheel-nut gun
    "alignment": [("UT02", 11.9, 5.3, 1.0)],                           # trailer axles rolling past
    "products":  [("UT02", 4.4, 1.4, 0.5), ("UT01", 14.0, 0.95, 0.5)], # Ralson display, BF188 tread (slow)
    "insights":  [("UT01", 1.4, 2.6, 1.0), ("UT01", 8.0, 2.4, 1.0)],   # old tyre off, tread close-up
    "dealer":    [("UT02", 5.9, 3.8, 1.0), ("UT03", 7.2, 2.0, 1.0)],   # wheel on machine, fitter lifting tyre
    "login":     [("ut2", 0.0, 6.5, 1.0)],                             # full side view of the branded truck
}
FADE = 0.6


def master(theme, clips):
    inputs, chains, durs = [], [], []
    for i, (src, start, length, speed) in enumerate(clips):
        inputs += ["-ss", str(start), "-t", str(length), "-i", SRC[src]]
        slow = "" if speed == 1.0 else f"setpts=PTS/{speed},minterpolate=fps=24:mi_mode=blend,"
        chains.append(
            f"[{i}:v]{slow}fps=24,crop={CROP[src]},hqdn3d=2:2:6:6,scale=1920:1080:flags=lanczos,"
            f"unsharp=5:5:0.6:5:5:0,setsar=1,format=yuv420p,settb=AVTB[c{i}]"
        )
        durs.append(length / speed)
    prev, total = "c0", durs[0]
    for i in range(1, len(clips)):
        offset = total - FADE
        chains.append(f"[{prev}][c{i}]xfade=transition=fade:duration={FADE}:offset={offset:.3f}[x{i}]")
        prev, total = f"x{i}", offset + durs[i]
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
only = set(sys.argv[3:])  # optional: build just these themes
for theme, clips in THEMES.items():
    if only and theme not in only:
        continue
    m, total = master(theme, clips)
    encode(m, f"{DEST}/{theme}.av1.mp4", None, "av1")
    encode(m, f"{DEST}/{theme}.h264.mp4", None, "h264")
    encode(m, f"{DEST}/{theme}-mobile.av1.mp4", "960:540", "av1")
    encode(m, f"{DEST}/{theme}-mobile.h264.mp4", "960:540", "h264")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", "1.0", "-i", m, "-frames:v", "1",
                    "-vf", "scale=1280:720", "-q:v", "8", f"{DEST}/{theme}.jpg"], check=True)
    print(f"{theme}: {total:.1f}s", flush=True)
print("BACKDROPS-DONE")
