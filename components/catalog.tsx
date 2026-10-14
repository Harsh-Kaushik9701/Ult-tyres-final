"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo,useState } from "react";

export type TyreProduct={id:number;brand:string;application:string;pattern:string;size:string;plyRating:string;loadSpeed:string;treadDepthMm:string;image:string};

export function ProductCatalog({products}:{products:TyreProduct[]}) {
  const [query,setQuery]=useState(""); const [application,setApplication]=useState("all"); const [pattern,setPattern]=useState("all");
  const filtered=useMemo(()=>products.filter(p=>(!query||`${p.pattern} ${p.size} ${p.application}`.toLowerCase().includes(query.toLowerCase()))&&(application==="all"||p.application===application)&&(pattern==="all"||p.pattern===pattern)),[products,query,application,pattern]);
  return <>
    <div className="catalog-tools"><input className="field" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search pattern, size or application" aria-label="Search tyre catalogue"/><select className="select" value={application} onChange={e=>setApplication(e.target.value)} aria-label="Filter by application"><option value="all">All applications</option>{Array.from(new Set(products.map(p=>p.application))).sort().map(x=><option key={x}>{x}</option>)}</select><select className="select" value={pattern} onChange={e=>setPattern(e.target.value)} aria-label="Filter by pattern"><option value="all">All patterns</option>{Array.from(new Set(products.map(p=>p.pattern))).sort().map(x=><option key={x}>{x}</option>)}</select></div>
    <p style={{fontSize:11,color:"var(--muted)",marginBottom:14}}>{filtered.length} tyre specifications</p>
    <div className="product-grid">{filtered.slice(0,48).map(p=><article className="product-card" key={p.id}><div className="product-visual"><Image src={p.image} alt={`${p.brand} ${p.pattern} tyre`} width={480} height={480} onError={e=>{e.currentTarget.style.visibility="hidden";}}/></div><h3><Link href={"/products/"+p.id}>{p.pattern}</Link></h3><p>{p.brand} · {p.application}</p><div className="product-specs"><span>Size <strong>{p.size}</strong></span><span>Load / speed <strong>{p.loadSpeed||"See spec"}</strong></span><span>Ply / LR <strong>{p.plyRating||"See spec"}</strong></span><span>Tread <strong>{p.treadDepthMm||"–"} mm</strong></span></div><Link className="button button-dark" href={"/products/"+p.id}>View tyre details ↗</Link></article>)}{filtered.length===0&&<div className="empty-state">No tyres match those filters. Try a different size or application.</div>}</div>
    {filtered.length>48&&<p style={{marginTop:20,color:"var(--muted)",fontSize:11}}>Showing 48 of {filtered.length}. Use search or filters to narrow the range.</p>}
  </>;
}

export function LoginForm() {
  const [email, setEmail] = useState("dealer@ultimatetyres.com.au");
  const [password, setPassword] = useState("dealer123");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      location.href = data.role === "admin" ? "/admin" : "/portal";
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Unable to sign in.");
      setBusy(false);
    }
  }

  function useDemo() {
    setEmail("dealer@ultimatetyres.com.au");
    setPassword("dealer123");
    setMessage("Demo credentials populated. Click 'Sign in to Portal' below.");
  }

  return (
    <form className="form-card" onSubmit={submit}>
      <div className="eyebrow">Authorised Dealer Login</div>
      <h2>Good to have you back.</h2>
      <p style={{ fontSize: 13, color: "var(--muted)" }}>
        Controlled Login ID & Password issued by Ultimate Tyres. Sign in to access live wholesale pricing, rapid-order forms, and order fulfillment.
      </p>

      {/* Demo helper pill */}
      <div
        style={{
          background: "#f0fdf4",
          border: "1px solid #86efac",
          padding: "12px 14px",
          borderRadius: 6,
          marginBottom: 18,
          fontSize: 12
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <strong style={{ color: "#166534" }}>Test / Demo Access:</strong>
          <button
            type="button"
            onClick={useDemo}
            style={{
              background: "#166534",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              padding: "4px 8px",
              fontSize: 11,
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            Auto-Fill Demo
          </button>
        </div>
        <div style={{ color: "#15803d", marginTop: 4 }}>
          ID: <code>dealer@ultimatetyres.com.au</code> · Pass: <code>dealer123</code>
        </div>
      </div>

      <div className="form-grid">
        <div className="form-field full">
          <label htmlFor="email">Authorised Email ID *</label>
          <input
            className="field"
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            required
          />
        </div>
        <div className="form-field full">
          <label htmlFor="password">Password *</label>
          <input
            className="field"
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>
      </div>
      <div className="form-actions" style={{ marginTop: 18 }}>
        <button className="button" style={{ width: "100%", justifyContent: "center" }} disabled={busy}>
          {busy ? "Authenticating…" : "Sign in to Dealer Portal"} ↗
        </button>
        {message && <span className="form-note" role="status" style={{ display: "block", marginTop: 8 }}>{message}</span>}
      </div>
      <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--line)", fontSize: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span>Not yet an approved dealer?</span>
        <Link href="/dealers/apply" style={{ color: "var(--red)", fontWeight: 700 }}>
          Register for new account ↗
        </Link>
      </div>
    </form>
  );
}

export function OrderForm({products}:{products:TyreProduct[]}) {
 const [message,setMessage]=useState("");const [busy,setBusy]=useState(false);
 async function submit(e:React.FormEvent<HTMLFormElement>){e.preventDefault();setBusy(true);setMessage("");const form=e.currentTarget;const items=Array.from(form.querySelectorAll<HTMLInputElement>("[data-product]")).map(el=>({productId:Number(el.dataset.product),quantity:Number(el.value)})).filter(x=>x.quantity>0);try{const res=await fetch("/api/orders",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({items})});const data=await res.json();if(!res.ok)throw new Error(data.error);setMessage(data.message);form.reset();}catch(err){setMessage(err instanceof Error?err.message:"Unable to submit order.");}setBusy(false);}
 return <form onSubmit={submit}><div className="table-wrap"><table><thead><tr><th>Pattern</th><th>Tyre size</th><th>Application</th><th>Qty</th></tr></thead><tbody>{products.slice(0,30).map(p=><tr key={p.id}><td><strong>{p.pattern}</strong></td><td>{p.size}</td><td>{p.application}</td><td><input data-product={p.id} type="number" min="0" defaultValue="0" aria-label={`Quantity ${p.pattern} ${p.size}`} style={{width:62,padding:5}}/></td></tr>)}</tbody></table></div><div className="form-actions"><button className="button" disabled={busy}>{busy?"Submitting…":"Submit order request"} ↗</button><span className="form-note" role="status">{message}</span></div></form>;
}
