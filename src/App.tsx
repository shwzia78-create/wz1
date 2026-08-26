import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Layers, 
  ShoppingBag, 
  Zap, 
  Settings, 
  Code2, 
  Smartphone, 
  ToggleRight, 
  Sparkles,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Clock,
  ArrowRight
} from 'lucide-react';

export default function App() {
  const [embedEnabled, setEmbedEnabled] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [qty, setQty] = useState(1);
  const [addon, setAddon] = useState(true);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Muhammad Ali',
    phone: '0300 1234567',
    city: 'Lahore',
    address: 'House 42-B, Sector C, Bahria Town'
  });

  const basePrice = 3499;
  const addonPrice = 99;
  const subtotal = basePrice * qty;
  const total = subtotal + (addon ? addonPrice : 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderPlaced(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-emerald-900/40">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white tracking-tight">Codify COD</h1>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs px-2 py-0.5 rounded-full font-medium">
                  App Embed Ready
                </span>
              </div>
              <p className="text-xs text-slate-400">Shopify 1-Click Cash on Delivery Engine</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a 
              href="#setup-steps" 
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 transition"
            >
              <span>App Embed Guide</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        
        {/* Solution Alert Banner for the User */}
        <div className="bg-emerald-950/50 border border-emerald-600/40 rounded-2xl p-5 shadow-xl">
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-emerald-600 text-white rounded-xl flex-shrink-0 mt-0.5">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="space-y-2 flex-1">
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Codify App Embed Block created: <code className="bg-emerald-900/80 px-2 py-0.5 rounded text-emerald-200 text-sm">blocks/codify_app_embed.liquid</code></span>
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Shopify me <strong>App Embeds</strong> tab me show hone ke liye block me <code className="text-emerald-400 bg-slate-900 px-1.5 py-0.5 rounded">"target": "body"</code> hona lazmi hota hai (jese EasySell aur Bundlex me hota hai). Humne aapke project me <strong>App Embed</strong> aur <strong>Section Block</strong> dono add kar diye hain.
              </p>
            </div>
          </div>
        </div>

        {/* 2-Column Grid: Comparison & Setup Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: How to activate in Theme Customizer */}
          <div id="setup-steps" className="lg:col-span-6 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
                <Layers className="w-5 h-5 text-emerald-400" />
                Shopify Theme Customizer me kaise show hoga?
              </h3>

              <div className="space-y-4">
                {/* Step 1 */}
                <div className="flex gap-3.5 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">1</div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200">Terminal me Extension deploy / push karein</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      VS Code me <code className="bg-slate-800 px-1.5 py-0.5 rounded text-emerald-300">shopify app dev</code> run karein ya theme extension ko deploy karein:
                    </p>
                    <div className="bg-slate-900 rounded-md p-2 mt-2 font-mono text-xs text-emerald-400 border border-slate-800">
                      shopify app deploy
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-3.5 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">2</div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200">App embeds tab open karein</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Shopify Theme Customizer me left sidebar par <strong>App embeds (3rd icon)</strong> par click karein. Wahan <strong>Codify COD Form</strong> toggle switch ke sath show ho jayega.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-3.5 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">3</div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200">Toggle ON karke Save dabayein</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Codify ko switch ON karein aur top right se <strong>Save</strong> button press karein. Har product page par automatic COD button aur mobile sticky bar load ho jayega!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Blocks Structure Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
                <Code2 className="w-4 h-4 text-emerald-400" />
                Extension Files & Roles
              </h3>

              <div className="divide-y divide-slate-800 text-xs">
                <div className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-200">codify_app_embed.liquid</span>
                    <span className="block text-slate-400 text-[11px]">target: "body"</span>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded font-medium">
                    App Embeds Tab
                  </span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-200">codify_form.liquid</span>
                    <span className="block text-slate-400 text-[11px]">target: "section"</span>
                  </div>
                  <span className="px-2 py-0.5 bg-blue-950 text-blue-400 border border-blue-800 rounded font-medium">
                    Product Page Block
                  </span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-200">api.create-cod-order.jsx</span>
                    <span className="block text-slate-400 text-[11px]">/api/create-cod-order</span>
                  </div>
                  <span className="px-2 py-0.5 bg-purple-950 text-purple-400 border border-purple-800 rounded font-medium">
                    Shopify Admin Order API
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Interactive Demo */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-emerald-400" />
                    Live Storefront Preview
                  </h3>
                  <p className="text-xs text-slate-400">Customer ko product page par kesa dikhega</p>
                </div>

                {/* Embed Toggle Simulation */}
                <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                  <span className="text-xs font-medium text-slate-300">App Embed:</span>
                  <button 
                    onClick={() => setEmbedEnabled(!embedEnabled)}
                    className={`text-xs font-bold px-2 py-0.5 rounded transition ${embedEnabled ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-400'}`}
                  >
                    {embedEnabled ? 'ENABLED (ON)' : 'DISABLED (OFF)'}
                  </button>
                </div>
              </div>

              {/* Mock Product Card */}
              <div className="mt-5 bg-white text-slate-900 rounded-xl p-5 shadow-inner">
                <div className="flex gap-4 items-center">
                  <div className="w-20 h-20 bg-slate-100 rounded-lg flex items-center justify-center text-3xl border border-slate-200">
                    ⌚
                  </div>
                  <div>
                    <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">In Stock</span>
                    <h4 className="font-bold text-base text-slate-900 leading-snug">Smart Ultra Watch 2 - Midnight Black</h4>
                    <div className="text-lg font-extrabold text-slate-900 mt-1">Rs. 3,499</div>
                  </div>
                </div>

                {/* Standard Buttons */}
                <div className="mt-5 space-y-2.5">
                  <button className="w-full py-3 bg-slate-900 text-white font-semibold rounded-lg text-sm cursor-not-allowed opacity-90">
                    Add to Cart
                  </button>
                  <button className="w-full py-3 bg-slate-200 text-slate-800 font-semibold rounded-lg text-sm cursor-not-allowed">
                    Buy with Standard Checkout
                  </button>

                  {/* Codify Injected Button (Only if embed is ON) */}
                  {embedEnabled ? (
                    <div className="pt-2">
                      <button 
                        onClick={() => { setShowModal(true); setOrderPlaced(false); }}
                        className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition transform hover:-translate-y-0.5 animate-pulse"
                      >
                        <Zap className="w-4 h-4 fill-white" />
                        <span>Order Cash on Delivery (COD) - 1 Click</span>
                      </button>
                      <p className="text-[11px] text-center text-slate-500 font-medium mt-1.5">
                        ⚡ Quick 15-second checkout • Pay cash at doorstep
                      </p>
                    </div>
                  ) : (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 text-center font-medium mt-2">
                      Codify App Embed is turned OFF. Enable it to show the 1-Click COD button.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>

      </main>

      {/* 1-Click COD Modal Simulation */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="bg-emerald-600 text-white p-5 text-center relative flex-shrink-0">
              <button 
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-lg transition"
              >
                &times;
              </button>
              <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-1 text-lg">
                📦
              </div>
              <h3 className="font-extrabold text-lg tracking-tight">Cash on Delivery Quick Checkout</h3>
              <p className="text-xs text-emerald-100 mt-0.5">Pay with cash when your parcel arrives at your doorstep!</p>
            </div>

            {/* Urgency Bar */}
            <div className="bg-amber-50 border-b border-amber-100 px-4 py-2 flex items-center justify-center gap-2 text-xs font-bold text-amber-800 flex-shrink-0">
              <Clock className="w-3.5 h-3.5" />
              <span>High demand! Cart stock reserved for:</span>
              <span className="bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-mono font-extrabold">14:52</span>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto p-5 space-y-4">
              {!orderPlaced ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Item Summary */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 bg-white rounded-lg border border-slate-200 flex items-center justify-center text-xl">
                        ⌚
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">Smart Ultra Watch 2</div>
                        <div className="text-xs text-slate-500 font-semibold">Rs. {basePrice.toLocaleString()} • <span className="text-emerald-600 font-bold">In Stock</span></div>
                      </div>
                    </div>

                    {/* Stepper */}
                    <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white">
                      <button 
                        type="button" 
                        onClick={() => setQty(Math.max(1, qty - 1))}
                        className="w-7 h-7 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-100"
                      >-</button>
                      <span className="w-7 text-center font-bold text-xs">{qty}</span>
                      <button 
                        type="button" 
                        onClick={() => setQty(qty + 1)}
                        className="w-7 h-7 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-100"
                      >+</button>
                    </div>
                  </div>

                  {/* Form fields */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                    <input 
                      type="text" 
                      required 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number (WhatsApp) *</label>
                    <div className="flex gap-2">
                      <div className="bg-slate-100 border border-slate-300 rounded-lg px-3 flex items-center text-xs font-bold text-slate-600">
                        🇵🇰 +92
                      </div>
                      <input 
                        type="tel" 
                        required 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="flex-1 px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">City *</label>
                      <input 
                        type="text" 
                        required 
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Payment Method</label>
                      <div className="px-3.5 py-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Cash on Delivery</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Delivery Address *</label>
                    <textarea 
                      required 
                      rows={2}
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none font-sans"
                    />
                  </div>

                  {/* Addon Checkbox */}
                  <label className="flex items-start gap-3 p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={addon} 
                      onChange={(e) => setAddon(e.target.checked)}
                      className="mt-0.5 w-4 h-4 accent-emerald-600 rounded"
                    />
                    <div className="text-xs">
                      <strong className="text-emerald-900 block">⚡ Add VIP Priority Inspection & Shipping Guarantee</strong>
                      <span className="text-slate-600">Insured express dispatch for only <strong className="text-emerald-700">Rs. {addonPrice}</strong></span>
                    </div>
                  </label>

                  {/* Calculation summary */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1.5">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal ({qty} item):</span>
                      <span className="font-semibold text-slate-900">Rs. {subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Delivery (COD):</span>
                      <span className="font-bold text-emerald-600">FREE</span>
                    </div>
                    {addon && (
                      <div className="flex justify-between text-slate-600">
                        <span>VIP Guarantee:</span>
                        <span className="font-semibold text-slate-900">Rs. {addonPrice}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-1.5 border-t border-slate-200">
                      <span>Total Payable (COD):</span>
                      <span className="text-emerald-600">Rs. {total.toLocaleString()}</span>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl shadow-lg shadow-emerald-600/30 text-sm flex items-center justify-center gap-2 transition"
                  >
                    <span>✓ Complete Order Cash on Delivery</span>
                  </button>
                </form>
              ) : (
                /* Order Confirmation view */
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl mx-auto">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900">Order Placed Successfully!</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Order <strong className="text-emerald-700">#COD-948210</strong> has been sent to Shopify Admin.
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-left space-y-1.5">
                    <div><strong>Customer:</strong> {formData.name}</div>
                    <div><strong>Phone:</strong> {formData.phone}</div>
                    <div><strong>Delivery City:</strong> {formData.city}</div>
                    <div><strong>Total COD Amount:</strong> Rs. {total.toLocaleString()}</div>
                  </div>

                  <button 
                    onClick={() => { setShowModal(false); setOrderPlaced(false); }}
                    className="w-full py-2.5 bg-slate-900 text-white font-bold rounded-lg text-xs"
                  >
                    Close & Continue
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
