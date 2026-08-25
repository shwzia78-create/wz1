import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Order, 
  StaffMember, 
  FormCustomization, 
  WhatsAppConfig, 
  LocationRule, 
  BlacklistItem, 
  AutoTagRule, 
  UpsellOffer, 
  DepositGatewayConfig, 
  AppSettings,
  RiskLevel
} from '../types';
import { 
  INITIAL_SETTINGS, 
  INITIAL_STAFF, 
  INITIAL_ORDERS, 
  INITIAL_FORM_CONFIG, 
  INITIAL_WHATSAPP_CONFIG, 
  INITIAL_LOCATION_RULES, 
  INITIAL_BLACKLIST, 
  INITIAL_UPSELLS, 
  INITIAL_TAG_RULES, 
  INITIAL_DEPOSIT_GATEWAYS 
} from '../mockData/initialData';

interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>, silent?: boolean) => void;
  orders: Order[];
  addOrder: (order: Partial<Order>) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  updateOrderRisk: (orderId: string, riskLevel: RiskLevel, score: number, factors: string[]) => void;
  assignOrderStaff: (orderId: string, staffId: string) => void;
  verifyWhatsAppOrder: (orderId: string, confirmed: boolean) => void;
  deleteOrder: (orderId: string) => void;
  staff: StaffMember[];
  updateStaffMember: (staffId: string, updates: Partial<StaffMember>) => void;
  addStaffMember: (newStaff: Omit<StaffMember, 'id' | 'currentAssignedCount' | 'confirmedCount' | 'cancelledCount' | 'rtoCount' | 'confirmationRate'>) => void;
  deleteStaffMember: (staffId: string) => void;
  formConfig: FormCustomization;
  updateFormConfig: (newConfig: Partial<FormCustomization>) => void;
  whatsAppConfig: WhatsAppConfig;
  updateWhatsAppConfig: (newConfig: Partial<WhatsAppConfig>) => void;
  locationRules: LocationRule[];
  addLocationRule: (rule: Omit<LocationRule, 'id'>) => void;
  updateLocationRule: (ruleId: string, updates: Partial<LocationRule>) => void;
  deleteLocationRule: (ruleId: string) => void;
  blacklist: BlacklistItem[];
  addBlacklistItem: (item: Omit<BlacklistItem, 'id' | 'addedAt' | 'blockedAttempts'>) => void;
  deleteBlacklistItem: (itemId: string) => void;
  upsells: UpsellOffer[];
  toggleUpsell: (upsellId: string) => void;
  updateUpsell: (upsellId: string, updates: Partial<UpsellOffer>) => void;
  addUpsell: (offer: Omit<UpsellOffer, 'id'>) => void;
  tagRules: AutoTagRule[];
  toggleTagRule: (ruleId: string) => void;
  addTagRule: (rule: Omit<AutoTagRule, 'id'>) => void;
  depositGateways: DepositGatewayConfig;
  updateDepositGateways: (updates: Partial<DepositGatewayConfig>) => void;
  activeRoute: string;
  setActiveRoute: (route: string) => void;
  toasts: ToastMessage[];
  showToast: (title: string, message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
  selectedOrderForPrint: Order | null;
  setSelectedOrderForPrint: (order: Order | null) => void;
  isExitIntentOpen: boolean;
  setIsExitIntentOpen: (open: boolean) => void;
  isFormPreviewOpen: boolean;
  setIsFormPreviewOpen: (open: boolean) => void;
  calculateAIRisk: (order: Partial<Order>) => { level: RiskLevel; score: number; factors: string[]; requiresDeposit: boolean; depositAmt: number };
  autoAssignOrderToStaff: (orderCity: string) => StaffMember | undefined;
  verifyOrder: (orderId: string) => void;
  cancelOrder: (orderId: string) => void;
  sendWhatsAppConfirmation: (orderId: string) => void;
  assignOrderToStaff: (orderId: string, staffId: string) => void;
  openShippingLabelModal: (order: Order) => void;
  addToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Safe storage helper
const safeGetItem = (key: string, fallback: any) => {
  if (typeof window === 'undefined') return fallback;
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch (e) {
    return fallback;
  }
};

const safeSetItem = (key: string, value: any) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // ignore quota/storage errors
  }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from localStorage or default
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = safeGetItem('makcod_settings', null);
    return saved ? { ...INITIAL_SETTINGS, ...saved } : INITIAL_SETTINGS;
  });

  const [orders, setOrders] = useState<Order[]>(() => safeGetItem('makcod_orders', INITIAL_ORDERS));
  const [staff, setStaff] = useState<StaffMember[]>(() => safeGetItem('makcod_staff', INITIAL_STAFF));
  const [formConfig, setFormConfig] = useState<FormCustomization>(() => safeGetItem('makcod_form_config', INITIAL_FORM_CONFIG));
  const [whatsAppConfig, setWhatsAppConfig] = useState<WhatsAppConfig>(() => safeGetItem('makcod_whatsapp_config', INITIAL_WHATSAPP_CONFIG));
  const [locationRules, setLocationRules] = useState<LocationRule[]>(() => safeGetItem('makcod_location_rules', INITIAL_LOCATION_RULES));
  const [blacklist, setBlacklist] = useState<BlacklistItem[]>(() => safeGetItem('makcod_blacklist', INITIAL_BLACKLIST));
  const [upsells, setUpsells] = useState<UpsellOffer[]>(() => safeGetItem('makcod_upsells', INITIAL_UPSELLS));
  const [tagRules, setTagRules] = useState<AutoTagRule[]>(() => safeGetItem('makcod_tag_rules', INITIAL_TAG_RULES));
  const [depositGateways, setDepositGateways] = useState<DepositGatewayConfig>(() => safeGetItem('makcod_deposit_gateways', INITIAL_DEPOSIT_GATEWAYS));

  const [activeRoute, setActiveRoute] = useState<string>('dashboard');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [selectedOrderForPrint, setSelectedOrderForPrint] = useState<Order | null>(null);
  const [isExitIntentOpen, setIsExitIntentOpen] = useState<boolean>(false);
  const [isFormPreviewOpen, setIsFormPreviewOpen] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    safeSetItem('makcod_settings', settings);
  }, [settings]);

  useEffect(() => {
    safeSetItem('makcod_orders', orders);
  }, [orders]);

  useEffect(() => {
    safeSetItem('makcod_staff', staff);
  }, [staff]);

  useEffect(() => {
    safeSetItem('makcod_form_config', formConfig);
  }, [formConfig]);

  useEffect(() => {
    safeSetItem('makcod_whatsapp_config', whatsAppConfig);
  }, [whatsAppConfig]);

  useEffect(() => {
    safeSetItem('makcod_location_rules', locationRules);
  }, [locationRules]);

  useEffect(() => {
    safeSetItem('makcod_blacklist', blacklist);
  }, [blacklist]);

  useEffect(() => {
    safeSetItem('makcod_upsells', upsells);
  }, [upsells]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback((title: string, message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  }, [removeToast]);

  const updateSettings = useCallback((newSettings: Partial<AppSettings>, silent: boolean = false) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    if (!silent) {
      showToast('Settings Updated', 'MakCod configuration saved successfully.');
    }
  }, [showToast]);

  // AI Risk calculation engine
  const calculateAIRisk = useCallback((order: Partial<Order>) => {
    let score = 10;
    const factors: string[] = [];
    let requiresDeposit = false;
    let depositAmt = 0;

    const phone = order.phone || '';
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const address = (order.address || '').toLowerCase();
    const city = (order.city || '').toLowerCase();
    const total = order.total || 0;

    // Check blacklist first
    const blacklistedPhone = blacklist.find(b => b.type === 'PHONE' && cleanPhone.includes((b.value || '').replace(/[^0-9]/g, '')));
    if (blacklistedPhone) {
      score += 65;
      factors.push(`Blacklisted Phone Number: ${blacklistedPhone.reason || 'Flagged'}`);
      requiresDeposit = true;
    }

    const blacklistedAddress = blacklist.find(b => b.type === 'ADDRESS' && address.includes((b.value || '').toLowerCase()));
    if (blacklistedAddress) {
      score += 50;
      factors.push(`Flagged Address Zone: ${blacklistedAddress.reason || 'Flagged'}`);
      requiresDeposit = true;
    }

    // Phone format check
    if (cleanPhone.length < 10 || cleanPhone.length > 13) {
      score += 35;
      factors.push('Abnormal phone number length (suspicious fake entry)');
    }

    // High cart value
    if (total > 15000) {
      score += 25;
      factors.push(`High COD Cart Value (Rs. ${total.toLocaleString()})`);
      requiresDeposit = true;
    }

    // Address specificity check
    if (address.length < 15 || (!address.includes('house') && !address.includes('flat') && !address.includes('street') && !address.includes('gali') && !address.includes('sector') && !address.includes('block') && !address.includes('road') && !address.includes('phase'))) {
      score += 20;
      factors.push('Vague or incomplete delivery address missing house/street detail');
    }

    // Location specific check
    const matchedLocRule = locationRules.find(r => {
      const name = (r.cityName || r.city || r.name || '').toLowerCase();
      return name && city && (name.includes(city) || city.includes(name));
    });
    if (matchedLocRule && (matchedLocRule.requiresAdvanceDeposit || matchedLocRule.requireAdvanceDeposit)) {
      score += 20;
      factors.push(`High RTO Delivery Zone: ${matchedLocRule.cityName || matchedLocRule.city || matchedLocRule.name || 'Location'}`);
      requiresDeposit = true;
      depositAmt = matchedLocRule.depositAmount || 500;
    }

    // Cap score at 99
    score = Math.min(score, 99);

    let level: RiskLevel = 'LOW';
    if (score >= settings.riskScoreThresholdHigh) {
      level = 'HIGH';
    } else if (score >= settings.riskScoreThresholdMedium) {
      level = 'MEDIUM';
    }

    if (requiresDeposit && depositAmt === 0) {
      depositAmt = depositGateways.defaultDepositAmount || 500;
    }

    return { level, score, factors, requiresDeposit, depositAmt };
  }, [blacklist, locationRules, settings.riskScoreThresholdHigh, settings.riskScoreThresholdMedium, depositGateways.defaultDepositAmount]);

  // Staff auto-assignment logic
  const autoAssignOrderToStaff = useCallback((orderCity: string): StaffMember | undefined => {
    if (!settings.autoAssignStaff) return undefined;

    // Filter active staff
    const activeStaff = staff.filter(s => s.status === 'ACTIVE');
    if (activeStaff.length === 0) return undefined;

    const cityLower = (orderCity || '').toLowerCase();

    if (settings.routingMode === 'CITY_BASED') {
      const cityMatched = activeStaff.find(s => s.assignedCities?.some(c => (c || '').toLowerCase() === cityLower));
      if (cityMatched) return cityMatched;
    }

    if (settings.routingMode === 'QUOTA') {
      // Find staff whose current count is strictly under their assigned quota
      const underQuotaStaff = activeStaff.find(s => s.currentAssignedCount < s.assignedQuota);
      if (underQuotaStaff) return underQuotaStaff;
    }

    // Fallback: Round-robin or lowest assigned count
    return [...activeStaff].sort((a, b) => a.currentAssignedCount - b.currentAssignedCount)[0];
  }, [settings.autoAssignStaff, settings.routingMode, staff]);

  const addOrder = useCallback((orderData: Partial<Order>): Order => {
    const risk = calculateAIRisk(orderData);
    const assigned = autoAssignOrderToStaff(orderData.city || '');

    // Generate tags based on auto-tag rules
    const newTags: string[] = [];
    if (orderData.city) newTags.push(`${orderData.city.toUpperCase()}-COD`);
    if (risk.level === 'HIGH') newTags.push('RISK_HIGH', 'NEEDS_DEPOSIT');
    if (risk.level === 'LOW') newTags.push('RISK_LOW_SAFE');
    if (assigned) newTags.push(`STAFF_${(assigned.name || 'AGENT').split(' ')[0].toUpperCase()}`);

    const newOrder: Order = {
      id: `MC-${Math.floor(1000 + Math.random() * 9000)}`,
      shopifyOrderId: `#${Math.floor(10400 + Math.random() * 600)}`,
      customerName: orderData.customerName || 'Walk-in Customer',
      phone: orderData.phone || '0300-0000000',
      email: orderData.email || '',
      city: orderData.city || 'Lahore',
      province: orderData.province || 'Punjab',
      address: orderData.address || 'Street address',
      postalCode: orderData.postalCode || '54000',
      items: orderData.items || [
        {
          id: 'it-demo',
          title: 'MakCod Premium Apparel - 2026 Collection',
          variant: 'Standard / Fit',
          price: orderData.subtotal || 3500,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=120&auto=format&fit=crop&q=80',
        }
      ],
      subtotal: orderData.subtotal || 3500,
      shippingFee: orderData.shippingFee !== undefined ? orderData.shippingFee : 150,
      codFee: orderData.codFee !== undefined ? orderData.codFee : 99,
      discount: orderData.discount || 0,
      total: orderData.total || ((orderData.subtotal || 3500) + (orderData.shippingFee !== undefined ? orderData.shippingFee : 150) + (orderData.codFee !== undefined ? orderData.codFee : 99) - (orderData.discount || 0)),
      status: 'PENDING',
      riskLevel: risk.level,
      riskScore: risk.score,
      riskFactors: risk.factors,
      assignedStaffId: assigned?.id,
      assignedStaffName: assigned?.name,
      tags: newTags,
      depositRequired: risk.requiresDeposit,
      depositAmount: risk.depositAmt,
      depositStatus: risk.requiresDeposit ? 'PENDING' : 'NONE',
      depositMethod: risk.requiresDeposit ? 'JazzCash' : undefined,
      whatsappStatus: 'UNSENT',
      createdAt: new Date().toISOString(),
      ipAddress: '111.119.187.' + Math.floor(Math.random() * 250),
      source: (orderData.source as any) || 'MakCod Quick Form',
      courier: 'Trax',
    };

    setOrders(prev => [newOrder, ...prev]);

    // Update staff count
    if (assigned) {
      setStaff(prev => prev.map(s => s.id === assigned.id ? { ...s, currentAssignedCount: s.currentAssignedCount + 1 } : s));
    }

    showToast('New COD Order Received!', `Order ${newOrder.id} for ${newOrder.customerName} (Rs. ${newOrder.total.toLocaleString()}) created with AI Risk: ${newOrder.riskLevel}.`);
    return newOrder;
  }, [calculateAIRisk, autoAssignOrderToStaff, showToast]);

  const updateOrderStatus = useCallback((orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        return { ...order, status };
      }
      return order;
    }));
    showToast('Order Status Updated', `Order ${orderId} moved to ${status}`);
  }, [showToast]);

  const updateOrderRisk = useCallback((orderId: string, riskLevel: RiskLevel, score: number, factors: string[]) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        return { ...order, riskLevel, riskScore: score, riskFactors: factors };
      }
      return order;
    }));
    showToast('AI Risk Re-evaluated', `Order ${orderId} risk updated to ${riskLevel} (${score}/100)`);
  }, [showToast]);

  const assignOrderStaff = useCallback((orderId: string, staffId: string) => {
    const selected = staff.find(s => s.id === staffId);
    if (!selected) return;

    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          assignedStaffId: selected.id,
          assignedStaffName: selected.name,
          tags: [...order.tags.filter(t => !t.startsWith('STAFF_')), `STAFF_${selected.name.split(' ')[0].toUpperCase()}`]
        };
      }
      return order;
    }));

    setStaff(prev => prev.map(s => s.id === staffId ? { ...s, currentAssignedCount: s.currentAssignedCount + 1 } : s));
    showToast('Staff Assigned', `Order ${orderId} routed to ${selected.name}`);
  }, [staff, showToast]);

  const verifyWhatsAppOrder = useCallback((orderId: string, confirmed: boolean) => {
    const targetOrder = orders.find(o => o.id === orderId);
    if (!targetOrder) return;

    const newStatus: Order['status'] = confirmed ? 'VERIFIED' : 'CANCELLED';
    const newWhatsAppStatus: Order['whatsappStatus'] = confirmed ? 'CONFIRMED' : 'CANCELLED';

    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const updatedTags = confirmed 
          ? [...order.tags.filter(t => t !== 'WHATSAPP_PENDING'), 'VERIFIED_WHATSAPP']
          : [...order.tags.filter(t => t !== 'WHATSAPP_PENDING'), 'CANCELLED_BY_CUSTOMER'];
        return {
          ...order,
          status: newStatus,
          whatsappStatus: newWhatsAppStatus,
          tags: updatedTags,
        };
      }
      return order;
    }));

    // Update staff confirmation metrics
    if (targetOrder.assignedStaffId) {
      setStaff(prev => prev.map(s => {
        if (s.id === targetOrder.assignedStaffId) {
          const confirmedCount = confirmed ? s.confirmedCount + 1 : s.confirmedCount;
          const cancelledCount = !confirmed ? s.cancelledCount + 1 : s.cancelledCount;
          const totalResolved = confirmedCount + cancelledCount;
          const confirmationRate = totalResolved > 0 ? Number(((confirmedCount / totalResolved) * 100).toFixed(1)) : s.confirmationRate;
          return {
            ...s,
            confirmedCount,
            cancelledCount,
            confirmationRate,
          };
        }
        return s;
      }));
    }

    showToast(
      confirmed ? 'Order Confirmed via WhatsApp! 📱' : 'Order Cancelled via WhatsApp',
      `Order ${orderId} updated to ${confirmed ? 'VERIFIED' : 'CANCELLED'}. Tags synchronized with Shopify.`,
      confirmed ? 'success' : 'warning'
    );
  }, [orders, showToast]);

  const deleteOrder = useCallback((orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
    showToast('Order Deleted', `Order ${orderId} removed from dashboard.`);
  }, [showToast]);

  const updateStaffMember = useCallback((staffId: string, updates: Partial<StaffMember>) => {
    setStaff(prev => prev.map(s => s.id === staffId ? { ...s, ...updates } : s));
    showToast('Staff Member Updated', 'Agent quota and routing preferences saved.');
  }, [showToast]);

  const addStaffMember = useCallback((newStaff: Omit<StaffMember, 'id' | 'currentAssignedCount' | 'confirmedCount' | 'cancelledCount' | 'rtoCount' | 'confirmationRate'>) => {
    const created: StaffMember = {
      ...newStaff,
      id: `staff-${Date.now()}`,
      currentAssignedCount: 0,
      confirmedCount: 0,
      cancelledCount: 0,
      rtoCount: 0,
      confirmationRate: 100,
    };
    setStaff(prev => [...prev, created]);
    showToast('Staff Added', `${created.name} is now available for automated order auto-routing.`);
  }, [showToast]);

  const deleteStaffMember = useCallback((staffId: string) => {
    setStaff(prev => prev.filter(s => s.id !== staffId));
    showToast('Staff Removed', 'Agent removed from rotation.');
  }, [showToast]);

  const updateFormConfig = useCallback((newConfig: Partial<FormCustomization>) => {
    setFormConfig(prev => ({ ...prev, ...newConfig }));
    showToast('COD Popup Form Saved', 'Changes will reflect on your Shopify storefront immediately.');
  }, [showToast]);

  const updateWhatsAppConfig = useCallback((newConfig: Partial<WhatsAppConfig>) => {
    setWhatsAppConfig(prev => ({ ...prev, ...newConfig }));
    showToast('WhatsApp Settings Saved', 'Hybrid verification rules updated.');
  }, [showToast]);

  const addLocationRule = useCallback((rule: Omit<LocationRule, 'id'>) => {
    const newRule: LocationRule = { ...rule, id: `loc-${Date.now()}` };
    setLocationRules(prev => [...prev, newRule]);
    showToast('Location Rule Added', `COD rule for ${newRule.cityName || newRule.city || newRule.name || 'Location'} is now live.`);
  }, [showToast]);

  const updateLocationRule = useCallback((ruleId: string, updates: Partial<LocationRule>) => {
    setLocationRules(prev => prev.map(r => r.id === ruleId ? { ...r, ...updates } : r));
    showToast('Location Rule Updated', 'City COD fees and restrictions updated.');
  }, [showToast]);

  const deleteLocationRule = useCallback((ruleId: string) => {
    setLocationRules(prev => prev.filter(r => r.id !== ruleId));
    showToast('Location Rule Removed', 'City rule deleted.');
  }, [showToast]);

  const addBlacklistItem = useCallback((item: Omit<BlacklistItem, 'id' | 'addedAt' | 'blockedAttempts'>) => {
    const newItem: BlacklistItem = {
      ...item,
      id: `bl-${Date.now()}`,
      addedAt: new Date().toISOString().split('T')[0],
      blockedAttempts: 0,
    };
    setBlacklist(prev => [newItem, ...prev]);
    showToast('Added to Blacklist', `${item.value} (${item.type}) will now be ${item.severity === 'BLOCK_ORDER' ? 'auto-blocked' : 'flagged'}.`);
  }, [showToast]);

  const deleteBlacklistItem = useCallback((itemId: string) => {
    setBlacklist(prev => prev.filter(b => b.id !== itemId));
    showToast('Removed from Blacklist', 'Entry restored to whitelist.');
  }, [showToast]);

  const toggleUpsell = useCallback((upsellId: string) => {
    setUpsells(prev => prev.map(u => u.id === upsellId ? { ...u, enabled: !u.enabled } : u));
    showToast('Upsell Toggled', 'Storefront checkout offer updated.');
  }, [showToast]);

  const updateUpsell = useCallback((upsellId: string, updates: Partial<UpsellOffer>) => {
    setUpsells(prev => prev.map(u => u.id === upsellId ? { ...u, ...updates } : u));
    showToast('Upsell Saved', 'Offer details updated.');
  }, [showToast]);

  const addUpsell = useCallback((offer: Omit<UpsellOffer, 'id'>) => {
    const newOffer: UpsellOffer = { ...offer, id: `up-${Date.now()}` };
    setUpsells(prev => [...prev, newOffer]);
    showToast('New Upsell Created', `${newOffer.title} is now enabled for checkout.`);
  }, [showToast]);

  const toggleTagRule = useCallback((ruleId: string) => {
    setTagRules(prev => prev.map(r => r.id === ruleId ? { ...r, enabled: !r.enabled } : r));
  }, []);

  const addTagRule = useCallback((rule: Omit<AutoTagRule, 'id'>) => {
    const newRule: AutoTagRule = { ...rule, id: `tr-${Date.now()}` };
    setTagRules(prev => [...prev, newRule]);
    showToast('Tag Rule Added', `Orders matching condition will be tagged with #${newRule.targetTag}`);
  }, [showToast]);

  const updateDepositGateways = useCallback((updates: Partial<DepositGatewayConfig>) => {
    setDepositGateways(prev => ({ ...prev, ...updates }));
    showToast('Deposit Gateways Saved', 'JazzCash / EasyPaisa / Bank Transfer accounts updated.');
  }, [showToast]);

  const verifyOrder = useCallback((orderId: string) => {
    updateOrderStatus(orderId, 'VERIFIED');
  }, [updateOrderStatus]);

  const cancelOrder = useCallback((orderId: string) => {
    updateOrderStatus(orderId, 'CANCELLED');
  }, [updateOrderStatus]);

  const sendWhatsAppConfirmation = useCallback((orderId: string) => {
    verifyWhatsAppOrder(orderId, true);
  }, [verifyWhatsAppOrder]);

  const assignOrderToStaff = useCallback((orderId: string, staffId: string) => {
    assignOrderStaff(orderId, staffId);
  }, [assignOrderStaff]);

  const openShippingLabelModal = useCallback((order: Order) => {
    setSelectedOrderForPrint(order);
  }, []);

  const addToast = useCallback((message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    showToast('Codify Alert', message, type);
  }, [showToast]);

  const contextValue = useMemo(() => ({
    settings,
    updateSettings,
    orders,
    addOrder,
    updateOrderStatus,
    updateOrderRisk,
    assignOrderStaff,
    verifyWhatsAppOrder,
    deleteOrder,
    staff,
    updateStaffMember,
    addStaffMember,
    deleteStaffMember,
    formConfig,
    updateFormConfig,
    whatsAppConfig,
    updateWhatsAppConfig,
    locationRules,
    addLocationRule,
    updateLocationRule,
    deleteLocationRule,
    blacklist,
    addBlacklistItem,
    deleteBlacklistItem,
    upsells,
    toggleUpsell,
    updateUpsell,
    addUpsell,
    tagRules,
    toggleTagRule,
    addTagRule,
    depositGateways,
    updateDepositGateways,
    activeRoute,
    setActiveRoute,
    toasts,
    showToast,
    removeToast,
    selectedOrderForPrint,
    setSelectedOrderForPrint,
    isExitIntentOpen,
    setIsExitIntentOpen,
    isFormPreviewOpen,
    setIsFormPreviewOpen,
    calculateAIRisk,
    autoAssignOrderToStaff,
    verifyOrder,
    cancelOrder,
    sendWhatsAppConfirmation,
    assignOrderToStaff,
    openShippingLabelModal,
    addToast,
  }), [
    settings,
    updateSettings,
    orders,
    addOrder,
    updateOrderStatus,
    updateOrderRisk,
    assignOrderStaff,
    verifyWhatsAppOrder,
    deleteOrder,
    staff,
    updateStaffMember,
    addStaffMember,
    deleteStaffMember,
    formConfig,
    updateFormConfig,
    whatsAppConfig,
    updateWhatsAppConfig,
    locationRules,
    addLocationRule,
    updateLocationRule,
    deleteLocationRule,
    blacklist,
    addBlacklistItem,
    deleteBlacklistItem,
    upsells,
    toggleUpsell,
    updateUpsell,
    addUpsell,
    tagRules,
    toggleTagRule,
    addTagRule,
    depositGateways,
    updateDepositGateways,
    activeRoute,
    toasts,
    showToast,
    removeToast,
    selectedOrderForPrint,
    isExitIntentOpen,
    isFormPreviewOpen,
    calculateAIRisk,
    autoAssignOrderToStaff,
    verifyOrder,
    cancelOrder,
    sendWhatsAppConfirmation,
    assignOrderToStaff,
    openShippingLabelModal,
    addToast,
  ]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

const FALLBACK_CONTEXT: AppContextType = {
  settings: INITIAL_SETTINGS,
  updateSettings: () => {},
  orders: INITIAL_ORDERS,
  addOrder: () => INITIAL_ORDERS[0],
  updateOrderStatus: () => {},
  updateOrderRisk: () => {},
  assignOrderStaff: () => {},
  verifyWhatsAppOrder: () => {},
  deleteOrder: () => {},
  staff: INITIAL_STAFF,
  updateStaffMember: () => {},
  addStaffMember: () => {},
  deleteStaffMember: () => {},
  formConfig: INITIAL_FORM_CONFIG,
  updateFormConfig: () => {},
  whatsAppConfig: INITIAL_WHATSAPP_CONFIG,
  updateWhatsAppConfig: () => {},
  locationRules: INITIAL_LOCATION_RULES,
  addLocationRule: () => {},
  updateLocationRule: () => {},
  deleteLocationRule: () => {},
  blacklist: INITIAL_BLACKLIST,
  addBlacklistItem: () => {},
  deleteBlacklistItem: () => {},
  upsells: INITIAL_UPSELLS,
  toggleUpsell: () => {},
  updateUpsell: () => {},
  addUpsell: () => {},
  tagRules: INITIAL_TAG_RULES,
  toggleTagRule: () => {},
  addTagRule: () => {},
  depositGateways: INITIAL_DEPOSIT_GATEWAYS,
  updateDepositGateways: () => {},
  activeRoute: 'dashboard',
  setActiveRoute: () => {},
  toasts: [],
  showToast: () => {},
  removeToast: () => {},
  selectedOrderForPrint: null,
  setSelectedOrderForPrint: () => {},
  isExitIntentOpen: false,
  setIsExitIntentOpen: () => {},
  isFormPreviewOpen: false,
  setIsFormPreviewOpen: () => {},
  calculateAIRisk: () => ({ level: 'LOW', score: 10, factors: [], requiresDeposit: false, depositAmt: 0 }),
  autoAssignOrderToStaff: () => INITIAL_STAFF[0],
  verifyOrder: () => {},
  cancelOrder: () => {},
  sendWhatsAppConfirmation: () => {},
  assignOrderToStaff: () => {},
  openShippingLabelModal: () => {},
  addToast: () => {},
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    return FALLBACK_CONTEXT;
  }
  return context;
};
