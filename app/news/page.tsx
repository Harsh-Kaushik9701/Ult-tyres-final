import type { Metadata } from "next";
import Link from "next/link";
import { articles } from "@/lib/content";
import { PageHero, ContactBand } from "@/components/site";

export const metadata: Metadata = {
  title: "Commercial Fleet News & Technical Blog",
  description:
    "Thought leadership, technical guides, Cost-Per-Kilometer analysis, and heavy vehicle maintenance advice for Australian fleet managers and workshop directors."
};

export default function NewsPage() {
  return (
    <>
      <PageHero
        eyebrow="Commercial Transport Thought Leadership · News & Blogs"
        title="Fleet Know-How for the Road Ahead."
        intro="Straight-talking, benefit-driven engineering guides from Australia's commercial tyre specialists. Discover how to cut tyre scrub, double casing retreadability, and eliminate avoidable downtime."
      />

      <section className="section">
        <div className="container">
          <div className="article-grid" style={{ gap: 28 }}>
            {articles.map((a, i) => (
              <article
                className="article-card"
                key={a.slug}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  background: "#fff",
                  border: "1px solid var(--line)",
                  borderRadius: 8,
                  padding: 28,
                  position: "relative"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <span
                    style={{
                      background: i === 0 ? "var(--red)" : "var(--white-200)",
                      color: i === 0 ? "#ffffff" : "var(--ink)",
                      fontSize: 10,
                      fontWeight: 800,
                      textTransform: "uppercase",
                      padding: "3px 8px",
                      borderRadius: 4
                    }}
                  >
                    {a.category}
                  </span>
                  <span style={{ fontSize: 11, color: "var(--muted)" }}>
                    {a.date} · {a.readTime || "4 min read"}
                  </span>
                </div>

                <h3 style={{ fontSize: 21, lineHeight: 1.3, margin: "0 0 12px" }}>
                  <Link href={`/news/${a.slug}`} style={{ color: "var(--ink)" }}>
                    {a.title}
                  </Link>
                </h3>

                <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6, flex: 1, margin: "0 0 18px" }}>
                  {a.excerpt}
                </p>

                <div style={{ paddingTop: 14, borderTop: "1px solid var(--line)" }}>
                  <Link className="text-link" href={`/news/${a.slug}`}>
                    Read full article
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <ContactBand />
    </>
  );
}
