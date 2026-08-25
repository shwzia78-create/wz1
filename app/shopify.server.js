// Shopify Remix Server Utility - /app/shopify.server.js
import { INITIAL_ORDERS, INITIAL_STAFF, INITIAL_SETTINGS } from './mockData/initialData.js';

export const LATEST_API_VERSION = '2025-01';

/**
 * Mock Shopify Admin Authenticator for Shopify Remix App
 */
export const authenticate = {
  admin: async (request) => {
    const url = new URL(request.url);
    const shop = url.searchParams.get('shop') || 'codify-demo.myshopify.com';
    let host = url.searchParams.get('host');
    if (!host) {
      try {
        host = typeof Buffer !== 'undefined' ? Buffer.from(`${shop}/admin`).toString('base64') : btoa(`${shop}/admin`);
      } catch (e) {
        host = 'mock_shopify_host';
      }
    }

    return {
      session: {
        shop,
        accessToken: 'shpat_mock_codify_token_' + Date.now(),
        isOnline: true,
      },
      admin: {
        graphql: async (query, { variables } = {}) => {
          // Simulated Shopify GraphQL Admin API
          if (query.includes('orders')) {
            return {
              json: async () => ({
                data: {
                  orders: {
                    edges: INITIAL_ORDERS.map(order => ({
                      node: {
                        id: `gid://shopify/Order/${order.shopifyOrderId.replace('#', '')}`,
                        name: order.shopifyOrderId,
                        createdAt: order.createdAt,
                        totalPriceSet: {
                          shopMoney: {
                            amount: String(order.total),
                            currencyCode: 'PKR',
                          },
                        },
                        tags: order.tags,
                      },
                    })),
                  },
                },
              }),
            };
          }
          return {
            json: async () => ({
              data: {
                shop: {
                  name: INITIAL_SETTINGS.storeName,
                  myshopifyDomain: shop,
                },
              },
            }),
          };
        },
        rest: {
          get: async ({ path }) => ({ body: { status: 'ok', path } }),
          post: async ({ path, data }) => ({ body: { status: 'created', data } }),
        },
      },
      billing: {
        require: async () => true,
        check: async () => ({ hasActivePayment: true }),
      },
    };
  },
  public: {
    checkout: async (request) => {
      return { session: { id: 'public-checkout-session' } };
    },
  },
};

export const apiVersion = LATEST_API_VERSION;
export const addDocumentResponseHeaders = (request, headers) => {
  headers.set('X-Shopify-Api-Version', LATEST_API_VERSION);
  return headers;
};

export const login = async (request) => {
  const url = new URL(request.url);
  const shop = url.searchParams.get('shop') || 'codify-demo.myshopify.com';
  return { shop };
};

export const unauthenticated = {
  admin: async () => ({ session: { shop: 'codify-demo.myshopify.com' } }),
  storefront: async () => ({ session: { shop: 'codify-demo.myshopify.com' } }),
};

