import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import axios from 'axios';

admin.initializeApp();
const db = admin.firestore();

// Valores simulados.
const PAYWAY_PRIVATE_KEY = process.env.PAYWAY_KEY || 'TEST_PRIVATE_KEY_PAYWAY';
const PAYWAY_URL = 'https://sandbox.decidir.com/api/v2/payments';

// Callable function to process Payway payment
export const processPaywayPayment = functions.https.onCall(async (request) => {
  const { token, amount, clientInfo, slotId } = request.data || {};

  console.log("Mock Payway initialized", { PAYWAY_PRIVATE_KEY: !!PAYWAY_PRIVATE_KEY, PAYWAY_URL, axios: !!axios, clientInfo });

  if (!token || !amount || !clientInfo || !slotId) {
    throw new functions.https.HttpsError('invalid-argument', 'Faltan parámetros requeridos.');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(clientInfo.email)) {
    throw new functions.https.HttpsError('invalid-argument', 'Formato de email inválido.');
  }

  try {
    const slotRef = db.collection('slots').doc(slotId);
    const slotSnap = await slotRef.get();
    
    if (!slotSnap.exists) {
      throw new functions.https.HttpsError('not-found', 'Espacio no encontrado.');
    }
    
    const slotData = slotSnap.data();
    if (slotData?.status !== 'available') {
      throw new functions.https.HttpsError('failed-precondition', 'El espacio seleccionado ya fue vendido o reservado.');
    }

    const editionId = slotData?.editionId;
    const slotSize = slotData?.size;

    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (token.endsWith('0000')) {
      return {
        status: 'rejected',
        message: 'Pago rechazado simulado. Terminación 0000.'
      };
    }

    const transactionId = `txn_${Date.now()}_${slotId}`;
    const batch = db.batch();

    batch.update(slotRef, {
      status: 'sold',
      clientInfo,
      paymentId: transactionId,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    const clientEmail = clientInfo.email.toLowerCase();
    const clientRef = db.collection('clients').doc(clientEmail);
    const clientSnap = await clientRef.get();

    if (clientSnap.exists) {
      batch.update(clientRef, {
        name: clientInfo.name,
        phone: clientInfo.phone,
        lastPurchaseDate: admin.firestore.FieldValue.serverTimestamp(),
        totalPurchases: admin.firestore.FieldValue.increment(1)
      });
    } else {
      batch.set(clientRef, {
        name: clientInfo.name,
        email: clientEmail,
        phone: clientInfo.phone,
        firstPurchaseDate: admin.firestore.FieldValue.serverTimestamp(),
        lastPurchaseDate: admin.firestore.FieldValue.serverTimestamp(),
        totalPurchases: 1
      });
    }

    const notifRef = db.collection('notifications').doc();
    batch.set(notifRef, {
      id: notifRef.id,
      type: 'sale',
      editionId,
      slotId,
      clientName: clientInfo.name,
      clientEmail: clientEmail,
      slotSize,
      amount,
      message: `Nueva venta de espacio (${slotSize}) para ${clientInfo.name}`,
      read: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      emailSent: false
    });

    await batch.commit();

    return {
      status: 'approved',
      transactionId,
      message: 'Pago aprobado y espacio reservado.'
    };

  } catch (error: any) {
    console.error('Error processing payment:', error);
    throw new functions.https.HttpsError('internal', error.message || 'No se pudo procesar el pago.');
  }
});

export const saveSlotMaterial = functions.https.onCall(async (request) => {
  const { slotId, fileUrl, destinationLink, linkType } = request.data || {};

  if (!slotId || !fileUrl || !destinationLink || !linkType) {
    throw new functions.https.HttpsError('invalid-argument', 'Faltan parámetros requeridos.');
  }

  try {
    const slotRef = db.collection('slots').doc(slotId);
    const slotSnap = await slotRef.get();

    if (!slotSnap.exists) {
      throw new functions.https.HttpsError('not-found', 'Espacio no encontrado.');
    }

    const slotData = slotSnap.data();
    if (slotData?.status !== 'sold') {
      throw new functions.https.HttpsError('failed-precondition', 'El espacio no está vendido o ya fue configurado.');
    }

    await slotRef.update({
      fileUrl,
      destinationLink,
      linkType,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return { success: true };
  } catch (error: any) {
    console.error('Error saving material:', error);
    throw new functions.https.HttpsError('internal', error.message || 'No se pudo guardar el material.');
  }
});
