// Shopify Remix Root Document - /app/root.jsx
import React from 'react';
import { 
  Links, 
  Meta, 
  Outlet, 
  Scripts, 
  ScrollRestoration,
  useLocation,
  useRouteError,
  useLoaderData,
  isRouteErrorResponse
} from '@remix-run/react';
import { json } from '@remix-run/node';
import { AppProvider } from './context/AppContext';
import { ToastContainer } from './components/ToastContainer';
import { ShippingLabelModal } from './components/ShippingLabelModal';
import { ExitIntentModal } from './components/ExitIntentModal';
import { LiveFormPreviewModal } from './components/LiveFormPreviewModal';

export const links = () => [
  { rel: 'preconnect', href: 'https://cdn.shopify.com' },
  { rel: 'stylesheet', href: 'https://unpkg.com/@shopify/polaris@12.0.0/build/esm/styles.css' },
];

export const meta = () => [
  { charset: 'utf-8' },
  { name: 'viewport', content: 'width=device-width,initial-scale=1' },
  { title: 'Codify | Shopify Cash on Delivery (COD) Automation & RTO Shield' },
];

export const loader = async ({ request }) => {
  return json({
    apiKey: process.env.SHOPIFY_API_KEY || 'mock_codify_api_key_2026',
    shop: 'codify-demo.myshopify.com',
  });
};

export default function App() {
  const data = useLoaderData();

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
        {data?.apiKey ? (
          <meta name="shopify-api-key" content={data.apiKey} />
        ) : null}
        <script src="https://cdn.shopify.com/shopifycloud/app-bridge.js"></script>
        {/* Tailwind CSS & Theme Engine */}
        <script src="https://cdn.tailwindcss.com"></script>
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --polaris-bg: #f6f6f7;
            --polaris-surface: #ffffff;
            --polaris-border: #e1e3e5;
            --polaris-text: #202223;
            --polaris-brand: #008060;
          }
          body {
            background-color: #F6F6F7;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
            margin: 0;
            padding: 0;
          }
          @media print {
            body * { visibility: hidden; }
            #printable-shipping-label, #printable-shipping-label * { visibility: visible; }
            #printable-shipping-label { position: absolute; left: 0; top: 0; width: 100%; }
            .no-print { display: none !important; }
          }
        `}} />
      </head>
      <body className="h-full w-full bg-[#F6F6F7] m-0 p-0 font-sans text-[#202223] antialiased selection:bg-[#10B981] selection:text-white flex flex-col">
        <AppProvider>
          {/* Main App Layout Route Outlet */}
          <Outlet />

          {/* Global Modals in App Tree */}
          <ShippingLabelModal />
          <ExitIntentModal />
          <LiveFormPreviewModal />

          {/* Shopify Admin Toast Container */}
          <ToastContainer />
        </AppProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  console.error("Shopify Remix App ErrorBoundary:", error);

  let errorMessage = "An unexpected error occurred in the Shopify Remix runtime.";
  let errorDetails = "";

  if (isRouteErrorResponse(error)) {
    errorMessage = `${error.status} ${error.statusText}`;
    errorDetails = error.data || "Shopify App Route Not Found";
  } else if (error instanceof Error) {
    errorMessage = error.message;
    errorDetails = error.stack || "";
  }

  return (
    <html lang="en">
      <head>
        <title>Codify App Error</title>
        <Meta />
        <Links />
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="bg-slate-50 min-h-screen flex items-center justify-center p-4 font-sans text-slate-800">
        <div className="max-w-xl w-full bg-white rounded-2xl border border-rose-200 shadow-xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3 text-rose-600">
            <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center font-bold text-xl">
              !
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">Codify App Runtime Error</h1>
              <p className="text-xs text-rose-600 font-medium">{errorMessage}</p>
            </div>
          </div>

          {errorDetails && (
            <div className="bg-slate-900 text-slate-200 p-4 rounded-xl text-xs font-mono overflow-auto max-h-60 border border-slate-800">
              {errorDetails}
            </div>
          )}

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              Reload Application
            </button>
          </div>
        </div>
        <Scripts />
      </body>
    </html>
  );
}