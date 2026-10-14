import type {MetadataRoute} from "next";
import {services,brands,articles} from "@/lib/content";
import products from "@/public/data/ralson-products.json";
export default function sitemap():MetadataRoute.Sitemap{const root="https://ultimatetyres.com.au";const paths=["","/about","/products","/products/trucks","/products/buses","/services","/news","/network","/contact","/careers","/dealers/apply"].map(path=>({url:root+path,lastModified:new Date()}));return [...paths,...services.map(s=>({url:root+"/services/"+s.slug,lastModified:new Date()})),...brands.map(b=>({url:root+"/brands/"+b.slug,lastModified:new Date()})),...articles.map(a=>({url:root+"/news/"+a.slug,lastModified:new Date()})),...products.map(p=>({url:root+"/products/"+p.id,lastModified:new Date()}))];}
