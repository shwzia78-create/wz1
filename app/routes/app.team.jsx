import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { json } from '@remix-run/node';
import { authenticate } from '../shopify.server';
import { 
  Users, 
  UserPlus, 
  Phone, 
  Clock, 
  TrendingUp, 
  Trash2, 
  Edit3, 
  MapPin,
  ListOrdered
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

export default function TeamRoute() {
  const { staff = [
  { id: '1', name: 'Hamza Tariq', role: 'Admin', phone: '+92 300 1234567', email: 'hamza@example.com', currentAssignedCount: 42, assignedQuota: 100, confirmedCount: 38, confirmationRate: 90.5, rtoCount: 1, assignedCities: ['Lahore', 'Islamabad', 'Rawalpindi'], workingHours: '09:00 AM - 06:00 PM', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' },
  { id: '2', name: 'Ayesha Khan', role: 'Agent', phone: '+92 321 9876543', email: 'ayesha@example.com', currentAssignedCount: 89, assignedQuota: 150, confirmedCount: 81, confirmationRate: 91, rtoCount: 3, assignedCities: ['Karachi', 'Hyderabad', 'Sukkur'], workingHours: '10:00 AM - 07:00 PM', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100' },
  { id: '3', name: 'Bilal Ahmed', role: 'Agent', phone: '+92 333 5551234', email: 'bilal@example.com', currentAssignedCount: 65, assignedQuota: 80, confirmedCount: 54, confirmationRate: 83.1, rtoCount: 4, assignedCities: ['Faisalabad', 'Multan', 'Peshawar', 'Gujranwala'], workingHours: '01:00 PM - 10:00 PM', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
  { id: '4', name: 'Zainab Noor', role: 'Agent', phone: '+92 345 8899001', email: 'zainab@example.com', currentAssignedCount: 30, assignedQuota: 100, confirmedCount: 26, confirmationRate: 86.7, rtoCount: 2, assignedCities: ['Sialkot', 'Quetta', 'Abbottabad'], workingHours: '09:00 AM - 06:00 PM', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' }
], addStaffMember, updateStaffMember, deleteStaffMember, settings, updateSettings } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);

  // New staff form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('0300-1234567');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Agent');
  const [assignedQuota, setAssignedQuota] = useState(100);
  const [assignedCities, setAssignedCities] = useState('Lahore, Faisalabad');
  const [workingHours, setWorkingHours] = useState('09:00 AM - 06:00 PM');

  const handleSaveStaff = (e) => {
    e.preventDefault();
const citiesArray = (typeof assignedCities === 'string' ? assignedCities : Array.isArray(assignedCities) ? assignedCities.join(',') : '').split(',').map(c => c.trim()).filter(Boolean);

    if (editingStaff) {
      updateStaffMember(editingStaff.id, {
        name,
        phone,
        email,
        role,
        assignedQuota: Number(assignedQuota),
        assignedCities: citiesArray,
        workingHours,
      });
      setEditingStaff(null);
    } else {
      addStaffMember({
        name,
        phone,
        email,
        role,
        avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 90000000)}?w=150&auto=format&fit=crop&q=80`,
        status: 'ACTIVE',
        assignedQuota: Number(assignedQuota),
        assignedCities: citiesArray,
        workingHours,
      });
    }

    setIsAddModalOpen(false);
    // Reset form
    setName('');
    setEmail('');
  };

  const handleOpenEdit = (member) => {
    setEditingStaff(member);
    setName(member.name);
    setPhone(member.phone);
    setEmail(member.email);
    setRole(member.role);
    setAssignedQuota(member.assignedQuota);
    setAssignedCities(member.assignedCities?.join(', ') || '');
    setWorkingHours(member.workingHours);
    setIsAddModalOpen(true);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white border border-[#e1e3e5] rounded-xl p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-700" />
            <h1 className="text-lg font-bold text-[#202223]">Team Order Auto-Routing & Staff Quotas</h1>
          </div>
          <p className="text-xs text-[#6d7175] mt-1">
            Distribute incoming COD orders automatically across agents with strict daily quota limits (e.g. Agent 1 gets first 100).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setEditingStaff(null);
              setName('');
              setEmail('');
              setIsAddModalOpen(true);
            }}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Add Confirmation Agent</span>
          </button>
        </div>
      </div>

      {/* Routing Mode Selector Card */}
      <div className="bg-white border border-[#e1e3e5] rounded-xl p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-[#202223]">Auto-Routing Engine Mode</h3>
            <p className="text-xs text-[#6d7175]">Choose how MakCod assigns orders to active call agents.</p>
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <input
              type="checkbox"
              checked={settings.autoAssignStaff}
              onChange={(e) => updateSettings({ autoAssignStaff: e.target.checked })}
              className="w-4 h-4 text-emerald-600 rounded"
            />
            <span>Auto-Routing Active</span>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {[
            {
              id: 'QUOTA',
              title: 'Sequential Quota Limits',
              desc: 'Agent 1 receives orders until their quota (e.g. 100) is filled, then overflow routes to Agent 2.',
              icon: ListOrdered
            },
            {
              id: 'ROUND_ROBIN',
              title: 'Fair Round-Robin',
              desc: 'Orders cycle evenly across all active staff members to keep workloads balanced.',
              icon: TrendingUp
            },
            {
              id: 'CITY_BASED',
              title: 'City & Regional Specialization',
              desc: 'Orders are routed to agents specialized in specific cities (e.g. Lahore agent vs Karachi agent).',
              icon: MapPin
            }
          ].map(mode => {
      const isSelected = (settings?.routingMode || 'QUOTA') === mode.id;
            const Icon = mode.icon;
            return (
              <div
                key={mode.id}
                onClick={() => updateSettings({ routingMode: mode.id })}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected 
                    ? 'bg-emerald-50/70 border-emerald-500 ring-1 ring-emerald-500' 
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-700' : 'text-slate-500'}`} />
                  <span className="font-bold text-slate-900">{mode.title}</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">{mode.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Staff Members List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(staff || []).map(member => {
          const quotaPercent = Math.min(Math.round((member.currentAssignedCount / member.assignedQuota) * 100), 100);
          return (
            <div key={member.id} className="bg-white border border-[#e1e3e5] rounded-xl p-5 shadow-2xs space-y-4">
              
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-slate-200 shadow-xs"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-[#202223]">{member.name}</h3>
                      <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-slate-100 text-slate-700">
                        {member.role}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                      <span className="flex items-center gap-1 font-mono">
                        <Phone className="w-3 h-3 text-slate-400" /> {member.phone}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status selector */}
                <select
                  value={member.status}
                  onChange={(e) => updateStaffMember(member.id, { status: e.target.value })}
                  aria-label="Staff member status"
                  className={`text-xs font-bold px-2.5 py-1 rounded-full border cursor-pointer ${
                    member.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                    member.status === 'ON_BREAK' ? 'bg-amber-50 text-amber-800 border-amber-300' :
                    'bg-slate-100 text-slate-600 border-slate-300'
                  }`}
                >
                  <option value="ACTIVE">● ACTIVE</option>
                  <option value="ON_BREAK">● ON BREAK</option>
                  <option value="OFFLINE">● OFFLINE</option>
                </select>
              </div>

              {/* Quota Progress Bar */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-700">
                    Daily Quota: {member.currentAssignedCount} / {member.assignedQuota} Orders
                  </span>
                  <span className="font-bold text-emerald-800">{quotaPercent}% Capacity</span>
                </div>

                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      quotaPercent >= 90 ? 'bg-amber-500' : 'bg-emerald-600'
                    }`}
                    style={{ width: `${quotaPercent}%` }}
                  />
                </div>
              </div>

              {/* Performance Stats */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-200">
                  <div className="text-slate-500 text-[10px]">Confirmed</div>
                  <div className="font-bold text-emerald-900 text-sm">{member.confirmedCount}</div>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-slate-500 text-[10px]">Confirm Rate</div>
                  <div className="font-bold text-blue-900 text-sm">{member.confirmationRate}%</div>
                </div>
                <div className="p-2 bg-rose-50 rounded-lg border border-rose-200">
                  <div className="text-slate-500 text-[10px]">RTO Returns</div>
                  <div className="font-bold text-rose-900 text-sm">{member.rtoCount}</div>
                </div>
              </div>

              {/* Assigned Cities & Working Hours */}
              <div className="text-xs text-slate-600 space-y-1 pt-1 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>Cities: <strong>{member.assignedCities?.join(', ') || 'All Cities'}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Hours: {member.workingHours}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => handleOpenEdit(member)}
                  className="px-3 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit Quota</span>
                </button>
                <button
                  onClick={() => deleteStaffMember(member.id)}
                  className="px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Add / Edit Staff Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              {editingStaff ? 'Edit Staff Member & Quota' : 'Add New Order Confirmation Agent'}
            </h3>

            <form onSubmit={handleSaveStaff} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-800 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Hamza Tariq"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">WhatsApp / Phone</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Daily Order Quota</label>
                  <input
                    type="number"
                    required
                    value={assignedQuota}
                    onChange={(e) => setAssignedQuota(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Assigned Cities (Comma separated)</label>
                <input
                  type="text"
                  value={assignedCities}
                  onChange={(e) => setAssignedCities(e.target.value)}
                  placeholder="Lahore, Karachi, Islamabad"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Shift / Working Hours</label>
                <input
                  type="text"
                  value={workingHours}
                  onChange={(e) => setWorkingHours(e.target.value)}
                  placeholder="09:00 AM - 06:00 PM"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
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
                  Save Agent
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
