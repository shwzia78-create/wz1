// Shopify Remix Route: Dynamic Form Builder & Theme Customization Studio - /app/routes/app.form-builder.jsx
import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { json } from '@remix-run/node';
import { authenticate } from '../shopify.server';
import { 
  Sliders, 
  Sparkles, 
  Eye, 
  Palette, 
  ListOrdered, 
  Timer, 
  ShieldCheck, 
  Percent, 
  Smartphone, 
  Monitor, 
  Save,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Code,
  Copy,
  Check,
  Type,
  Layers,
  HelpCircle,
  Settings2,
  CheckCircle2,
  ExternalLink
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
  return json({ status: 'saved', data: Object.fromEntries(formData) });
};

const THEME_PRESETS = [
  {
    id: 'shopify_emerald',
    name: 'Shopify Emerald',
    headerBgColor: '#008060',
    headerTextColor: '#ffffff',
    buttonColor: '#008060',
    buttonTextColor: '#ffffff',
    buttonHoverColor: '#004c3f',
    formBgColor: '#ffffff',
    textColor: '#202223',
    inputBgColor: '#f6f6f7',
    inputBorderColor: '#d2d5d8',
    accentColor: '#10b981',
    fontFamily: 'Inter',
    borderRadius: 12,
  },
  {
    id: 'midnight_luxury',
    name: 'Midnight Black & Gold',
    headerBgColor: '#0f172a',
    headerTextColor: '#fbbf24',
    buttonColor: '#d97706',
    buttonTextColor: '#ffffff',
    buttonHoverColor: '#b45309',
    formBgColor: '#ffffff',
    textColor: '#0f172a',
    inputBgColor: '#f8fafc',
    inputBorderColor: '#cbd5e1',
    accentColor: '#d97706',
    fontFamily: 'Poppins',
    borderRadius: 8,
  },
  {
    id: 'modern_indigo',
    name: 'Modern Indigo & Violet',
    headerBgColor: '#4f46e5',
    headerTextColor: '#ffffff',
    buttonColor: '#4f46e5',
    buttonTextColor: '#ffffff',
    buttonHoverColor: '#4338ca',
    formBgColor: '#ffffff',
    textColor: '#1e1b4b',
    inputBgColor: '#f5f3ff',
    inputBorderColor: '#c7d2fe',
    accentColor: '#6366f1',
    fontFamily: 'Plus Jakarta Sans',
    borderRadius: 16,
  },
  {
    id: 'clean_rose',
    name: 'Rose & Warm Coral',
    headerBgColor: '#e11d48',
    headerTextColor: '#ffffff',
    buttonColor: '#e11d48',
    buttonTextColor: '#ffffff',
    buttonHoverColor: '#be123c',
    formBgColor: '#ffffff',
    textColor: '#1c1917',
    inputBgColor: '#fff1f2',
    inputBorderColor: '#fecdd3',
    accentColor: '#f43f5e',
    fontFamily: 'Outfit',
    borderRadius: 12,
  },
  {
    id: 'minimal_monochrome',
    name: 'Minimalist Monochrome',
    headerBgColor: '#18181b',
    headerTextColor: '#ffffff',
    buttonColor: '#18181b',
    buttonTextColor: '#ffffff',
    buttonHoverColor: '#27272a',
    formBgColor: '#ffffff',
    textColor: '#09090b',
    inputBgColor: '#fafafa',
    inputBorderColor: '#e4e4e7',
    accentColor: '#52525b',
    fontFamily: 'Inter',
    borderRadius: 4,
  }
];

const FONT_OPTIONS = [
  { id: 'Inter', name: 'Inter (Clean & Modern)', css: 'font-sans' },
  { id: 'Poppins', name: 'Poppins (Geometric & Friendly)', css: 'font-sans' },
  { id: 'Plus Jakarta Sans', name: 'Plus Jakarta Sans (High-End SaaS)', css: 'font-sans' },
  { id: 'Outfit', name: 'Outfit (Fashion & Lifestyle)', css: 'font-sans' },
  { id: 'Montserrat', name: 'Montserrat (Bold Display)', css: 'font-sans' },
  { id: 'Playfair Display', name: 'Playfair Display (Luxury Serif)', css: 'font-serif' },
  { id: 'Cairo', name: 'Cairo (Arabic & Latin Bilingual)', css: 'font-sans' },
  { id: 'Noto Nastaliq Urdu', name: 'Noto Nastaliq Urdu (Urdu Native)', css: 'font-serif' }
];

export default function FormBuilderRoute() {
  const appContext = useApp() || {};
  const { 
    formConfig = {}, 
    updateFormConfig = () => {}, 
    setIsExitIntentOpen = () => {}, 
    showToast = () => {}, 
    settings = {} 
  } = appContext;

  const [activeTab, setActiveTab] = useState('fields');
  const [devicePreview, setDevicePreview] = useState('desktop');
  const [isAddFieldModalOpen, setIsAddFieldModalOpen] = useState(false);
  const [isEmbedModalOpen, setIsEmbedModalOpen] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  // New field creator state
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldPlaceholder, setNewFieldPlaceholder] = useState('');
  const [newFieldType, setNewFieldType] = useState('text');
  const [newFieldRequired, setNewFieldRequired] = useState(false);
  const [newFieldHelpText, setNewFieldHelpText] = useState('');
  const [newFieldOptions, setNewFieldOptions] = useState('Option 1, Option 2, Option 3');

const fields = Array.isArray(formConfig?.fields) && formConfig.fields.length > 0 
    ? formConfig.fields 
    : [
        { id: 'f-1', name: 'fullName', label: 'Full Name', placeholder: 'Enter your full name', required: true, enabled: true, type: 'text' },
        { id: 'f-2', name: 'whatsapp', label: 'WhatsApp / Phone Number', placeholder: '0300 1234567', required: true, enabled: true, type: 'tel' },
        { id: 'f-3', name: 'city', label: 'City', placeholder: 'Select your city', required: true, enabled: true, type: 'select', options: ['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad'] },
        { id: 'f-4', name: 'address', label: 'Complete Delivery Address', placeholder: 'House #, Street name, Area', required: true, enabled: true, type: 'textarea' }
      ];

  // Toggle field visibility
  const handleFieldToggle = (fieldId) => {
    const updated = fields.map(f => f.id === fieldId ? { ...f, enabled: !f.enabled } : f);
    updateFormConfig({ fields: updated });
  };

  // Toggle field required
  const handleFieldRequiredToggle = (fieldId) => {
    const updated = fields.map(f => f.id === fieldId ? { ...f, required: !f.required } : f);
    updateFormConfig({ fields: updated });
  };

  // Change field label
  const handleFieldLabelChange = (fieldId, newLabel) => {
    const updated = fields.map(f => f.id === fieldId ? { ...f, label: newLabel } : f);
    updateFormConfig({ fields: updated });
  };

  // Move field UP
  const handleMoveUp = (index) => {
    if (index === 0) return;
    const newFields = [...fields];
    const temp = newFields[index - 1];
    newFields[index - 1] = newFields[index];
    newFields[index] = temp;
    updateFormConfig({ fields: newFields });
    showToast('Field Reordered', 'Field position moved up.');
  };

  // Move field DOWN
  const handleMoveDown = (index) => {
    if (index === fields.length - 1) return;
    const newFields = [...fields];
    const temp = newFields[index + 1];
    newFields[index + 1] = newFields[index];
    newFields[index] = temp;
    updateFormConfig({ fields: newFields });
    showToast('Field Reordered', 'Field position moved down.');
  };

  // Remove field
  const handleRemoveField = (fieldId) => {
    if (fields.length <= 2) {
      showToast('Action Blocked', 'At least 2 fields are required for checkout.', 'error');
      return;
    }
    const updated = fields.filter(f => f.id !== fieldId);
    updateFormConfig({ fields: updated });
    showToast('Field Removed', 'The form field has been deleted.');
  };

  // Add new field
  const handleAddNewField = (e) => {
    e.preventDefault();
    if (!newFieldLabel.trim()) {
      showToast('Validation Error', 'Field Label is required.', 'error');
      return;
    }

    const fieldId = `f-${Date.now()}`;
    const optionsArray = newFieldType === 'select' || newFieldType === 'radio'
      ? newFieldOptions.split(',').map(o => o.trim()).filter(Boolean)
      : undefined;

    const newField = {
      id: fieldId,
      name: newFieldName.trim() || `custom_${fieldId}`,
      label: newFieldLabel.trim(),
      placeholder: newFieldPlaceholder.trim() || `Enter ${newFieldLabel.trim()}`,
      required: newFieldRequired,
      enabled: true,
      type: newFieldType,
      options: optionsArray,
      helpText: newFieldHelpText.trim() || undefined,
      isCustom: true
    };

    updateFormConfig({ fields: [...fields, newField] });
    setIsAddFieldModalOpen(false);
    setNewFieldName('');
    setNewFieldLabel('');
    setNewFieldPlaceholder('');
    setNewFieldType('text');
    setNewFieldRequired(false);
    setNewFieldHelpText('');
    showToast('Field Added', `"${newField.label}" added to form fields.`);
  };

  // Apply Theme Preset
  const handleApplyPreset = (preset) => {
    updateFormConfig({
      headerBgColor: preset.headerBgColor,
      headerTextColor: preset.headerTextColor,
      buttonColor: preset.buttonColor,
      buttonTextColor: preset.buttonTextColor,
      buttonHoverColor: preset.buttonHoverColor,
      formBgColor: preset.formBgColor,
      textColor: preset.textColor,
      inputBgColor: preset.inputBgColor,
      inputBorderColor: preset.inputBorderColor,
      accentColor: preset.accentColor,
      fontFamily: preset.fontFamily,
      borderRadius: preset.borderRadius
    });
    showToast('Theme Preset Applied', `Applied "${preset.name}" styling.`);
  };

  // Generated Embed Liquid Snippet
  const generatedLiquidCode = useMemo(() => {
    return `<!-- Codify 1-Click Cash on Delivery App Block -->
<div id="codify-quick-order-form"
  data-shop="${settings.storeName || 'your-store.myshopify.com'}"
  data-product-id="{{ product.id }}"
  data-variant-id="{{ product.selected_or_first_available_variant.id }}"
  data-button-color="${formConfig.buttonColor || '#008060'}"
  data-border-radius="${formConfig.borderRadius || 12}px"
  data-font-family="${formConfig.fontFamily || 'Inter'}"
  class="codify-embedded-container">
  {% render 'codify-1click-checkout' %}
</div>

<script defer src="https://cdn.codify-apps.com/storefront/v2/codify-loader.js"></script>`;
  }, [formConfig, settings]);

  const handleCopyCode = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(generatedLiquidCode);
      setCopiedSnippet(true);
      setTimeout(() => setCopiedSnippet(false), 2500);
      showToast('Copied to Clipboard', 'Paste this snippet in your Shopify theme product.liquid template or Theme Customizer.');
    }
  };

  return (
    <div className="space-y-6 max-w-[1500px] mx-auto">
      
      {/* Top Banner */}
      <div className="bg-white border border-[#e1e3e5] rounded-xl p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#202223]">Codify Form Builder & Store Theme Studio</h1>
              <p className="text-xs text-[#6d7175]">
                Customize form fields, typography, colors to match your store branding, and generate 1-click embed code.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsEmbedModalOpen(true)}
            className="px-3.5 py-2 bg-slate-900 hover:bg-black text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Code className="w-3.5 h-3.5 text-emerald-400" />
            <span>Get Embed Code</span>
          </button>
          
          <button
            onClick={() => setIsExitIntentOpen(true)}
            className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Test Exit-Intent</span>
          </button>

          <button
            onClick={() => showToast('Form Config Saved', 'Your storefront COD popup and theme settings have been published.')}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Publish to Theme</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Controls on Left, Live Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Settings Panel (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Sub-tabs */}
          <div className="flex bg-white p-1 rounded-xl border border-[#e1e3e5] shadow-2xs text-xs font-semibold overflow-x-auto gap-1">
            {[
              { id: 'fields', label: 'Form Fields & Logic', icon: ListOrdered },
              { id: 'styling', label: 'Theme & Typography', icon: Palette },
              { id: 'embed', label: 'Embed & Liquid Code', icon: Code },
              { id: 'exit_intent', label: 'Exit-Intent Discount', icon: Percent },
              { id: 'scarcity', label: 'Urgency & Trust', icon: Timer },
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

          {/* TAB 1: DYNAMIC FORM FIELDS */}
          {activeTab === 'fields' && (
            <div className="bg-white border border-[#e1e3e5] rounded-xl p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#202223]">Form Input Fields & Field Ordering</h3>
                  <p className="text-xs text-[#6d7175]">Add, remove, reorder, and configure custom input fields.</p>
                </div>
                
                <button
                  onClick={() => setIsAddFieldModalOpen(true)}
                  className="px-3 py-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Add New Field</span>
                </button>
              </div>

              {/* Fields List with Reorder Controls */}
              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div 
                    key={field.id} 
                    className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={field.enabled}
                          onChange={() => handleFieldToggle(field.id)}
                          className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
                        />
                        <span className="font-bold text-xs text-slate-800">{field.label || field.name}</span>
                        <span className="text-[10px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-600 font-mono uppercase">
                          {field.type}
                        </span>
                        {field.isCustom && (
                          <span className="text-[9px] bg-purple-100 text-purple-700 font-bold px-1.5 py-0.5 rounded">
                            Custom
                          </span>
                        )}
                      </div>

                      {/* Controls: Reorder & Actions */}
                      <div className="flex items-center gap-2 text-xs">
                        <label className="flex items-center gap-1 cursor-pointer text-slate-600 mr-1">
                          <input
                            type="checkbox"
                            checked={field.required}
                            disabled={!field.enabled}
                            onChange={() => handleFieldRequiredToggle(field.id)}
                            className="w-3.5 h-3.5 text-emerald-600 rounded cursor-pointer"
                          />
                          <span className="text-[11px] font-medium">Required</span>
                        </label>

                        {/* Move Up */}
                        <button
                          onClick={() => handleMoveUp(index)}
                          disabled={index === 0}
                          title="Move field up"
                          className="p-1 rounded bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>

                        {/* Move Down */}
                        <button
                          onClick={() => handleMoveDown(index)}
                          disabled={index === fields.length - 1}
                          title="Move field down"
                          className="p-1 rounded bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Field */}
                        <button
                          onClick={() => handleRemoveField(field.id)}
                          title="Delete field"
                          className="p-1 rounded bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                      <div>
                        <label className="text-[10px] text-slate-500 font-semibold block mb-0.5">Label (English)</label>
                        <input
                          type="text"
                          value={field.label}
                          onChange={(e) => handleFieldLabelChange(field.id, e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 font-semibold block mb-0.5">Placeholder</label>
                        <input
                          type="text"
                          value={field.placeholder || ''}
                          onChange={(e) => {
                            const updated = fields.map(f => f.id === field.id ? { ...f, placeholder: e.target.value } : f);
                            updateFormConfig({ fields: updated });
                          }}
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Extra toggles */}
              <div className="pt-4 border-t border-slate-200 space-y-2.5 text-xs">
                <h4 className="font-bold text-slate-800">Checkout Add-ons & Fast Selectors</h4>
                
                <label className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100">
                  <div>
                    <div className="font-semibold text-slate-800">Show Quantity (+ / -) Selector</div>
                    <div className="text-[11px] text-slate-500">Allow customers to quickly order multiple units inside the modal</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={formConfig.showQuantitySelector}
                    onChange={(e) => updateFormConfig({ showQuantitySelector: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100">
                  <div>
                    <div className="font-semibold text-slate-800">Direct 1-Click Buy Now Button</div>
                    <div className="text-[11px] text-slate-500">Bypasses cart page directly to COD modal on product page</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={formConfig.enableOneClickBuy}
                    onChange={(e) => updateFormConfig({ enableOneClickBuy: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100">
                  <div>
                    <div className="font-semibold text-slate-800">Verified City Dropdown & Fuzzy Anti-Typo</div>
                    <div className="text-[11px] text-slate-500">Auto-suggests standardized courier delivery cities to eliminate return fees</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={formConfig.enableCityDropdown}
                    onChange={(e) => updateFormConfig({ enableCityDropdown: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                  />
                </label>
              </div>
            </div>
          )}

          {/* TAB 2: THEME & TYPOGRAPHY MATCHING */}
          {activeTab === 'styling' && (
            <div className="bg-white border border-[#e1e3e5] rounded-xl p-5 shadow-2xs space-y-5">
              <div>
                <h3 className="text-sm font-bold text-[#202223]">Store Theme Matching & Typography</h3>
                <p className="text-xs text-[#6d7175]">
                  Select 1-click theme presets or customize exact hex colors, typography font families, and border radius.
                </p>
              </div>

              {/* Theme Presets */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 block">1-Click Theme Presets</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {THEME_PRESETS.map(preset => (
                    <button
                      key={preset.id}
                      onClick={() => handleApplyPreset(preset)}
                      className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-800">{preset.name}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{preset.fontFamily} • {preset.borderRadius}px radius</div>
                      </div>
                      <div className="flex items-center gap-1.5 mt-2.5">
                        <div className="w-4 h-4 rounded-full border border-black/10" style={{ backgroundColor: preset.headerBgColor }} />
                        <div className="w-4 h-4 rounded-full border border-black/10" style={{ backgroundColor: preset.buttonColor }} />
                        <div className="w-4 h-4 rounded-full border border-black/10" style={{ backgroundColor: preset.accentColor }} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Typography & Fonts */}
              <div className="space-y-3 pt-2 border-t border-slate-200">
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Type className="w-4 h-4 text-emerald-700" />
                  <span>Typography & Font Family</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Font Family</label>
                    <select
                      value={formConfig.fontFamily || 'Inter'}
                      onChange={(e) => updateFormConfig({ fontFamily: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    >
                      {FONT_OPTIONS.map(font => (
                        <option key={font.id} value={font.id}>{font.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Border Radius</label>
                    <div className="flex items-center gap-2">
                      {[0, 6, 12, 16, 24].map(rad => (
                        <button
                          key={rad}
                          onClick={() => updateFormConfig({ borderRadius: rad })}
                          className={`flex-1 py-1.5 rounded text-xs font-bold border transition-colors cursor-pointer ${
                            (formConfig.borderRadius || 12) === rad
                              ? 'bg-emerald-700 text-white border-emerald-700'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {rad}px
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Color Customization Grid */}
              <div className="space-y-3 pt-2 border-t border-slate-200">
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Palette className="w-4 h-4 text-emerald-700" />
                  <span>Custom Color Palette</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  
                  {/* Header Background */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                    <label className="font-bold text-slate-800 block text-[11px]">Header Background</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formConfig.headerBgColor || '#008060'}
                        onChange={(e) => updateFormConfig({ headerBgColor: e.target.value })}
                        className="w-9 h-8 rounded border border-slate-300 cursor-pointer p-0.5"
                      />
                      <input
                        type="text"
                        value={formConfig.headerBgColor || '#008060'}
                        onChange={(e) => updateFormConfig({ headerBgColor: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded font-mono text-xs"
                      />
                    </div>
                  </div>

                  {/* Primary Buy Button */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                    <label className="font-bold text-slate-800 block text-[11px]">Buy Button Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formConfig.buttonColor || '#008060'}
                        onChange={(e) => updateFormConfig({ buttonColor: e.target.value })}
                        className="w-9 h-8 rounded border border-slate-300 cursor-pointer p-0.5"
                      />
                      <input
                        type="text"
                        value={formConfig.buttonColor || '#008060'}
                        onChange={(e) => updateFormConfig({ buttonColor: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded font-mono text-xs"
                      />
                    </div>
                  </div>

                  {/* Button Text Color */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                    <label className="font-bold text-slate-800 block text-[11px]">Button Text Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formConfig.buttonTextColor || '#ffffff'}
                        onChange={(e) => updateFormConfig({ buttonTextColor: e.target.value })}
                        className="w-9 h-8 rounded border border-slate-300 cursor-pointer p-0.5"
                      />
                      <input
                        type="text"
                        value={formConfig.buttonTextColor || '#ffffff'}
                        onChange={(e) => updateFormConfig({ buttonTextColor: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded font-mono text-xs"
                      />
                    </div>
                  </div>

                  {/* Accent Highlight Color */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                    <label className="font-bold text-slate-800 block text-[11px]">Accent & Badge Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formConfig.accentColor || '#10b981'}
                        onChange={(e) => updateFormConfig({ accentColor: e.target.value })}
                        className="w-9 h-8 rounded border border-slate-300 cursor-pointer p-0.5"
                      />
                      <input
                        type="text"
                        value={formConfig.accentColor || '#10b981'}
                        onChange={(e) => updateFormConfig({ accentColor: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded font-mono text-xs"
                      />
                    </div>
                  </div>

                </div>
              </div>

              {/* Text Copies */}
              <div className="space-y-3 text-xs pt-2 border-t border-slate-200">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Popup Header Title</label>
                  <input
                    type="text"
                    value={formConfig.popupTitle}
                    onChange={(e) => updateFormConfig({ popupTitle: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">Popup Subtitle</label>
                  <input
                    type="text"
                    value={formConfig.popupSubtitle}
                    onChange={(e) => updateFormConfig({ popupSubtitle: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">Buy Button Copy</label>
                  <input
                    type="text"
                    value={formConfig.buttonText}
                    onChange={(e) => updateFormConfig({ buttonText: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: EMBED CODE GENERATOR */}
          {activeTab === 'embed' && (
            <div className="bg-white border border-[#e1e3e5] rounded-xl p-5 shadow-2xs space-y-4">
              <div>
                <h3 className="text-sm font-bold text-[#202223] flex items-center gap-2">
                  <Code className="w-4 h-4 text-emerald-700" />
                  <span>Shopify Storefront Embed & App Block Code</span>
                </h3>
                <p className="text-xs text-[#6d7175]">
                  Easily add Codify to your Shopify product pages using Theme App Extensions or manual liquid snippets.
                </p>
              </div>

              {/* Method 1: Theme App Extension */}
              <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-xs text-emerald-950">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Method 1: Shopify Theme Customizer (Online Store 2.0 - Recommended)</span>
                  </div>
                  <span className="text-[10px] bg-emerald-200 text-emerald-900 font-bold px-2 py-0.5 rounded">
                    No Code Required
                  </span>
                </div>
                <ol className="list-decimal list-inside text-xs text-slate-700 space-y-1 pl-1">
                  <li>Go to <strong>Shopify Admin &gt; Online Store &gt; Themes</strong>.</li>
                  <li>Click <strong>Customize</strong> on your active theme.</li>
                  <li>Navigate to <strong>Default Product</strong> page.</li>
                  <li>Under <strong>Product Information</strong>, click <strong>Add Block &gt; Apps &gt; Codify 1-Click Form</strong>.</li>
                  <li>Drag the block right beneath your "Buy it now" button and click <strong>Save</strong>!</li>
                </ol>
              </div>

              {/* Method 2: Liquid Snippet */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Method 2: Direct Liquid / HTML Snippet</span>
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-black text-white rounded-lg text-xs font-bold cursor-pointer transition-colors"
                  >
                    {copiedSnippet ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSnippet ? 'Copied!' : 'Copy Liquid Code'}</span>
                  </button>
                </div>

                <div className="p-3.5 bg-slate-900 text-emerald-300 rounded-xl font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800">
                  <pre>{generatedLiquidCode}</pre>
                </div>
                <p className="text-[11px] text-slate-500">
                  Paste into <code className="bg-slate-100 text-slate-700 px-1 py-0.5 rounded font-mono">snippets/codify-checkout.liquid</code> or directly inside your product form template.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: EXIT-INTENT CONFIG */}
          {activeTab === 'exit_intent' && (
            <div className="bg-white border border-[#e1e3e5] rounded-xl p-5 shadow-2xs space-y-4">
              <div>
                <h3 className="text-sm font-bold text-[#202223]">Exit-Intent Abandonment Interceptor</h3>
                <p className="text-xs text-[#6d7175]">
                  Detects when a shopper is about to close the tab or press back, offering a timed discount.
                </p>
              </div>

              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span className="font-bold text-xs text-amber-950">Enable Exit-Intent Trigger</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={formConfig.exitIntent.enabled}
                    onChange={(e) => updateFormConfig({
                      exitIntent: { ...formConfig.exitIntent, enabled: e.target.checked }
                    })}
                    className="w-4 h-4 text-amber-600 rounded cursor-pointer"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Discount Value</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={formConfig.exitIntent.discountValue}
                        onChange={(e) => updateFormConfig({
                          exitIntent: { ...formConfig.exitIntent, discountValue: Number(e.target.value) }
                        })}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-amber-500 focus:outline-none"
                      />
                      <span className="font-bold text-slate-700">% OFF</span>
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Coupon Code (Auto-Applied)</label>
                    <input
                      type="text"
                      value={formConfig.exitIntent.couponCode}
                      onChange={(e) => updateFormConfig({
                        exitIntent: { ...formConfig.exitIntent, couponCode: e.target.value }
                      })}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded font-mono font-bold uppercase focus:ring-1 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Modal Headline</label>
                  <input
                    type="text"
                    value={formConfig.exitIntent.headline}
                    onChange={(e) => updateFormConfig({
                      exitIntent: { ...formConfig.exitIntent, headline: e.target.value }
                    })}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded focus:ring-1 focus:ring-amber-500 focus:outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Subheadline Description</label>
                  <input
                    type="text"
                    value={formConfig.exitIntent.subheadline}
                    onChange={(e) => updateFormConfig({
                      exitIntent: { ...formConfig.exitIntent, subheadline: e.target.value }
                    })}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded focus:ring-1 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-medium text-slate-600">Urgency Countdown Seconds:</span>
                  <input
                    type="number"
                    value={formConfig.exitIntent.timerSeconds}
                    onChange={(e) => updateFormConfig({
                      exitIntent: { ...formConfig.exitIntent, timerSeconds: Number(e.target.value) }
                    })}
                    className="w-24 px-2 py-1 text-xs bg-white border border-slate-300 rounded text-center font-bold"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                <span className="text-slate-600">Preview exit-intent modal in interactive mode:</span>
                <button
                  onClick={() => setIsExitIntentOpen(true)}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg cursor-pointer"
                >
                  Test Popup Now
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: SCARCITY & TRUST BADGES */}
          {activeTab === 'scarcity' && (
            <div className="bg-white border border-[#e1e3e5] rounded-xl p-5 shadow-2xs space-y-4">
              <div>
                <h3 className="text-sm font-bold text-[#202223]">Scarcity & Trust Badges</h3>
                <p className="text-xs text-[#6d7175]">Increase FOMO and reassure customers with doorstep inspection badges.</p>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-xs text-slate-800">Cart Reservation Countdown Timer</div>
                    <div className="text-[11px] text-slate-500">Displays "Items reserved in your cart for 14:59" bar</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={formConfig.showTimer}
                    onChange={(e) => updateFormConfig({ showTimer: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Timer Bar Text</label>
                  <input
                    type="text"
                    value={formConfig.timerText}
                    onChange={(e) => updateFormConfig({ timerText: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <label className="font-bold text-xs text-slate-800 block">Trust & Doorstep Guarantee Badge Text</label>
                <input
                  type="text"
                  value={formConfig.trustBadgeText}
                  onChange={(e) => updateFormConfig({ trustBadgeText: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>
          )}

        </div>

        {/* Live Preview Panel (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          
          <div className="flex items-center justify-between bg-slate-900 text-white px-4 py-2.5 rounded-t-xl">
            <div className="flex items-center gap-2 text-xs font-bold">
              <Eye className="w-3.5 h-3.5 text-emerald-400" />
              <span>Real-Time Storefront Preview</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setDevicePreview(devicePreview === 'desktop' ? 'mobile' : 'desktop')}
                className="text-[11px] bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded flex items-center gap-1 cursor-pointer"
              >
                {devicePreview === 'desktop' ? <Smartphone className="w-3 h-3 text-emerald-400" /> : <Monitor className="w-3 h-3 text-emerald-400" />}
                <span>{devicePreview === 'desktop' ? 'Mobile View' : 'Desktop View'}</span>
              </button>
            </div>
          </div>

          <div className="bg-slate-800 p-4 rounded-b-xl flex justify-center min-h-[500px]">
            
            {/* Embedded Form Mockup with Dynamic Theme Matching */}
            <div 
              style={{
                fontFamily: formConfig.fontFamily || 'Inter, sans-serif',
                borderRadius: `${formConfig.borderRadius || 12}px`,
              }}
              className={`bg-white shadow-2xl overflow-hidden text-xs transition-all ${
                devicePreview === 'mobile' ? 'w-full max-w-[340px]' : 'w-full'
              }`}
            >
              
              {/* Header */}
              <div 
                style={{ 
                  backgroundColor: formConfig.headerBgColor || '#008060',
                  color: formConfig.headerTextColor || '#ffffff'
                }}
                className="p-4 text-center"
              >
                <div className="font-bold text-sm">{formConfig.popupTitle}</div>
                <div className="text-[11px] opacity-90 mt-0.5">{formConfig.popupSubtitle}</div>
              </div>

              {/* Timer */}
              {formConfig.showTimer && (
                <div className="bg-amber-50 border-b border-amber-200 py-1.5 px-3 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-amber-900">
                  <Timer className="w-3.5 h-3.5 text-amber-600" />
                  <span>{formConfig.timerText}</span>
                  <span className="font-mono font-bold bg-amber-200 px-1.5 py-0.2 rounded">14:59</span>
                </div>
              )}

              {/* Product mini header */}
              <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
                <div className="flex items-center gap-2.5">
                  <img
                    src="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=120&auto=format&fit=crop&q=80"
                    alt="Demo"
                    className="w-10 h-10 object-cover rounded-lg border border-slate-200"
                  />
                  <div>
                    <div className="font-bold text-[11px] text-slate-800">Egyptian Embroidered Kurta</div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      {settings.currencySymbol || 'Rs.'} 3,499 • Free Delivery
                    </div>
                  </div>
                </div>
                {formConfig.showQuantitySelector && (
                  <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden text-[11px]">
                    <button className="px-2 py-0.5 hover:bg-slate-100 font-bold">-</button>
                    <span className="px-2 font-bold text-slate-800">1</span>
                    <button className="px-2 py-0.5 hover:bg-slate-100 font-bold">+</button>
                  </div>
                )}
              </div>

              {/* Form elements preview */}
              <div className="p-4 space-y-3">
                {fields.filter(f => f.enabled).map(f => (
                  <div key={f.id} className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-700">
                      {f.label} {f.required && <span className="text-rose-500">*</span>}
                    </label>

                    {f.type === 'textarea' ? (
                      <textarea
                        disabled
                        rows={2}
                        placeholder={f.placeholder}
                        style={{ borderRadius: `${Math.max(4, (formConfig.borderRadius || 12) - 4)}px` }}
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 text-slate-400 text-[11px] resize-none"
                      />
                    ) : f.type === 'select' ? (
                      <select
                        disabled
                        style={{ borderRadius: `${Math.max(4, (formConfig.borderRadius || 12) - 4)}px` }}
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 text-slate-500 text-[11px]"
                      >
                        <option>{f.placeholder || 'Select city...'}</option>
                        {(f.options || ['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Dubai', 'Riyadh']).map(opt => (
                          <option key={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : f.type === 'checkbox' ? (
                      <label className="flex items-center gap-2 text-[11px] text-slate-600 cursor-pointer">
                        <input type="checkbox" defaultChecked className="w-3.5 h-3.5 text-emerald-600 rounded" />
                        <span>{f.placeholder || f.label}</span>
                      </label>
                    ) : (
                      <input
                        type="text"
                        disabled
                        placeholder={f.placeholder}
                        style={{ borderRadius: `${Math.max(4, (formConfig.borderRadius || 12) - 4)}px` }}
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 text-slate-400 text-[11px]"
                      />
                    )}

                    {f.helpText && (
                      <p className="text-[9px] text-slate-400">{f.helpText}</p>
                    )}
                  </div>
                ))}

                {/* Buy Button */}
                <div className="pt-2">
                  <button
                    style={{ 
                      backgroundColor: formConfig.buttonColor || '#008060', 
                      color: formConfig.buttonTextColor || '#ffffff',
                      borderRadius: `${formConfig.borderRadius || 12}px`
                    }}
                    className="w-full py-2.5 font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-opacity hover:opacity-90 cursor-pointer"
                  >
                    <span>{formConfig.buttonText}</span>
                  </button>
                </div>

                {/* Trust Badge */}
                <div className="text-center text-[9px] text-slate-500 flex items-center justify-center gap-1 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{formConfig.trustBadgeText}</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ADD FIELD MODAL */}
      {isAddFieldModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-600" />
                <span>Add New Form Field</span>
              </h3>
              <button
                onClick={() => setIsAddFieldModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddNewField} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Field Label (Visible to Customer) *</label>
                <input
                  type="text"
                  required
                  value={newFieldLabel}
                  onChange={(e) => setNewFieldLabel(e.target.value)}
                  placeholder="e.g. Alternate Phone / House No. / Gift Message"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Field Type</label>
                  <select
                    value={newFieldType}
                    onChange={(e) => setNewFieldType(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="text">Single Line Text</option>
                    <option value="tel">Phone / WhatsApp Number</option>
                    <option value="email">Email Address</option>
                    <option value="textarea">Multi-line Textarea</option>
                    <option value="select">Dropdown Options</option>
                    <option value="checkbox">Checkbox Toggle</option>
                    <option value="number">Number</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Internal Key</label>
                  <input
                    type="text"
                    value={newFieldName}
                    onChange={(e) => setNewFieldName(e.target.value)}
                    placeholder="e.g. alt_phone"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-[11px]"
                  />
                </div>
              </div>

              {newFieldType === 'select' && (
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Dropdown Options (Comma separated)</label>
                  <input
                    type="text"
                    value={newFieldOptions}
                    onChange={(e) => setNewFieldOptions(e.target.value)}
                    placeholder="Small, Medium, Large"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
              )}

              <div>
                <label className="font-bold text-slate-700 block mb-1">Placeholder Text</label>
                <input
                  type="text"
                  value={newFieldPlaceholder}
                  onChange={(e) => setNewFieldPlaceholder(e.target.value)}
                  placeholder="e.g. Enter additional notes..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Help Text (Optional hint)</label>
                <input
                  type="text"
                  value={newFieldHelpText}
                  onChange={(e) => setNewFieldHelpText(e.target.value)}
                  placeholder="e.g. We will contact this number if primary is unreachable"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newFieldRequired}
                    onChange={(e) => setNewFieldRequired(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span className="font-bold text-slate-800">Make this field mandatory (Required)</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddFieldModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold cursor-pointer shadow-sm"
                >
                  Add Field to Form
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EMBED CODE MODAL */}
      {isEmbedModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Code className="w-4 h-4 text-emerald-600" />
                <span>Embed Codify 1-Click Form in Shopify Store</span>
              </h3>
              <button
                onClick={() => setIsEmbedModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600">
                Copy this snippet and insert it into your Shopify Theme Customizer as an App Block, or paste into <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">product.liquid</code>.
              </p>

              <div className="p-3 bg-slate-900 text-emerald-300 rounded-xl font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800 max-h-48">
                <pre>{generatedLiquidCode}</pre>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-slate-500 text-[11px]">Dynamic styling & fields will auto-sync with this admin panel.</span>
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold cursor-pointer shadow-sm"
                >
                  {copiedSnippet ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSnippet ? 'Copied Code!' : 'Copy Code'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
