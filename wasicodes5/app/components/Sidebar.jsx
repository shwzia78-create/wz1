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
  Zap,
  Power,
  X
} from 'lucide-react';

export const Sidebar = ({ isMobileOpen, onCloseMobile }) => {
  const { activeRoute, setActiveRoute, orders, staff, settings, updateSettings } = useApp();

  const highRiskCount = orders.filter(o => o.riskLevel === 'HIGH' || o.riskLevel === 'CRITICAL').length;
  const pendingOrdersCount = orders.filter(o => o.status === 'PENDING').length;
  const activeStaffCount = staff.filter(s => s.status === 'ACTIVE').length;

  const navItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: LayoutDashboard,
      badge: pendingOrdersCount > 0 ? `${pendingOrdersCount}` : undefined,
      badgeColor: 'bg-amber-500/20 text-amber-300'
    },
    { 
      id: 'form-builder', 
      label: 'COD Form Builder', 
      icon: Sliders,
      badge: '1-Click',
      badgeColor: 'bg-emerald-500/20 text-emerald-300'
    },
    { 
      id: 'whatsapp', 
      label: 'WhatsApp Settings', 
      icon: MessageSquare,
      badge: 'OTP',
      badgeColor: 'bg-emerald-500/20 text-emerald-300'
    },
    { 
      id: 'team', 
      label: 'Team & Routing', 
      icon: Users,
      badge: `${activeStaffCount}`,
      badgeColor: 'bg-blue-500/20 text-blue-300'
    },
    { 
      id: 'location-rules', 
      label: 'Location & Rules', 
      icon: MapPin,
    },
    { 
      id: 'risk-blacklist', 
      label: 'Fraud & Risk', 
      icon: ShieldAlert,
      badge: highRiskCount > 0 ? `${highRiskCount}` : undefined,
      badgeColor: 'bg-rose-500/20 text-rose-300'
    },
    { 
      id: 'upsells', 
      label: 'Upsells & BOGO', 
      icon: ShoppingBag,
    },
    { 
      id: 'analytics', 
      label: 'RTO Analytics', 
      icon: TrendingUp,
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: SettingsIcon,
    },
  ];

  const handleNavClick = (id) => {
    setActiveRoute(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-60 bg-[#1A1C1D] flex flex-col h-full border-r border-[#2C3032] transition-transform duration-200 ease-in-out
        lg:static lg:translate-x-0
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand Header */}
        <div className="p-5 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#10B981] rounded flex items-center justify-center font-bold text-white text-xl shadow-xs">
              M
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-white font-bold text-lg tracking-tight">MakCod</span>
                <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 bg-[#10B981]/20 text-[#10B981] rounded border border-[#10B981]/30">
                  PRO
                </span>
              </div>
              <span className="text-[11px] text-gray-400 font-sans block truncate max-w-[120px]">{settings.storeName}</span>
            </div>
          </div>

          <button 
            onClick={onCloseMobile}
            className="text-gray-400 hover:text-white p-1 rounded lg:hidden"
            aria-label="Close Sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-none" aria-label="Main Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeRoute === item.id || (item.id === 'settings' && activeRoute === 'location-rules' && false);
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md font-medium text-xs transition-colors cursor-pointer text-left ${
                  isActive
                    ? 'bg-[#10B981]/10 text-[#10B981] font-semibold border-l-2 border-[#10B981]'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#10B981]' : 'text-gray-400'}`} />
                  <span className="text-xs">{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${item.badgeColor || 'bg-white/10 text-gray-300'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Plan / Usage Status Indicator */}
        <div className="p-4 border-t border-white/10 space-y-3 bg-[#161819]">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span className="font-mono text-[11px] uppercase tracking-wider">Plan: Pro Active</span>
            <button 
              onClick={() => handleNavClick('settings')}
              className="text-[#10B981] font-bold text-xs hover:underline cursor-pointer"
            >
              Manage
            </button>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] text-gray-400">
              <span>Monthly Quota</span>
              <span className="font-mono text-gray-300">{orders.length} / 5,000</span>
            </div>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-[#10B981] w-3/4 rounded-full transition-all duration-500"></div>
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
    </>
  );
};
