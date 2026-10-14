import {redirect} from "next/navigation";
import {currentSession} from "@/lib/session";
export const dynamic="force-dynamic";
export const metadata={robots:{index:false,follow:false}};
export default async function AdminLayout({children}:{children:React.ReactNode}){const session=await currentSession();if(!session||session.role!=="admin")redirect("/dealers/login");return <section className="section"><div className="container">{children}</div></section>;}
