import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  ShoppingBag, 
  Sparkles, 
  ShieldCheck, 
  Timer, 
  Check, 
  Plus, 
  Minus, 
  Globe, 
  Smartphone, 
  Monitor
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const LiveFormPreviewModal = () => {
  const { 
    isFormPreviewOpen, 
    setIsFormPreviewOpen, 
    formConfig, 
    upsells, 
    settings, 
    addOrder 
  } = useApp();

  const [deviceView, setDeviceView] = useState('desktop');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  
  // Simulated form inputs
  const [fullName, setFullName] = useState('Hamza Tariq');
  const [phone, setPhone] = useState('0300-1234567');
  const [city, setCity] = useState('Lahore');
  const [address, setAddress] = useState('House # 42-B, Sector C, Bahria Town');
  const [landmark, setLandmark] = useState('Near Safari Park Gate');
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant] = useState('Size L / Navy Blue');
  const [selectedUpsells, setSelectedUpsells] = useState(['up-2']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  if (!isFormPreviewOpen) return null;

  const basePrice = 3499;
  const activeUpsellsList = upsells.filter(u => u.enabled && selectedUpsells.includes(u.id));
  const upsellsTotal = activeUpsellsList.reduce((acc, u) => acc + u.price, 0);
  const subtotal = (basePrice * quantity) + upsellsTotal;
  const shippingFee = subtotal >= 4000 ? 0 : 150;
  const codFee = 99;
  const grandTotal = subtotal + shippingFee + codFee;

  const toggleUpsellItem = (id) => {
    setSelectedUpsells(prev => 
      prev.includes(id) ? prev.filter(u => u !== id) : [...prev, id]
    );
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setOrderSuccess(true);

      try {
        if (typeof window !== 'undefined' && confetti) {
          confetti({
            particleCount: 80,
            spread: 80,
            origin: { y: 0.5 },
            colors: ['#008060', '#108043', '#34d399']
          });
        }
      } catch (err) {
        // safe fallback
      }

      addOrder({
        customerName: fullName,
        phone: phone,
        city: city,
        address: `${address} (${landmark || 'No landmark'})`,
        subtotal: subtotal,
        shippingFee: shippingFee,
        codFee: codFee,
        total: grandTotal,
        items: [
          {
            id: 'it-live-1',
            title: 'Premium Egyptian Cotton Kurta',
            variant: selectedVariant,
            price: basePrice,
            quantity: quantity,
            image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=120&auto=format&fit=crop&q=80',
          },
          ...activeUpsellsList.map(u => ({
            id: u.id,
            title: u.title,
            variant: 'Addon Upgrade',
            price: u.price,
            quantity: 1,
            image: u.image,
          }))
        ],
        source: 'MakCod Quick Form',
      });

      setTimeout(() => {
        setOrderSuccess(false);
        setIsFormPreviewOpen(false);
      }, 2500);

    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4">
      <div className="bg-slate-900 text-white rounded-2xl w-full max-w-4xl max-h-[96vh] overflow-hidden flex flex-col shadow-2xl border border-slate-700">
        
        {/* Top Control Bar */}
        <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-slate-800 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>MakCod Live Storefront Simulator</span>
            </div>
            
            {/* Device Switcher */}
            <div className="hidden sm:flex items-center bg-slate-800 p-0.5 rounded-lg text-xs">
              <button
                onClick={() => setDeviceView('desktop')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
                  deviceView === 'desktop' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Desktop (1200px)</span>
              </button>
              <button
                onClick={() => setDeviceView('mobile')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
                  deviceView === 'mobile' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile (390px)</span>
              </button>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center bg-slate-800 px-2 py-1 rounded-lg text-xs">
              <Globe className="w-3.5 h-3.5 text-slate-400 mr-1.5" />
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                aria-label="Form language selector"
                className="bg-transparent text-slate-300 font-medium focus:outline-none cursor-pointer text-xs"
              >
                <option value="en" className="bg-slate-800 text-white">English (Default)</option>
                <option value="ur" className="bg-slate-800 text-white">Urdu (اردو)</option>
                <option value="ar" className="bg-slate-800 text-white">Arabic (العربية)</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => setIsFormPreviewOpen(false)}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Storefront Stage */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center items-start bg-slate-800/60">
          
          <div 
            dir={selectedLanguage === 'ur' || selectedLanguage === 'ar' ? 'rtl' : 'ltr'}
            className={`bg-white text-[#202223] rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
              deviceView === 'mobile' ? 'w-full max-w-[390px]' : 'w-full max-w-[580px]'
            }`}
          >
            
            {/* Form Header */}
            <div 
              style={{ backgroundColor: formConfig.headerBgColor || '#047857' }}
              className="p-4 sm:p-5 text-white text-center relative"
            >
              <h2 className="text-lg sm:text-xl font-bold tracking-tight">
                {selectedLanguage === 'ur' ? 'کیش آن ڈیلیوری آرڈر فارم' :
                 selectedLanguage === 'ar' ? 'نموذج الدفع عند الاستلام السريع' :
                 formConfig.popupTitle}
              </h2>
              <p className="text-xs text-emerald-100 mt-1 opacity-90">
                {selectedLanguage === 'ur' ? 'صرف 15 سیکنڈ میں آرڈر مکمل کریں۔ کوئی کارڈ درکار نہیں۔' :
                 selectedLanguage === 'ar' ? 'أكمل طلبك في 15 ثانية فقط. لا يلزم وجود بطاقة.' :
                 formConfig.popupSubtitle}
              </p>
            </div>

            {/* Demand / Scarcity Countdown Timer */}
            {formConfig.showTimer && (
              <div className="bg-amber-50 border-b border-amber-200 py-2 px-4 flex items-center justify-center gap-2 text-xs font-semibold text-amber-900">
                <Timer className="w-4 h-4 text-amber-600 animate-pulse" />
                <span>{formConfig.timerText}</span>
                <span className="bg-amber-200 text-amber-950 px-2 py-0.5 rounded font-mono font-bold">
                  13:42
                </span>
              </div>
            )}

            {/* Product Summary in Form */}
            <div className="p-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=120&auto=format&fit=crop&q=80"
                  alt="Product"
                  className="w-12 h-12 object-cover rounded-lg border border-slate-200"
                />
                <div>
                  <h3 className="font-bold text-xs sm:text-sm text-slate-900">
                    Premium Egyptian Cotton Kurta - Navy Blue
                  </h3>
                  <div className="text-xs text-slate-500 font-medium">
                    {settings.currencySymbol} {basePrice.toLocaleString()} • In Stock
                  </div>
                </div>
              </div>

              {/* Quantity Selector */}
              {formConfig.showQuantitySelector && (
                <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden text-xs">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-2 py-1 hover:bg-slate-100 text-slate-600"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="px-2.5 font-bold text-slate-800">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-2 py-1 hover:bg-slate-100 text-slate-600"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmitOrder} className="p-4 sm:p-6 space-y-4">
              
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  {selectedLanguage === 'ur' ? 'مکمل نام *' : selectedLanguage === 'ar' ? 'الاسم الكامل *' : 'Full Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Muhammad Usman"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Phone Number with WhatsApp badge */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-800">
                    {selectedLanguage === 'ur' ? 'واٹس ایپ / موبائل نمبر *' : selectedLanguage === 'ar' ? 'رقم الواتساب / الجوال *' : 'WhatsApp / Mobile Number *'}
                  </label>
                  <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded">
                    📱 OTP Verification Ready
                  </span>
                </div>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0300-1234567"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                />
              </div>

              {/* City Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  {selectedLanguage === 'ur' ? 'شہر منتخب کریں *' : selectedLanguage === 'ar' ? 'اختر المدينة *' : 'Delivery City *'}
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
                >
                  <option value="Lahore">Lahore (Fast 24h Delivery - Trax)</option>
                  <option value="Karachi">Karachi (2-3 Days - Leopards)</option>
                  <option value="Islamabad">Islamabad (1-2 Days - PostEx)</option>
                  <option value="Rawalpindi">Rawalpindi</option>
                  <option value="Faisalabad">Faisalabad</option>
                  <option value="Multan">Multan</option>
                  <option value="Peshawar">Peshawar (Deposit Rs. 500)</option>
                  <option value="Sialkot">Sialkot</option>
                  <option value="Dubai">Dubai, UAE</option>
                  <option value="Riyadh">Riyadh, KSA</option>
                </select>
              </div>

              {/* Complete Address */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  {selectedLanguage === 'ur' ? 'مکمل پتہ (گھر، گلی، علاقہ) *' : selectedLanguage === 'ar' ? 'العنوان بالتفصيل *' : 'Complete Delivery Address *'}
                </label>
                <textarea
                  rows={2}
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House # 42-B, Street 5, Sector C..."
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Dynamic Upsells & BOGO Selector */}
              {upsells.filter(u => u.enabled).length > 0 && (
                <div className="pt-2">
                  <div className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Special 1-Click Checkout Upgrades:</span>
                  </div>

                  <div className="space-y-2">
                    {upsells.filter(u => u.enabled).map(upsell => {
                      const isSelected = selectedUpsells.includes(upsell.id);
                      return (
                        <div
                          key={upsell.id}
                          onClick={() => toggleUpsellItem(upsell.id)}
                          className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                            isSelected
                              ? 'bg-emerald-50/70 border-emerald-500 ring-1 ring-emerald-500'
                              : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                              isSelected ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                            }`}>
                              {isSelected && <Check className="w-3 h-3" />}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-xs text-slate-900">{upsell.title}</span>
                                {upsell.badge && (
                                   <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800">
                                    {upsell.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-500 mt-0.5">{upsell.subtitle}</p>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="font-bold text-xs text-emerald-800">
                              + {settings.currencySymbol} {upsell.price}
                            </div>
                            <div className="text-[10px] text-slate-400 line-through">
                              {settings.currencySymbol} {upsell.originalPrice}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Order Financial Calculation Box */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal ({quantity} item + {activeUpsellsList.length} addons):</span>
                  <span>{settings.currencySymbol} {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Express Shipping:</span>
                  <span>{shippingFee === 0 ? <strong className="text-emerald-700">FREE</strong> : `${settings.currencySymbol} ${shippingFee}`}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Doorstep COD Fee:</span>
                  <span>{settings.currencySymbol} {codFee}</span>
                </div>
                <div className="flex justify-between font-extrabold text-slate-900 text-sm pt-2 border-t border-slate-200">
                  <span>Total Amount (Pay at Doorstep):</span>
                  <span className="text-emerald-800">{settings.currencySymbol} {grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Submit 1-Click COD Button */}
              <button
                type="submit"
                disabled={isSubmitting || orderSuccess}
                style={{ 
                  backgroundColor: formConfig.buttonColor || '#008060',
                  color: formConfig.buttonTextColor || '#ffffff'
                }}
                className="w-full py-4 px-6 rounded-xl font-bold text-sm sm:text-base shadow-lg hover:brightness-105 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {orderSuccess ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Order Placed Successfully! 🚚</span>
                  </>
                ) : isSubmitting ? (
                  <span>Securing COD Order...</span>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    <span>{formConfig.buttonText || 'Complete Order (Cash on Delivery)'}</span>
                  </>
                )}
              </button>

              {/* Trust Badge */}
              <div className="text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5 pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{formConfig.trustBadgeText}</span>
              </div>

            </form>

          </div>

        </div>

      </div>
    </div>
  );
};
