import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { articles } from "@/lib/content";
import { PageHero, ContactBand } from "@/components/site";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const a = articles.find((x) => x.slug === slug);
  return {
    title: a?.title || "Fleet Insights",
    description: a?.excerpt
  };
}

export default async function NewsArticle({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) return notFound();

  // Split markdown headings/paragraphs cleanly
  const paragraphs = (article.content || "")
    .trim()
    .split("\n\n")
    .filter(Boolean);

  return (
    <>
      <PageHero
        eyebrow={`${article.category} · ${article.date} · ${article.readTime || "4 min read"}`}
        title={article.title}
        intro={article.excerpt}
        crumb="News & blogs"
      />

      <section className="section">
        <div className="container content-layout">
          <article className="content-main" style={{ fontSize: 15, lineHeight: 1.7 }}>
            {paragraphs.map((p, idx) => {
              if (p.startsWith("### ")) {
                return (
                  <h3 key={idx} style={{ fontSize: 24, margin: "28px 0 12px", color: "var(--ink)" }}>
                    {p.replace("### ", "")}
                  </h3>
                );
              }
              if (p.startsWith("## ")) {
                return (
                  <h2 key={idx} style={{ fontSize: 28, margin: "32px 0 16px", color: "var(--ink)" }}>
                    {p.replace("## ", "")}
                  </h2>
                );
              }
              if (p.includes("\n1. ") || p.includes("\n2. ")) {
                const items = p.split("\n").filter(Boolean);
                return (
                  <div key={idx} style={{ margin: "16px 0" }}>
                    {items.map((it, i) => (
                      <p key={i} style={{ margin: "8px 0" }}>
                        {it}
                      </p>
                    ))}
                  </div>
                );
              }
              return (
                <p key={idx} style={{ margin: "16px 0", color: "#374151" }}>
                  {p}
                </p>
              );
            })}

            <div
              style={{
                marginTop: 40,
                padding: 24,
                background: "#f8faf9",
                borderRadius: 8,
                border: "1px solid var(--line)"
              }}
            >
              <h4 style={{ margin: "0 0 8px", fontSize: 17 }}>Have questions about your fleet's tyre performance?</h4>
              <p style={{ margin: "0 0 16px", fontSize: 13, color: "var(--muted)" }}>
                Our commercial specialists can review your routes, axle weights, and current tread wear patterns to provide tailored Cost-Per-Kilometer recommendations.
              </p>
              <Link className="button button-dark" href="/contact">
                Connect with a Commercial Tyre Engineer ↗
              </Link>
            </div>
          </article>

          <aside className="side-panel">
            <h3>Recent Articles</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {articles
                .filter((a) => a.slug !== slug)
                .slice(0, 4)
                .map((a) => (
                  <div key={a.slug} style={{ borderBottom: "1px solid var(--line)", paddingBottom: 12 }}>
                    <span style={{ fontSize: 10, color: "var(--red)", fontWeight: 800, textTransform: "uppercase" }}>
                      {a.category}
                    </span>
                    <h4 style={{ fontSize: 14, margin: "4px 0" }}>
                      <Link href={`/news/${a.slug}`} style={{ color: "var(--ink)" }}>
                        {a.title}
                      </Link>
                    </h4>
                    <span style={{ fontSize: 11, color: "var(--muted)" }}>{a.readTime}</span>
                  </div>
                ))}
            </div>

            <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid var(--line)" }}>
              <Link className="button" href="/dealers/apply" style={{ width: "100%", justifyContent: "center" }}>
                Become an Authorized Dealer ↗
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <ContactBand />
    </>
  );
}
