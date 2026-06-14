import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, CreditCard, Upload, User, Shield } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { SLOT_DIMENSIONS } from '../types';
import type { ClientInfo, CheckoutStep } from '../types';
import { mockSlots, mockPricing } from '../lib/mockData';
import { tokenizeCard, processPayment } from '../lib/payway';
import type { CardData } from '../lib/payway';

export default function Checkout() {
  const { slotId } = useParams<{ slotId: string }>();
  const slot = mockSlots.find((s) => s.id === slotId);
  const [step, setStep] = useState<CheckoutStep>('summary');
  const [clientInfo, setClientInfo] = useState<ClientInfo>({ name: '', email: '', phone: '' });
  const [cardData, setCardData] = useState<CardData>({
    cardNumber: '', cardExpMonth: '', cardExpYear: '', cardCvv: '', cardHolderName: '',
  });
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentResult, setPaymentResult] = useState<'approved' | 'rejected' | null>(null);
  const [paymentError, setPaymentError] = useState('');

  if (!slot) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Espacio no encontrado</h2>
        <p className="mt-2 text-gray-500">El espacio seleccionado no existe o ya no está disponible.</p>
        <Link to="/espacios" className="mt-6 inline-block">
          <Button variant="outline">Volver a espacios</Button>
        </Link>
      </div>
    );
  }

  const dim = SLOT_DIMENSIONS[slot.size];
  const price = mockPricing[slot.size];

  const steps: { key: CheckoutStep; label: string; icon: React.ReactNode }[] = [
    { key: 'summary', label: 'Datos', icon: <User size={16} /> },
    { key: 'payment', label: 'Pago', icon: <CreditCard size={16} /> },
    { key: 'upload', label: 'Material', icon: <Upload size={16} /> },
  ];

  const handlePayment = async () => {
    setPaymentLoading(true);
    setPaymentError('');
    try {
      const token = await tokenizeCard(cardData);
      const result = await processPayment(token.token, price, clientInfo.email);
      if (result.status === 'approved') {
        setPaymentResult('approved');
        setTimeout(() => setStep('upload'), 1500);
      } else {
        setPaymentResult('rejected');
        setPaymentError(result.message);
      }
    } catch (err: any) {
      setPaymentError(err.message || 'Error al procesar el pago');
    } finally {
      setPaymentLoading(false);
    }
  };

  const canProceedToPayment = clientInfo.name.length > 2 && clientInfo.email.includes('@') && clientInfo.phone.length > 6;

  return (
    <div className="py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link to="/espacios" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors">
          <ArrowLeft size={16} /> Volver a espacios
        </Link>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {steps.map((s, i) => {
            const isActive = s.key === step;
            const isDone = steps.findIndex((x) => x.key === step) > i;
            return (
              <div key={s.key} className="flex items-center gap-2">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                  ${isActive ? 'bg-teal text-white shadow-sm' : isDone ? 'bg-green-50 text-green' : 'bg-gray-100 text-gray-400'}`}>
                  {isDone ? <Check size={14} /> : s.icon}
                  <span className="hidden sm:inline">{s.label}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`w-8 h-0.5 ${isDone ? 'bg-green' : 'bg-gray-200'}`} />
                )}
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {step === 'summary' && (
                <motion.div key="summary" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  <Card>
                    <h2 className="text-xl font-bold text-gray-900 mb-5">Datos del anunciante</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre / Empresa</label>
                        <input
                          type="text" value={clientInfo.name}
                          onChange={(e) => setClientInfo({ ...clientInfo, name: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-[var(--radius-md)] border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal focus:border-teal transition-all"
                          placeholder="Ej: Mi Empresa SRL"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          type="email" value={clientInfo.email}
                          onChange={(e) => setClientInfo({ ...clientInfo, email: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-[var(--radius-md)] border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal focus:border-teal transition-all"
                          placeholder="email@empresa.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                        <input
                          type="tel" value={clientInfo.phone}
                          onChange={(e) => setClientInfo({ ...clientInfo, phone: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-[var(--radius-md)] border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal focus:border-teal transition-all"
                          placeholder="+54 9 11 ..."
                        />
                      </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                      <Button onClick={() => setStep('payment')} disabled={!canProceedToPayment} icon={<ArrowRight size={16} />}>
                        Continuar al pago
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              )}

              {step === 'payment' && (
                <motion.div key="payment" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  <Card>
                    <h2 className="text-xl font-bold text-gray-900 mb-1">Pago seguro</h2>
                    <p className="text-sm text-gray-400 mb-5 flex items-center gap-1.5"><Shield size={14} /> Procesado por Payway (modo sandbox)</p>

                    {paymentResult === 'approved' ? (
                      <motion.div
                        className="text-center py-8"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                      >
                        <div className="w-16 h-16 mx-auto rounded-full bg-green-50 flex items-center justify-center mb-4">
                          <Check size={32} className="text-green" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">¡Pago aprobado!</h3>
                        <p className="text-sm text-gray-500 mt-1">Redirigiendo al formulario de material...</p>
                      </motion.div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Número de tarjeta</label>
                          <input
                            type="text" value={cardData.cardNumber}
                            onChange={(e) => setCardData({ ...cardData, cardNumber: e.target.value.replace(/\D/g, '').slice(0, 16) })}
                            className="w-full px-4 py-2.5 rounded-[var(--radius-md)] border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal focus:border-teal font-mono tracking-wider"
                            placeholder="4111 1111 1111 1111"
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mes</label>
                            <input
                              type="text" value={cardData.cardExpMonth}
                              onChange={(e) => setCardData({ ...cardData, cardExpMonth: e.target.value.slice(0, 2) })}
                              className="w-full px-4 py-2.5 rounded-[var(--radius-md)] border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal focus:border-teal text-center"
                              placeholder="MM"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Año</label>
                            <input
                              type="text" value={cardData.cardExpYear}
                              onChange={(e) => setCardData({ ...cardData, cardExpYear: e.target.value.slice(0, 2) })}
                              className="w-full px-4 py-2.5 rounded-[var(--radius-md)] border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal focus:border-teal text-center"
                              placeholder="AA"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                            <input
                              type="text" value={cardData.cardCvv}
                              onChange={(e) => setCardData({ ...cardData, cardCvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                              className="w-full px-4 py-2.5 rounded-[var(--radius-md)] border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal focus:border-teal text-center"
                              placeholder="123"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Titular</label>
                          <input
                            type="text" value={cardData.cardHolderName}
                            onChange={(e) => setCardData({ ...cardData, cardHolderName: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-[var(--radius-md)] border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal focus:border-teal"
                            placeholder="Como figura en la tarjeta"
                          />
                        </div>

                        {paymentError && (
                          <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-[var(--radius-md)] border border-red-200">
                            {paymentError}
                          </div>
                        )}

                        <div className="flex justify-between mt-6">
                          <Button variant="ghost" onClick={() => setStep('summary')} icon={<ArrowLeft size={16} />}>
                            Volver
                          </Button>
                          <Button onClick={handlePayment} loading={paymentLoading} icon={<CreditCard size={16} />}>
                            Pagar ${price.toLocaleString('es-AR')}
                          </Button>
                        </div>
                      </div>
                    )}
                  </Card>
                </motion.div>
              )}

              {step === 'upload' && (
                <motion.div key="upload" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  <UploadStep slot={slot} clientName={clientInfo.name} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order summary sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-28">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Resumen</h3>
              
              {/* Slot visual */}
              <div className="aspect-[0.685] w-full bg-gray-50 rounded-[var(--radius-md)] mb-4 border border-gray-200 relative flex items-center justify-center">
                <div
                  className="bg-teal/10 border-2 border-dashed border-teal/40 rounded-sm flex items-center justify-center"
                  style={{
                    width: slot.size === 'full' ? '80%' : slot.size === 'half' ? '80%' : '45%',
                    height: slot.size === 'full' ? '85%' : slot.size === 'half' ? '42%' : slot.size === 'quarter' ? '42%' : '20%',
                  }}
                >
                  <span className="text-[9px] text-teal font-medium">{dim.label}</span>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Espacio</span>
                  <span className="font-medium text-gray-800">{dim.label}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Dimensiones</span>
                  <span className="text-gray-700">{dim.width} × {dim.height} cm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Página</span>
                  <span className="text-gray-700">{slot.pageNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Edición</span>
                  <Badge variant="teal" size="sm">Jul-Ago 2026</Badge>
                </div>
              </div>

              <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between items-baseline">
                <span className="text-sm font-medium text-gray-700">Total</span>
                <span className="text-2xl font-bold text-gray-900">${price.toLocaleString('es-AR')}</span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---- Upload Step Component ----
function UploadStep({ slot, clientName }: { slot: any; clientName: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [linkType, setLinkType] = useState<'web' | 'whatsapp'>('web');
  const [link, setLink] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const handleUpload = async () => {
    if (!file || !link) return;
    setUploading(true);
    // Simulate upload
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setUploading(false);
    setUploaded(true);
  };

  if (uploaded) {
    return (
      <Card>
        <motion.div
          className="text-center py-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <div className="w-20 h-20 mx-auto rounded-full bg-green-50 flex items-center justify-center mb-4">
            <Check size={40} className="text-green" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">¡Todo listo!</h2>
          <p className="text-gray-500 mt-2 max-w-sm mx-auto">
            Tu material fue recibido. Recibirás un email de confirmación en <strong>{clientName}</strong>.
          </p>
          <p className="text-xs text-gray-400 mt-4">
            Tu anuncio aparecerá en la edición Jul-Ago 2026 de La Troncal.
          </p>
          <Link to="/" className="mt-6 inline-block">
            <Button variant="outline">Volver al inicio</Button>
          </Link>
        </motion.div>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="text-xl font-bold text-gray-900 mb-1">Subí tu material</h2>
      <p className="text-sm text-gray-400 mb-5">Tu espacio está reservado. Subí tu diseño y definí el link de destino.</p>

      <div className="space-y-5">
        {/* File upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Archivo del anuncio</label>
          <div className="border-2 border-dashed border-gray-300 rounded-[var(--radius-lg)] p-6 text-center hover:border-teal transition-colors cursor-pointer relative">
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.tiff,.tif"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {file ? (
              <div>
                <Check size={24} className="text-green mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-800">{file.name}</p>
                <p className="text-xs text-gray-400">{(file.size / (1024 * 1024)).toFixed(1)} MB</p>
              </div>
            ) : (
              <div>
                <Upload size={24} className="text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Arrastrá o hacé click para subir</p>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG o TIFF · Mínimo 300 DPI</p>
              </div>
            )}
          </div>
        </div>

        {/* Link type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de link interactivo</label>
          <div className="flex gap-2">
            {(['web', 'whatsapp'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setLinkType(type)}
                className={`flex-1 py-2.5 px-4 rounded-[var(--radius-md)] text-sm font-medium border-2 transition-all
                  ${linkType === type
                    ? 'border-teal bg-teal-50 text-teal-dark'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
              >
                {type === 'web' ? '🌐 Web' : '💬 WhatsApp'}
              </button>
            ))}
          </div>
        </div>

        {/* Link input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {linkType === 'web' ? 'URL de destino' : 'Número de WhatsApp'}
          </label>
          <input
            type={linkType === 'web' ? 'url' : 'tel'}
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="w-full px-4 py-2.5 rounded-[var(--radius-md)] border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal focus:border-teal transition-all"
            placeholder={linkType === 'web' ? 'https://www.miempresa.com.ar' : '+54 9 11 1234-5678'}
          />
          <p className="text-xs text-gray-400 mt-1">
            {linkType === 'web'
              ? 'Este link se abrirá al hacer click en tu anuncio en la versión digital.'
              : 'Se generará un link de WhatsApp con tu número.'
            }
          </p>
        </div>

        <Button
          onClick={handleUpload}
          loading={uploading}
          disabled={!file || !link}
          className="w-full"
          size="lg"
          icon={<Upload size={18} />}
        >
          Enviar material
        </Button>
      </div>
    </Card>
  );
}
