"""Build the home page hero background reel, synced to the five hero slides.

The reel is five segments of exactly SLIDE seconds, one per slide, in order.
The carousel (components/site-client.tsx) reads the video's playback time to
decide which slide is showing, so text and footage always change together.

Each clip is cropped to remove watermarks (CapCut, RALSON badge, Blacklion/UT
logo), denoised, upscaled to Full HD with light sharpening, and has no audio.
Output: 1920x1080 (desktop) and 1080x1440 (phones) as AV1 + H.264, plus posters.

Usage (needs ffmpeg with libx264 and libsvtav1):
    python3 scripts/build-hero-reel.py <folder with UT01-UT03.mp4 and ut2.mp4> public/videos

Keep SLIDE equal to SLIDE_DURATION in components/site-client.tsx.
"""
import os, subprocess, sys, tempfile

SRC_DIR, DEST = sys.argv[1], sys.argv[2]
TMP = tempfile.mkdtemp(prefix="hero-reel-")
SLIDE = 5.5
FPS = 24
SRC = {k: f"{SRC_DIR}/{k}.mp4" for k in ["UT01", "UT02", "UT03", "ut2"]}

# (wide 16:9 crop, tall 3:4 crop) per source – windows that avoid the watermarks.
CROP = {
    "UT01": ("426:240:40:84", "180:240:110:84"),
    "UT02": ("680:382:0:48", "255:340:170:58"),
    "UT03": ("608:342:0:56", "225:300:330:56"),
    "ut2": ("1024:576:0:0", "432:576:296:0"),
}
# Optional per-clip tall-crop override (x offset) to keep the subject in frame on phones.
TALL_X = {("UT02", 18.25): 0, ("UT02", 10.0): 300, ("UT03", 12.6): 200, ("UT01", 11.0): 110}

# One entry per hero slide, in slide order. Each list sums to SLIDE seconds.
SLIDES = [
    [("ut2", 9.0, 5.5)],                          # 01 Your fleet. Our drive. – branded service truck
    [("UT03", 1.0, 5.5)],                         # 02 Built for the long haul – prime movers
    [("UT03", 12.6, 2.5), ("UT01", 11.0, 3.0)],   # 03 Ready for what's ahead – Ralson / Blacklion tread close-ups
    [("UT01", 4.0, 4.2), ("UT02", 18.25, 1.3)],   # 04 More life in every mile – fitting, fitter at work
    [("UT02", 0.3, 4.0), ("UT02", 10.0, 1.5)],    # 05 Local knowledge – tyre stock, truck rolling out
]
EDGE_FADE = 0.25  # dip at each slide boundary, matching the text fade


def crop_for(src, start, tall):
    wide, tall_crop = CROP[src]
    if not tall:
        return wide
    w, h, x, y = tall_crop.split(":")
    x = TALL_X.get((src, start), int(x))
    return f"{w}:{h}:{x}:{y}"


def build(name, size, tall):
    w, h = size
    inputs, chains, seg_labels, idx = [], [], [], 0
    for s, clips in enumerate(SLIDES):
        parts = []
        for src, start, dur in clips:
            # Read a little extra, then trim to the exact frame count below.
            inputs += ["-ss", str(start), "-t", str(dur + 0.3), "-i", SRC[src]]
            frames = round(dur * FPS)
            chains.append(
                f"[{idx}:v]fps={FPS},crop={crop_for(src, start, tall)},hqdn3d=2:2:6:6,"
                f"scale={w}:{h}:flags=lanczos,unsharp=5:5:0.6:5:5:0,setsar=1,format=yuv420p,"
                f"trim=end_frame={frames},setpts=PTS-STARTPTS[p{idx}]"
            )
            parts.append(f"[p{idx}]")
            idx += 1
        seg_frames = round(SLIDE * FPS)
        chains.append(
            f"{''.join(parts)}concat=n={len(parts)}:v=1:a=0,trim=end_frame={seg_frames},setpts=PTS-STARTPTS,"
            f"fade=t=in:st=0:d={EDGE_FADE},fade=t=out:st={SLIDE - EDGE_FADE}:d={EDGE_FADE}[s{s}]"
        )
        seg_labels.append(f"[s{s}]")
    chains.append(f"{''.join(seg_labels)}concat=n={len(SLIDES)}:v=1:a=0[v]")
    out = f"{TMP}/master-{name}.mp4"
    subprocess.run(["ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex", ";".join(chains),
                    "-map", "[v]", "-an", "-r", str(FPS), "-c:v", "libx264", "-crf", "12", "-preset", "fast", out],
                   check=True)
    return out


def encode(master, base):
    common = ["-an", "-pix_fmt", "yuv420p", "-g", str(FPS * 2), "-movflags", "+faststart"]
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", master, *common, "-c:v", "libsvtav1",
                    "-crf", "48", "-preset", "6", f"{DEST}/{base}.av1.mp4"], check=True, stderr=subprocess.DEVNULL)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", master, *common, "-c:v", "libx264", "-crf", "34",
                    "-preset", "slow", "-tune", "film", "-profile:v", "high", "-level", "4.0",
                    f"{DEST}/{base}.h264.mp4"], check=True)


def poster(master, name):
    # A frame from slide 01, which is what the page shows before the video starts.
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", "1.5", "-i", master, "-frames:v", "1",
                    "-q:v", "9", f"{DEST}/{name}"], check=True)


os.makedirs(DEST, exist_ok=True)
wide = build("wide", (1920, 1080), tall=False)
tall = build("tall", (1080, 1440), tall=True)
print("masters built", flush=True)
encode(wide, "hero-reel")
encode(tall, "hero-reel-mobile")
poster(wide, "hero-reel-poster.jpg")
poster(tall, "hero-reel-poster-mobile.jpg")
print("HERO-REEL-DONE ->", DEST)
