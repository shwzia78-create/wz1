import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Send,
  Printer,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  UserCheck,
  ShieldCheck,
  ShieldAlert,
  ArrowUpDown,
  ExternalLink,
  MessageCircle,
  Truck
} from 'lucide-react';

export const OrderTable = () => {
  const {
    orders,
    staff,
    settings,
    verifyOrder,
    cancelOrder,
    sendWhatsAppConfirmation,
    assignOrderToStaff,
    openShippingLabelModal,
    addToast,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [staffFilter, setStaffFilter] = useState('ALL');
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [sortField, setSortField] = useState('createdAt');
  const [sortAsc, setSortAsc] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

  // Filtering Logic
  const filteredOrders = useMemo(() => {
    return (orders || []).filter((order) => {
      if (!order) return false;
      
      // Search
      const q = searchQuery.toLowerCase();
      const orderIdMatch = (order.id || '').toLowerCase().includes(q) || (order.shopifyOrderId || '').toLowerCase().includes(q);
      const nameMatch = (order.customerName || '').toLowerCase().includes(q);
      const phoneMatch = (order.phone || '').includes(q);
      const cityMatch = (order.city || '').toLowerCase().includes(q);
      const matchesSearch = !q || orderIdMatch || nameMatch || phoneMatch || cityMatch;

      // Status
      const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;

      // Risk
      const matchesRisk =
        riskFilter === 'ALL' ||
        (riskFilter === 'HIGH_CRITICAL' && (order.riskLevel === 'HIGH' || order.riskLevel === 'CRITICAL')) ||
        order.riskLevel === riskFilter;

      // Staff
      const matchesStaff = staffFilter === 'ALL' || order.assignedStaffId === staffFilter;

      return matchesSearch && matchesStatus && matchesRisk && matchesStaff;
    }).sort((a, b) => {
      let valA = a[sortField] ?? '';
      let valB = b[sortField] ?? '';
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [orders, searchQuery, statusFilter, riskFilter, staffFilter, sortField, sortAsc]);

  // Bulk Actions
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedOrders(filteredOrders.map((o) => o.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOne = (id) => {
    if (selectedOrders.includes(id)) {
      setSelectedOrders(selectedOrders.filter((item) => item !== id));
    } else {
      setSelectedOrders([...selectedOrders, id]);
    }
  };

  const handleBulkVerify = () => {
    selectedOrders.forEach((id) => verifyOrder(id));
    addToast(`Successfully verified ${selectedOrders.length} orders`, 'success');
    setSelectedOrders([]);
  };

  const handleBulkWhatsApp = () => {
    selectedOrders.forEach((id) => sendWhatsAppConfirmation(id));
    addToast(`Queued WhatsApp messages for ${selectedOrders.length} orders`, 'success');
    setSelectedOrders([]);
  };

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const getRiskBadge = (level, score) => {
    switch (level) {
      case 'LOW':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            <span>Low ({score})</span>
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            <span>Med ({score})</span>
          </span>
        );
      case 'HIGH':
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 animate-pulse">
            <ShieldAlert className="w-3 h-3 text-rose-600" />
            <span>High ({score})</span>
          </span>
        );
      default:
        return null;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">Pending Call</span>;
      case 'VERIFIED':
        return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">Verified & Ready</span>;
      case 'DISPATCHED':
        return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">Dispatched</span>;
      case 'DELIVERED':
        return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">Delivered</span>;
      case 'CANCELLED':
        return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-200 text-gray-700">Cancelled / RTO</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#E1E3E5] shadow-xs overflow-hidden">
      {/* Header & Tabs */}
      <div className="p-4 border-b border-[#E1E3E5] space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Quick Filter Tabs */}
          <div className="flex items-center gap-1 bg-[#F6F6F7] p-1 rounded-lg border border-[#E1E3E5] overflow-x-auto">
            {[
              { id: 'ALL', label: 'All Orders', count: (orders || []).length },
              { id: 'PENDING', label: 'Pending', count: (orders || []).filter((o) => o && o.status === 'PENDING').length },
              { id: 'VERIFIED', label: 'Verified', count: (orders || []).filter((o) => o && o.status === 'VERIFIED').length },
              { id: 'HIGH_RISK', label: 'High Risk', count: (orders || []).filter((o) => o && (o.riskLevel === 'HIGH' || o.riskLevel === 'CRITICAL')).length },
              { id: 'DISPATCHED', label: 'Dispatched', count: (orders || []).filter((o) => o && o.status === 'DISPATCHED').length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.id === 'HIGH_RISK') {
                    setRiskFilter('HIGH_CRITICAL');
                    setStatusFilter('ALL');
                  } else {
                    setStatusFilter(tab.id);
                    setRiskFilter('ALL');
                  }
                }}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  (tab.id === 'HIGH_RISK' && riskFilter === 'HIGH_CRITICAL') ||
                  (tab.id !== 'HIGH_RISK' && statusFilter === tab.id && riskFilter === 'ALL')
                    ? 'bg-white text-[#202223] shadow-xs font-semibold'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <span>{tab.label}</span>
                <span className="px-1.5 py-0.2 bg-gray-200 text-gray-700 rounded-full text-[10px] font-mono">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative min-w-[240px] flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search name, phone, city, order ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-[#F6F6F7] border border-[#E1E3E5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008060] focus:bg-white"
            />
          </div>
        </div>

        {/* Secondary Filter Dropdowns & Bulk Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2">
            {/* Risk Filter */}
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="text-xs bg-white border border-[#E1E3E5] rounded-md px-2.5 py-1 text-gray-700 focus:outline-none"
            >
              <option value="ALL">All Risk Scores</option>
              <option value="LOW">Low Risk Only (&lt; 40)</option>
              <option value="MEDIUM">Medium Risk (40 - 70)</option>
              <option value="HIGH_CRITICAL">High / Fraud Risk (&gt; 70)</option>
            </select>

            {/* Staff Filter */}
            <select
              value={staffFilter}
              onChange={(e) => setStaffFilter(e.target.value)}
              className="text-xs bg-white border border-[#E1E3E5] rounded-md px-2.5 py-1 text-gray-700 focus:outline-none"
            >
              <option value="ALL">All Assigned Staff</option>
              {(staff || []).map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.role})
                </option>
              ))}
            </select>
          </div>

          {/* Bulk Selection Bar */}
          {selectedOrders.length > 0 && (
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg text-xs text-emerald-900 animate-fadeIn">
              <span className="font-semibold">{selectedOrders.length} selected</span>
              <button
                onClick={handleBulkVerify}
                className="px-2 py-0.5 bg-emerald-600 text-white rounded hover:bg-emerald-700 font-medium cursor-pointer"
              >
                Mark Verified
              </button>
              <button
                onClick={handleBulkWhatsApp}
                className="px-2 py-0.5 bg-[#25D366] text-white rounded hover:bg-emerald-600 font-medium flex items-center gap-1 cursor-pointer"
              >
                <MessageCircle className="w-3 h-3" /> Send WhatsApp OTP
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F6F6F7] text-gray-600 font-semibold border-b border-[#E1E3E5] select-none">
            <tr>
              <th className="p-4 w-8">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={filteredOrders.length > 0 && selectedOrders.length === filteredOrders.length}
                  className="rounded text-[#008060] focus:ring-[#008060] cursor-pointer"
                />
              </th>
              <th className="px-4 py-3 cursor-pointer" onClick={() => toggleSort('shopifyOrderId')}>
                <div className="flex items-center gap-1">
                  <span>Order</span>
                  <ArrowUpDown className="w-3 h-3 text-gray-400" />
                </div>
              </th>
              <th className="px-4 py-3 cursor-pointer" onClick={() => toggleSort('customerName')}>
                <div className="flex items-center gap-1">
                  <span>Customer & Phone</span>
                  <ArrowUpDown className="w-3 h-3 text-gray-400" />
                </div>
              </th>
              <th className="px-4 py-3 cursor-pointer" onClick={() => toggleSort('city')}>
                <div className="flex items-center gap-1">
                  <span>City / Address</span>
                  <ArrowUpDown className="w-3 h-3 text-gray-400" />
                </div>
              </th>
              <th className="px-4 py-3 cursor-pointer" onClick={() => toggleSort('total')}>
                <div className="flex items-center gap-1">
                  <span>Total Amount</span>
                  <ArrowUpDown className="w-3 h-3 text-gray-400" />
                </div>
              </th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 cursor-pointer" onClick={() => toggleSort('riskScore')}>
                <div className="flex items-center gap-1">
                  <span>RTO Shield</span>
                  <ArrowUpDown className="w-3 h-3 text-gray-400" />
                </div>
              </th>
              <th className="px-4 py-3">Assigned Staff</th>
              <th className="px-4 py-3 text-right">Quick Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-800">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-8 text-center text-gray-400">
                  <div className="max-w-xs mx-auto space-y-2">
                    <p className="font-semibold text-gray-600">No Orders Found</p>
                    <p className="text-xs">No orders match your active search and filter criteria.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className={`hover:bg-[#F9FAFB] transition-colors ${
                    selectedOrders.includes(order.id) ? 'bg-emerald-50/50' : ''
                  }`}
                >
                  {/* Checkbox */}
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => handleSelectOne(order.id)}
                      className="rounded text-[#008060] focus:ring-[#008060] cursor-pointer"
                    />
                  </td>

                  {/* Order ID */}
                  <td className="px-4 py-3 font-medium text-[#202223] whitespace-nowrap">
                    <div className="font-bold text-[#005bd3]">{order.shopifyOrderId || order.id || '#ORDER'}</div>
                    <div className="text-[10px] text-gray-400 font-mono">{order.id || ''}</div>
                  </td>

                  {/* Customer */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="font-medium text-[#202223]">{order.customerName || 'Customer'}</div>
                    <div className="text-gray-400 font-mono text-[11px]">{order.phone || '-'}</div>
                  </td>

                  {/* Location */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="font-medium text-gray-700">{order.city || '-'}</div>
                    <div className="text-gray-400 text-[11px] truncate max-w-[140px]" title={order.address || ''}>
                      {order.address || '-'}
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="px-4 py-3 whitespace-nowrap font-medium text-[#202223]">
                    <div>{settings?.currencySymbol || 'Rs.'} {(order.total || 0).toLocaleString()}</div>
                    <div className="text-[10px] text-gray-400">{(order.items?.length || 0)} items</div>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    {getStatusBadge(order.status)}
                  </td>

                  {/* Risk Score */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    {getRiskBadge(order.riskLevel, order.riskScore)}
                  </td>

                  {/* Assigned Staff */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <select
                      value={order.assignedStaffId || ''}
                      onChange={(e) => assignOrderToStaff(order.id, e.target.value)}
                      className="text-xs bg-transparent border border-gray-200 rounded px-1.5 py-0.5 text-gray-700 focus:outline-none focus:bg-white"
                    >
                      <option value="">Unassigned</option>
                      {(staff || []).map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Quick Actions */}
                  <td className="px-4 py-3 whitespace-nowrap text-right space-x-1">
                    {/* View Details */}
                    <button
                      onClick={() => setSelectedOrderDetails(order)}
                      title="View Full Details"
                      className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-900 inline-flex cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>

                    {/* WhatsApp */}
                    <button
                      onClick={() => sendWhatsAppConfirmation(order.id)}
                      title="Send WhatsApp OTP Confirmation"
                      className={`p-1.5 rounded inline-flex cursor-pointer ${
                        order.whatsappStatus === 'CONFIRMED'
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'hover:bg-emerald-50 text-gray-400 hover:text-emerald-600'
                      }`}
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                    </button>

                    {/* Shipping Label */}
                    <button
                      onClick={() => openShippingLabelModal(order)}
                      title="Print Courier Shipping Label"
                      className="p-1.5 hover:bg-blue-50 rounded text-gray-400 hover:text-blue-600 inline-flex cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>

                    {/* Quick Verify */}
                    {order.status === 'PENDING' && (
                      <button
                        onClick={() => verifyOrder(order.id)}
                        title="Mark Verified"
                        className="p-1.5 hover:bg-emerald-50 rounded text-gray-400 hover:text-emerald-600 inline-flex cursor-pointer"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Quick Cancel */}
                    {order.status !== 'CANCELLED' && (
                      <button
                        onClick={() => cancelOrder(order.id)}
                        title="Cancel Order / Block Risk"
                        className="p-1.5 hover:bg-rose-50 rounded text-gray-400 hover:text-rose-600 inline-flex cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Order Details Drawer / Modal */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-[#E1E3E5] max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div>
                <h3 className="font-bold text-[#202223] text-base">
                  Order Details {selectedOrderDetails.shopifyOrderId}
                </h3>
                <p className="text-xs text-gray-400">ID: {selectedOrderDetails.id}</p>
              </div>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="text-gray-400 hover:text-gray-700 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Risk Assessment Box */}
            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs space-y-2">
              <div className="flex items-center justify-between font-semibold text-amber-900">
                <span className="flex items-center gap-1">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  RTO Fraud Shield Analysis
                </span>
                <span className="font-mono font-bold">Risk Score: {selectedOrderDetails.riskScore}/100</span>
              </div>
              <div className="space-y-1 text-gray-700">
                {(selectedOrderDetails.riskFactors || []).map((f, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Information */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-gray-50 rounded border border-[#E1E3E5]">
                <h4 className="font-bold text-gray-700 mb-1.5 uppercase text-[10px] tracking-wider">Customer Details</h4>
                <p><span className="text-gray-500">Name:</span> <strong>{selectedOrderDetails.customerName}</strong></p>
                <p><span className="text-gray-500">Phone:</span> <strong>{selectedOrderDetails.phone}</strong></p>
                <p><span className="text-gray-500">IP:</span> {selectedOrderDetails.ipAddress || 'N/A'}</p>
              </div>

              <div className="p-3 bg-gray-50 rounded border border-[#E1E3E5]">
                <h4 className="font-bold text-gray-700 mb-1.5 uppercase text-[10px] tracking-wider">Delivery Address</h4>
                <p><span className="text-gray-500">City:</span> <strong>{selectedOrderDetails.city}</strong></p>
                <p className="text-gray-700 mt-1 leading-tight">{selectedOrderDetails.address}</p>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-gray-700 uppercase text-[10px] tracking-wider">Order Summary</h4>
              <div className="p-3 bg-gray-50 rounded border border-[#E1E3E5] space-y-1">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span>{settings?.currencySymbol || 'Rs.'} {(selectedOrderDetails.subtotal || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping:</span>
                  <span>{settings?.currencySymbol || 'Rs.'} {selectedOrderDetails.shippingFee || 0}</span>
                </div>
                <div className="flex justify-between font-bold text-[#202223] text-sm pt-1 border-t border-gray-200">
                  <span>Total COD Collectable:</span>
                  <span>{settings?.currencySymbol || 'Rs.'} {(selectedOrderDetails.total || 0).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons inside Drawer */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  sendWhatsAppConfirmation(selectedOrderDetails.id);
                  setSelectedOrderDetails(null);
                }}
                className="px-3 py-1.5 bg-[#25D366] text-white rounded text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" /> Send WhatsApp OTP
              </button>
              <button
                onClick={() => {
                  openShippingLabelModal(selectedOrderDetails);
                  setSelectedOrderDetails(null);
                }}
                className="px-3 py-1.5 bg-[#008060] text-white rounded text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" /> Print Label
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};