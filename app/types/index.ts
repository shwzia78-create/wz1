export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type OrderStatus = 'PENDING' | 'VERIFIED' | 'DISPATCHED' | 'DELIVERED' | 'CANCELLED' | 'RTO';

export interface OrderItem {
  id: string;
  title: string;
  variant: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  shopifyOrderId: string;
  customerName: string;
  phone: string;
  email?: string;
  city: string;
  province: string;
  address: string;
  postalCode?: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  codFee: number;
  discount: number;
  total: number;
  status: OrderStatus;
  riskLevel: RiskLevel;
  riskScore: number; // 0-100 (higher = riskier)
  riskFactors: string[];
  assignedStaffId?: string;
  assignedStaffName?: string;
  tags: string[];
  depositRequired: boolean;
  depositAmount: number;
  depositStatus: 'NONE' | 'PENDING' | 'PAID' | 'WAIVED';
  depositMethod?: 'JazzCash' | 'EasyPaisa' | 'Bank Transfer' | 'Credit Card';
  whatsappStatus: 'UNSENT' | 'SENT' | 'CONFIRMED' | 'CANCELLED' | 'REPLIED';
  whatsappSentAt?: string;
  createdAt: string;
  ipAddress: string;
  source: 'MakCod Quick Form' | 'Shopify Standard Checkout' | 'Exit-Intent Popup';
  trackingNumber?: string;
  courier?: 'Trax' | 'Leopards' | 'TCS' | 'M&P' | 'PostEx' | 'DHL' | 'Aramex';
}

export interface StaffMember {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: 'Agent' | 'Manager' | 'Admin';
  avatar: string;
  status: 'ACTIVE' | 'ON_BREAK' | 'OFFLINE';
  assignedQuota: number; // e.g. 100 orders per day
  currentAssignedCount: number;
  confirmedCount: number;
  cancelledCount: number;
  rtoCount: number;
  confirmationRate: number; // percentage
  assignedCities?: string[];
  workingHours: string;
}

export interface FormFieldConfig {
  id: string;
  name: string;
  label: string;
  labelUrdu?: string;
  labelArabic?: string;
  placeholder: string;
  required: boolean;
  enabled: boolean;
  type: 'text' | 'tel' | 'email' | 'select' | 'textarea' | 'number' | 'checkbox' | 'radio';
  options?: string[];
  defaultValue?: string;
  helpText?: string;
  isCustom?: boolean;
}

export interface ExitIntentConfig {
  enabled: boolean;
  discountType: 'percentage' | 'fixed' | 'free_shipping';
  discountValue: number;
  headline: string;
  subheadline: string;
  timerSeconds: number;
  couponCode: string;
  showGiftBadge: boolean;
  triggerDelayMs: number;
}

export interface FormCustomization {
  popupTitle: string;
  popupSubtitle: string;
  buttonText: string;
  buttonColor: string;
  buttonTextColor: string;
  buttonHoverColor?: string;
  headerBgColor: string;
  headerTextColor?: string;
  formBgColor?: string;
  textColor?: string;
  inputBgColor?: string;
  inputBorderColor?: string;
  accentColor?: string;
  fontFamily?: string;
  fontSize?: 'sm' | 'md' | 'lg';
  borderRadius?: number;
  cardShadow?: 'none' | 'subtle' | 'elevated' | 'glow';
  trustBadgeText: string;
  showTimer: boolean;
  timerMinutes: number;
  timerText: string;
  showQuantitySelector: boolean;
  showVariantSelector: boolean;
  showAddressNotes: boolean;
  enableOneClickBuy: boolean;
  enableCityDropdown: boolean;
  enableFuzzyCityAutocomplete?: boolean;
  fields: FormFieldConfig[];
  exitIntent: ExitIntentConfig;
}

export interface WhatsAppConfig {
  mode: 'DIRECT_LINK' | 'OFFICIAL_META_API';
  directLinkPhoneNumber: string;
  directLinkCustomMessage: string;
  metaPhoneNumberId: string;
  metaWabaId: string;
  metaAccessToken: string;
  metaWebhookSecret: string;
  metaTemplateName: string;
  metaLanguageCode: string;
  autoSendOnNewOrder: boolean;
  autoTagConfirmedOrders: boolean;
  autoCancelTimeoutHours: number;
  enableQuickReplies: boolean;
  confirmationKeyword: string;
  cancellationKeyword: string;
}

export interface LocationRule {
  id: string;
  cityName?: string;
  city?: string;
  name?: string;
  province?: string;
  region?: string;
  postalCodePrefix?: string;
  codEnabled?: boolean;
  codAllowed?: boolean;
  codFee: number;
  shippingFee?: number;
  freeCodThreshold?: number;
  estimatedDeliveryDays?: string;
  estimatedDays?: string;
  courierPreference?: string;
  requiresAdvanceDeposit?: boolean;
  requireAdvanceDeposit?: boolean;
  depositAmount?: number;
}

export interface BlacklistItem {
  id: string;
  type: 'PHONE' | 'IP' | 'ADDRESS' | 'CITY_ZONE';
  value: string;
  reason: string;
  addedAt: string;
  blockedAttempts: number;
  severity: 'BLOCK_ORDER' | 'REQUIRE_DEPOSIT' | 'FLAG_HIGH_RISK';
}

export interface AutoTagRule {
  id: string;
  name: string;
  condition: string;
  targetTag: string;
  color: string;
  enabled: boolean;
}

export interface UpsellOffer {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  originalPrice: number;
  badge: string;
  type: 'BOGO' | 'ADD_ON' | 'WARRANTY' | 'PRIORITY_SHIPPING';
  selectedByDefault: boolean;
  image: string;
  enabled: boolean;
}

export interface DepositGatewayConfig {
  jazzCashEnabled: boolean;
  jazzCashAccountTitle: string;
  jazzCashAccountNumber: string;
  easyPaisaEnabled: boolean;
  easyPaisaAccountTitle: string;
  easyPaisaAccountNumber: string;
  bankTransferEnabled: boolean;
  bankName: string;
  bankAccountTitle: string;
  bankIban: string;
  stripeEnabled: boolean;
  defaultDepositAmount: number;
  depositMode: 'FIXED' | 'PERCENTAGE';
  depositPercentage: number;
  minOrderValueForDeposit: number;
  autoExemptVerifiedCustomers: boolean;
  instructionsNote: string;
}

export type PlanTier = 'FREE' | 'PREMIUM' | 'ENTERPRISE' | 'UNLIMITED';
export type BillingInterval = 'MONTHLY' | 'ANNUAL';

export interface AppSettings {
  appActive: boolean;
  storeName: string;
  currency: 'PKR' | 'USD' | 'SAR' | 'AED' | 'INR' | 'EGP';
  currencySymbol: string;
  themeAppExtensionActive: boolean;
  defaultLanguage: 'en' | 'ur' | 'ar';
  enableRtl: boolean;
  autoAssignStaff: boolean;
  routingMode: 'QUOTA' | 'ROUND_ROBIN' | 'CITY_BASED';
  riskScoreThresholdHigh: number; // e.g. 70
  riskScoreThresholdMedium: number; // e.g. 40
  autoCancelHighRisk: boolean;
  requireDepositForHighRisk: boolean;
  planTier: PlanTier;
  billingInterval: BillingInterval;
  planMonthlyQuota: number;
  discountCodeApplied?: string;
  discountPercent?: number;
}

