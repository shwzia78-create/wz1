import { redirect } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop") || "60n3yp-iw.myshopify.com";

  try {
    return await authenticate.admin(request);
  } catch (error) {
    // If not authenticated, initiate Shopify OAuth
    return redirect(`/auth/login?shop=${encodeURIComponent(shop)}`);
  }
};
