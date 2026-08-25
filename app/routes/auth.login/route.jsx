import { useState } from "react";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop") || "60n3yp-iw.myshopify.com";
  return json({ shop, errors: {} });
};

export const action = async ({ request }) => {
  const formData = await request.formData();
  let shop = formData.get("shop")?.toString().trim();

  if (!shop) {
    return json({ errors: { shop: "Please enter your Shopify store domain" } });
  }

  // Clean domain
  shop = shop.replace(/^https?:\/\//, "").replace(/\/$/, "");
  if (!shop.includes(".myshopify.com")) {
    shop = `${shop}.myshopify.com`;
  }

  // Direct redirect to Shopify Admin App installation or Dashboard
  return redirect(`/app?shop=${encodeURIComponent(shop)}`);
};

export default function AuthLogin() {
  const loaderData = useLoaderData();
  const actionData = useActionData();
  const [shop, setShop] = useState(loaderData?.shop || "60n3yp-iw.myshopify.com");
  const errors = actionData?.errors || loaderData?.errors || {};

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: "440px", width: "100%", backgroundColor: "#ffffff", borderRadius: "16px", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)", border: "1px solid #e2e8f0", padding: "32px" }}>
        
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "10px", backgroundColor: "#059669", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "20px" }}>
            C
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: "22px", fontWeight: "800", color: "#0f172a", letterSpacing: "-0.5px" }}>Codify</h1>
            <p style={{ margin: 0, fontSize: "11px", color: "#64748b", fontWeight: "600", textTransform: "uppercase" }}>Shopify 1-Click COD & Fraud Shield</p>
          </div>
        </div>

        <h2 style={{ fontSize: "17px", fontWeight: "700", color: "#1e293b", margin: "0 0 6px 0" }}>Connect Store & Activate</h2>
        <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 20px 0", lineHeight: "1.4" }}>
          Enter your Shopify myshopify.com domain to link Codify Cash on Delivery checkout and launch your admin dashboard.
        </p>

        <Form method="post">
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>
              Shopify Store URL / Domain
            </label>
            <input
              type="text"
              name="shop"
              value={shop}
              onChange={(e) => setShop(e.target.value)}
              placeholder="e.g. 60n3yp-iw.myshopify.com"
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: "10px",
                border: "1.5px solid #cbd5e1",
                fontSize: "14px",
                color: "#0f172a",
                backgroundColor: "#fff",
                outline: "none",
                boxSizing: "border-box"
              }}
              required
            />
            {errors?.shop && (
              <p style={{ margin: "6px 0 0 0", fontSize: "12px", color: "#e11d48", fontWeight: "500" }}>{errors.shop}</p>
            )}
            <p style={{ margin: "6px 0 0 0", fontSize: "11px", color: "#94a3b8" }}>
              Example: <strong>60n3yp-iw.myshopify.com</strong>
            </p>
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px 16px",
              backgroundColor: "#059669",
              color: "#ffffff",
              fontWeight: "700",
              fontSize: "14px",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              boxShadow: "0 4px 6px -1px rgba(5, 150, 105, 0.3)",
              transition: "background-color 0.2s"
            }}
          >
            Connect Store & Open Dashboard &rarr;
          </button>
        </Form>

        <div style={{ marginTop: "24px", paddingTop: "16px", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <a href="/app" style={{ fontSize: "12px", color: "#059669", textDecoration: "none", fontWeight: "600" }}>
            &larr; Direct Dashboard View
          </a>
          <span style={{ fontSize: "11px", color: "#94a3b8" }}>v1.4.0 Live</span>
        </div>

      </div>
    </div>
  );
}
