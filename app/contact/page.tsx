import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { PageHero, LeadForm, SocialLinks } from "@/components/site";
import { BranchesSection } from "@/components/branches";
import { CAREERS_TOPIC } from "@/lib/forms";
import { MailIcon, PhoneIcon, WhatsAppIcon } from "@/components/icons";
import { siteConfig, telHref, whatsappHref } from "@/lib/site-config";

export const metadata: Metadata = buildMetadata({
  title: "Contact Us & Careers – Commercial Tyre & Fleet Enquiries",
  description:
    "Contact Ultimate Tyres for commercial tyre advice, fleet services and dealer support, or ask about joining our team. Call 1300 110 002 or message us on WhatsApp.",
  keywords: [
    "contact Ultimate Tyres",
    "truck tyre quote",
    "fleet tyre enquiry",
    "tyre shop Rocklea",
    "tyre fitter jobs",
    "Ultimate Tyres careers"
  ],
  path: "/contact"
});

type Props = { searchParams: Promise<{ topic?: string }> };

export default async function ContactPage({ searchParams }: Props) {
  const { topic } = await searchParams;
  const initialTopic = topic === "careers" ? CAREERS_TOPIC : undefined;

  return (
    <>
      <PageHero
        backdrop="truck"
        eyebrow="We’re here to help"
        title="Let’s talk about your fleet."
        intro="Tell us what you’re working on – or about the role you’re after – and our team will help you find the right next step."
        crumb="Contact"
      />

      <section className="section" id="enquiry">
        <div className="container content-layout">
          <LeadForm initialTopic={initialTopic} />
          <aside className="side-panel">
            <h3>Reach us direct.</h3>
            <p>For a quick answer, give the team a call or send us a WhatsApp.</p>
            <div className="footer-links contact-direct">
              <a href={telHref()} className="footer-icon-link">
                <PhoneIcon /> {siteConfig.phone}
              </a>
              <a href="tel:+61731877527" className="footer-icon-link">
                <PhoneIcon /> 07 3187 7527
              </a>
              <a href="tel:+61481372472" className="footer-icon-link">
                <PhoneIcon /> +61 481 372 472
              </a>
              <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="footer-icon-link">
                <WhatsAppIcon /> WhatsApp · +61 482 094 850
              </a>
              <a href="mailto:sales@ultimatetyres.com.au" className="footer-icon-link">
                <MailIcon /> sales@ultimatetyres.com.au
              </a>
            </div>
            <SocialLinks className="social-links contact-socials" />
            <p style={{ marginTop: 22 }}>
              Rocklea · Yatala · Bald Hills. <a href="#branches-heading">Find a branch ↓</a>
            </p>
          </aside>
        </div>
      </section>

      <section className="section work-with-us" aria-labelledby="work-with-us">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">Work with us</div>
              <h2 id="work-with-us">Join the Ultimate Tyres network.</h2>
            </div>
            <p>Grow your tyre business as a dealer, or bring your skills to our team.</p>
          </div>
          <div className="work-cards">
            <article className="work-card">
              <h3>Become a dealer</h3>
              <p>Wholesale pricing, live stock and rapid online ordering for tyre retailers and fleet workshops.</p>
              <Link className="button" href="/dealers/apply">
                Apply for a trade account ↗
              </Link>
            </article>
            <article className="work-card">
              <h3>Join our team</h3>
              <p>Tyre fitters, technicians, drivers, sales and warehouse roles across our three branches.</p>
              <Link className="button button-dark" href="/contact?topic=careers#enquiry">
                Send an expression of interest ↗
              </Link>
            </article>
          </div>
        </div>
      </section>

      <BranchesSection />
    </>
  );
}
