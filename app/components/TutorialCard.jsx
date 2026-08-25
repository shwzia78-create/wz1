import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Check, 
  ChevronRight, 
  Layers, 
  MessageSquare, 
  CreditCard, 
  Users,
  Zap,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';

export const TutorialCard = () => {
  const { 
    setActiveRoute, 
    settings, 
    updateSettings, 
    whatsAppConfig, 
    staff, 
    depositGateways,
    showToast 
  } = useApp();

  const isButtonPlaced = Boolean(settings?.themeAppExtensionActive || settings?.buttonPlaced);

  const handlePlaceThemeButton = () => {
    try {
      const storeName = settings?.storeName?.replace('.myshopify.com', '') || 'admin';
      const deepLink = `https://admin.shopify.com/store/${storeName}/themes/current/editor?template=product&addAppBlockId=codify-cod-embed/codify_form`;
      
      window.open(deepLink, '_blank');
      
      updateSettings({ 
        themeAppExtensionActive: true,
        buttonPlaced: true 
      });

      if (showToast) {
        showToast('✓ Button Placed on Theme', 'Theme Editor opened with Codify Block auto-injected. Click Save in theme editor.');
      }
    } catch (e) {
      updateSettings({ 
        themeAppExtensionActive: true,
        buttonPlaced: true 
      });
    }
  };

  const steps = [
    {
      id: 'theme-app-embed',
      title: 'Auto-Place COD Button in Theme',
      subtitle: isButtonPlaced ? '✓ Button placed & active on product pages' : '1-Click automated placement on live theme',
      completed: isButtonPlaced,
      actionRoute: 'settings',
      isThemeButton: true
    },
    {
      id: 'whatsapp-verify',
      title: 'Configure WhatsApp Verification',
      subtitle: 'Boost conversion with free links or Cloud API.',
      completed: Boolean(whatsAppConfig?.directLinkPhoneNumber || whatsAppConfig?.metaAccessToken),
      actionRoute: 'whatsapp',
    },
    {
      id: 'staff-routing',
      title: 'Setup Staff Quotas & Routing',
      subtitle: 'Auto-assign incoming COD orders to team.',
      completed: Boolean((staff || []).length > 0 && settings?.autoAssignStaff),
      actionRoute: 'team',
    },
    {
      id: 'deposit-security',
      title: 'Setup Location Fees & Deposits',
      subtitle: 'Block risky postal codes & fake addresses.',
      completed: Boolean(depositGateways?.jazzCashEnabled || depositGateways?.easyPaisaEnabled),
      actionRoute: 'settings',
    }
  ];

  return (
    <div className="bg-white p-5 rounded-xl shadow-xs border border-[#E1E3E5] space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-sm text-[#202223]">Quick Setup Checklist</h2>
        <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
          {steps.filter(s => s.completed).length}/{steps.length} Complete
        </span>
      </div>

      {/* 1-Click Theme Placement Action Button */}
      <div className="p-3.5 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950">
            <Zap className="w-3.5 h-3.5 text-emerald-600" />
            <span>Storefront Theme Action</span>
          </div>
          {isButtonPlaced && (
            <span className="text-[10px] font-semibold text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200">
              Active on Theme
            </span>
          )}
        </div>

        {isButtonPlaced ? (
          <div className="flex items-center justify-between gap-2 pt-1">
            <button
              disabled
              className="flex-1 py-2 px-3 bg-gray-100 text-gray-500 text-xs font-bold rounded-lg border border-gray-300 flex items-center justify-center gap-1.5 cursor-not-allowed"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>✓ Button Placed on Theme</span>
            </button>
            <button
              onClick={() => updateSettings({ themeAppExtensionActive: false, buttonPlaced: false })}
              title="Reset state if you want to re-add to theme"
              className="text-[11px] text-gray-400 hover:text-gray-700 underline cursor-pointer px-1 shrink-0"
            >
              Reset
            </button>
          </div>
        ) : (
          <button
            onClick={handlePlaceThemeButton}
            className="w-full py-2.5 px-3 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer hover:shadow-md active:scale-98"
          >
            <span>⚡ Add COD Button to Theme</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Checklist items */}
      <div className="space-y-3.5 pt-1">
        {steps.map((step) => (
          <div 
            key={step.id} 
            className={`flex items-start justify-between gap-3 group ${
              step.completed ? 'opacity-70' : ''
            }`}
          >
            <div className="flex items-start gap-3">
              <button
                onClick={() => {
                  if (step.id === 'theme-app-embed') {
                    updateSettings({ 
                      themeAppExtensionActive: !isButtonPlaced,
                      buttonPlaced: !isButtonPlaced
                    });
                  }
                }}
                className="mt-0.5 focus:outline-none cursor-pointer shrink-0"
                aria-label={`Toggle status for ${step.title}`}
              >
                {step.completed ? (
                  <div className="w-5 h-5 rounded-full bg-[#10B981] flex items-center justify-center text-white text-[10px] font-bold">
                    ✓
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300 hover:border-emerald-500 transition-colors" />
                )}
              </button>

              <div>
                <p className={`text-xs font-bold ${step.completed ? 'line-through text-gray-500' : 'text-[#202223]'}`}>
                  {step.title}
                </p>
                <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">{step.subtitle}</p>
              </div>
            </div>

            <button
              onClick={() => {
                if (step.isThemeButton && !isButtonPlaced) {
                  handlePlaceThemeButton();
                } else {
                  setActiveRoute(step.actionRoute);
                }
              }}
              className="text-xs text-[#005bd3] font-medium hover:underline flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer pt-0.5"
            >
              <span>{step.isThemeButton && !isButtonPlaced ? 'Place' : 'Setup'}</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};
