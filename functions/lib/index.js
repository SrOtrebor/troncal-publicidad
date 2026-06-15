"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processPaywayPayment = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios_1 = require("axios");
admin.initializeApp();
// Valores simulados. Cuando el cliente te dé las credenciales reales, 
// puedes configurarlas aquí o usar Firebase Secret Manager.
const PAYWAY_PRIVATE_KEY = 'TEST_PRIVATE_KEY_PAYWAY';
const PAYWAY_URL = 'https://sandbox.decidir.com/api/v2/payments';
// Callable function to process Payway payment
exports.processPaywayPayment = functions.https.onCall(async (request) => {
    var _a;
    const { token, amount, email, slotId } = request.data || {};
    // Evitar error de variables no usadas temporalmente:
    console.log("Mock Payway initialized", { PAYWAY_PRIVATE_KEY, PAYWAY_URL, axios: !!axios_1.default, email });
    if (!token || !amount) {
        throw new functions.https.HttpsError('invalid-argument', 'Missing token or amount.');
    }
    try {
        // ---------------------------------------------------------
        // CÓDIGO REAL PARA CUANDO TENGAS CREDENCIALES
        // ---------------------------------------------------------
        // const response = await axios.post(PAYWAY_URL, {
        //   site_transaction_id: `txn_${Date.now()}_${slotId}`,
        //   payment_method_id: 1, // Ej: 1=Visa, 15=Mastercard (Depende del BIN)
        //   token: token,
        //   bin: "450799", // Se debe obtener del frontend al tokenizar
        //   amount: amount,
        //   currency: "ARS",
        //   installments: 1,
        //   description: `Pago por espacio publicitario: ${slotId}`,
        //   establishment_name: "La Troncal"
        // }, {
        //   headers: {
        //     'apikey': PAYWAY_PRIVATE_KEY,
        //     'Content-Type': 'application/json'
        //   }
        // });
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
        return {
            status: 'approved',
            transactionId: `txn_${Date.now()}_${slotId}`,
            message: 'Pago aprobado exitosamente (Modo Sandbox Simulado).'
        };
    }
    catch (error) {
        console.error('Error processing payment:', ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
        throw new functions.https.HttpsError('internal', 'No se pudo procesar el pago en Payway.');
    }
});
//# sourceMappingURL=index.js.map