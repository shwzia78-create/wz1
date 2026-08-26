import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { json } from '@remix-run/node';
import { authenticate } from '../shopify.server';
import { 
  ShoppingBag, 
  Plus, 
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

export default function UpsellsRoute() {
  const appContext = useApp() || {};
  const { 
    upsells = [], 
    toggleUpsell = () => {}, 
    addUpsell = () => {}, 
    settings = { currencySymbol: 'Rs.' } 
  } = appContext;

  const activeUpsells = Array.isArray(upsells) && upsells.length > 0 
    ? upsells 
    : [
 { id: 'u-1', title: 'Buy 1 More Get 25% OFF (BOGO Special)', price: 2499, regularPrice: 3499, type: 'BOGO', enabled: true },
{ id: 'u-2', title: 'VIP Express Priority Shipping + Parcel Insurance', price: 199, regularPrice: 400, type: 'PRIORITY_SHIPPING', enabled: true },
{ id: 'u-3', title: '1-Year Hassle-Free Exchange & Fabric Warranty', price: 349, regularPrice: 600, type: 'WARRANTY', enabled: true }     ];

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [price, setPrice] = useState(1999);
  const [originalPrice, setOriginalPrice] = useState(2999);
  const [badge, setBadge] = useState('HOT DEAL 🔥');
  const [type, setType] = useState('BOGO');
  const [image] = useState('https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=150&auto=format&fit=crop&q=80');

  const handleCreateUpsell = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    addUpsell({
      title,
      subtitle,
      price: Number(price),
      originalPrice: Number(originalPrice),
      badge,
      type,
      selectedByDefault: false,
      image,
      enabled: true,
    });

    setIsAddModalOpen(false);
    setTitle('');
    setSubtitle('');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white border border-[#e1e3e5] rounded-xl p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-700" />
            <h1 className="text-lg font-bold text-[#202223]">Multi-Tier Upsells & BOGO Bundle Engine</h1>
          </div>
          <p className="text-xs text-[#6d7175] mt-1">
            Increase your Average Order Value (AOV) by +25% directly inside the 1-click Cash on Delivery popup modal.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create New Upsell Offer</span>
        </button>
      </div>

      {/* Upsells List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {activeUpsells.map(offer => (
          <div
            key={offer.id}
            className={`bg-white border rounded-2xl p-5 shadow-2xs space-y-4 transition-all ${
              offer.enabled ? 'border-[#e1e3e5]' : 'border-slate-200 opacity-60 bg-slate-50'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <img
                  src={offer.image}
                  alt={offer.title}
                  className="w-12 h-12 object-cover rounded-xl border border-slate-200"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-amber-100 text-amber-900">
                      {offer.badge}
                    </span>
                  </div>
                  <h3 className="font-bold text-xs text-slate-900 mt-1">{offer.title}</h3>
                </div>
              </div>

              <input
                type="checkbox"
                checked={offer.enabled}
                onChange={() => toggleUpsell(offer.id)}
                className="w-4 h-4 text-emerald-600 rounded cursor-pointer mt-1"
              />
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              {offer.subtitle}
            </p>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-500 text-[10px]">Upsell Price:</span>
                <div className="font-black text-emerald-800 text-sm">
              {settings.currencySymbol} {Number(offer.price || 0).toLocaleString()}
                </div>
              </div>

              <div className="text-right">
                <span className="text-slate-400 text-[10px]">Regular:</span>
                <div className="line-through text-slate-400 font-mono text-xs">
                  {settings.currencySymbol} {Number(offer.regularPrice || offer.originalPrice || 0).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs text-slate-500">
              <span>Type: <strong>{offer.type}</strong></span>
              <span className={`font-semibold ${offer.enabled ? 'text-emerald-700' : 'text-slate-400'}`}>
                {offer.enabled ? '● Active on Popup' : '○ Disabled'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Create New Checkout Upsell</h3>

            <form onSubmit={handleCreateUpsell} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-800 block mb-1">Upsell Offer Headline</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Buy 1 More & Get 30% OFF (BOGO Special)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Subheadline Description</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="e.g. Add another piece for your brother with zero shipping fee"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Special Price (Rs.)</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Original Price (Rs.)</label>
                  <input
                    type="number"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Badge Text</label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Upsell Category</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  >
                    <option value="BOGO">BOGO Bundle</option>
                    <option value="PRIORITY_SHIPPING">Priority Shipping + Insurance</option>
                    <option value="WARRANTY">Extended Warranty</option>
                    <option value="ADD_ON">Product Addon</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg cursor-pointer"
                >
                  Create Upsell
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
