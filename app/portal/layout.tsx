import Link from "next/link";
import { redirect } from "next/navigation";
import { getVerifiedSession } from "@/lib/auth";
import { PortalNav, SignOut } from "@/components/portal";
import { getDb, isMongoConfigured } from "@/lib/db";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const session = await getVerifiedSession("dealer");
  if (!session) redirect("/dealers/login");

  let company = "Dealer Account";
  try {
    if (isMongoConfigured()) {
      const db = await getDb();
      const d = ObjectId.isValid(session.dealerId!)
        ? await db.collection("dealers").findOne({ _id: new ObjectId(session.dealerId) })
        : null;
      if (d?.business_name || d?.businessName) {
        company = d.business_name || d.businessName;
      }
    }
  } catch {}

  return (
    <>
      <section className="page-hero">
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20 }}>
          <div>
            <div className="eyebrow">Wholesale · Ultimate Tyres</div>
            <h1 style={{ fontSize: 46, margin: "14px 0 6px" }}>{company}</h1>
            <p style={{ margin: 0 }}>Catalogue, wholesale ordering and account support.</p>
          </div>
          <SignOut />
        </div>
      </section>
      <section className="section">
        <div className="container portal-layout">
          <PortalNav />
          <div>{children}</div>
        </div>
      </section>
    </>
  );
}

