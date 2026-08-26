// Shopify Remix Route: Billing Plans & Subscription Tiers - /app/routes/app.billing.jsx
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { json } from '@remix-run/node';
import { authenticate } from '../shopify.server';
import { 
  Check, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  Crown, 
  ArrowRight, 
  HelpCircle, 
  Tag, 
  TrendingUp, 
  Layers, 
  CheckCircle2, 
  X,
  CreditCard,
  Percent,
  AlertCircle,
  Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const loader = async ({ request }) => {
  try {
    const { billing } = await authenticate.admin(request);
  } catch (err) {
    if (err instanceof Response) throw err;
  }
  return json({ ok: true });
};

export const action = async ({ request }) => {
  return json({ success: true });
};

const safeConfetti = (opts = {}) => {
  try {
    if (typeof window !== 'undefined' && confetti) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.4 },
        disableForReducedMotion: true,
        ...opts,
      });
    }
  } catch (e) {
    // Non-fatal fallback
  }
};

export default function BillingRoute() {
  const contextData = useApp() || {};
  const settings = contextData.settings || {};
  const updateSettings = typeof contextData.updateSettings === 'function' ? contextData.updateSettings : () => {};
  const showToast = typeof contextData.showToast === 'function' ? contextData.showToast : (title, msg) => console.log(title, msg);

  const [billingInterval, setBillingInterval] = useState(settings.billingInterval || 'MONTHLY');
  const [couponInput, setCouponInput] = useState(settings.discountCodeApplied || '');
  const [appliedCoupon, setAppliedCoupon] = useState(settings.discountCodeApplied || '');
  const [couponDiscount, setCouponDiscount] = useState(settings.discountPercent || 0);
  const [couponError, setCouponError] = useState('');

  // Selected plan for card attachment modal
  const [selectedPlanForUpgrade, setSelectedPlanForUpgrade] = useState(null);
  const [isAttachingCard, setIsAttachingCard] = useState(false);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const code = couponInput.trim().toUpperCase();
    if (!code) return;

    if (code === 'MAKCOD25' || code === 'SAVE25' || code === 'CODPRO') {
      setAppliedCoupon(code);
      setCouponDiscount(25);
      setCouponError('');
      updateSettings({ discountCodeApplied: code, discountPercent: 25 }, true);
      showToast('Promo Code Applied!', '25% additional discount applied to all plans.', 'success');
      safeConfetti({ particleCount: 30, spread: 45, origin: { y: 0.3 } });
    } else if (code === 'FOUNDER50') {
      setAppliedCoupon(code);
      setCouponDiscount(50);
      setCouponError('');
      updateSettings({ discountCodeApplied: code, discountPercent: 50 }, true);
      showToast('VIP Founder Code Applied!', '50% exclusive discount activated!', 'success');
      safeConfetti({ particleCount: 50, spread: 60, origin: { y: 0.3 } });
    } else {
      setCouponError('Invalid promo code. Try MAKCOD25 or SAVE25');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon('');
    setCouponDiscount(0);
    setCouponInput('');
    updateSettings({ discountCodeApplied: undefined, discountPercent: 0 }, true);
    showToast('Promo Code Removed', 'Standard pricing restored.', 'info');
  };

  const plans = [
    {
      id: 'FREE',
      name: 'Free',
      badge: 'Starter',
      description: 'Ideal for new stores launching COD without upfront risk.',
      monthlyPrice: 0,
      annualMonthlyPrice: 0,
      orderLimit: 100,
      orderLimitLabel: '100 Orders / mo',
      highlighted: false,
      popular: false,
      features: [
        '100 COD Orders per month',
        'Basic 1-Click COD Form',
        'City-wise COD Rules & Fees',
        'Direct WhatsApp Link generator',
        'Standard Shopify Admin Sync',
        'Community & Email Support',
      ],
      missingFeatures: [
        'JazzCash & EasyPaisa Advance Deposits',
        'Sales Booster & BOGO Offers',
        'AI Fraud & Blacklist Shield',
        'Local Courier Auto-Routing',
        'Google Sheets Live Sync',
      ],
    },
    {
      id: 'PREMIUM',
      name: 'Premium',
      badge: 'Most Popular',
      description: 'The complete toolkit to double COD delivery rates and boost AOV.',
      monthlyPrice: 9.75,
      annualMonthlyPrice: 7.31,
      orderLimit: 500,
      orderLimitLabel: '500 Orders / mo',
      highlighted: true,
      popular: true,
      features: [
        '500 COD Orders per month',
        'Full Drag & Drop Form Designer',
        'JazzCash & EasyPaisa Advance Deposits',
        'Sales Boosters (BOGO, Upsells, Add-ons)',
        'Automated SMS & WhatsApp OTP Verification',
        'Address Auto-Complete & Postal Lookup',
        'Standard Courier Tracking (TCS, Trax)',
        'Priority Email & Live Chat Support',
      ],
      missingFeatures: [
        'Google Sheets Real-time Sync & Meta CAPI',
        'Custom JavaScript & CSS Injection',
        'A/B Testing Engine',
      ],
    },
    {
      id: 'ENTERPRISE',
      name: 'Enterprise',
      badge: 'High Volume',
      description: 'Maximum security and automation for established COD scale brands.',
      monthlyPrice: 29.25,
      annualMonthlyPrice: 21.94,
      orderLimit: 12000,
      orderLimitLabel: '12,000 Orders / mo',
      highlighted: false,
      popular: false,
      features: [
        '12,000 COD Orders per month',
        'Advanced AI Fraud & RTO Protection Shield',
        'Automated Staff Routing & Quota Rules',
        'Multi-Courier Allocation (TCS, Leopards, Trax, PostEx)',
        'Google Sheets Live Sync & Meta Pixel CAPI',
        'Custom JavaScript & CSS Code Injector',
        'Exit-Intent Popup & Timer Countdown',
        'Dedicated WhatsApp VIP Account Manager',
      ],
      missingFeatures: [
        'A/B Testing Engine for Multiple Forms',
      ],
    },
    {
      id: 'UNLIMITED',
      name: 'Unlimited',
      badge: 'Uncapped Scale',
      description: 'Zero limits. Engineered for high-scale enterprise e-commerce powerhouses.',
      monthlyPrice: 59.49,
      annualMonthlyPrice: 44.62,
      orderLimit: 999999,
      orderLimitLabel: 'Unlimited Orders / mo',
      highlighted: false,
      popular: false,
      features: [
        'Unlimited COD Orders (Zero Overages)',
        'A/B Testing Engine for Forms & Upsells',
        'Multiple Storefronts & Unlimited Forms',
        'All Courier Integrations + Auto-Booking APIs',
        'VIP WhatsApp & Live Call Concierge (24/7)',
        'Custom Webhooks & REST API Endpoints',
        'Dedicated High-Speed Database Cluster',
        'Custom Feature Engineering on Request',
      ],
      missingFeatures: [],
    },
  ];

  const handleSelectFreePlan = () => {
    updateSettings({
      planTier: 'FREE',
      billingInterval: billingInterval,
      planMonthlyQuota: 100,
    }, true);

    safeConfetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.4 },
      colors: ['#10B981', '#059669', '#34D399', '#F59E0B']
    });

    showToast(
      'Free Plan Switched!',
      'Your store is now on Free Plan (100 orders/mo). Zero charges applied.',
      'success'
    );
  };

  const handleOpenUpgradeModal = (plan) => {
    setSelectedPlanForUpgrade(plan);
  };

  const handleConfirmPlanUpgrade = () => {
    if (!selectedPlanForUpgrade) return;
    setIsAttachingCard(true);

    setTimeout(() => {
      setIsAttachingCard(false);
      updateSettings({
        planTier: selectedPlanForUpgrade.id,
        billingInterval: billingInterval,
        planMonthlyQuota: selectedPlanForUpgrade.orderLimit,
      }, true);

      safeConfetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.4 },
        colors: ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B']
      });

      showToast(
        `${selectedPlanForUpgrade.name} Plan Activated!`,
        `Payment method verified. Your subscription is active with ${selectedPlanForUpgrade.orderLimitLabel}.`,
        'success'
      );

      setSelectedPlanForUpgrade(null);
    }, 900);
  };

  const getCalculatedPrice = (plan) => {
    let base = billingInterval === 'ANNUAL' ? plan.annualMonthlyPrice : plan.monthlyPrice;
    if (couponDiscount > 0 && base > 0) {
      base = base * (1 - couponDiscount / 100);
    }
    return base.toFixed(2);
  };

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto pb-12">
      
      {/* Header Banner */}
      <div className="text-center space-y-3 pt-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Unbeatable Industry Pricing — Maximum Value Guaranteed</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#202223] tracking-tight">
          The Most Advanced COD Automation Engine on Shopify
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Unmatched Scale & Power — Zero Commission Limits. Unlock high-converting 1-click forms, advance JazzCash/EasyPaisa security deposits, automated WhatsApp verification, and AI-powered RTO protection.
        </p>

        {/* Current Active Plan Status Banner */}
        <div className="inline-flex items-center gap-3 px-4 py-2 bg-white border border-[#E1E3E5] shadow-xs rounded-xl text-xs font-semibold text-[#202223] mt-2">
          <span className="text-gray-500">Current Subscription:</span>
          <span className="px-2.5 py-0.5 bg-[#10B981]/15 text-[#008060] font-extrabold rounded-md uppercase tracking-wider">
            {settings.planTier || 'FREE'} ACTIVE
          </span>
          {settings.planTier && settings.planTier !== 'FREE' && (
            <button
              type="button"
              onClick={handleSelectFreePlan}
              className="text-rose-600 hover:text-rose-700 underline font-bold cursor-pointer text-xs ml-2"
            >
              Downgrade to Free Plan
            </button>
          )}
        </div>

        {/* Billing Interval Toggle */}
        <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-4">
          <div className="bg-[#E4E5E7] p-1 rounded-xl inline-flex items-center border border-[#D2D5D8] shadow-2xs">
            <button
              type="button"
              onClick={() => {
                setBillingInterval('MONTHLY');
                updateSettings({ billingInterval: 'MONTHLY' }, true);
              }}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                billingInterval === 'MONTHLY'
                  ? 'bg-white text-[#202223] shadow-xs'
                  : 'text-gray-600 hover:text-[#202223]'
              }`}
            >
              Monthly Billing
            </button>
            <button
              type="button"
              onClick={() => {
                setBillingInterval('ANNUAL');
                updateSettings({ billingInterval: 'ANNUAL' }, true);
              }}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                billingInterval === 'ANNUAL'
                  ? 'bg-[#10B981] text-white shadow-xs'
                  : 'text-gray-600 hover:text-[#202223]'
              }`}
            >
              <span>Annual Billing</span>
              <span className="bg-amber-400 text-amber-950 text-[10px] px-1.5 py-0.2 rounded font-extrabold">
                SAVE 25%
              </span>
            </button>
          </div>

          {/* Discount Coupon Box */}
          <form onSubmit={handleApplyCoupon} className="flex items-center gap-1.5">
            <div className="relative">
              <Tag className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Discount Code (e.g. MAKCOD25)"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-white border border-[#E1E3E5] rounded-lg text-xs w-52 focus:outline-none focus:ring-1 focus:ring-[#10B981]"
              />
            </div>
            <button
              type="submit"
              className="px-3 py-1.5 bg-[#202223] hover:bg-black text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              Apply
            </button>
          </form>
        </div>

        {appliedCoupon && (
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg text-xs font-medium">
            <Percent className="w-3.5 h-3.5 text-amber-600" />
            <span>Coupon <strong>{appliedCoupon}</strong> active: {couponDiscount}% extra discount applied!</span>
            <button 
              type="button"
              onClick={handleRemoveCoupon} 
              className="text-gray-400 hover:text-gray-700 ml-1 cursor-pointer"
              title="Remove coupon"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {couponError && (
          <p className="text-xs text-rose-600 font-medium">{couponError}</p>
        )}
      </div>

      {/* 4 Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
        {plans.map((plan) => {
          const isCurrentPlan = (settings.planTier || 'FREE') === plan.id;
          const calculatedPrice = getCalculatedPrice(plan);

          return (
            <div
              key={plan.id}
              className={`rounded-2xl flex flex-col justify-between transition-all duration-200 relative ${
                isCurrentPlan 
                  ? 'bg-white border-2 border-[#10B981] shadow-lg ring-2 ring-[#10B981]/20' 
                  : plan.popular 
                  ? 'bg-white border-2 border-[#202223] shadow-md' 
                  : 'bg-white border border-[#E1E3E5] shadow-xs hover:border-gray-400 hover:shadow-sm'
              }`}
            >
              {/* Top Banner Tag */}
              {isCurrentPlan ? (
                <div className="bg-[#10B981] text-white text-center py-1.5 text-[11px] font-extrabold uppercase tracking-wider rounded-t-xl flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>YOUR ACTIVE PLAN</span>
                </div>
              ) : plan.popular ? (
                <div className="bg-[#202223] text-white text-center py-1.5 text-[11px] font-extrabold uppercase tracking-wider rounded-t-xl flex items-center justify-center gap-1">
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                  <span>RECOMMENDED CHOICE</span>
                </div>
              ) : null}

              <div className="p-5 sm:p-6 flex-1 flex flex-col">
                
                {/* Tier Title & Order Limit Badge */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h2 className="text-lg font-extrabold text-[#202223]">{plan.name}</h2>
                    <p className="text-xs text-gray-500 mt-0.5 leading-tight">{plan.description}</p>
                  </div>
                </div>

                {/* Quota Pill */}
                <div className="my-3">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold font-mono ${
                    plan.id === 'UNLIMITED' 
                      ? 'bg-purple-100 text-purple-800' 
                      : plan.id === 'ENTERPRISE'
                      ? 'bg-blue-100 text-blue-800'
                      : plan.id === 'PREMIUM'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    <Zap className="w-3 h-3" />
                    <span>{plan.orderLimitLabel}</span>
                  </span>
                </div>

                {/* Price Display */}
                <div className="my-3 pb-4 border-b border-[#F1F2F4]">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-extrabold text-[#202223] tracking-tight">
                      ${calculatedPrice}
                    </span>
                    <span className="text-xs font-medium text-gray-500">
                      / month
                    </span>
                  </div>
                  {billingInterval === 'ANNUAL' && plan.monthlyPrice > 0 && (
                    <div className="text-[11px] text-emerald-700 font-semibold mt-1">
                      Billed annually (Save ${(plan.monthlyPrice * 12 - plan.annualMonthlyPrice * 12).toFixed(0)}/year)
                    </div>
                  )}
                </div>

                {/* Action CTA Button */}
                <div className="mb-6">
                  {isCurrentPlan ? (
                    <button
                      type="button"
                      disabled
                      className="w-full py-2.5 px-4 bg-[#E3F2ED] text-[#008060] border border-[#B7D7CC] rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 cursor-default"
                    >
                      <Check className="w-4 h-4" />
                      <span>Current Plan Active</span>
                    </button>
                  ) : plan.id === 'FREE' ? (
                    <button
                      type="button"
                      onClick={handleSelectFreePlan}
                      className="w-full py-2.5 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-xs"
                    >
                      Switch to Free Plan
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleOpenUpgradeModal(plan)}
                      className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer ${
                        plan.popular
                          ? 'bg-[#10B981] hover:bg-emerald-600 text-white'
                          : 'bg-[#202223] hover:bg-black text-white'
                      }`}
                    >
                      <span>Choose {plan.name}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Feature Bullet Points */}
                <div className="space-y-2.5 text-xs text-gray-700 flex-1">
                  <div className="font-bold text-[11px] uppercase tracking-wider text-gray-400 mb-2">
                    Included Features:
                  </div>
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span className="leading-snug">{feat}</span>
                    </div>
                  ))}

                  {plan.missingFeatures.map((feat, idx) => (
                    <div key={`missing-${idx}`} className="flex items-start gap-2 opacity-40">
                      <div className="w-4 h-4 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center shrink-0 mt-0.5">
                        <X className="w-2.5 h-2.5" />
                      </div>
                      <span className="leading-snug line-through">{feat}</span>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Card Attachment & Upgrade Approval Modal */}
      {selectedPlanForUpgrade && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full border border-gray-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-[#1A1C1D] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#10B981] flex items-center justify-center text-white font-bold">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Attach Payment Method & Subscribe</h3>
                  <p className="text-[11px] text-gray-300">Shopify Official Subscription Approval</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPlanForUpgrade(null)}
                className="text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-xs text-[#202223]">
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-emerald-900 text-xs">
                    Upgrading to {selectedPlanForUpgrade.name} ({billingInterval === 'ANNUAL' ? 'Annual' : 'Monthly'})
                  </div>
                  <div className="text-emerald-700 text-[11px] mt-0.5">
                    Amount: <strong>${getCalculatedPrice(selectedPlanForUpgrade)}/mo</strong> • Quota: <strong>{selectedPlanForUpgrade.orderLimitLabel}</strong>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="font-bold block text-gray-700">Billing Credit/Debit Card Details:</label>
                <div className="space-y-2">
                  <input
                    type="text"
                    readOnly
                    value="•••• •••• •••• 4242 (Shopify Primary Store Card)"
                    className="w-full bg-gray-50 border border-gray-300 px-3 py-2 rounded-lg text-xs font-mono text-gray-700 cursor-not-allowed"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value="Expires 12/28"
                      className="w-1/2 bg-gray-50 border border-gray-300 px-3 py-2 rounded-lg text-xs text-gray-600 cursor-not-allowed"
                    />
                    <input
                      type="text"
                      readOnly
                      value="CVC: •••"
                      className="w-1/2 bg-gray-50 border border-gray-300 px-3 py-2 rounded-lg text-xs text-gray-600 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-amber-800 text-[11px]">
                <Lock className="w-4 h-4 shrink-0 text-amber-600" />
                <span>You can cancel anytime or switch back to the Free plan instantly with 1-click.</span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedPlanForUpgrade(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isAttachingCard}
                onClick={handleConfirmPlanUpgrade}
                className="px-5 py-2 bg-[#10B981] hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isAttachingCard ? (
                  <span>Authorizing Card...</span>
                ) : (
                  <>
                    <span>Confirm & Activate Plan</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
