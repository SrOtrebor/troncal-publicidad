import { useState, useEffect } from 'react';
import { doc, collection, onSnapshot, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { db, auth } from '../lib/firebase';
import type { Edition, PricingConfig, AppSettings, Slot, Notification, ClientRecord, CustomPaymentLink } from '../types';

// Utility to convert Firestore timestamps to JS Dates
const convertTimestamps = (data: any): any => {
  if (!data) return data;
  if (data instanceof Timestamp) return data.toDate();
  if (Array.isArray(data)) return data.map(convertTimestamps);
  if (typeof data === 'object') {
    const converted: any = {};
    for (const key in data) {
      converted[key] = convertTimestamps(data[key]);
    }
    return converted;
  }
  return data;
};

export function usePricing() {
  const [pricing, setPricing] = useState<PricingConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'config', 'pricing'), (doc) => {
      if (doc.exists()) {
        setPricing(convertTimestamps(doc.data()) as PricingConfig);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  return { pricing, loading };
}

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'config', 'settings'), (doc) => {
      if (doc.exists()) {
        setSettings(convertTimestamps(doc.data()) as AppSettings);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  return { settings, loading };
}

export function useEdition(editionId?: string) {
  const [edition, setEdition] = useState<Edition | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!editionId) {
      setLoading(false);
      return;
    }
    const unsub = onSnapshot(doc(db, 'editions', editionId), (doc) => {
      if (doc.exists()) {
        setEdition({ id: doc.id, ...convertTimestamps(doc.data()) } as Edition);
      }
      setLoading(false);
    });
    return unsub;
  }, [editionId]);

  return { edition, loading };
}

export function useActiveEdition() {
  const { settings, loading: loadingSettings } = useSettings();
  const { edition, loading: loadingEdition } = useEdition(settings?.activeEditionId);

  return { 
    edition, 
    loading: loadingSettings || loadingEdition 
  };
}

export function useSlots(editionId?: string) {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!editionId) {
      setLoading(false);
      return;
    }
    const q = query(collection(db, 'slots'), where('editionId', '==', editionId));
    const unsub = onSnapshot(q, (snapshot) => {
      const slotsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...convertTimestamps(doc.data())
      })) as Slot[];
      setSlots(slotsData);
      setLoading(false);
    });
    return unsub;
  }, [editionId]);

  return { slots, loading };
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'notifications'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const notifs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...convertTimestamps(doc.data())
      })) as Notification[];
      setNotifications(notifs);
      setLoading(false);
    });
    return unsub;
  }, []);

  return { notifications, loading };
}

export function useClients() {
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'clients'), orderBy('lastPurchaseDate', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const clientsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...convertTimestamps(doc.data())
      })) as ClientRecord[];
      setClients(clientsData);
      setLoading(false);
    });
    return unsub;
  }, []);

  return { clients, loading };
}

// =========================================
// Authentication Hook
// =========================================
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { user, loading };
}

// =========================================
// Custom Links Hooks
// =========================================
export function useCustomLinks() {
  const [links, setLinks] = useState<CustomPaymentLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'customLinks'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...convertTimestamps(doc.data())
      })) as CustomPaymentLink[];
      setLinks(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  return { links, loading };
}

export function useCustomLink(linkId?: string) {
  const [link, setLink] = useState<CustomPaymentLink | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!linkId) {
      setLoading(false);
      return;
    }
    const unsub = onSnapshot(doc(db, 'customLinks', linkId), (docSnap) => {
      if (docSnap.exists()) {
        setLink({ id: docSnap.id, ...convertTimestamps(docSnap.data()) } as CustomPaymentLink);
      } else {
        setLink(null);
      }
      setLoading(false);
    });
    return unsub;
  }, [linkId]);

  return { link, loading };
}
