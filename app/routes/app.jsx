// Shopify Remix Embedded App Layout - /app/routes/app.jsx
import React, { useState, useMemo, useCallback } from 'react';
import { json } from '@remix-run/node';
import { Outlet, NavLink, useLocation, useNavigate } from '@remix-run/react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  Sliders, 
  ShoppingBag,
  MessageSquare, 
  ShieldAlert, 
  Users, 
  MapPin, 
  CheckCircle2,
  TrendingUp, 
  Settings as SettingsIcon,
  CreditCard,
  Power,
  Globe,
  Maximize2,
  Sparkles,
  Menu,
  X
} from 'lucide-react';
import { authenticate } from '../shopify.server';

export const loader = async ({ request }) => {
  try {
    if (authenticate?.admin) {
      await authenticate.admin(request);
    }
  } catch (err) {
    if (err instanceof Response) {
      throw err;
    }
    console.warn("Auth check handled in app loader:", err);
  }

  const url = new URL(request.url);
  return json({
    apiKey: process.env.SHOPIFY_API_KEY || 'mock_codify_api_key_2026',
    host: url.searchParams.get('host') || 'mock_shopify_host',
  });
};

export default function AppLayout() {
  const contextData = useApp() || {};
  const settings = contextData.settings || {};
  const updateSettings = typeof contextData.updateSettings === 'function' 
    ? contextData.updateSettings 
    : (newSettings) => { console.log("Local settings update:", newSettings); };
  const orders = contextData.orders || [];
  const staff = contextData.staff || [];
  const addOrder = contextData.addOrder || (() => {});
  const setIsExitIntentOpen = contextData.setIsExitIntentOpen || (() => {});
  const setIsFormPreviewOpen = contextData.setIsFormPreviewOpen || (() => {});

  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const highRiskCount = useMemo(() => 
    orders.filter(o => o && (o.riskLevel === 'HIGH' || o.riskLevel === 'CRITICAL')).length
  , [orders]);

  const pendingOrdersCount = useMemo(() => 
    orders.filter(o => o && o.status === 'PENDING').length
  , [orders]);

  const activeStaffCount = useMemo(() => 
    staff.filter(s => s && s.status === 'ACTIVE').length
  , [staff]);

  // Exact 11 Sidebar Items as specified by the user
  const navItems = useMemo(() => [
    { 
      to: '/app', 
      label: 'Dashboard', 
      sublabel: 'Overview & Quick Stats',
      icon: LayoutDashboard,
      badge: pendingOrdersCount > 0 ? `${pendingOrdersCount}` : undefined,
      badgeColor: 'bg-amber-500/20 text-amber-300'
    },
    { 
      to: '/app/form-builder', 
      label: 'COD Form Builder', 
      sublabel: 'Drag & Drop Designer',
      icon: Sliders,
      badge: '1-Click',
      badgeColor: 'bg-emerald-500/20 text-emerald-300'
    },
    { 
      to: '/app/upsells', 
      label: 'Sales Booster & Upsells', 
      sublabel: 'Quantity Offers, BOGO',
      icon: ShoppingBag,
      badge: 'BOGO',
      badgeColor: 'bg-purple-500/20 text-purple-300'
    },
    { 
      to: '/app/whatsapp', 
      label: 'WhatsApp Settings & OTP', 
      sublabel: 'Order Verification',
      icon: MessageSquare,
      badge: 'OTP',
      badgeColor: 'bg-emerald-500/20 text-emerald-300'
    },
    { 
      to: '/app/risk-blacklist', 
      label: 'Fraud & RTO Prevention', 
      sublabel: 'Address Validation & Risk',
      icon: ShieldAlert,
      badge: highRiskCount > 0 ? `${highRiskCount}` : undefined,
      badgeColor: 'bg-rose-500/20 text-rose-300'
    },
    { 
      to: '/app/team', 
      label: 'Team & Routing', 
      sublabel: 'Courier Assignment (TCS, Trax)',
      icon: Users,
      badge: `${activeStaffCount}`,
      badgeColor: 'bg-blue-500/20 text-blue-300'
    },
    { 
      to: '/app/location-rules', 
      label: 'Location & Rules', 
      sublabel: 'City-wise COD Fees',
      icon: MapPin,
    },
    { 
      to: '/app/delivery-success', 
      label: 'Delivery Success', 
      sublabel: 'Advance Deposit Gateways',
      icon: CheckCircle2,
      badge: 'JazzCash',
      badgeColor: 'bg-emerald-500/20 text-emerald-300'
    },
    { 
      to: '/app/analytics', 
      label: 'Analytics & Ad Pixel', 
      sublabel: 'Google Sheets & Meta',
      icon: TrendingUp,
    },
    { 
      to: '/app/settings', 
      label: 'Settings & Integrations', 
      sublabel: 'Store info, Language',
      icon: SettingsIcon,
    },
    { 
      to: '/app/billing', 
      label: 'Billing Plans', 
      sublabel: 'Subscription Tiers',
      icon: CreditCard,
      badge: settings.planTier || 'PREMIUM',
      badgeColor: 'bg-amber-400 text-amber-950 font-bold'
    },
  ], [pendingOrdersCount, highRiskCount, activeStaffCount, settings.planTier]);

  const routeTitle = useMemo(() => {
    const path = location.pathname;
    if (path.includes('form-builder')) return 'COD Form Builder';
    if (path.includes('upsells')) return 'Sales Booster & Upsells';
    if (path.includes('whatsapp')) return 'WhatsApp Settings & OTP Verification';
    if (path.includes('risk-blacklist')) return 'Fraud & RTO Prevention';
    if (path.includes('team')) return 'Team & Courier Routing';
    if (path.includes('location-rules')) return 'Location & City COD Rules';
    if (path.includes('delivery-success')) return 'Delivery Success & Advance Deposit Gateways';
    if (path.includes('analytics')) return 'Analytics & Ad Pixel Tracking';
    if (path.includes('billing')) return 'Billing Plans & Subscription Tiers';
    if (path.includes('settings')) return 'Settings & Integrations';
    return 'Dashboard';
  }, [location.pathname]);

  // Plan calculation for bottom-left indicator
  const currentTier = settings.planTier || 'PREMIUM';
  const planQuotaLimit = currentTier === 'FREE' ? 100 : currentTier === 'PREMIUM' ? 500 : currentTier === 'ENTERPRISE' ? 12000 : 999999;
  const quotaDisplay = currentTier === 'UNLIMITED' 
    ? `${orders.length} / Unlimited` 
    : `${orders.length} / ${planQuotaLimit.toLocaleString()}`;
  const quotaPercent = currentTier === 'UNLIMITED' 
    ? 25 
    : Math.min(Math.round((orders.length / planQuotaLimit) * 100), 100);

  const planTierName = currentTier === 'FREE' ? 'Free' : currentTier === 'PREMIUM' ? 'Premium' : currentTier === 'ENTERPRISE' ? 'Enterprise' : 'Unlimited';

  const handleSimulateNewOrder = useCallback(() => {
    const pakistaniCustomers = [
      { name: 'Ahmed Rashid', city: 'Dubai', address: 'Villa 14, Al Barsha 2', phone: '+971-50-8921102', total: 4200 },
      { name: 'Khurram Shehzad', city: 'Karachi', address: 'Plot 88, Block 2, Clifton', phone: '0321-9988112', total: 6800 },
      { name: 'Sarah Smith', city: 'Riyadh', address: 'Olaya St, Al Wurud', phone: '+966-55-5128990', total: 8500 },
      { name: 'Shahid Afridi', city: 'Peshawar', address: 'University Road, Gulbahar # 2', phone: '0345-7766554', total: 3100 },
      { name: 'Ali Qasim', city: 'Karachi', address: 'Madina Town, Main Bazar', phone: '0302-3344556', total: 5400 },
    ];

    const randomCust = pakistaniCustomers[Math.floor(Math.random() * pakistaniCustomers.length)];
    addOrder({
      customerName: randomCust.name,
      city: randomCust.city,
      address: randomCust.address,
      phone: randomCust.phone,
      subtotal: randomCust.total,
      shippingFee: 150,
      codFee: 99,
      discount: 0,
      total: randomCust.total + 249,
      source: 'MakCod Quick Form',
    });

    try {
      if (typeof window !== 'undefined' && confetti) {
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.2 },
          colors: ['#10B981', '#008060', '#34d399']
        });
      }
    } catch (err) {
      // safe fallback
    }
  }, [addOrder]);

  return (
    <div className="h-screen w-full bg-[#F6F6F7] flex overflow-hidden font-sans text-[#202223]">
      
      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div 
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Shopify Geometric Balance Navigation Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#1A1C1D] flex flex-col h-full border-r border-[#2C3032] transition-transform duration-200 ease-in-out
        lg:static lg:translate-x-0
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand Header */}
        <div className="p-4 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#10B981] rounded-lg flex items-center justify-center font-bold text-white text-lg shadow-xs">
              C
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-white font-bold text-base tracking-tight">Codify</span>
                <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 bg-[#10B981]/20 text-[#10B981] rounded border border-[#10B981]/30">
                  REMIX
                </span>
              </div>
              <span className="text-[11px] text-gray-400 font-sans block truncate max-w-[130px]">{settings.storeName}</span>
            </div>
          </div>

          <button 
            onClick={() => setIsMobileOpen(false)}
            className="text-gray-400 hover:text-white p-1 rounded lg:hidden cursor-pointer"
            aria-label="Close Sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links in Remix - 11 Items */}
        <nav className="flex-1 px-2.5 py-3 space-y-0.5 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10" aria-label="Remix App Navigation">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isRootDashboard = item.to === '/app';
            const isActive = isRootDashboard 
              ? (location.pathname === '/app' || location.pathname === '/' || location.pathname === '') 
              : location.pathname.startsWith(item.to);
            
            return (
              <NavLink
                key={`${item.to}-${index}`}
                to={item.to}
                onClick={() => setIsMobileOpen(false)}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg font-medium text-xs transition-colors cursor-pointer text-left ${
                  isActive
                    ? 'bg-[#10B981]/15 text-[#10B981] font-semibold border-l-2 border-[#10B981]'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#10B981]' : 'text-gray-400'}`} />
                  <span className="text-xs truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold shrink-0 ${item.badgeColor || 'bg-white/10 text-gray-300'}`}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Plan / Usage Status Indicator Connected to AppContext */}
        <div className="p-3.5 border-t border-white/10 space-y-2.5 bg-[#161819]">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span className="font-mono text-[11px] uppercase tracking-wider text-gray-300 font-bold">
              Plan: {planTierName} Active
            </span>
            <NavLink 
              to="/app/billing"
              className="text-[#10B981] font-bold text-xs hover:underline cursor-pointer flex items-center gap-0.5"
            >
              <span>Manage</span>
            </NavLink>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] text-gray-400">
              <span>Monthly Quota</span>
              <span className="font-mono text-gray-300">{quotaDisplay}</span>
            </div>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#10B981] rounded-full transition-all duration-500"
                style={{ width: `${quotaPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Master Storefront Toggle */}
          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
            <span className="text-gray-400 text-[11px]">Storefront COD:</span>
            <button
              onClick={() => updateSettings({ appActive: !settings.appActive })}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                settings.appActive 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}
            >
              <Power className="w-2.5 h-2.5" />
              <span>{settings.appActive ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        
        {/* Top Header */}
        <header className="h-14 bg-white border-b border-[#E1E3E5] flex items-center justify-between px-4 sm:px-8 shrink-0 z-30">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="p-1.5 rounded-md text-gray-500 hover:text-gray-900 hover:bg-[#F1F2F4] lg:hidden cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <h1 className="font-semibold text-base sm:text-lg text-[#202223] tracking-tight">{routeTitle}</h1>

            <span className={`hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${
              settings.appActive 
                ? 'bg-[#E3F2ED] text-[#008060] border-[#B7D7CC]' 
                : 'bg-rose-50 text-rose-700 border-rose-200'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${settings.appActive ? 'bg-[#008060] animate-pulse' : 'bg-rose-500'}`}></span>
              <span>{settings.appActive ? 'App is ON' : 'App is PAUSED'}</span>
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Currency Selector */}
            <div className="hidden md:flex items-center bg-[#F1F2F4] border border-[#E1E3E5] rounded-md px-2 py-1 text-xs">
              <Globe className="w-3 h-3 text-gray-500 mr-1.5" />
              <select
                value={settings.currency}
                onChange={(e) => {
                  const val = e.target.value;
                  const sym = val === 'PKR' ? 'Rs.' : val === 'USD' ? '$' : val === 'SAR' ? 'SAR' : val === 'AED' ? 'AED' : '₹';
                  updateSettings({ currency: val, currencySymbol: sym });
                }}
                aria-label="Select Currency"
                className="bg-transparent font-medium text-gray-700 focus:outline-none cursor-pointer text-xs"
              >
                <option value="PKR">PKR (Rs.)</option>
                <option value="USD">USD ($)</option>
                <option value="SAR">SAR (ر.س)</option>
                <option value="AED">AED (د.إ)</option>
                <option value="INR">INR (₹)</option>
              </select>
            </div>

            {/* Live Form Modal Trigger */}
            <button
              onClick={() => setIsFormPreviewOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#F1F2F4] text-[#202223] text-xs font-medium border border-[#E1E3E5] rounded-md shadow-xs transition-colors cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5 text-[#10B981]" />
              <span>Live Form</span>
            </button>

            {/* Exit-Intent Trigger Test */}
            <button
              onClick={() => setIsExitIntentOpen(true)}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-medium border border-amber-200 rounded-md shadow-xs transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Exit Intent</span>
            </button>

            {/* Simulate Live Order */}
            <button
              onClick={handleSimulateNewOrder}
              className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 bg-[#10B981] hover:bg-emerald-600 text-white text-xs font-semibold rounded-md shadow-xs transition-all cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>+ <span className="hidden sm:inline">Simulate</span> Order</span>
            </button>

            {/* Store Avatar */}
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 text-xs font-bold border border-emerald-200 shadow-2xs">
              JD
            </div>
          </div>
        </header>

        {/* Scrollable Child Route View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-[1600px] mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>

    </div>
  );
}

