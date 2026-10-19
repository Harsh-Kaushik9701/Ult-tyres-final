import { redirect } from "next/navigation";
import { getVerifiedSession } from "@/lib/auth";

export const metadata = { robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getVerifiedSession("admin");
  if (!session) redirect("/dealers/login");
  return (
    <section className="section">
      <div className="container">{children}</div>
    </section>
  );
}
