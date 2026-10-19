import type {Metadata} from "next";
import { buildMetadata } from "@/lib/seo";
import {PageHero,LeadForm} from "@/components/site";
export const metadata: Metadata = buildMetadata({
  title: "Contact Us – Commercial Tyre & Fleet Enquiries",
  description: "Contact Ultimate Tyres for commercial tyre advice, fleet services, dealer support and product enquiries. Call 1300 110 002 or message us on WhatsApp.",
  keywords: ["contact Ultimate Tyres", "truck tyre quote", "fleet tyre enquiry", "tyre shop Rocklea"],
  path: "/contact"
});export default function ContactPage(){const phone=process.env.NEXT_PUBLIC_PHONE||"1300 110 002";const whats=process.env.NEXT_PUBLIC_WHATSAPP||"61482094850";return <><PageHero eyebrow="We’re here to help" title="Let’s talk about your fleet." intro="Tell us what you’re working on and our team will help you find the right next step."/><section className="section"><div className="container content-layout"><LeadForm/><aside className="side-panel"><h3>Reach us direct.</h3><p>For a quick answer, give the team a call or send us a WhatsApp.</p><div className="footer-links"><a href={"tel:"+phone.replace(/[^\d+]/g,"")}>{phone}</a><a href="tel:+61731877527">07 3187 7527</a><a href="tel:+61481372472">+61 481 372 472</a><a href={"https://wa.me/"+whats}>WhatsApp · +61 482 094 850 ↗</a></div><div style={{marginTop:22}}><strong style={{fontSize:12}}>Rocklea · Yatala · Bald Hills</strong><p style={{marginTop:6}}>Supporting fleets across South East Queensland.</p></div><p style={{marginTop:22}}>For wholesale pricing and rapid orders, sign in to the dealer portal.</p><a className="button button-dark" href="/dealers/login">Dealer login</a></aside></div></section></>;}
