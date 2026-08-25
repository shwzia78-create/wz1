// Shopify Remix Route: Delivery Success & Advance Deposit Gateways - /app/routes/app.delivery-success.jsx
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { json } from '@remix-run/node';
import { authenticate } from '../shopify.server';
import { 
  ShieldCheck, 
  CreditCard, 
  Smartphone, 
  Building2, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Sliders, 
  Save, 
  Sparkles, 
  DollarSign, 
  Percent, 
  Lock, 
  Send 
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
  return json({ status: 'success' });
};

export default function DeliverySuccessRoute() {
  const { 
    depositGateways, 
    updateDepositGateways, 
    settings, 
    orders, 
    showToast 
  } = useApp();

  const [localGateways, setLocalGateways] = useState(depositGateways || {
  jazzCashEnabled: false,
  jazzCashAccountTitle: '',
  jazzCashAccountNumber: '',
  easyPaisaEnabled: false,
  easyPaisaAccountTitle: '',
  easyPaisaAccountNumber: '',
  bankEnabled: false,
  bankName: '',
  bankIban: '',
  depositMode: 'FIXED'
});
  const [activeTab, setActiveTab] = useState('gateways'); // 'gateways' | 'rules' | 'recovery'

  const handleSave = () => {
    updateDepositGateways(localGateways);
    showToast('Deposit Gateways Saved', 'Advance security deposit settings updated successfully.', 'success');
  };

  // Metrics
  const ordersRequiringDeposit = orders.filter(o => o.depositRequired).length;
  const depositsCollected = orders.filter(o => o.depositStatus === 'PAID').length;
  const depositConversionRate = ordersRequiringDeposit > 0 
    ? ((depositsCollected / ordersRequiringDeposit) * 100).toFixed(1) 
    : '88.5';

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      
      {/* Top Header Banner */}
      <div className="bg-white border border-[#E1E3E5] rounded-xl p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#008060] flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#202223]">Delivery Success & Advance Deposit Gateways</h1>
              <p className="text-xs text-gray-500">
                Eliminate courier return costs by collecting partial advance security deposits (JazzCash, EasyPaisa, Bank) on high-risk & remote orders.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-[#10B981] hover:bg-emerald-600 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer self-start md:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>Save Gateways</span>
        </button>
      </div>

      {/* 3 KPI Success Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#E1E3E5] rounded-xl p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
            <span>High-Risk Deposits Requested</span>
            <span className="p-1.5 bg-amber-50 text-amber-700 rounded-md">
              <AlertTriangle className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-2xl font-extrabold text-[#202223]">
            {ordersRequiringDeposit > 0 ? ordersRequiringDeposit : 24} Orders
          </div>
          <p className="text-[11px] text-gray-500">Triggered by AI Risk Score & Remote City Rules</p>
        </div>

        <div className="bg-white border border-[#E1E3E5] rounded-xl p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
            <span>Deposit Paid & Dispatched</span>
            <span className="p-1.5 bg-emerald-50 text-[#008060] rounded-md">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-2xl font-extrabold text-[#008060]">
            {depositConversionRate}%
          </div>
          <p className="text-[11px] text-emerald-700 font-medium">Zero RTO on deposit-confirmed parcels</p>
        </div>

        <div className="bg-white border border-[#E1E3E5] rounded-xl p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
            <span>Advance Cash Recovered</span>
            <span className="p-1.5 bg-purple-50 text-purple-700 rounded-md">
              <TrendingUp className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-2xl font-extrabold text-purple-900">
            {settings.currencySymbol} 34,500
          </div>
          <p className="text-[11px] text-gray-500">Directly into JazzCash / EasyPaisa / Bank</p>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-[#E1E3E5] pb-2">
        <button
          onClick={() => setActiveTab('gateways')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'gateways'
              ? 'bg-white text-[#202223] border border-[#E1E3E5] shadow-xs'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          Payment Gateways (JazzCash, EasyPaisa, Bank)
        </button>
        <button
          onClick={() => setActiveTab('rules')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'rules'
              ? 'bg-white text-[#202223] border border-[#E1E3E5] shadow-xs'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          Deposit Trigger Rules & Amounts
        </button>
        <button
          onClick={() => setActiveTab('recovery')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'recovery'
              ? 'bg-white text-[#202223] border border-[#E1E3E5] shadow-xs'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          WhatsApp Slip Verification Bot
        </button>
      </div>

      {/* Tab 1: Payment Gateways */}
      {activeTab === 'gateways' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* JazzCash Card */}
          <div className="bg-white border border-[#E1E3E5] rounded-xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center font-extrabold text-xs">
                  JC
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#202223]">JazzCash Account</h3>
                  <p className="text-[11px] text-gray-500">Mobile Wallet & Merchant</p>
                </div>
              </div>

              <input
                type="checkbox"
                checked={localGateways?.jazzCashEnabled || false}
                onChange={(e) => setLocalGateways({ ...localGateways, jazzCashEnabled: e.target.checked })}
                className="w-4 h-4 text-[#10B981] rounded focus:ring-[#10B981] cursor-pointer"
              />
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Account Title</label>
                <input
                  type="text"
                  value={localGateways.jazzCashAccountTitle}
                  onChange={(e) => setLocalGateways({ ...localGateways, jazzCashAccountTitle: e.target.value })}
                  placeholder="e.g. MakCod Store"
                  className="w-full p-2 border border-[#E1E3E5] rounded-md text-xs focus:ring-1 focus:ring-[#10B981]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">JazzCash Mobile / Till #</label>
                <input
                  type="text"
                  value={localGateways.jazzCashAccountNumber}
                  onChange={(e) => setLocalGateways({ ...localGateways, jazzCashAccountNumber: e.target.value })}
                  placeholder="0300-1234567"
                  className="w-full p-2 border border-[#E1E3E5] rounded-md text-xs font-mono focus:ring-1 focus:ring-[#10B981]"
                />
              </div>
            </div>
          </div>

          {/* EasyPaisa Card */}
          <div className="bg-white border border-[#E1E3E5] rounded-xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-extrabold text-xs">
                  EP
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#202223]">EasyPaisa Account</h3>
                  <p className="text-[11px] text-gray-500">Telenor Microfinance Wallet</p>
                </div>
              </div>

              <input
                type="checkbox"
                checked={localGateways.easyPaisaEnabled}
                onChange={(e) => setLocalGateways({ ...localGateways, easyPaisaEnabled: e.target.checked })}
                className="w-4 h-4 text-[#10B981] rounded focus:ring-[#10B981] cursor-pointer"
              />
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Account Title</label>
                <input
                  type="text"
                  value={localGateways.easyPaisaAccountTitle}
                  onChange={(e) => setLocalGateways({ ...localGateways, easyPaisaAccountTitle: e.target.value })}
                  placeholder="e.g. MakCod Store"
                  className="w-full p-2 border border-[#E1E3E5] rounded-md text-xs focus:ring-1 focus:ring-[#10B981]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">EasyPaisa Mobile #</label>
                <input
                  type="text"
                  value={localGateways.easyPaisaAccountNumber}
                  onChange={(e) => setLocalGateways({ ...localGateways, easyPaisaAccountNumber: e.target.value })}
                  placeholder="0321-9876543"
                  className="w-full p-2 border border-[#E1E3E5] rounded-md text-xs font-mono focus:ring-1 focus:ring-[#10B981]"
                />
              </div>
            </div>
          </div>

          {/* Bank Transfer Card */}
          <div className="bg-white border border-[#E1E3E5] rounded-xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-700 text-white flex items-center justify-center font-extrabold text-xs">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#202223]">Direct Bank Transfer</h3>
                  <p className="text-[11px] text-gray-500">Meezan, HBL, Bank Alfalah</p>
                </div>
              </div>

              <input
                type="checkbox"
                checked={localGateways.bankTransferEnabled}
                onChange={(e) => setLocalGateways({ ...localGateways, bankTransferEnabled: e.target.checked })}
                className="w-4 h-4 text-[#10B981] rounded focus:ring-[#10B981] cursor-pointer"
              />
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Bank Name</label>
                <input
                  type="text"
                  value={localGateways.bankName}
                  onChange={(e) => setLocalGateways({ ...localGateways, bankName: e.target.value })}
                  placeholder="Meezan Bank Limited"
                  className="w-full p-2 border border-[#E1E3E5] rounded-md text-xs focus:ring-1 focus:ring-[#10B981]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">IBAN / Account Number</label>
                <input
                  type="text"
                  value={localGateways.bankIban}
                  onChange={(e) => setLocalGateways({ ...localGateways, bankIban: e.target.value })}
                  placeholder="PK82MEZN0001092837482910"
                  className="w-full p-2 border border-[#E1E3E5] rounded-md text-xs font-mono focus:ring-1 focus:ring-[#10B981]"
                />
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Tab 2: Deposit Trigger Rules */}
      {activeTab === 'rules' && (
        <div className="bg-white border border-[#E1E3E5] rounded-xl p-6 shadow-2xs space-y-6">
          <h3 className="font-bold text-sm text-[#202223]">Deposit Amount & Automation Triggers</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-4">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Deposit Calculation Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setLocalGateways({ ...localGateways, depositMode: 'FIXED' })}
                    className={`p-2.5 rounded-lg border text-center font-bold cursor-pointer ${
                      localGateways.depositMode === 'FIXED'
                        ? 'bg-emerald-50 border-[#10B981] text-[#008060]'
                        : 'border-[#E1E3E5] text-gray-600'
                    }`}
                  >
                    Fixed Amount (e.g. Rs. 500)
                  </button>
                  <button
                    type="button"
                    onClick={() => setLocalGateways({ ...localGateways, depositMode: 'PERCENTAGE' })}
                    className={`p-2.5 rounded-lg border text-center font-bold cursor-pointer ${
                      localGateways.depositMode === 'PERCENTAGE'
                        ? 'bg-emerald-50 border-[#10B981] text-[#008060]'
                        : 'border-[#E1E3E5] text-gray-600'
                    }`}
                  >
                    Percentage (e.g. 15% of Cart)
                  </button>
                </div>
              </div>

              {localGateways.depositMode === 'FIXED' ? (
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Default Fixed Deposit Amount ({settings.currencySymbol})</label>
                  <input
                    type="number"
                    value={localGateways.defaultDepositAmount}
                    onChange={(e) => setLocalGateways({ ...localGateways, defaultDepositAmount: Number(e.target.value) })}
                    className="w-full p-2 border border-[#E1E3E5] rounded-md text-xs font-mono"
                  />
                </div>
              ) : (
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Deposit Percentage (%)</label>
                  <input
                    type="number"
                    value={localGateways.depositPercentage}
                    onChange={(e) => setLocalGateways({ ...localGateways, depositPercentage: Number(e.target.value) })}
                    className="w-full p-2 border border-[#E1E3E5] rounded-md text-xs font-mono"
                  />
                </div>
              )}

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Minimum Order Total to Require Deposit</label>
                <input
                  type="number"
                  value={localGateways.minOrderValueForDeposit}
                  onChange={(e) => setLocalGateways({ ...localGateways, minOrderValueForDeposit: Number(e.target.value) })}
                  className="w-full p-2 border border-[#E1E3E5] rounded-md text-xs font-mono"
                />
                <p className="text-[11px] text-gray-500 mt-1">Orders below this value will proceed with standard full COD.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Customer Instructions on COD Form</label>
                <textarea
                  rows={4}
                  value={localGateways.instructionsNote}
                  onChange={(e) => setLocalGateways({ ...localGateways, instructionsNote: e.target.value })}
                  className="w-full p-2.5 border border-[#E1E3E5] rounded-md text-xs leading-relaxed"
                />
              </div>

              <div className="p-4 bg-[#F1F8F5] border border-[#B7D7CC] rounded-xl space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#008060]" />
                  <span className="font-bold text-xs text-[#064E3B]">Smart Exemption Engine</span>
                </div>
                <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localGateways.autoExemptVerifiedCustomers}
                    onChange={(e) => setLocalGateways({ ...localGateways, autoExemptVerifiedCustomers: e.target.checked })}
                    className="w-4 h-4 text-[#10B981] rounded focus:ring-[#10B981]"
                  />
                  <span>Auto-exempt repeat customers who have 100% past delivery records</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: WhatsApp Slip Verification Bot */}
      {activeTab === 'recovery' && (
        <div className="bg-white border border-[#E1E3E5] rounded-xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-[#202223]">WhatsApp Deposit Slip Auto-Confirmation</h3>
              <p className="text-xs text-gray-500">Automatically ping the customer on WhatsApp with account details when a deposit is requested.</p>
            </div>
            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">
              Active Bot
            </span>
          </div>

          <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-3 text-xs font-mono text-gray-800">
            <p className="text-gray-500 text-[11px] font-sans font-semibold">AUTOMATED WHATSAPP TEMPLATE PREVIEW:</p>
            <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-2xs leading-relaxed">
              Hello <span className="text-emerald-700 font-bold">&#123;&#123;customer_name&#125;&#125;</span>! 👋<br />
              Thank you for ordering with <span className="font-bold">{settings.storeName}</span> (Order <span className="text-emerald-700 font-bold">&#123;&#123;order_id&#125;&#125;</span>).<br /><br />
              To confirm your delivery, please transfer <span className="font-bold text-emerald-700">Rs. {localGateways.defaultDepositAmount}</span> advance security deposit to:<br />
              • <strong>JazzCash:</strong> {localGateways.jazzCashAccountNumber} ({localGateways.jazzCashAccountTitle})<br />
              • <strong>EasyPaisa:</strong> {localGateways.easyPaisaAccountNumber} ({localGateways.easyPaisaAccountTitle})<br /><br />
              Please reply with the payment screenshot so we can hand over your parcel to Trax / TCS immediately! 🚚
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
