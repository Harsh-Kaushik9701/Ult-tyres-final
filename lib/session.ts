import {createHmac,timingSafeEqual} from "node:crypto";
import {cookies} from "next/headers";

export type Session={id:string;email:string;role:"dealer"|"admin";dealerId?:string;exp:number};
const cookieName="ut_session";
function secret(){const value=process.env.SESSION_SECRET;if(!value||value.length<32)return "ultimate-tyres-australia-session-secret-key-32chars-fallback-2026";return value;}
function signature(value:string){return createHmac("sha256",secret()).update(value).digest("base64url");}
export function signSession(session:Session){const payload=Buffer.from(JSON.stringify(session)).toString("base64url");return payload+"."+signature(payload);}
export async function currentSession():Promise<Session|null>{
 const raw=(await cookies()).get(cookieName)?.value;if(!raw)return null;
 const [payload,provided]=raw.split(".");if(!payload||!provided)return null;
 const expected=Buffer.from(signature(payload));const actual=Buffer.from(provided);if(expected.length!==actual.length||!timingSafeEqual(expected,actual))return null;
 try{const session=JSON.parse(Buffer.from(payload,"base64url").toString()) as Session;if(session.exp<Date.now())return null;return session;}catch{return null;}
}
export const sessionCookieName=cookieName;
export const createSignature=signature;
