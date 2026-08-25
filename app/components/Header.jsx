import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Power, 
  Sparkles, 
  ShoppingBag, 
  Maximize2, 
  Globe,
  Menu,
  Search
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const Header = ({ onToggleMobileMenu }) => {
  const { 
    settings, 
    updateSettings, 
    addOrder, 
    setIsExitIntentOpen, 
    setIsFormPreviewOpen,
    activeRoute,
  } = useApp();

  const getRouteTitle = () => {
    switch (activeRoute) {
      case 'dashboard':
        return 'Overview';
      case 'form-builder':
        return 'COD Form Builder';
      case 'whatsapp':
        return 'WhatsApp Verification';
      case 'team':
        return 'Team & Auto-Routing';
      case 'risk-blacklist':
        return 'AI Fraud & Blacklist';
      case 'location-rules':
        return 'Location & COD Rules';
      case 'upsells':
        return 'Upsells & BOGO Bundles';
      case 'analytics':
        return 'RTO & Revenue Analytics';
      case 'settings':
        return 'Settings & Deposit Gateways';
      default:
        return 'Overview';
    }
  };

  const handleSimulateNewOrder = () => {
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

    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.2 },
      colors: ['#10B981', '#008060', '#34d399']
    });
  };

  return (
    <header className="h-14 bg-white border-b border-[#E1E3E5] flex items-center justify-between px-4 sm:px-8 shrink-0 z-30">
      
      {/* Left: Mobile Toggle & Page Title with App Status Badge */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Mobile menu toggle */}
        <button
          onClick={onToggleMobileMenu}
          className="p-1.5 rounded-md text-gray-500 hover:text-gray-900 hover:bg-[#F1F2F4] lg:hidden cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h1 className="font-semibold text-base sm:text-lg text-[#202223] tracking-tight">{getRouteTitle()}</h1>

        <span className={`hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${
          settings.appActive 
            ? 'bg-[#E3F2ED] text-[#008060] border-[#B7D7CC]' 
            : 'bg-rose-50 text-rose-700 border-rose-200'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${settings.appActive ? 'bg-[#008060] animate-pulse' : 'bg-rose-500'}`}></span>
          <span>{settings.appActive ? 'App is ON' : 'App is PAUSED'}</span>
        </span>
      </div>

      {/* Right Controls */}
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

        {/* Live Form Preview Modal Trigger */}
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

        {/* User / Store Avatar */}
        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 text-xs font-bold border border-emerald-200 shadow-2xs">
          JD
        </div>

      </div>

    </header>
  );
};
