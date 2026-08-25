import { useState } from "react";
import { Form, useLoaderData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import styles from "./styles.module.css";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  if (url.searchParams.get("shop")) {
    return redirect(`/app?${url.searchParams.toString()}`);
  }
  return json({ 
    showForm: true,
    defaultShop: "60n3yp-iw.myshopify.com" 
  });
};

export default function App() {
  const data = useLoaderData() || {};
  const [shop, setShop] = useState(data.defaultShop || "60n3yp-iw.myshopify.com");

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
        
        {/* Direct Connect Box on Landing Page */}
        <div className="my-6 p-6 bg-slate-50 border border-slate-200 rounded-2xl max-w-md mx-auto text-left shadow-sm">
          <Form method="post" action="/auth/login" className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Enter your Shopify Store Domain:
              </label>
              <input
                type="text"
                name="shop"
                value={shop}
                onChange={(e) => setShop(e.target.value)}
                placeholder="60n3yp-iw.myshopify.com"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                required
              />
              <p className="text-xs text-slate-400 mt-1">e.g. 60n3yp-iw.myshopify.com</p>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow transition-colors"
              >
                Connect & Install &rarr;
              </button>
              <a
                href="/app"
                className="px-4 py-2.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-semibold text-sm rounded-xl transition-colors flex items-center justify-center"
              >
                Open Dashboard
              </a>
            </div>
          </Form>
        </div>

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
