import React, { useState, useMemo, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { json } from '@remix-run/node';
import { authenticate } from '../shopify.server';
import { 
  ShieldAlert, 
  Ban, 
  Trash2, 
  Search, 
  Sparkles, 
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
  return json({ status: 'success' });
};

export default function RiskBlacklistRoute() {
  const { 
    blacklist = [], 
    addBlacklistItem, 
    deleteBlacklistItem, 
    settings, 
    updateSettings, 
  } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [blacklistType, setBlacklistType] = useState('PHONE');
  const [blacklistValue, setBlacklistValue] = useState('');
  const [blacklistReason, setBlacklistReason] = useState('');
  const [blacklistSeverity, setBlacklistSeverity] = useState('BLOCK_ORDER');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBlacklist = useMemo(() => {
    const q = (searchQuery || '').toLowerCase().trim();
    if (!q) return blacklist;
    return (blacklist || []).filter(item => {
      if (!item) return false;
      const val = (item.value || '').toLowerCase();
      const reason = (item.reason || '').toLowerCase();
      const type = (item.type || '').toLowerCase();
      return val.includes(q) || reason.includes(q) || type.includes(q);
    });
  }, [blacklist, searchQuery]);

  const handleAddBlacklist = useCallback((e) => {
    e.preventDefault();
    const val = (blacklistValue || '').trim();
    if (!val) return;

    addBlacklistItem({
      type: blacklistType,
      value: val,
      reason: blacklistReason || 'Flagged for high return/RTO risk',
      severity: blacklistSeverity,
    });

    setIsAddModalOpen(false);
    setBlacklistValue('');
    setBlacklistReason('');
  }, [blacklistValue, blacklistType, blacklistReason, blacklistSeverity, addBlacklistItem]);

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="bg-white border border-[#e1e3e5] rounded-xl p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <h1 className="text-lg font-bold text-[#202223]">AI Fraud Detector & Blacklist Management</h1>
          </div>
          <p className="text-xs text-[#6d7175] mt-1">
            Automated intelligence that flags fake orders, suspicious IP bursts, duplicate phone numbers, and repeat return offenders.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <Ban className="w-4 h-4" />
          <span>+ Add to Blacklist</span>
        </button>
      </div>

      {/* AI Scoring Configuration */}
      <div className="bg-white border border-[#e1e3e5] rounded-xl p-5 shadow-2xs space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-[#202223]">AI Risk Scoring Thresholds & Protections</h3>
          </div>
          <p className="text-xs text-[#6d7175]">Adjust the sensitivity of the MakCod fraud detection neural scoring engine.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          
          <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-rose-900">High Risk Score Threshold</span>
              <span className="font-mono font-bold text-rose-900 text-sm bg-rose-200 px-2 py-0.5 rounded">
                Score ≥ {settings.riskScoreThresholdHigh}
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="90"
              value={settings.riskScoreThresholdHigh}
              onChange={(e) => updateSettings({ riskScoreThresholdHigh: Number(e.target.value) })}
              className="w-full accent-rose-600 cursor-pointer"
            />
            
            <div className="space-y-1.5 pt-2 border-t border-rose-200/60">
              <label className="flex items-center gap-2 cursor-pointer font-semibold text-rose-950">
                <input
                  type="checkbox"
                  checked={settings.requireDepositForHighRisk}
                  onChange={(e) => updateSettings({ requireDepositForHighRisk: e.target.checked })}
                  className="w-4 h-4 text-rose-600 rounded"
                />
                <span>Enforce Rs. 500 Advance Deposit for High Risk</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-semibold text-rose-950">
                <input
                  type="checkbox"
                  checked={settings.autoCancelHighRisk}
                  onChange={(e) => updateSettings({ autoCancelHighRisk: e.target.checked })}
                  className="w-4 h-4 text-rose-600 rounded"
                />
                <span>Auto-Cancel Orders scoring over 90% (Zero Loss Policy)</span>
              </label>
            </div>
          </div>

          <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-900">Medium Risk Alert Threshold</span>
              <span className="font-mono font-bold text-amber-900 text-sm bg-amber-200 px-2 py-0.5 rounded">
                Score ≥ {settings.riskScoreThresholdMedium}
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="60"
              value={settings.riskScoreThresholdMedium}
              onChange={(e) => updateSettings({ riskScoreThresholdMedium: Number(e.target.value) })}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <p className="text-[11px] text-amber-800 leading-relaxed pt-2 border-t border-amber-200/60">
              Orders falling between Medium and High risk will be automatically highlighted on the dashboard with a yellow badge, requesting agent phone verification.
            </p>
          </div>

        </div>
      </div>

      {/* Blacklist Management Table */}
      <div className="bg-white border border-[#e1e3e5] rounded-xl shadow-2xs overflow-hidden">
        
        <div className="p-5 border-b border-[#e1e3e5] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-[#202223]">Active Blacklist Entries ({blacklist.length})</h3>
            <p className="text-xs text-[#6d7175]">Entries here are either automatically blocked or required to prepay.</p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search phone, IP, address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f6f6f7] text-[#5c5f62] uppercase font-semibold border-b border-[#e1e3e5]">
              <tr>
                <th className="py-3 px-4">Type & Value</th>
                <th className="py-3 px-4">Reason / Notes</th>
                <th className="py-3 px-4">Date Added</th>
                <th className="py-3 px-4">Interception Action</th>
                <th className="py-3 px-4">Blocked Count</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ebebeb] bg-white">
              {filteredBlacklist.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400">
                    No blacklist records found.
                  </td>
                </tr>
              ) : (
                filteredBlacklist.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          item.type === 'PHONE' ? 'bg-purple-100 text-purple-800' :
                          item.type === 'IP' ? 'bg-blue-100 text-blue-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {item.type}
                        </span>
                        <span className="font-mono font-bold text-slate-900">{item.value}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-slate-600 max-w-xs">
                      {item.reason}
                    </td>

                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                      {item.addedAt}
                    </td>

                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.severity === 'BLOCK_ORDER' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {item.severity === 'BLOCK_ORDER' ? '⛔ Immediate Auto-Block' : '💳 Require Advance Deposit'}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-slate-800">
                      {item.blockedAttempts} orders
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => deleteBlacklistItem(item.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                        title="Remove from Blacklist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Ban className="w-5 h-5 text-rose-600" />
              <span>Add Entity to Fraud Blacklist</span>
            </h3>

            <form onSubmit={handleAddBlacklist} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-800 block mb-1">Blacklist Entity Type</label>
                <select
                  value={blacklistType}
                  onChange={(e) => setBlacklistType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-1 focus:ring-rose-500 focus:outline-none"
                >
                  <option value="PHONE">Phone Number</option>
                  <option value="IP">IP Address</option>
                  <option value="ADDRESS">Street / Area Address</option>
                  <option value="CITY_ZONE">City / Postal Zone</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Value to Block (e.g. 03001234567 or 182.185.10.4)
                </label>
                <input
                  type="text"
                  required
                  value={blacklistValue}
                  onChange={(e) => setBlacklistValue(e.target.value)}
                  placeholder="Enter exact phone, IP or address keyword..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-1 focus:ring-rose-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Reason / Offense Note</label>
                <input
                  type="text"
                  value={blacklistReason}
                  onChange={(e) => setBlacklistReason(e.target.value)}
                  placeholder="e.g. Repeated doorstep refusal, automated bot, fake address"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-1 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Action to Take upon Match</label>
                <select
                  value={blacklistSeverity}
                  onChange={(e) => setBlacklistSeverity(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-1 focus:ring-rose-500 focus:outline-none font-semibold"
                >
                  <option value="BLOCK_ORDER">Auto-Block & Cancel Order</option>
                  <option value="REQUIRE_DEPOSIT">Require Advance Security Deposit (JazzCash/EasyPaisa)</option>
                  <option value="FLAG_HIGH_RISK">Flag as High Risk for Manual Review</option>
                </select>
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
                  className="px-4 py-2 text-xs font-bold text-white bg-rose-700 hover:bg-rose-800 rounded-lg cursor-pointer"
                >
                  Confirm Blacklist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
