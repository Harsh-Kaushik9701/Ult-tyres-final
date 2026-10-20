import type {Metadata} from "next";
import { buildMetadata } from "@/lib/seo";
import {LeadForm,PageHero} from "@/components/site";
export const metadata: Metadata = buildMetadata({
  title: "Become a Dealer – Wholesale Tyre Dealer Program",
  description: "Apply to join the Ultimate Tyres dealer network and request access to wholesale commercial tyre pricing, live stock and rapid online ordering.",
  keywords: ["become a tyre dealer", "wholesale truck tyres", "tyre dealer program Australia", "trade tyre account"],
  path: "/dealers/apply"
});export default function DealerApplyPage(){return <><PageHero backdrop="dealer" eyebrow="Dealer network" title="Let’s grow together." intro="Apply to join the Ultimate Tyres network. Our team reviews each business before dealer portal access is activated."/><section className="section"><div className="container"><LeadForm kind="dealer-application"/></div></section></>;}
