// ============================================================
// Payway Mock — Sandbox payment integration
// ============================================================
// This module simulates the Payway payment flow.
// Replace with real Payway SDK when credentials are available.
// SDK Frontend: https://github.com/payway-ar/sdk-javascript-ventaonline

export interface CardData {
  cardNumber: string;
  cardExpMonth: string;
  cardExpYear: string;
  cardCvv: string;
  cardHolderName: string;
}

export interface TokenResponse {
  token: string;
  lastFourDigits: string;
  cardBrand: string;
}

export interface PaymentResult {
  status: 'approved' | 'rejected' | 'pending';
  transactionId: string;
  message: string;
  amount: number;
}

// Simulated delay to mimic real API calls
const simulateDelay = (ms: number = 1500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Mock tokenization — simulates Payway's frontend SDK.
 * In production, this would use the Payway JS SDK to securely
 * capture card data and return a token.
 */
export async function tokenizeCard(cardData: CardData): Promise<TokenResponse> {
  await simulateDelay(1200);

  // Simple validation
  if (cardData.cardNumber.replace(/\s/g, '').length !== 16) {
    throw new Error('Número de tarjeta inválido');
  }
  if (!cardData.cardCvv || cardData.cardCvv.length < 3) {
    throw new Error('CVV inválido');
  }

  const lastFour = cardData.cardNumber.slice(-4);
  
  return {
    token: `mock_token_${Date.now()}_${lastFour}`,
    lastFourDigits: lastFour,
    cardBrand: detectCardBrand(cardData.cardNumber),
  };
}

/**
 * Mock payment processing — simulates the backend Cloud Function
 * that would call Payway's server-side API.
 */
export async function processPayment(
  token: string,
  amount: number,
  _email: string
): Promise<PaymentResult> {
  await simulateDelay(2000);

  // Simulate: cards ending in 0000 are rejected (for testing)
  if (token.endsWith('0000')) {
    return {
      status: 'rejected',
      transactionId: '',
      message: 'Pago rechazado. Intentá con otra tarjeta.',
      amount,
    };
  }

  return {
    status: 'approved',
    transactionId: `MOCK_TXN_${Date.now()}`,
    message: 'Pago aprobado exitosamente',
    amount,
  };
}

function detectCardBrand(cardNumber: string): string {
  const num = cardNumber.replace(/\s/g, '');
  if (num.startsWith('4')) return 'Visa';
  if (num.startsWith('5')) return 'Mastercard';
  if (num.startsWith('3')) return 'American Express';
  return 'Otra';
}
