import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

let logoCache: string | null = null;
async function logoDataUrl() {
  if (!logoCache) {
    const file = await readFile(join(process.cwd(), "public/images/utlogo.png"));
    logoCache = `data:image/png;base64,${file.toString("base64")}`;
  }
  return logoCache;
}

/**
 * Branded 1200×630 social image, rendered on the server with the font bundled
 * in Next.js — no network access needed. Keep text plain (no emoji: emoji
 * glyphs are fetched from the internet by the renderer).
 */
export async function renderOgImage({ eyebrow, title, footer }: { eyebrow: string; title: string; footer?: string }) {
  const logo = await logoDataUrl();
  const fontSize = title.length > 70 ? 52 : title.length > 45 ? 62 : 74;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "linear-gradient(135deg, #0f1212 0%, #1c2222 100%)",
          color: "#ffffff",
          borderLeft: "18px solid #d72d24"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} width={81} height={72} alt="" style={{ borderRadius: 8 }} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: 2 }}>ULTIMATE TYRES</div>
            <div style={{ fontSize: 20, color: "#ea3a31" }}>Your Fleet. Our Drive.</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 24, color: "#ea3a31", textTransform: "uppercase", letterSpacing: 3 }}>{eyebrow}</div>
          <div style={{ fontSize, fontWeight: 800, lineHeight: 1.08, maxWidth: 1000 }}>{title}</div>
        </div>
        <div style={{ fontSize: 22, color: "#9ca3af" }}>{footer ?? "Commercial tyres & fleet services across Australia"}</div>
      </div>
    ),
    ogSize
  );
}
