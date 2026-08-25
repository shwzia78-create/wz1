import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { json } from '@remix-run/node';
import { authenticate } from '../shopify.server';
import { 
  Settings as SettingsIcon, 
  MapPin, 
  CreditCard, 
  Tag, 
  Globe, 
  Layers, 
  Plus, 
  Trash2, 
  Save, 
  CheckCircle, 
  ExternalLink,
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

export default function SettingsRoute() {
  const { 
    settings = { currencySymbol: 'Rs.', storeName: 'Royal Attire' }, 
    updateSettings = () => {}, 
    locationRules = [], 
    addLocationRule = () => {}, 
    deleteLocationRule = () => {}, 
    depositGateways = {}, 
    updateDepositGateways = () => {},
    tagRules = [],
    toggleTagRule = () => {},
    showToast = () => {} 
  } = useApp();

  const [activeTab, setActiveTab] = useState('location');
  
  // New location modal state
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [cityName, setCityName] = useState('');
  const [codFee, setCodFee] = useState(150);
  const [freeCodThreshold, setFreeCodThreshold] = useState(4000);
  const [deliveryDays, setDeliveryDays] = useState('2-3 Business Days');
  const [courierPref, setCourierPref] = useState('Trax');
  const [requiresDeposit, setRequiresDeposit] = useState(false);
  const [depositAmount, setDepositAmount] = useState(500);

  const handleAddLocationRule = (e) => {
    e.preventDefault();
    if (!cityName.trim()) return;

    addLocationRule({
      cityName,
      codEnabled: true,
      codFee: Number(codFee),
      freeCodThreshold: Number(freeCodThreshold),
      estimatedDeliveryDays: deliveryDays,
      courierPreference: courierPref,
      requiresAdvanceDeposit: requiresDeposit,
      depositAmount: Number(depositAmount),
    });

    setIsLocationModalOpen(false);
    setCityName('');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white border border-[#e1e3e5] rounded-xl p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-emerald-700" />
            <h1 className="text-lg font-bold text-[#202223]">Settings, Location Rules & Deposit Gateways</h1>
          </div>
          <p className="text-xs text-[#6d7175] mt-1">
            Configure city-wise COD fees, JazzCash/EasyPaisa advance deposits, automated Shopify tagging, and theme extension status.
          </p>
        </div>

        <button
          onClick={() => showToast('Settings Saved', 'All MakCod rules updated successfully.')}
          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-white p-1 rounded-xl border border-[#e1e3e5] shadow-2xs text-xs font-semibold overflow-x-auto">
        {[
          { id: 'location', label: 'City & Location COD Rules', icon: MapPin },
          { id: 'deposit', label: 'Advance Deposit Gateways (JazzCash/EasyPaisa)', icon: CreditCard },
          { id: 'tags', label: 'Smart Order Tagging Rules', icon: Tag },
          { id: 'theme', label: 'Shopify Theme 2.0 App Embed', icon: Layers },
          { id: 'general', label: 'Multi-Language & Store Info', icon: Globe },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-[#5c5f62] hover:text-[#202223] hover:bg-[#f6f6f7]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: LOCATION RULES */}
      {activeTab === 'location' && (
        <div className="bg-white border border-[#e1e3e5] rounded-xl shadow-2xs overflow-hidden space-y-4">
          
          <div className="p-5 border-b border-[#e1e3e5] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-[#202223]">City & Regional Cash on Delivery Rules</h3>
              <p className="text-xs text-[#6d7175]">
                Customize COD fees, free delivery thresholds, preferred couriers, or enforce advance deposits for high-RTO cities.
              </p>
            </div>

            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center gap-1 self-start sm:self-auto cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add City Rule</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f6f6f7] text-[#5c5f62] uppercase font-semibold border-b border-[#e1e3e5]">
                <tr>
                  <th className="py-3 px-4">City / Region</th>
                  <th className="py-3 px-4">COD Status & Fee</th>
                  <th className="py-3 px-4">Free COD Above</th>
                  <th className="py-3 px-4">Est. Delivery</th>
                  <th className="py-3 px-4">Courier</th>
                  <th className="py-3 px-4">Advance Deposit</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ebebeb] bg-white">
                {locationRules.map(rule => (
                  <tr key={rule.id} className="hover:bg-slate-50">
                    
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {rule.cityName}
                    </td>

                    <td className="py-3.5 px-4">
                      {rule.codEnabled ? (
                        <span className="font-semibold text-emerald-800">
                          Enabled ({settings.currencySymbol} {rule.codFee})
                        </span>
                      ) : (
                        <span className="font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                          Blocked (Prepaid Only)
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 font-mono">
                      {rule.freeCodThreshold ? `${settings.currencySymbol} ${rule.freeCodThreshold.toLocaleString()}` : 'None'}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      {rule.estimatedDeliveryDays}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        {rule.courierPreference}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      {rule.requiresAdvanceDeposit ? (
                        <span className="font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[11px]">
                          Required ({settings.currencySymbol} {rule.depositAmount})
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Not required</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => deleteLocationRule(rule.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* TAB 2: DEPOSIT GATEWAYS */}
      {activeTab === 'deposit' && (
        <div className="space-y-4">
          <div className="bg-white border border-[#e1e3e5] rounded-xl p-5 shadow-2xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-[#202223]">Partial Advance Security Deposit Gateways</h3>
              <p className="text-xs text-[#6d7175]">
                Require shoppers with high risk scores or from remote delivery zones to send a partial advance deposit (e.g. Rs. 500) via JazzCash or EasyPaisa.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              
              {/* JazzCash */}
              <div className="p-4 bg-red-50/50 border border-red-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-red-700 text-sm">JazzCash</span>
                    <span className="text-[10px] bg-red-100 text-red-900 font-bold px-1.5 py-0.2 rounded">Direct Wallet</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={depositGateways.jazzCashEnabled}
                    onChange={(e) => updateDepositGateways({ jazzCashEnabled: e.target.checked })}
                    className="w-4 h-4 text-red-600 rounded"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">JazzCash Account Title</label>
                  <input
                    type="text"
                    value={depositGateways.jazzCashAccountTitle}
                    onChange={(e) => updateDepositGateways({ jazzCashAccountTitle: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-red-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">JazzCash Mobile / Till Number</label>
                  <input
                    type="text"
                    value={depositGateways.jazzCashAccountNumber}
                    onChange={(e) => updateDepositGateways({ jazzCashAccountNumber: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded font-mono font-bold focus:ring-1 focus:ring-red-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* EasyPaisa */}
              <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-emerald-700 text-sm">EasyPaisa</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-900 font-bold px-1.5 py-0.2 rounded">Telenor Microfinance</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={depositGateways.easyPaisaEnabled}
                    onChange={(e) => updateDepositGateways({ easyPaisaEnabled: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">EasyPaisa Account Title</label>
                  <input
                    type="text"
                    value={depositGateways.easyPaisaAccountTitle}
                    onChange={(e) => updateDepositGateways({ easyPaisaAccountTitle: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">EasyPaisa Mobile Number</label>
                  <input
                    type="text"
                    value={depositGateways.easyPaisaAccountNumber}
                    onChange={(e) => updateDepositGateways({ easyPaisaAccountNumber: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded font-mono font-bold focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

            </div>

            {/* Bank Transfer Box */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">Direct Bank Account Transfer / IBAN</span>
                <input
                  type="checkbox"
                  checked={depositGateways.bankTransferEnabled}
                  onChange={(e) => updateDepositGateways({ bankTransferEnabled: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="text-slate-600 block mb-0.5">Bank Name</label>
                  <input
                    type="text"
                    value={depositGateways.bankName}
                    onChange={(e) => updateDepositGateways({ bankName: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <label className="text-slate-600 block mb-0.5">Account Title</label>
                  <input
                    type="text"
                    value={depositGateways.bankAccountTitle}
                    onChange={(e) => updateDepositGateways({ bankAccountTitle: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <label className="text-slate-600 block mb-0.5">IBAN Number</label>
                  <input
                    type="text"
                    value={depositGateways.bankIban}
                    onChange={(e) => updateDepositGateways({ bankIban: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Payment instructions */}
            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-slate-800 block">Customer Deposit Notice Message</label>
              <textarea
                rows={3}
                value={depositGateways.instructionsNote}
                onChange={(e) => updateDepositGateways({ instructionsNote: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
              />
            </div>

          </div>
        </div>
      )}

      {/* TAB 3: SMART AUTO-TAGGING RULES */}
      {activeTab === 'tags' && (
        <div className="bg-white border border-[#e1e3e5] rounded-xl p-5 shadow-2xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-[#202223]">Smart Automated Shopify Order Tagging</h3>
            <p className="text-xs text-[#6d7175]">
              MakCod automatically applies structured tags to Shopify orders based on city, risk score, WhatsApp verification, and staff assignment.
            </p>
          </div>

          <div className="space-y-2.5">
            {tagRules.map(rule => (
              <div key={rule.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={rule.enabled}
                    onChange={() => toggleTagRule(rule.id)}
                    className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                  />
                  <div>
                    <div className="font-bold text-slate-900">{rule.name}</div>
                    <div className="text-slate-500 font-mono text-[11px]">IF {rule.condition}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs bg-white px-2.5 py-1 rounded-md border border-slate-300 text-slate-800 shadow-2xs">
                    #{rule.targetTag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: THEME APP EMBED */}
      {activeTab === 'theme' && (
        <div className="bg-white border border-[#e1e3e5] rounded-xl p-5 shadow-2xs space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <h3 className="text-sm font-bold text-[#202223]">Shopify Theme App Extension Status</h3>
            </div>
            <p className="text-xs text-[#6d7175]">
              MakCod integrates natively using Shopify Online Store 2.0 App Embeds with zero liquid template modifications.
            </p>
          </div>

          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <h4 className="font-bold text-xs text-emerald-950">App Embed Active on Current Theme</h4>
                <p className="text-[11px] text-emerald-800">
                  makcod-form-block is injected into your product & cart templates.
                </p>
              </div>
            </div>

            <button
              onClick={() => showToast('Theme Editor Opened', 'Opening Shopify Theme Customizer...')}
              className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>Theme Editor</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-4 bg-slate-900 text-slate-200 rounded-xl font-mono text-xs space-y-2">
            <div className="text-slate-400 text-[11px] flex items-center justify-between">
              <span>App Block Liquid Reference (extensions/makcod-cod-block/blocks/form.liquid):</span>
              <span className="text-emerald-400 font-sans font-bold">Auto-Injected</span>
            </div>
            <pre className="text-emerald-300 text-[11px] bg-slate-950 p-3 rounded-lg overflow-x-auto">
{`{% schema %}
{
  "name": "MakCod Quick COD Form",
  "target": "section",
  "stylesheet": "makcod-bundle.css",
  "javascript": "makcod-core.js",
  "settings": [
    { "type": "color", "id": "btn_color", "label": "Button Color", "default": "#008060" },
    { "type": "checkbox", "id": "exit_intent", "label": "Enable Exit Intent", "default": true }
  ]
}
{% endschema %}`}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 5: GENERAL & TRANSLATION */}
      {activeTab === 'general' && (
        <div className="bg-white border border-[#e1e3e5] rounded-xl p-5 shadow-2xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-[#202223]">Store & Multi-Language Settings</h3>
            <p className="text-xs text-[#6d7175]">Customize default language, RTL layout, and store identity.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-800 block mb-1">Store Brand Name</label>
              <input
                type="text"
                value={settings.storeName}
                onChange={(e) => updateSettings({ storeName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">Default Language on Storefront</label>
              <select
                value={settings.defaultLanguage}
                onChange={(e) => updateSettings({ defaultLanguage: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none cursor-pointer"
              >
                <option value="en">English (Default)</option>
                <option value="ur">Urdu (اردو - Pakistan)</option>
                <option value="ar">Arabic (العربية - Saudi Arabia / UAE)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Add Location Rule Modal */}
      {isLocationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Add City COD Rule</h3>

            <form onSubmit={handleAddLocationRule} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-800 block mb-1">City Name</label>
                <input
                  type="text"
                  required
                  value={cityName}
                  onChange={(e) => setCityName(e.target.value)}
                  placeholder="e.g. Multan or Sialkot"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">COD Fee (Rs.)</label>
                  <input
                    type="number"
                    value={codFee}
                    onChange={(e) => setCodFee(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Free COD Above (Rs.)</label>
                  <input
                    type="number"
                    value={freeCodThreshold}
                    onChange={(e) => setFreeCodThreshold(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Preferred Courier Partner</label>
                <select
                  value={courierPref}
                  onChange={(e) => setCourierPref(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                >
                  <option value="Trax">Trax Logistics</option>
                  <option value="Leopards">Leopards Courier</option>
                  <option value="TCS">TCS Express</option>
                  <option value="PostEx">PostEx Instant COD</option>
                  <option value="M&P">M&P Express</option>
                </select>
              </div>

              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-amber-900">
                  <input
                    type="checkbox"
                    checked={requiresDeposit}
                    onChange={(e) => setRequiresDeposit(e.target.checked)}
                    className="w-4 h-4 text-amber-600 rounded"
                  />
                  <span>Enforce Advance Deposit for this city</span>
                </label>

                {requiresDeposit && (
                  <div>
                    <label className="text-[10px] text-amber-800 font-semibold block mb-0.5">Deposit Amount (Rs.)</label>
                    <input
                      type="number"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 bg-white border border-amber-300 rounded font-bold"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsLocationModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg cursor-pointer"
                >
                  Save City Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
