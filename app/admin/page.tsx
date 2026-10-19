import { redirect } from "next/navigation";
import { AdminPanel } from "@/components/admin";
import { SignOut } from "@/components/portal";
import { getVerifiedSession } from "@/lib/auth";

export const metadata = { title: "Operations Admin", robots: { index: false, follow: false } };

export default async function AdminPage() {
  if (!(await getVerifiedSession("admin"))) redirect("/dealers/login");
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div className="eyebrow">Restricted access</div>
        <SignOut />
      </div>
      <AdminPanel />
    </>
  );
}
