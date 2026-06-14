import { doc, writeBatch, collection } from 'firebase/firestore';
import { db } from './firebase';
import { mockEdition, mockSlots, mockPricing, mockSettings, mockNotifications } from './mockData';

export async function seedDatabase() {
  console.log('Seeding database...');
  const batch = writeBatch(db);

  try {
    // 1. Seed Pricing Config
    const pricingRef = doc(db, 'config', 'pricing');
    batch.set(pricingRef, mockPricing);

    // 2. Seed Settings
    const settingsRef = doc(db, 'config', 'settings');
    batch.set(settingsRef, mockSettings);

    // 3. Seed Edition
    const editionRef = doc(db, 'editions', mockEdition.id);
    batch.set(editionRef, mockEdition);

    // 4. Seed Slots
    mockSlots.forEach(slot => {
      const slotRef = doc(db, 'slots', slot.id);
      batch.set(slotRef, slot);
    });

    // 5. Seed Notifications
    mockNotifications.forEach(notif => {
      const notifRef = doc(db, 'notifications', notif.id);
      batch.set(notifRef, notif);
    });

    await batch.commit();
    console.log('Database seeded successfully!');
    return true;
  } catch (error) {
    console.error('Error seeding database:', error);
    return false;
  }
}
