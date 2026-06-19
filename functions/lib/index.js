"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processPaywayPayment = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios_1 = require("axios");
admin.initializeApp();
const db = admin.firestore();
// Valores simulados. Cuando el cliente te dé las credenciales reales, 
// puedes configurarlas aquí o usar Firebase Secret Manager.
const PAYWAY_PRIVATE_KEY = process.env.PAYWAY_KEY || 'TEST_PRIVATE_KEY_PAYWAY';
const PAYWAY_URL = 'https://sandbox.decidir.com/api/v2/payments';
// Callable function to process Payway payment
exports.processPaywayPayment = functions.https.onCall(async (request) => {
    const { token, amount, clientInfo, slotId } = request.data || {};
    // Evitar error de variables no usadas temporalmente (no loggear Private Key):
    console.log("Mock Payway initialized", { PAYWAY_PRIVATE_KEY: !!PAYWAY_PRIVATE_KEY, PAYWAY_URL, axios: !!axios_1.default, clientInfo });
    if (!token || !amount || !clientInfo || !slotId) {
        throw new functions.https.HttpsError('invalid-argument', 'Faltan parámetros requeridos.');
    }
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(clientInfo.email)) {
        throw new functions.https.HttpsError('invalid-argument', 'Formato de email inválido.');
    }
    try {
        // Verificar que el slot existe y está disponible
        const slotRef = db.collection('slots').doc(slotId);
        const slotSnap = await slotRef.get();
        if (!slotSnap.exists) {
            throw new functions.https.HttpsError('not-found', 'Espacio no encontrado.');
        }
        const slotData = slotSnap.data();
        if ((slotData === null || slotData === void 0 ? void 0 : slotData.status) !== 'available') {
            throw new functions.https.HttpsError('failed-precondition', 'El espacio seleccionado ya fue vendido o reservado.');
        }
        const editionId = slotData === null || slotData === void 0 ? void 0 : slotData.editionId;
        const slotSize = slotData === null || slotData === void 0 ? void 0 : slotData.size;
        // ---------------------------------------------------------
        // SIMULACIÓN ACTUAL (Sandbox Mock)
        // ---------------------------------------------------------
        await new Promise(resolve => setTimeout(resolve, 1500));
        if (token.endsWith('0000')) {
            return {
                status: 'rejected',
                message: 'Pago rechazado simulado. Terminación 0000.'
            };
        }
        const transactionId = `txn_${Date.now()}_${slotId}`;
        // Si el pago es exitoso, actualizar Firestore desde el servidor
        const batch = db.batch();
        // 1. Marcar slot como vendido
        batch.update(slotRef, {
            status: 'sold',
            clientInfo,
            paymentId: transactionId,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        // 2. Registrar / Actualizar cliente
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
        }
        else {
            batch.set(clientRef, {
                name: clientInfo.name,
                email: clientEmail,
                phone: clientInfo.phone,
                firstPurchaseDate: admin.firestore.FieldValue.serverTimestamp(),
                lastPurchaseDate: admin.firestore.FieldValue.serverTimestamp(),
                totalPurchases: 1
            });
        }
        // 3. Crear notificación
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
        // Ejecutar todas las escrituras de forma atómica
        await batch.commit();
        return {
            status: 'approved',
            transactionId,
            message: 'Pago aprobado y espacio reservado.'
        };
    }
    catch (error) {
        console.error('Error processing payment:', error);
        throw new functions.https.HttpsError('internal', error.message || 'No se pudo procesar el pago.');
    }
});
//# sourceMappingURL=index.js.map