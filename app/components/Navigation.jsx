import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  Sliders, 
  MessageSquare, 
  Users, 
  ShieldAlert, 
  MapPin, 
  TrendingUp, 
  ShoppingBag, 
  Settings as SettingsIcon,
} from 'lucide-react';

export const Navigation = () => {
  const { activeRoute, setActiveRoute, orders, staff } = useApp();

  const highRiskCount = orders.filter(o => o.riskLevel === 'HIGH' || o.riskLevel === 'CRITICAL').length;
  const pendingOrdersCount = orders.filter(o => o.status === 'PENDING').length;
  const activeStaffCount = staff.filter(s => s.status === 'ACTIVE').length;

  const navItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: LayoutDashboard,
      badge: pendingOrdersCount > 0 ? `${pendingOrdersCount} pending` : undefined,
      badgeColor: 'bg-amber-100 text-amber-800'
    },
    { 
      id: 'form-builder', 
      label: 'COD Form & Exit-Intent', 
      icon: Sliders,
      badge: '1-Click',
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    { 
      id: 'whatsapp', 
      label: 'WhatsApp Verification', 
      icon: MessageSquare,
      badge: 'Hybrid OTP',
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    { 
      id: 'team', 
      label: 'Team & Order Routing', 
      icon: Users,
      badge: `${activeStaffCount} active`,
      badgeColor: 'bg-blue-100 text-blue-800'
    },
    { 
      id: 'risk-blacklist', 
      label: 'AI Fraud & Blacklist', 
      icon: ShieldAlert,
      badge: highRiskCount > 0 ? `${highRiskCount} alert` : undefined,
      badgeColor: 'bg-rose-100 text-rose-800'
    },
    { 
      id: 'location-rules', 
      label: 'Location & COD Fees', 
      icon: MapPin,
    },
    { 
      id: 'upsells', 
      label: 'Upsells & BOGO Bundles', 
      icon: ShoppingBag,
      badge: 'Revenue+',
      badgeColor: 'bg-purple-100 text-purple-800'
    },
    { 
      id: 'analytics', 
      label: 'RTO & Revenue Analytics', 
      icon: TrendingUp,
    },
    { 
      id: 'settings', 
      label: 'Settings & Deposit Gateways', 
      icon: SettingsIcon,
    },
  ];

  return (
    <div className="bg-white border border-[#e1e3e5] rounded-xl shadow-2xs">
      <div className="px-3 sm:px-4">
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2.5 scrollbar-none" aria-label="Tabs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeRoute === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveRoute(item.id)}
                className={`flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#f1f8f5] text-emerald-800 border border-emerald-300 font-semibold shadow-xs'
                    : 'text-[#5c5f62] hover:text-[#202223] hover:bg-[#f6f6f7]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-700' : 'text-[#6d7175]'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`px-1.5 py-0.5 text-[10px] font-semibold rounded-full ${item.badgeColor || 'bg-slate-100 text-slate-700'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
