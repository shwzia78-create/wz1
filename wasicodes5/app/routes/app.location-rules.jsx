// Shopify Remix Route: City Management, Validation & COD Rules - /app/routes/app.location-rules.jsx
import React, { useState, useMemo, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { json } from '@remix-run/node';
import { authenticate } from '../shopify.server';
import { 
  MapPin, 
  Plus, 
  Trash2, 
  Check, 
  X, 
  Search, 
  ShieldAlert, 
  DollarSign, 
  Truck, 
  AlertCircle, 
  Sparkles,
  Building,
  Filter,
  FileSpreadsheet,
  Upload,
  Download,
  ListPlus,
  CheckCircle2,
  HelpCircle,
  ArrowUpDown,
  RefreshCw
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

// Standard preset cities for 1-click import
const PRESET_PAKISTAN_CITIES = [
  { city: 'Lahore', province: 'Punjab', shippingFee: 120, codFee: 80, estimatedDays: '1-2 Days' },
  { city: 'Karachi', province: 'Sindh', shippingFee: 150, codFee: 99, estimatedDays: '2-3 Days' },
  { city: 'Islamabad', province: 'Federal', shippingFee: 120, codFee: 80, estimatedDays: '1-2 Days' },
  { city: 'Rawalpindi', province: 'Punjab', shippingFee: 120, codFee: 80, estimatedDays: '1-2 Days' },
  { city: 'Faisalabad', province: 'Punjab', shippingFee: 150, codFee: 99, estimatedDays: '2-3 Days' },
  { city: 'Multan', province: 'Punjab', shippingFee: 150, codFee: 99, estimatedDays: '2-3 Days' },
  { city: 'Peshawar', province: 'KPK', shippingFee: 180, codFee: 100, estimatedDays: '2-4 Days' },
  { city: 'Sialkot', province: 'Punjab', shippingFee: 150, codFee: 90, estimatedDays: '2-3 Days' },
  { city: 'Gujranwala', province: 'Punjab', shippingFee: 150, codFee: 90, estimatedDays: '2-3 Days' },
  { city: 'Quetta', province: 'Balochistan', shippingFee: 250, codFee: 150, estimatedDays: '3-5 Days' },
  { city: 'Hyderabad', province: 'Sindh', shippingFee: 160, codFee: 100, estimatedDays: '2-3 Days' },
  { city: 'Bahawalpur', province: 'Punjab', shippingFee: 170, codFee: 100, estimatedDays: '2-4 Days' },
  { city: 'Sargodha', province: 'Punjab', shippingFee: 160, codFee: 90, estimatedDays: '2-3 Days' },
  { city: 'Sukkur', province: 'Sindh', shippingFee: 180, codFee: 110, estimatedDays: '2-4 Days' },
  { city: 'Abbottabad', province: 'KPK', shippingFee: 190, codFee: 120, estimatedDays: '3-4 Days' },
  { city: 'Mardan', province: 'KPK', shippingFee: 180, codFee: 110, estimatedDays: '2-4 Days' },
  { city: 'Gujrat', province: 'Punjab', shippingFee: 150, codFee: 90, estimatedDays: '2-3 Days' },
  { city: 'Kasur', province: 'Punjab', shippingFee: 140, codFee: 90, estimatedDays: '2-3 Days' },
  { city: 'Rahim Yar Khan', province: 'Punjab', shippingFee: 190, codFee: 120, estimatedDays: '3-4 Days' },
  { city: 'Sahiwal', province: 'Punjab', shippingFee: 160, codFee: 90, estimatedDays: '2-3 Days' },
  { city: 'Okara', province: 'Punjab', shippingFee: 150, codFee: 90, estimatedDays: '2-3 Days' },
  { city: 'Wah Cantt', province: 'Punjab', shippingFee: 130, codFee: 80, estimatedDays: '1-2 Days' },
  { city: 'Dera Ghazi Khan', province: 'Punjab', shippingFee: 200, codFee: 120, estimatedDays: '3-5 Days' },
  { city: 'Mirpur (AJK)', province: 'AJK', shippingFee: 220, codFee: 130, estimatedDays: '3-5 Days' },
  { city: 'Muzaffarabad', province: 'AJK', shippingFee: 230, codFee: 140, estimatedDays: '3-5 Days' }
];

const PRESET_GCC_CITIES = [
  { city: 'Dubai', province: 'UAE', shippingFee: 25, codFee: 15, estimatedDays: '1-2 Days' },
  { city: 'Abu Dhabi', province: 'UAE', shippingFee: 25, codFee: 15, estimatedDays: '1-2 Days' },
  { city: 'Sharjah', province: 'UAE', shippingFee: 25, codFee: 15, estimatedDays: '1-2 Days' },
  { city: 'Ajman', province: 'UAE', shippingFee: 30, codFee: 15, estimatedDays: '1-2 Days' },
  { city: 'Riyadh', province: 'Saudi Arabia', shippingFee: 35, codFee: 20, estimatedDays: '2-3 Days' },
  { city: 'Jeddah', province: 'Saudi Arabia', shippingFee: 35, codFee: 20, estimatedDays: '2-3 Days' },
  { city: 'Dammam', province: 'Saudi Arabia', shippingFee: 35, codFee: 20, estimatedDays: '2-3 Days' },
  { city: 'Doha', province: 'Qatar', shippingFee: 30, codFee: 18, estimatedDays: '2-3 Days' },
  { city: 'Kuwait City', province: 'Kuwait', shippingFee: 30, codFee: 18, estimatedDays: '2-3 Days' },
  { city: 'Manama', province: 'Bahrain', shippingFee: 28, codFee: 16, estimatedDays: '2-3 Days' },
  { city: 'Muscat', province: 'Oman', shippingFee: 35, codFee: 20, estimatedDays: '2-4 Days' }
];

export default function LocationRulesRoute() {
  const { 
    locationRules = [], 
    addLocationRule, 
    updateLocationRule, 
    deleteLocationRule, 
    settings, 
    showToast 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterProvince, setFilterProvince] = useState('ALL');
  const [filterCodStatus, setFilterCodStatus] = useState('ALL');
  const [isAddingModalOpen, setIsAddingModalOpen] = useState(false);
  const [addMode, setAddMode] = useState('single'); // 'single' | 'bulk_text' | 'csv' | 'presets'

  // Single Add Form State
  const [newCity, setNewCity] = useState('');
  const [newProvince, setNewProvince] = useState('Punjab');
  const [newCodAllowed, setNewCodAllowed] = useState(true);
  const [newShippingFee, setNewShippingFee] = useState(150);
  const [newCodFee, setNewCodFee] = useState(0);
  const [newEstimatedDays, setNewEstimatedDays] = useState('2-3 Days');
  const [newRequireAdvanceDeposit, setNewRequireAdvanceDeposit] = useState(false);
  const [newDepositAmount, setNewDepositAmount] = useState(500);

  // Bulk Text State
  const [bulkText, setBulkText] = useState('');
  const [bulkDefaultProvince, setBulkDefaultProvince] = useState('Punjab');
  const [bulkShippingFee, setBulkShippingFee] = useState(150);
  const [bulkCodFee, setBulkCodFee] = useState(0);

  // Validation Sandbox Test State
  const [sandboxInput, setSandboxInput] = useState('');

  // Handle Single Add
  const handleAddSingleRule = useCallback((e) => {
    e.preventDefault();
    const cityTrimmed = (newCity || '').trim();
    if (!cityTrimmed) {
      showToast('Validation Error', 'City name is required', 'error');
      return;
    }

    addLocationRule({
      cityName: cityTrimmed,
      city: cityTrimmed,
      name: cityTrimmed,
      province: newProvince,
      codEnabled: Boolean(newCodAllowed),
      codAllowed: Boolean(newCodAllowed),
      shippingFee: Number(newShippingFee) || 0,
      codFee: Number(newCodFee) || 0,
      estimatedDeliveryDays: newEstimatedDays || '2-3 Days',
      estimatedDays: newEstimatedDays || '2-3 Days',
      requiresAdvanceDeposit: Boolean(newRequireAdvanceDeposit),
      requireAdvanceDeposit: Boolean(newRequireAdvanceDeposit),
      courierPreference: 'Trax',
      depositAmount: newRequireAdvanceDeposit ? Number(newDepositAmount) || 500 : 0,
    });

    setNewCity('');
    setIsAddingModalOpen(false);
    showToast('City Added', `${cityTrimmed} added to delivery zones with verified anti-typo rules.`, 'success');
  }, [newCity, newProvince, newCodAllowed, newShippingFee, newCodFee, newEstimatedDays, newRequireAdvanceDeposit, newDepositAmount, addLocationRule, showToast]);

  // Handle Bulk Text Import
  const handleBulkTextImport = () => {
    if (!bulkText.trim()) {
      showToast('Validation Error', 'Please paste city names', 'error');
      return;
    }

    // Split by comma, newlines, semicolons
    const rawCities = bulkText.split(/[\n,;]+/).map(c => c.trim()).filter(Boolean);
    if (rawCities.length === 0) {
      showToast('Validation Error', 'No valid city names parsed', 'error');
      return;
    }

    let addedCount = 0;
    rawCities.forEach(cityStr => {
      // Check if duplicate exists
      const exists = locationRules.some(r => (r.cityName || r.city || '').toLowerCase() === cityStr.toLowerCase());
      if (!exists) {
        addLocationRule({
          cityName: cityStr,
          city: cityStr,
          name: cityStr,
          province: bulkDefaultProvince,
          codEnabled: true,
          codAllowed: true,
          shippingFee: Number(bulkShippingFee) || 0,
          codFee: Number(bulkCodFee) || 0,
          estimatedDeliveryDays: '2-3 Days',
          estimatedDays: '2-3 Days',
          requiresAdvanceDeposit: false,
          requireAdvanceDeposit: false,
          courierPreference: 'Trax',
          depositAmount: 0,
        });
        addedCount++;
      }
    });

    setBulkText('');
    setIsAddingModalOpen(false);
    showToast('Bulk Import Completed', `Successfully imported ${addedCount} verified delivery cities!`, 'success');
  };

  // Handle Preset Import
  const handleImportPreset = (presetList, name) => {
    let addedCount = 0;
    presetList.forEach(item => {
      const exists = locationRules.some(r => (r.cityName || r.city || '').toLowerCase() === item.city.toLowerCase());
      if (!exists) {
        addLocationRule({
          cityName: item.city,
          city: item.city,
          name: item.city,
          province: item.province,
          codEnabled: true,
          codAllowed: true,
          shippingFee: item.shippingFee,
          codFee: item.codFee,
          estimatedDeliveryDays: item.estimatedDays,
          estimatedDays: item.estimatedDays,
          requiresAdvanceDeposit: false,
          requireAdvanceDeposit: false,
          courierPreference: 'Trax',
          depositAmount: 0,
        });
        addedCount++;
      }
    });

    setIsAddingModalOpen(false);
    showToast('Preset Imported', `Imported ${addedCount} cities from ${name}.`, 'success');
  };

  // Handle CSV Upload simulation
  const handleCSVUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === 'string') {
        const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
        let count = 0;
        lines.forEach((line, idx) => {
          if (idx === 0 && line.toLowerCase().includes('city')) return; // skip header
          const parts = line.split(',').map(p => p.trim().replace(/^["']|["']$/g, ''));
          const cityName = parts[0];
          const province = parts[1] || 'Punjab';
          const shippingFee = Number(parts[2]) || 150;
          const codFee = Number(parts[3]) || 0;

          if (cityName) {
            const exists = locationRules.some(r => (r.cityName || r.city || '').toLowerCase() === cityName.toLowerCase());
            if (!exists) {
              addLocationRule({
                cityName,
                city: cityName,
                name: cityName,
                province,
                codEnabled: true,
                codAllowed: true,
                shippingFee,
                codFee,
                estimatedDeliveryDays: '2-3 Days',
                requiresAdvanceDeposit: false,
                depositAmount: 0,
              });
              count++;
            }
          }
        });

        setIsAddingModalOpen(false);
        showToast('CSV Uploaded', `Successfully parsed and added ${count} cities from CSV file.`, 'success');
      }
    };
    reader.readAsText(file);
  };

  // Export Cities to CSV
  const handleExportCSV = () => {
    const headers = 'City,Province,COD Allowed,Shipping Fee,COD Fee,Estimated Days,Requires Deposit\n';
    const rows = locationRules.map(r => 
      `"${r.cityName || r.city || ''}","${r.province || ''}",${r.codEnabled !== false},${r.shippingFee || 0},${r.codFee || 0},"${r.estimatedDeliveryDays || ''}",${Boolean(r.requiresAdvanceDeposit)}`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `codify_verified_cities_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('CSV Exported', 'Downloaded verified city list to your computer.');
  };

  // Download CSV Template for Bulk Import
  const handleDownloadTemplate = () => {
    const templateContent = "City Name,Province/Region,Shipping Fee,COD Fee,Estimated Days,Requires Deposit\n"
      + "Lahore,Punjab,120,80,1-2 Days,false\n"
      + "Karachi,Sindh,150,99,2-3 Days,false\n"
      + "Quetta,Balochistan,250,150,3-5 Days,true\n";

    const blob = new Blob([templateContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'codify_city_rules_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Template Downloaded', 'CSV template downloaded successfully. Fill it and upload back!');
  };

  // Filtered Rules
  const filteredRules = useMemo(() => {
    const query = (searchQuery || '').toLowerCase().trim();
    const filterP = (filterProvince || 'ALL').toUpperCase();

    return (locationRules || []).filter(item => {
      if (!item) return false;
      const cityName = (item.cityName || item.city || item.name || '').toLowerCase();
      const province = (item.province || item.region || '').toLowerCase();
      const matchesQuery = !query || cityName.includes(query) || province.includes(query);
      
      const itemProvince = (item.province || item.region || 'Punjab').toUpperCase();
      const matchesProvince = filterP === 'ALL' || itemProvince.includes(filterP) || filterP.includes(itemProvince);

      const isCodAllowed = item.codEnabled !== false && item.codAllowed !== false;
      const matchesCodStatus = filterCodStatus === 'ALL' 
        || (filterCodStatus === 'ALLOWED' && isCodAllowed)
        || (filterCodStatus === 'BLOCKED' && !isCodAllowed)
        || (filterCodStatus === 'DEPOSIT' && item.requiresAdvanceDeposit);

      return matchesQuery && matchesProvince && matchesCodStatus;
    });
  }, [locationRules, searchQuery, filterProvince, filterCodStatus]);

  // Fuzzy match testing for Anti-Typo sandbox
  const fuzzyMatchSuggestions = useMemo(() => {
    const q = (sandboxInput || '').trim().toLowerCase();
    if (!q) return [];
    
    return locationRules.filter(r => {
      const name = (r.cityName || r.city || '').toLowerCase();
      return name.includes(q) || q.includes(name) || (q.length >= 3 && name.startsWith(q.slice(0, 3)));
    }).slice(0, 4);
  }, [sandboxInput, locationRules]);

  return (
    <div className="space-y-6 max-w-[1500px] mx-auto">
      
      {/* Top Header */}
      <div className="bg-white border border-[#E1E3E5] rounded-xl p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#202223]">City Management, Validation & COD Rules</h1>
            <p className="text-xs text-gray-500">
              Manage verified delivery destinations, bulk import via Excel/CSV, eliminate customer spelling errors, and enforce city-specific COD policies.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleDownloadTemplate}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
            title="Download Sample CSV Template"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>Download Template</span>
          </button>
          <button
            onClick={() => {
              setAddMode('bulk_text');
              setIsAddingModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-black text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Bulk Add Cities</span>
          </button>

          <button
            onClick={() => {
              setAddMode('single');
              setIsAddingModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#10B981] hover:bg-emerald-600 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Single City</span>
          </button>
        </div>
      </div>

      {/* Interactive Anti-Typo Sandbox Banner */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200 rounded-xl p-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-emerald-950">Storefront Anti-Typo & Auto-Correction Sandbox</h3>
              <p className="text-[11px] text-emerald-800">
                Customers typing misspelled cities on checkout (e.g. "lahor", "isb", "karachi south") are automatically validated against your verified list.
              </p>
            </div>
          </div>

          {/* Mini interactive test input */}
          <div className="relative min-w-[260px]">
            <input
              type="text"
              value={sandboxInput}
              onChange={(e) => setSandboxInput(e.target.value)}
              placeholder="Test typing a city (e.g. lahor)..."
              className="w-full px-3 py-1.5 bg-white border border-emerald-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            {fuzzyMatchSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-emerald-300 rounded-lg shadow-lg z-20 p-2 space-y-1 text-xs">
                <div className="text-[10px] font-bold text-emerald-700 uppercase">Suggested Verified City:</div>
                {fuzzyMatchSuggestions.map(s => (
                  <div key={s.id} className="flex items-center justify-between p-1 hover:bg-emerald-50 rounded">
                    <span className="font-bold text-slate-800">{s.cityName || s.city}</span>
                    <span className="text-[10px] text-slate-500">{s.province} • {settings.currencySymbol || 'Rs.'}{s.shippingFee}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-[#E1E3E5] rounded-xl p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[300px]">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search verified city name or province..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Province Filter */}
          <select
            value={filterProvince}
            onChange={(e) => setFilterProvince(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="ALL">All Provinces / Regions</option>
            <option value="PUNJAB">Punjab</option>
            <option value="SINDH">Sindh</option>
            <option value="FEDERAL">Islamabad / Federal</option>
            <option value="KPK">KPK</option>
            <option value="BALOCHISTAN">Balochistan</option>
            <option value="AJK">Azad Kashmir (AJK)</option>
            <option value="UAE">United Arab Emirates (UAE)</option>
            <option value="SAUDI">Saudi Arabia (KSA)</option>
          </select>

          {/* COD Status Filter */}
          <select
            value={filterCodStatus}
            onChange={(e) => setFilterCodStatus(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="ALL">All COD Statuses</option>
            <option value="ALLOWED">COD Allowed Only</option>
            <option value="BLOCKED">COD Blocked / Restricted</option>
            <option value="DEPOSIT">Requires Advance Deposit</option>
          </select>
        </div>

        <div className="text-xs text-slate-500 font-semibold">
          Showing <span className="text-slate-900 font-bold">{filteredRules.length}</span> of {locationRules.length} cities
        </div>
      </div>

      {/* City Rules Table */}
      <div className="bg-white border border-[#E1E3E5] rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAFBFB] text-[#5C5F62] border-b border-[#E1E3E5] font-bold text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Verified City Name</th>
                <th className="py-3 px-4">Province / Region</th>
                <th className="py-3 px-4">COD Status</th>
                <th className="py-3 px-4">Standard Shipping</th>
                <th className="py-3 px-4">Extra COD Fee</th>
                <th className="py-3 px-4">Transit SLA</th>
                <th className="py-3 px-4">Advance Deposit</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E1E3E5]">
              {filteredRules.map((rule) => {
                const cityName = rule.cityName || rule.city || rule.name || 'Unnamed';
                const province = rule.province || rule.region || 'Punjab';
                const isCodAllowed = rule.codEnabled !== false && rule.codAllowed !== false;

                return (
                  <tr key={rule.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                      <Building className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{cityName}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {province}
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => {
                          updateLocationRule(rule.id, { 
                            codEnabled: !isCodAllowed,
                            codAllowed: !isCodAllowed
                          });
                          showToast('COD Status Updated', `${cityName} COD is now ${!isCodAllowed ? 'Enabled' : 'Blocked'}.`);
                        }}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                          isCodAllowed 
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                            : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                        }`}
                      >
                        {isCodAllowed ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        <span>{isCodAllowed ? 'COD Allowed' : 'COD Blocked'}</span>
                      </button>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                      {settings.currencySymbol || 'Rs.'}{rule.shippingFee || 0}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-600">
                      {rule.codFee ? `${settings.currencySymbol || 'Rs.'}${rule.codFee}` : 'Free'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {rule.estimatedDeliveryDays || rule.estimatedDays || '2-3 Days'}
                    </td>
                    <td className="py-3.5 px-4">
                      {rule.requiresAdvanceDeposit ? (
                        <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded text-[10px]">
                          <ShieldAlert className="w-3 h-3 text-amber-600" />
                          <span>Req {settings.currencySymbol || 'Rs.'}{rule.depositAmount || 500}</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px] font-medium">None</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          deleteLocationRule(rule.id);
                          showToast('City Removed', `${cityName} has been removed from rule list.`);
                        }}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded cursor-pointer transition-colors"
                        title="Delete City"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredRules.length === 0 && (
            <div className="p-8 text-center text-slate-500">
              <Building className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="font-bold text-slate-700">No matching cities found</p>
              <p className="text-xs text-slate-400 mt-1">Try adjusting your search query or import preset cities.</p>
            </div>
          )}
        </div>
      </div>

      {/* ADD / BULK ADD MODAL */}
      {isAddingModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Add / Import Delivery Cities</span>
              </h3>
              <button
                onClick={() => setIsAddingModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold gap-1">
              {[
                { id: 'single', label: 'Single City', icon: Plus },
                { id: 'bulk_text', label: 'Paste List / Text', icon: ListPlus },
                { id: 'csv', label: 'Upload CSV / Excel', icon: Upload },
                { id: 'presets', label: 'Regional Presets', icon: Sparkles }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setAddMode(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                      addMode === tab.id
                        ? 'bg-white text-slate-900 shadow-xs font-bold'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* MODE 1: SINGLE CITY FORM */}
            {addMode === 'single' && (
              <form onSubmit={handleAddSingleRule} className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">City Name *</label>
                    <input
                      type="text"
                      required
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      placeholder="e.g. Sialkot / Dubai"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Province / Region</label>
                    <select
                      value={newProvince}
                      onChange={(e) => setNewProvince(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    >
                      <option value="Punjab">Punjab</option>
                      <option value="Sindh">Sindh</option>
                      <option value="Federal">Islamabad / Federal</option>
                      <option value="KPK">KPK</option>
                      <option value="Balochistan">Balochistan</option>
                      <option value="AJK">Azad Kashmir (AJK)</option>
                      <option value="UAE">United Arab Emirates (UAE)</option>
                      <option value="Saudi Arabia">Saudi Arabia (KSA)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Shipping Fee ({settings.currencySymbol || 'Rs.'})</label>
                    <input
                      type="number"
                      value={newShippingFee}
                      onChange={(e) => setNewShippingFee(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Extra COD Fee ({settings.currencySymbol || 'Rs.'})</label>
                    <input
                      type="number"
                      value={newCodFee}
                      onChange={(e) => setNewCodFee(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Estimated Delivery SLA</label>
                    <input
                      type="text"
                      value={newEstimatedDays}
                      onChange={(e) => setNewEstimatedDays(e.target.value)}
                      placeholder="e.g. 2-3 Days"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">COD Payment Allowed?</label>
                    <select
                      value={newCodAllowed ? 'yes' : 'no'}
                      onChange={(e) => setNewCodAllowed(e.target.value === 'yes')}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                    >
                      <option value="yes">Yes - COD Allowed</option>
                      <option value="no">No - Block COD in this City</option>
                    </select>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newRequireAdvanceDeposit}
                      onChange={(e) => setNewRequireAdvanceDeposit(e.target.checked)}
                      className="w-4 h-4 text-amber-600 rounded"
                    />
                    <span className="font-bold text-slate-800">Require Advance Security Deposit for this City</span>
                  </label>

                  {newRequireAdvanceDeposit && (
                    <div className="pl-6 pt-1">
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">Deposit Amount ({settings.currencySymbol || 'Rs.'})</label>
                      <input
                        type="number"
                        value={newDepositAmount}
                        onChange={(e) => setNewDepositAmount(Number(e.target.value))}
                        className="w-36 px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs font-bold"
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsAddingModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold cursor-pointer shadow-sm"
                  >
                    Save Verified City
                  </button>
                </div>
              </form>
            )}

            {/* MODE 2: BULK TEXT LIST */}
            {addMode === 'bulk_text' && (
              <div className="space-y-3 text-xs">
                <p className="text-slate-600">
                  Paste city names separated by commas or line breaks. They will be auto-formatted and added to your verified delivery list.
                </p>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Paste City List</label>
                  <textarea
                    rows={5}
                    value={bulkText}
                    onChange={(e) => setBulkText(e.target.value)}
                    placeholder="Lahore, Karachi, Islamabad&#10;Faisalabad, Multan, Sialkot&#10;Gujranwala, Peshawar, Quetta"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Default Province</label>
                    <select
                      value={bulkDefaultProvince}
                      onChange={(e) => setBulkDefaultProvince(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                    >
                      <option value="Punjab">Punjab</option>
                      <option value="Sindh">Sindh</option>
                      <option value="Federal">Federal / Islamabad</option>
                      <option value="KPK">KPK</option>
                      <option value="Balochistan">Balochistan</option>
                      <option value="UAE">UAE</option>
                      <option value="Saudi Arabia">Saudi Arabia</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Default Shipping Fee</label>
                    <input
                      type="number"
                      value={bulkShippingFee}
                      onChange={(e) => setBulkShippingFee(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsAddingModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBulkTextImport}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold cursor-pointer shadow-sm"
                  >
                    Import All Cities
                  </button>
                </div>
              </div>
            )}

            {/* MODE 3: CSV UPLOAD */}
            {addMode === 'csv' && (
              <div className="space-y-3 text-xs">
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-emerald-500 transition-colors">
                  <FileSpreadsheet className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                  <p className="font-bold text-slate-800 mb-1">Upload CSV or Excel File</p>
                  <p className="text-slate-500 text-[11px] mb-4">Columns: City, Province, Shipping Fee, COD Fee</p>
                  
                  <label className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold cursor-pointer shadow-sm">
                    <Upload className="w-4 h-4" />
                    <span>Select .csv File</span>
                    <input
                      type="file"
                      accept=".csv,text/csv,text/plain"
                      onChange={handleCSVUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            )}

            {/* MODE 4: REGIONAL PRESETS */}
            {addMode === 'presets' && (
              <div className="space-y-3 text-xs">
                <p className="text-slate-600">
                  1-Click import standard courier hubs and verified delivery coverage lists:
                </p>

                <div className="space-y-2">
                  <button
                    onClick={() => handleImportPreset(PRESET_PAKISTAN_CITIES, 'Pakistan Main Metros (25+ Cities)')}
                    className="w-full p-3 bg-emerald-50/70 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-left flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="font-bold text-emerald-950">Pakistan Major Hubs & Metros (25+ Cities)</div>
                      <div className="text-[11px] text-emerald-700">Pre-configured with Trax & TCS standard courier rates</div>
                    </div>
                    <span className="px-3 py-1 bg-emerald-700 text-white font-bold rounded-lg text-xs">
                      1-Click Import
                    </span>
                  </button>

                  <button
                    onClick={() => handleImportPreset(PRESET_GCC_CITIES, 'GCC & Gulf Metros')}
                    className="w-full p-3 bg-amber-50/70 hover:bg-amber-100 border border-amber-200 rounded-xl text-left flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="font-bold text-amber-950">GCC & Gulf Metros (Dubai, Riyadh, Doha, Kuwait, Muscat)</div>
                      <div className="text-[11px] text-amber-700">Standard Middle East COD delivery zones</div>
                    </div>
                    <span className="px-3 py-1 bg-amber-700 text-white font-bold rounded-lg text-xs">
                      1-Click Import
                    </span>
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}