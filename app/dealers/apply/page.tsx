import type {Metadata} from "next";
import {LeadForm,PageHero} from "@/components/site";
export const metadata:Metadata={title:"Become a Dealer",description:"Apply to join the Ultimate Tyres dealer network and request access to wholesale tyre ordering."};
export default function DealerApplyPage(){return <><PageHero eyebrow="Dealer network" title="Let’s grow together." intro="Apply to join the Ultimate Tyres network. Our team reviews each business before dealer portal access is activated."/><section className="section"><div className="container"><LeadForm kind="dealer-application"/></div></section></>;}
