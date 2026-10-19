import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { ReactNode } from "react";
import { articles } from "@/lib/content";
import { PageHero, ContactBand } from "@/components/site";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { articleKeywords, toIsoDate } from "@/lib/page-seo";
import { absoluteUrl, siteConfig } from "@/lib/site-config";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) return { title: "Article not found", robots: { index: false, follow: false } };
  return buildMetadata({
    title: article.title,
    description: article.excerpt,
    keywords: [...(articleKeywords[article.slug] ?? []), article.category, "fleet insights"],
    path: `/news/${article.slug}`,
    type: "article",
    publishedTime: toIsoDate(article.date),
    section: article.category,
    // Branded 1200×630 image generated on the server by ./opengraph-image.tsx
    image: { url: `/news/${article.slug}/opengraph-image`, width: 1200, height: 630, alt: article.title }
  });
}

/** Renders **bold** inline markup as <strong>. All text stays React-escaped. */
function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? <strong key={i}>{part.slice(2, -2)}</strong> : part
  );
}

/**
 * Minimal, safe Markdown-ish renderer (done on the server):
 * "### " headings, numbered lists and paragraphs. No raw HTML is ever injected.
 */
function renderBody(content: string) {
  const blocks = content.trim().split(/\n{2,}/).filter(Boolean);
  return blocks.map((block, idx) => {
    if (block.startsWith("### ") || block.startsWith("## ")) {
      const [heading, ...rest] = block.split("\n");
      return (
        <div key={idx}>
          <h2>{inline(heading.replace(/^#{2,3}\s+/, ""))}</h2>
          {rest.length > 0 && <p>{inline(rest.join(" "))}</p>}
        </div>
      );
    }
    const lines = block.split("\n").filter(Boolean);
    const listStart = lines.findIndex((l) => /^\d+\.\s/.test(l));
    if (listStart !== -1) {
      const intro = lines.slice(0, listStart);
      const items = lines.slice(listStart).filter((l) => /^\d+\.\s/.test(l));
      return (
        <div key={idx}>
          {intro.length > 0 && <p>{inline(intro.join(" "))}</p>}
          <ol>
            {items.map((item, i) => (
              <li key={i}>{inline(item.replace(/^\d+\.\s+/, ""))}</li>
            ))}
          </ol>
        </div>
      );
    }
    return <p key={idx}>{inline(lines.join(" "))}</p>;
  });
}

export default async function InsightArticle({ params }: Props) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) notFound();

  const isoDate = toIsoDate(article.date);
  const url = absoluteUrl(`/news/${article.slug}`);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Insights", path: "/news" },
            { name: article.title, path: `/news/${article.slug}` }
          ]),
          {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: article.title,
            description: article.excerpt,
            articleSection: article.category,
            datePublished: isoDate,
            dateModified: isoDate,
            mainEntityOfPage: url,
            url,
            image: absoluteUrl(`/news/${article.slug}/opengraph-image`),
            author: { "@type": "Organization", name: siteConfig.legalName, url: siteConfig.url },
            publisher: {
              "@type": "Organization",
              name: siteConfig.legalName,
              logo: { "@type": "ImageObject", url: absoluteUrl(siteConfig.logo) }
            }
          }
        ]}
      />
      <PageHero
        eyebrow={`${article.category} · ${article.date} · ${article.readTime || "4 min read"}`}
        title={article.title}
        intro={article.excerpt}
        trail={[{ name: "Insights", path: "/news" }]}
        crumb={article.category}
      />

      <section className="section">
        <div className="container content-layout">
          <article className="content-main article-body" style={{ fontSize: 15, lineHeight: 1.7 }}>
            <p style={{ fontSize: 12, color: "var(--muted)", margin: "0 0 8px" }}>
              Published <time dateTime={isoDate}>{article.date}</time> by the Ultimate Tyres fleet team
            </p>
            {renderBody(article.content || "")}

            <div
              style={{
                marginTop: 40,
                padding: 24,
                background: "#f8faf9",
                borderRadius: 8,
                border: "1px solid var(--line)"
              }}
            >
              <h2 style={{ margin: "0 0 8px", fontSize: 17 }}>Have questions about your fleet&apos;s tyre performance?</h2>
              <p style={{ margin: "0 0 16px", fontSize: 13, color: "var(--muted)" }}>
                Our commercial specialists can review your routes, axle weights, and current tread wear patterns to
                provide tailored Cost-Per-Kilometer recommendations.
              </p>
              <Link className="button button-dark" href="/contact">
                Connect with a Commercial Tyre Engineer ↗
              </Link>
            </div>
          </article>

          <aside className="side-panel">
            <h3>Recent Insights</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {articles
                .filter((a) => a.slug !== slug)
                .slice(0, 4)
                .map((a) => (
                  <div key={a.slug} style={{ borderBottom: "1px solid var(--line)", paddingBottom: 12 }}>
                    <span style={{ fontSize: 10, color: "var(--yellow-deep)", fontWeight: 800, textTransform: "uppercase" }}>
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
