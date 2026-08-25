// Compatibility bridge for @remix-run/react in Vite / Client environment
import React from 'react';
export {
  Outlet,
  NavLink,
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
  useParams,
  Navigate,
  useMatches,
} from 'react-router-dom';

export const useLoaderData = <T = any,>(): T => {
  return {
    apiKey: 'mock_makcod_api_key_2026',
    shop: 'makcod-demo.myshopify.com',
    host: 'mock_shopify_host',
  } as T;
};

export const useActionData = <T = any,>(): T | undefined => undefined;

export const useFetcher = () => ({
  Form: (props: React.FormHTMLAttributes<HTMLFormElement>) => <form {...props} />,
  submit: () => {},
  load: () => {},
  data: null,
  state: 'idle' as const,
  type: 'done' as const,
});

export const Form: React.FC<React.FormHTMLAttributes<HTMLFormElement>> = (props) => (
  <form {...props} />
);

export const Links: React.FC = () => null;
export const Meta: React.FC = () => null;
export const Scripts: React.FC = () => null;
export const LiveReload: React.FC = () => null;

export const RemixBrowser: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <>{children}</>
);

export const RemixServer: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <>{children}</>
);
