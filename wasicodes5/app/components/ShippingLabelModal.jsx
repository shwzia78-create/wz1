import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Printer, X, Truck, QrCode } from 'lucide-react';

export const ShippingLabelModal = () => {
  const { selectedOrderForPrint, setSelectedOrderForPrint, settings } = useApp();
  const [labelFormat, setLabelFormat] = useState('4x6');

  if (!selectedOrderForPrint) return null;

  const order = selectedOrderForPrint;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 no-print-bg">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[95vh] overflow-y-auto shadow-2xl border border-slate-300">
        
        {/* Modal Controls (Hidden in Print) */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between no-print bg-slate-50 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800">
              <Printer className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">COD Shipping Label & Receipt</h3>
              <p className="text-[11px] text-slate-500">Order: {order.shopifyOrderId} • Courier: {order.courier || 'Trax Logistics'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Format toggle */}
            <div className="bg-slate-200 p-0.5 rounded-lg flex text-xs font-semibold">
              <button
                onClick={() => setLabelFormat('4x6')}
                className={`px-2.5 py-1 rounded-md transition-all ${labelFormat === '4x6' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'}`}
              >
                Thermal 4x6"
              </button>
              <button
                onClick={() => setLabelFormat('A4')}
                className={`px-2.5 py-1 rounded-md transition-all ${labelFormat === 'A4' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'}`}
              >
                A4 Invoice
              </button>
            </div>

            <button
              onClick={() => setSelectedOrderForPrint(null)}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Label Area */}
        <div className="p-6 flex justify-center bg-slate-100/70">
          
          <div 
            id="printable-shipping-label"
            className={`bg-white border-2 border-black p-5 text-black font-sans shadow-lg transition-all ${
              labelFormat === '4x6' ? 'w-[380px] min-h-[540px]' : 'w-[500px] min-h-[680px]'
            }`}
          >
            
            {/* Top Courier Header */}
            <div className="border-b-2 border-black pb-3 mb-3 flex items-center justify-between">
              <div>
                <div className="text-xl font-black tracking-tighter uppercase flex items-center gap-1.5">
                  <Truck className="w-5 h-5 inline" />
                  <span>{order.courier || 'TRAX EXPRESS'}</span>
                </div>
                <div className="text-[10px] font-bold tracking-wider uppercase text-slate-700">
                  CASH ON DELIVERY (COD) EXPRESS
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-black bg-black text-white px-2 py-0.5 rounded">
                  {order.city.toUpperCase()}
                </div>
                <div className="text-[10px] font-mono mt-0.5">ZONE: {order.province}</div>
              </div>
            </div>

            {/* Tracking Barcode & Number */}
            <div className="text-center border-b-2 border-black pb-3 mb-3">
              <div className="font-mono text-xs tracking-widest font-bold">
                TRACKING #: {order.trackingNumber || 'TRX-98218739PK'}
              </div>
              
              {/* Simulated Barcode */}
              <div className="my-1.5 flex justify-center items-center h-12 overflow-hidden px-4">
                <div className="flex items-stretch h-10 w-full justify-between gap-[2px]">
                  {Array.from({ length: 48 }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`bg-black ${i % 3 === 0 ? 'w-1.5' : i % 5 === 0 ? 'w-1' : 'w-0.5'}`} 
                    />
                  ))}
                </div>
              </div>
              <div className="text-[10px] font-mono tracking-widest text-slate-800">
                *{order.shopifyOrderId}-{order.id}*
              </div>
            </div>

            {/* Shipper & Consignee Grid */}
            <div className="grid grid-cols-2 gap-2 border-b-2 border-black pb-3 mb-3 text-[11px]">
              
              {/* Shipper */}
              <div className="border-r border-black pr-2">
                <div className="font-black uppercase text-[10px] text-slate-700">FROM (SHIPPER):</div>
                <div className="font-bold">{settings.storeName}</div>
                <div className="text-[10px] text-slate-800">Plot 14-B, Industrial Area, Gulberg III, Lahore, Pakistan</div>
                <div className="font-mono text-[10px] mt-0.5">Ph: 0300-1234567</div>
              </div>

              {/* Consignee */}
              <div className="pl-1">
                <div className="font-black uppercase text-[10px] text-slate-700">SHIP TO (CUSTOMER):</div>
                <div className="font-bold text-sm">{order.customerName}</div>
                <div className="text-[11px] font-semibold">{order.address}</div>
                <div className="font-bold">{order.city}, {order.province} {order.postalCode}</div>
                <div className="font-mono font-bold text-xs mt-1 text-black bg-slate-100 p-0.5 inline-block">
                  📞 {order.phone}
                </div>
              </div>

            </div>

            {/* COD Amount Banner */}
            <div className="border-2 border-black bg-black text-white p-2.5 text-center my-3 rounded-xs">
              <div className="text-[10px] font-bold tracking-widest uppercase">
                TOTAL CASH TO COLLECT (COD):
              </div>
              <div className="text-2xl font-black tracking-tight">
                {settings.currencySymbol} {order.total.toLocaleString()} /-
              </div>
            </div>

            {/* Itemized summary */}
            <div className="text-[10px] border-b border-black pb-2 mb-2">
              <div className="font-bold mb-1 uppercase">Order Items ({order.items.length}):</div>
              <ul className="space-y-0.5">
                {order.items.map((it, idx) => (
                  <li key={idx} className="flex justify-between">
                    <span>{it.quantity}x {it.title} ({it.variant})</span>
                    <span className="font-mono">{settings.currencySymbol} {it.price * it.quantity}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer QR & verification note */}
            <div className="flex items-center justify-between text-[9px] pt-1 text-slate-700">
              <div>
                <div>Shopify Order: {order.shopifyOrderId}</div>
                <div>Date: {new Date(order.createdAt).toLocaleDateString()}</div>
                <div>MakCod Verified: Yes (100% Risk Safe)</div>
              </div>
              <div className="text-center font-mono">
                <div className="w-10 h-10 border border-black p-0.5 flex items-center justify-center mx-auto bg-slate-50">
                  <QrCode className="w-8 h-8 text-black" />
                </div>
                <span className="text-[8px]">SCAN TO VERIFY</span>
              </div>
            </div>

          </div>

        </div>

        {/* Modal Action Bar (Hidden in Print) */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between no-print rounded-b-2xl">
          <div className="text-xs text-slate-500">
            Thermal 4x6" label formatted for TSC, Xprinter, Zebra, and standard A4 printers.
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedOrderForPrint(null)}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100"
            >
              Close
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Print Label Now</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
