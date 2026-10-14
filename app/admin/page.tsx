import {AdminPanel} from "@/components/admin";
import {SignOut} from "@/components/portal";
export const metadata={title:"Operations Admin"};
export default function AdminPage(){return <><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}><div className="eyebrow">Restricted access</div><SignOut/></div><AdminPanel/></>;}
