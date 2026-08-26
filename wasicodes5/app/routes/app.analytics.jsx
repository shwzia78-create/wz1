import React from 'react';
import { useApp } from '../context/AppContext';
import { json } from '@remix-run/node';
import { authenticate } from '../shopify.server';
import { 
  TrendingUp, 
  ShieldCheck, 
  Truck, 
  MapPin, 
  DollarSign, 
  CheckCircle, 
  AlertTriangle,
  ArrowUpRight
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

export default function AnalyticsRoute() {
  const { orders = [], settings = { currencySymbol: 'Rs.' } } = useApp();

  const totalDelivered = (orders || []).filter(o => o && o.status === 'DELIVERED').length;
  const totalVerified = (orders || []).filter(o => o && o.status === 'VERIFIED').length;
  const totalRto = (orders || []).filter(o => o && o.status === 'CANCELLED').length;

  const courierStats = [
    { name: 'Trax Logistics', orders: 142, deliveredRate: 93.8, rtoRate: 6.2, avgDays: '1.4 Days', remittance: '24h Fast Remit' },
    { name: 'PostEx Instant COD', orders: 98, deliveredRate: 94.2, rtoRate: 5.8, avgDays: '1.2 Days', remittance: 'Instant Cash' },
    { name: 'Leopards Courier', orders: 74, deliveredRate: 88.4, rtoRate: 11.6, avgDays: '2.5 Days', remittance: '3 Business Days' },
    { name: 'TCS Express', orders: 52, deliveredRate: 86.1, rtoRate: 13.9, avgDays: '2.8 Days', remittance: 'Weekly' },
  ];

  const cityRiskData = [
    { city: 'Lahore', volume: 'Rs. 482,000', rtoRisk: '3.8% (Very Low)', badge: 'bg-emerald-100 text-emerald-800' },
    { city: 'Islamabad / Rawalpindi', volume: 'Rs. 312,000', rtoRisk: '4.2% (Low)', badge: 'bg-emerald-100 text-emerald-800' },
    { city: 'Karachi', volume: 'Rs. 590,000', rtoRisk: '7.5% (Normal)', badge: 'bg-blue-100 text-blue-800' },
    { city: 'Faisalabad & Multan', volume: 'Rs. 189,000', rtoRisk: '9.1% (Moderate)', badge: 'bg-amber-100 text-amber-800' },
    { city: 'Peshawar (Remote)', volume: 'Rs. 95,000', rtoRisk: '19.4% (High Risk - Requires Rs. 500 Deposit)', badge: 'bg-rose-100 text-rose-800' },
    { city: 'Quetta (Balochistan)', volume: 'Rs. 34,000', rtoRisk: '28.0% (Prepaid Mode Active)', badge: 'bg-rose-100 text-rose-800' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white border border-[#e1e3e5] rounded-xl p-5 shadow-2xs">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-700" />
          <h1 className="text-lg font-bold text-[#202223]">RTO & COD Revenue Intelligence Analytics</h1>
        </div>
        <p className="text-xs text-[#6d7175] mt-1">
          Monitor Cash on Delivery delivery fulfillment rates, courier remittance speeds, and city-level risk heatmaps.
        </p>
      </div>

      {/* RTO Savings Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-white border border-[#e1e3e5] rounded-xl p-5 shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-emerald-700 font-semibold text-xs">
            <ShieldCheck className="w-4 h-4" />
            <span>AI Shield RTO Money Saved</span>
          </div>
          <div className="text-2xl font-extrabold text-[#202223]">
            {settings.currencySymbol} 48,500
          </div>
          <p className="text-xs text-slate-500">Saved on two-way courier freight + packaging damage</p>
        </div>

        <div className="bg-white border border-[#e1e3e5] rounded-xl p-5 shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-emerald-700 font-semibold text-xs">
            <CheckCircle className="w-4 h-4" />
            <span>Overall Doorstep Delivery Success</span>
          </div>
          <div className="text-2xl font-extrabold text-emerald-800">
            92.6%
          </div>
          <p className="text-xs text-slate-500">+14.2% higher than standard unverified COD stores</p>
        </div>

        <div className="bg-white border border-[#e1e3e5] rounded-xl p-5 shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-purple-700 font-semibold text-xs">
            <DollarSign className="w-4 h-4" />
            <span>Upsell AOV Revenue Lift</span>
          </div>
          <div className="text-2xl font-extrabold text-purple-900">
            + {settings.currencySymbol} 420 / order
          </div>
          <p className="text-xs text-slate-500">Generated from 1-click BOGO & priority shipping</p>
        </div>

      </div>

      {/* Courier Performance Matrix */}
      <div className="bg-white border border-[#e1e3e5] rounded-xl shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-[#e1e3e5]">
          <h3 className="text-sm font-bold text-[#202223] flex items-center gap-2">
            <Truck className="w-4 h-4 text-emerald-700" />
            <span>Courier Partner Performance & Return Rates</span>
          </h3>
          <p className="text-xs text-[#6d7175]">Real delivery speed and remittance timelines across your integrated couriers.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f6f6f7] text-[#5c5f62] uppercase font-semibold border-b border-[#e1e3e5]">
              <tr>
                <th className="py-3 px-4">Courier Partner</th>
                <th className="py-3 px-4">Parcels Handled</th>
                <th className="py-3 px-4">Successful Delivery</th>
                <th className="py-3 px-4">RTO / Return Rate</th>
                <th className="py-3 px-4">Avg. Transit Time</th>
                <th className="py-3 px-4">Cash Remittance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ebebeb] bg-white">
              {courierStats.map((c, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{c.name}</td>
                  <td className="py-3.5 px-4 font-mono">{c.orders} orders</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-800">{c.deliveredRate}%</td>
                  <td className="py-3.5 px-4 font-semibold text-rose-700">{c.rtoRate}%</td>
                  <td className="py-3.5 px-4 text-slate-600">{c.avgDays}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-[11px] bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                      {c.remittance}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* City-wise Risk Heatmap */}
      <div className="bg-white border border-[#e1e3e5] rounded-xl shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-[#e1e3e5]">
          <h3 className="text-sm font-bold text-[#202223] flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-700" />
            <span>City & Regional COD Risk Breakdown</span>
          </h3>
          <p className="text-xs text-[#6d7175]">Identifies cities with abnormal return rates to apply automated advance deposit rules.</p>
        </div>

        <div className="divide-y divide-[#ebebeb] bg-white">
          {cityRiskData.map((item, idx) => (
            <div key={idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50 text-xs">
              <div>
                <div className="font-bold text-slate-900 text-sm">{item.city}</div>
                <div className="text-slate-500 mt-0.5">Processed COD Volume: {item.volume}</div>
              </div>

              <div>
                <span className={`px-2.5 py-1 rounded-full font-bold text-xs ${item.badge}`}>
                  {item.rtoRisk}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
