import type {Metadata} from "next";
import { buildMetadata } from "@/lib/seo";
import {LeadForm,PageHero} from "@/components/site";
export const metadata: Metadata = buildMetadata({
  title: "Careers – Join the Ultimate Tyres Team",
  description: "Explore career opportunities with Ultimate Tyres and join the team that keeps Australian fleets moving: tyre fitters, technicians, sales and warehouse roles.",
  keywords: ["tyre fitter jobs", "Ultimate Tyres careers", "truck tyre technician jobs", "Brisbane tyre jobs"],
  path: "/careers"
});export default function CareersPage(){return <><PageHero eyebrow="Join our team" title="Bring your drive." intro="We’re interested in people who care about good work, good service and helping Australian fleets keep moving."/><section className="section"><div className="container"><LeadForm kind="careers"/></div></section></>;}
