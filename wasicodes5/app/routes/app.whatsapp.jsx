import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { json } from '@remix-run/node';
import { authenticate } from '../shopify.server';
import { 
  MessageSquare, 
  Send, 
  CheckCircle, 
} from 'lucide-react';

export const loader = async ({ request }) => {
  try {
    if (authenticate?.admin) await authenticate.admin(request);
  } catch (err) {
    if (err instanceof Response) throw err;
  }
  return json({ ok: true });
};

export const action = async ({ request }) => {
  const formData = await request.formData();
  return json({ status: 'updated' });
};

export default function WhatsAppRoute() {
const appContext = useApp() || {};
const configData = appContext.whatsappConfig || appContext.whatsAppConfig || { mode: 'DIRECT_LINK', businessNumber: '', template: '' };
const { 
  whatsappConfig = configData,
  whatsAppConfig = configData,
  updateWhatsAppConfig = () => {}, 
  settings = { currencySymbol: 'Rs.' }, 
  showToast = () => {} 
} = appContext;
  const [testPhoneNumber, setTestPhoneNumber] = useState('03001234567');
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testSuccess, setTestSuccess] = useState(false);

  const handleCopyTag = (tag) => {
    navigator.clipboard.writeText(tag);
    showToast('Copied Tag', `${tag} copied to clipboard.`);
  };

  const handleSendTestMessage = () => {
    setIsSendingTest(true);
    setTimeout(() => {
      setIsSendingTest(false);
      setTestSuccess(true);
      showToast('WhatsApp Test Sent', `Verification test dispatched to ${testPhoneNumber}`);
      setTimeout(() => setTestSuccess(false), 4000);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white border border-[#e1e3e5] rounded-xl p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-700" />
            <h1 className="text-lg font-bold text-[#202223]">Hybrid WhatsApp Verification & Automation</h1>
          </div>
          <p className="text-xs text-[#6d7175] mt-1">
            Reduce COD cancellations by 50% with automated 1-click WhatsApp order confirmation.
          </p>
        </div>

        {/* Mode Selector Toggle */}
        <div className="bg-slate-100 p-1 rounded-xl flex text-xs font-bold">
          <button
            onClick={() => updateWhatsAppConfig({ mode: 'DIRECT_LINK' })}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
         (whatsappConfig?.mode || 'DIRECT_LINK') === 'DIRECT_LINK'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Option A: Free Direct Link (wa.me)
          </button>
          <button
            onClick={() => updateWhatsAppConfig({ mode: 'OFFICIAL_META_API' })}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              whatsAppConfig.mode === 'OFFICIAL_META_API'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Option B: Meta Cloud API (Official)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Config Panel (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* OPTION A: FREE DIRECT LINK */}
          {(whatsappConfig?.mode || 'DIRECT_LINK') === 'DIRECT_LINK' && (
            <div className="bg-white border border-[#e1e3e5] rounded-xl p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      100% FREE • ZERO SETUP COST
                    </span>
                  </div>
                  <h2 className="text-sm font-bold text-[#202223] mt-1">Free Click-to-Chat WhatsApp Verification</h2>
                  <p className="text-xs text-[#6d7175]">
                    Opens customer WhatsApp with pre-filled order confirmation template via wa.me link.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Store Official WhatsApp Business Number
                </label>
                <input
                  type="text"
                  value={whatsAppConfig.directLinkPhoneNumber}
                  onChange={(e) => updateWhatsAppConfig({ directLinkPhoneNumber: e.target.value })}
                  placeholder="+923001234567"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                />
                <p className="text-[11px] text-slate-500 mt-1">Include country code (e.g. +92 for Pakistan, +971 for UAE, +966 for KSA)</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-800">
                    Direct Message Template Text
                  </label>
                  <span className="text-[10px] text-slate-400">Supports Markdown *bold*, _italics_</span>
                </div>
                <textarea
                  rows={6}
                  value={whatsAppConfig.directLinkCustomMessage}
                  onChange={(e) => updateWhatsAppConfig({ directLinkCustomMessage: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                />
              </div>

              {/* Placeholders chips */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-bold text-slate-700">Click variable to copy:</div>
                <div className="flex flex-wrap gap-1.5">
                  {['{{customer_name}}', '{{order_id}}', '{{order_total}}', '{{address}}', '{{city}}', '{{confirmation_link}}'].map(token => (
                    <button
                      key={token}
                      onClick={() => handleCopyTag(token)}
                      className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-mono border border-slate-300 transition-colors cursor-pointer"
                    >
                      {token}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* OPTION B: OFFICIAL META CLOUD API */}
          {whatsAppConfig.mode === 'OFFICIAL_META_API' && (
            <div className="bg-white border border-[#e1e3e5] rounded-xl p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                      OFFICIAL META BUSINESS API
                    </span>
                  </div>
                  <h2 className="text-sm font-bold text-[#202223] mt-1">Automated Background WhatsApp Delivery & Buttons</h2>
                  <p className="text-xs text-[#6d7175]">
                    Sends interactive WhatsApp messages with [CONFIRM] and [CANCEL] interactive buttons directly via Meta Cloud API.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Phone Number ID</label>
                  <input
                    type="text"
                    value={whatsAppConfig.metaPhoneNumberId}
                    onChange={(e) => updateWhatsAppConfig({ metaPhoneNumberId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded font-mono text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-800 block mb-1">WABA ID (Business Account)</label>
                  <input
                    type="text"
                    value={whatsAppConfig.metaWabaId}
                    onChange={(e) => updateWhatsAppConfig({ metaWabaId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded font-mono text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-xs text-slate-800 block mb-1">Permanent System User Access Token</label>
                <input
                  type="password"
                  value={whatsAppConfig.metaAccessToken}
                  onChange={(e) => updateWhatsAppConfig({ metaAccessToken: e.target.value })}
                  placeholder="EAAQ..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded font-mono text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Approved Template Name</label>
                  <input
                    type="text"
                    value={whatsAppConfig.metaTemplateName}
                    onChange={(e) => updateWhatsAppConfig({ metaTemplateName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded font-mono text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Language Code</label>
                  <input
                    type="text"
                    value={whatsAppConfig.metaLanguageCode}
                    onChange={(e) => updateWhatsAppConfig({ metaLanguageCode: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded font-mono text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-xs">
                <div className="font-bold text-slate-800">MakCod Webhook Listener URL:</div>
                <div className="font-mono text-[11px] text-emerald-800 bg-white p-2 rounded border border-slate-200 break-all select-all">
                  https://makcod-api.shopifyapp.com/api/webhooks/whatsapp/24ghantyofficial
                </div>
                <p className="text-[10px] text-slate-500">Add this URL to Meta Developer Console to receive automated reply callbacks.</p>
              </div>
            </div>
          )}

          {/* Automation Rules */}
          <div className="bg-white border border-[#e1e3e5] rounded-xl p-5 shadow-2xs space-y-3">
            <h3 className="text-sm font-bold text-[#202223]">WhatsApp Order Automation Rules</h3>
            
            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer">
              <div>
                <div className="font-semibold text-xs text-slate-800">Auto-Send WhatsApp Verification upon Checkout</div>
                <div className="text-[11px] text-slate-500">Trigger message instantly when customer submits MakCod COD form</div>
              </div>
              <input
                type="checkbox"
                checked={whatsAppConfig.autoSendOnNewOrder}
                onChange={(e) => updateWhatsAppConfig({ autoSendOnNewOrder: e.target.checked })}
                className="w-4 h-4 text-emerald-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer">
              <div>
                <div className="font-semibold text-xs text-slate-800">Auto-Tag Shopify Order upon WhatsApp Confirmation</div>
                <div className="text-[11px] text-slate-500">Adds tag #VERIFIED_WHATSAPP so your warehouse team can pack immediately</div>
              </div>
              <input
                type="checkbox"
                checked={whatsAppConfig.autoTagConfirmedOrders}
                onChange={(e) => updateWhatsAppConfig({ autoTagConfirmedOrders: e.target.checked })}
                className="w-4 h-4 text-emerald-600 rounded"
              />
            </label>
          </div>

        </div>

        {/* Right Preview & Test Sandbox (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Simulated WhatsApp Chat UI */}
          <div className="bg-[#0b141a] rounded-2xl overflow-hidden shadow-2xl border border-slate-800 text-white">
            
            {/* WhatsApp Header */}
            <div className="bg-[#1f2c34] p-3.5 flex items-center justify-between border-b border-slate-700">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-xs text-white">
                  RA
                </div>
                <div>
                  <div className="font-bold text-xs">{settings.storeName}</div>
                  <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>Official Business Account</span>
                  </div>
                </div>
              </div>
              <span className="text-[10px] text-slate-400">🔒 End-to-End Encrypted</span>
            </div>

            {/* Chat Body */}
            <div className="p-4 space-y-3 bg-[radial-gradient(#1f2c34_1px,transparent_1px)] bg-[size:12px_12px] min-h-[280px]">
              
              {/* Message Bubble */}
              <div className="bg-[#005c4b] text-slate-100 p-3 rounded-2xl rounded-tl-none max-w-[85%] text-xs shadow-md space-y-2">
                <p className="whitespace-pre-line leading-relaxed font-sans">
                  Assalam-o-Alaikum *Muhammad Usman*! 🛍️{"\n\n"}
                  Thank you for ordering at *Royal Attire*!{"\n\n"}
                  📦 *Order ID:* #10492{"\n"}
                  💰 *Total Amount:* Rs. 4,747 (Cash on Delivery){"\n"}
                  📍 *Delivery Address:* House 42-B, Sector C, Bahria Town, Lahore
                </p>

                {/* Interactive Action Buttons (If Meta mode) */}
                <div className="pt-2 border-t border-emerald-600/40 space-y-1.5">
                  <div className="w-full py-1.5 bg-emerald-800/80 hover:bg-emerald-800 text-center rounded-lg font-bold text-emerald-200 text-[11px] cursor-pointer flex items-center justify-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Confirm Order (Yes, Deliver)</span>
                  </div>
                  <div className="w-full py-1.5 bg-emerald-950/60 hover:bg-emerald-950 text-center rounded-lg font-semibold text-rose-300 text-[11px] cursor-pointer">
                    Cancel Order
                  </div>
                </div>

                <div className="text-[9px] text-emerald-200/70 text-right">
                  15:40 • Delivered ✓✓
                </div>
              </div>

            </div>

            {/* Test Send Box */}
            <div className="p-3 bg-[#1f2c34] border-t border-slate-700 space-y-2">
              <div className="text-[11px] font-bold text-slate-300">Test Send to Phone:</div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={testPhoneNumber}
                  onChange={(e) => setTestPhoneNumber(e.target.value)}
                  placeholder="0300-1234567"
                  className="flex-1 px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <button
                  onClick={handleSendTestMessage}
                  disabled={isSendingTest}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Send className="w-3 h-3" />
                  <span>{isSendingTest ? 'Sending...' : 'Test Send'}</span>
                </button>
              </div>
              {testSuccess && (
                <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Simulated test delivered successfully!</span>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
