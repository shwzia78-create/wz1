// Shopify Remix File-Based Route Tree - /app/router.jsx
import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import RootDocument from './root';
import AppLayout from './routes/app';
import DashboardRoute from './routes/app._index';
import FormBuilderRoute from './routes/app.form-builder';
import UpsellsRoute from './routes/app.upsells';
import WhatsAppRoute from './routes/app.whatsapp';
import RiskBlacklistRoute from './routes/app.risk-blacklist';
import TeamRoute from './routes/app.team';
import LocationRulesRoute from './routes/app.location-rules';
import DeliverySuccessRoute from './routes/app.delivery-success';
import AnalyticsRoute from './routes/app.analytics';
import SettingsRoute from './routes/app.settings';
import BillingRoute from './routes/app.billing';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootDocument />,
    children: [
      {
        index: true,
        element: <Navigate to="/app" replace />,
      },
      {
        path: 'app',
        element: <AppLayout />,
        children: [
          {
            index: true,
            element: <DashboardRoute />,
          },
          {
            path: 'form-builder',
            element: <FormBuilderRoute />,
          },
          {
            path: 'upsells',
            element: <UpsellsRoute />,
          },
          {
            path: 'whatsapp',
            element: <WhatsAppRoute />,
          },
          {
            path: 'risk-blacklist',
            element: <RiskBlacklistRoute />,
          },
          {
            path: 'team',
            element: <TeamRoute />,
          },
          {
            path: 'location-rules',
            element: <LocationRulesRoute />,
          },
          {
            path: 'delivery-success',
            element: <DeliverySuccessRoute />,
          },
          {
            path: 'analytics',
            element: <AnalyticsRoute />,
          },
          {
            path: 'settings',
            element: <SettingsRoute />,
          },
          {
            path: 'billing',
            element: <BillingRoute />,
          },
          {
            path: '*',
            element: <Navigate to="/app" replace />,
          },
        ],
      },
      {
        path: '*',
        element: <Navigate to="/app" replace />,
      },
    ],
  },
]);

export function RemixApp() {
  return <RouterProvider router={router} />;
}

export default RemixApp;
