import { Form, useLoaderData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import styles from "./styles.module.css";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  if (url.searchParams.get("shop")) {
    return redirect(`/app?${url.searchParams.toString()}`);
  }
  return json({ 
    showForm: Boolean(url.searchParams.get("login")),
    defaultShop: url.searchParams.get("shop") || "" 
  });
};

export default function App() {
  const data = useLoaderData() || {};
  const showForm = data.showForm || false;

  return (
    <div className={styles.index}>
      <div className={styles.content}>
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-base shadow-sm">C</span>
          <span className="text-xl font-bold tracking-tight text-slate-900">Codify</span>
        </div>
        <h1 className={styles.heading}>1-Click COD Form Builder & Fraud Prevention</h1>
        <p className={styles.text}>
          High-converting Cash On Delivery checkout popup, OTP SMS/WhatsApp verification, and automatic RTO order protection for Shopify merchants.
        </p>
        
        <div className="flex flex-wrap items-center justify-center gap-3 my-6">
          <a
            href="/app"
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition-colors"
          >
            Open Codify App Dashboard &rarr;
          </a>
          <a
            href="/_index?login=true"
            className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-colors"
          >
            Log in with Shopify Store
          </a>
        </div>

        {showForm && (
          <Form className={styles.form} method="post" action="/auth/login">
            <label className={styles.label}>
              <span className="font-semibold text-slate-700">Enter your Shopify store domain:</span>
              <input className={styles.input} type="text" name="shop" placeholder="my-store.myshopify.com" required />
              <span className="text-xs text-slate-400">e.g. your-store-name.myshopify.com</span>
            </label>
            <button className={styles.button} type="submit">
              Connect & Install App
            </button>
          </Form>
        )}

        <ul className={styles.list}>
          <li>
            <strong>1-Click COD Embed</strong>: Custom dynamic checkout form embedded seamlessly on your product & cart pages.
          </li>
          <li>
            <strong>WhatsApp OTP Verification</strong>: Prevent fake orders & reduce returns (RTO) by up to 40%.
          </li>
          <li>
            <strong>Smart Risk Rules</strong>: Block high-risk IP addresses, phone numbers, and customize COD rules by city.
          </li>
        </ul>
      </div>
    </div>
  );
}
