import type {Metadata} from "next";
import {LeadForm,PageHero} from "@/components/site";
export const metadata:Metadata={title:"Careers",description:"Explore career opportunities with Ultimate Tyres and join the team that keeps fleets moving."};
export default function CareersPage(){return <><PageHero eyebrow="Join our team" title="Bring your drive." intro="We’re interested in people who care about good work, good service and helping Australian fleets keep moving."/><section className="section"><div className="container"><LeadForm kind="careers"/></div></section></>;}
