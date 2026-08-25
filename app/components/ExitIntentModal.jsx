import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Sparkles, Timer, Check, ShoppingBag, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export const ExitIntentModal = () => {
  const { isExitIntentOpen, setIsExitIntentOpen, formConfig, addOrder } = useApp();
  
  const exitIntentConfig = formConfig?.exitIntent || {
    enabled: true,
    discountValue: 10,
    couponCode: 'SAVE10COD',
    headline: 'Wait! Don’t Leave Empty Handed!',
    subheadline: 'Claim an instant 10% cash discount on your Cash on Delivery order now!',
    timerSeconds: 180,
  };

  const [timeLeft, setTimeLeft] = useState(exitIntentConfig.timerSeconds || 180);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    if (!isExitIntentOpen) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isExitIntentOpen]);

  if (!isExitIntentOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const handleClaimOffer = () => {
    setApplied(true);
    try {
      if (typeof window !== 'undefined' && confetti) {
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#008060', '#f59e0b', '#10b981']
        });
      }
    } catch (e) {
      // safe fallback
    }

    // Create order with discount
    addOrder({
      customerName: 'Exit-Intent Saved Shopper',
      phone: '0300-9988776',
      city: 'Lahore',
      address: 'House 10, Main Boulevard, Gulberg',
      subtotal: 4500,
      shippingFee: 0,
      codFee: 0,
      discount: 450,
      total: 4050,
      source: 'Exit-Intent Popup',
    });

    setTimeout(() => {
      setIsExitIntentOpen(false);
      setApplied(false);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border-4 border-amber-400 relative">
        
        {/* Close Button */}
        <button
          onClick={() => setIsExitIntentOpen(false)}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 py-3 px-6 text-center text-amber-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-900" />
          <span>Exclusive Last-Chance Offer</span>
          <Sparkles className="w-4 h-4 text-amber-900" />
        </div>

        <div className="p-6 sm:p-8 text-center space-y-4">
          
          {/* Main Headline */}
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
              {exitIntentConfig.headline}
            </h2>
            <p className="text-sm text-slate-600">
              {exitIntentConfig.subheadline}
            </p>
          </div>

          {/* Big Discount Tag */}
          <div className="bg-amber-50 border-2 border-dashed border-amber-400 rounded-2xl p-4 my-3 flex flex-col items-center justify-center">
            <div className="text-xs font-bold text-amber-900 uppercase tracking-widest">
              Coupon Code Auto-Applied:
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-900 font-mono tracking-wider mt-1">
              {exitIntentConfig.couponCode}
            </div>
            <div className="text-xs text-amber-800 font-semibold mt-1">
              🎁 Extra {exitIntentConfig.discountValue}% OFF + FREE Express Delivery
            </div>
          </div>

          {/* Countdown Timer */}
          <div className="flex items-center justify-center gap-2 bg-slate-900 text-white py-2 px-4 rounded-xl text-xs font-mono font-bold w-fit mx-auto">
            <Timer className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>EXPIRES IN:</span>
            <span className="text-amber-400 text-sm">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              onClick={handleClaimOffer}
              disabled={applied}
              className={`w-full py-4 px-6 rounded-2xl text-base font-black shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer ${
                applied 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-emerald-700 hover:bg-emerald-800 text-white hover:shadow-emerald-900/20'
              }`}
            >
              {applied ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>Offer Claimed! Redirecting...</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" />
                  <span>Claim 10% OFF & Order Cash on Delivery</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            <p className="text-[11px] text-slate-400 mt-2">
              🔒 No credit card required. Cash on Delivery available at your doorstep.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};