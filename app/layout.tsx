import type { Metadata } from "next";
import "./globals.css";
import { Header, Footer, WhatsApp } from "@/components/site";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://ultimatetyres.com.au"),
  title: { default:"Ultimate Tyres | Your fleet. Our drive.", template:"%s | Ultimate Tyres Australia" },
  description:"Commercial tyres, fleet services and dealer support for Australian businesses. Keep your fleet moving with Ultimate Tyres.",
  keywords:["commercial tyres Australia","truck tyres","fleet services","Ralson tyres","Blacklion tyres","Triangle tyres","tyre dealer"],
  openGraph:{type:"website",siteName:"Ultimate Tyres",title:"Ultimate Tyres | Your fleet. Our drive.",description:"Commercial tyres and practical fleet support for Australian businesses.",images:[{url:"/images/og-ultimate-tyres.webp",width:1200,height:630,alt:"Ultimate Tyres commercial tyres and fleet support"}]},
  twitter:{card:"summary_large_image"}
};

export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="en-AU"><body><Header/><main>{children}</main><Footer/><WhatsApp/></body></html>;
}
