import type {Metadata} from "next";
import Link from "next/link";
import {services} from "@/lib/content";
import {PageHero,ContactBand} from "@/components/site";
export const metadata:Metadata={title:"Fleet Services",description:"Explore commercial tyre fitting, truck maintenance, alignment and fleet support services."};
export default function ServicesPage(){return <><PageHero eyebrow="Fleet services" title="Keep your fleet working." intro="Practical tyre and vehicle services to help reduce avoidable downtime and keep every kilometre productive."/><section className="section"><div className="container"><div className="article-grid">{services.map((s,i)=><article className="article-card" key={s.slug}><div className="article-meta">Fleet service · 0{i+1}</div><h3>{s.title}</h3><p>{s.short}</p><Link className="text-link" href={"/services/"+s.slug}>Explore service</Link></article>)}</div></div></section><ContactBand/></>;}
