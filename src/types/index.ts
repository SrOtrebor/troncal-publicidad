// ============================================================
// La Troncal — Type Definitions
// ============================================================

// --- Slot Sizes ---
export type SlotSize = 'full' | 'half' | 'quarter' | 'eighth';
export type SlotPosition = 'top' | 'bottom' | 'left' | 'right' | 'full' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
export type SlotStatus = 'available' | 'reserved' | 'sold' | 'assigned';
export type LinkType = 'web' | 'whatsapp';

export const SLOT_DIMENSIONS: Record<SlotSize, { width: number; height: number; label: string }> = {
  full:    { width: 12.6,  height: 18.4,  label: 'Página entera' },
  half:    { width: 12.6,  height: 9,     label: 'Media página' },
  quarter: { width: 6.15,  height: 9,     label: 'Cuarto de página' },
  eighth:  { width: 6.15,  height: 4.37,  label: 'Octavo de página' },
};

// --- Edition ---
export type EditionStatus = 'draft' | 'active' | 'closed' | 'published';

export interface Edition {
  id: string;
  title: string;
  number: number;
  status: EditionStatus;
  period: string; // "Jul-Ago 2026"
  publicationDate: Date;
  printDeadline: Date;
  printDate: Date;
  pageCount: number;
  totalSlots: number;
  soldSlots: number;
  autoCloseOnDeadline: boolean;
  createdAt: Date;
  updatedAt: Date;
  coverImageUrl?: string;
}

// --- Slot ---
export interface ClientInfo {
  name: string;
  email: string;
  phone: string;
}

export interface Slot {
  id: string;
  editionId: string;
  pageNumber: number;
  position: SlotPosition;
  size: SlotSize;
  dimensions: {
    width: number;
    height: number;
  };
  price: number;
  status: SlotStatus;
  reservedUntil?: Date;
  clientInfo?: ClientInfo;
  paymentId?: string;
  fileUrl?: string;
  fileName?: string;
  renamedFileName?: string;
  destinationLink?: string;
  linkType?: LinkType;
  createdAt: Date;
  updatedAt: Date;
}

// --- Payment ---
export type PaymentStatus = 'pending' | 'approved' | 'rejected' | 'refunded';

export interface Payment {
  id: string;
  slotId: string;
  editionId: string;
  amount: number;
  currency: 'ARS';
  status: PaymentStatus;
  paywayTransactionId?: string;
  paywayResponse?: Record<string, unknown>;
  clientEmail: string;
  createdAt: Date;
  updatedAt: Date;
}

// --- Notification ---
export type NotificationType = 'sale' | 'upload' | 'payment_failed';

export interface Notification {
  id: string;
  type: NotificationType;
  editionId: string;
  slotId: string;
  clientName: string;
  clientEmail: string;
  slotSize: SlotSize;
  amount: number;
  message: string;
  read: boolean;
  createdAt: Date;
  emailSent: boolean;
}

// --- Config ---
export interface PricingConfig {
  full: number;
  half: number;
  quarter: number;
  eighth: number;
  updatedAt: Date;
}

export interface AppSettings {
  maxFileSize: number; // MB
  allowedFormats: string[];
  minDPI: number;
  activeEditionId: string;
  showSoldAds: boolean;
  adminEmail: string;
}

// --- UI Types ---
export interface PageSlots {
  pageNumber: number;
  slots: Slot[];
}

export interface MagazineData {
  edition: Edition;
  pages: PageSlots[];
  pricing: PricingConfig;
  showSoldAds: boolean;
}

// --- Checkout Flow ---
export type CheckoutStep = 'summary' | 'payment' | 'upload';

export interface CheckoutState {
  step: CheckoutStep;
  selectedSlot: Slot | null;
  clientInfo: ClientInfo | null;
  paymentId: string | null;
  uploadComplete: boolean;
}

// --- Bimonthly Periods ---
export const BIMONTHLY_PERIODS = [
  'Ene-Feb',
  'Mar-Abr',
  'May-Jun',
  'Jul-Ago',
  'Sep-Oct',
  'Nov-Dic',
] as const;

export type BimonthlyPeriod = typeof BIMONTHLY_PERIODS[number];
