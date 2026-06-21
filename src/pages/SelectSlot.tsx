import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { SLOT_DIMENSIONS } from '../types';
import type { SlotSize } from '../types';
import { useActiveEdition, usePricing, useSlots } from '../hooks/useFirebase';

export default function SelectSlot() {
  const { edition, loading: loadingEd } = useActiveEdition();
  const { pricing, loading: loadingPricing } = usePricing();
  const { slots, loading: loadingSlots } = useSlots(edition?.id);

  const loading = loadingEd || loadingPricing || loadingSlots;

  if (loading || !edition || !pricing) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-teal font-medium">Cargando espacios disponibles...</div>
      </div>
    );
  }

  // List of sizes in display order
  const displayOrder: SlotSize[] = [
    'quarter', 'half', 'full', 'retiro-tapa', 'indice', 'retiro-contratapa', 'contratapa', 'eighth'
  ];

  return (
    <div className="py-10 bg-gray-50 min-h-[80vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Elegí tu espacio publicitario
          </h1>
          <p className="mt-3 text-gray-500 max-w-2xl mx-auto">
            Seleccioná el tamaño ideal para tu marca. Todas las opciones incluyen la versión impresa 
            y la digital con link interactivo.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 bg-teal-50 text-teal-dark px-4 py-2 rounded-full text-sm font-medium">
            <span className="w-2 h-2 bg-teal rounded-full animate-pulse-soft" />
            Edición actual: {edition.title}
          </div>
        </motion.div>

        {/* Sizes Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayOrder.map((size, i) => {
            const dim = SLOT_DIMENSIONS[size];
            const price = pricing[size];
            const limit = edition.maxSlots?.[size];
            const soldOrReserved = slots.filter(s => s.size === size && (s.status === 'sold' || s.status === 'reserved')).length;
            const remaining = limit !== undefined ? limit - soldOrReserved : null;
            const isSoldOut = remaining !== null && remaining <= 0;
            
            return (
              <motion.div
                key={size}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <Card hover className="h-full flex flex-col">
                  {/* Visual representation */}
                  <div className="aspect-[0.685] w-full bg-gray-50 rounded-[var(--radius-md)] mb-4 border border-gray-200 relative overflow-hidden flex items-center justify-center">
                    <div
                      className={`bg-teal/10 border-2 border-dashed border-teal/40 rounded-sm flex items-center justify-center p-2 text-center`}
                      style={{
                        width: ['full', 'retiro-tapa', 'indice', 'retiro-contratapa', 'contratapa'].includes(size) ? '80%' : size === 'half' ? '80%' : '45%',
                        height: ['full', 'retiro-tapa', 'indice', 'retiro-contratapa', 'contratapa'].includes(size) ? '85%' : size === 'half' ? '42%' : size === 'quarter' ? '42%' : '20%',
                      }}
                    >
                      <span className="text-[10px] text-teal font-medium leading-tight">Tu aviso aquí</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-gray-900">{dim.label}</h3>
                    {remaining !== null && (
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${isSoldOut ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-teal-50 text-teal-700 border border-teal-200'}`}>
                        {isSoldOut ? 'AGOTADO' : `Quedan ${remaining}`}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Espacio estimado: {dim.width} × {dim.height} cm
                  </p>

                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-gray-900">
                      ${(price || 0).toLocaleString('es-AR')}
                    </span>
                    <span className="text-sm text-gray-400">+ IVA (2.5%)</span>
                  </div>

                  <ul className="mt-4 space-y-2 text-xs text-gray-500 flex-grow mb-6">
                    <li className="flex items-start gap-2">
                      <Check size={14} className="text-green mt-0.5 shrink-0" />
                      <span>Aviso en formato papel (full color)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check size={14} className="text-green mt-0.5 shrink-0" />
                      <span>Aviso en formato digital</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check size={14} className="text-green mt-0.5 shrink-0" />
                      <span>Publinota o link interactivo (QR/Web)</span>
                    </li>
                  </ul>

                  {isSoldOut ? (
                    <div className="block mt-auto">
                      <Button variant="secondary" className="w-full opacity-50 cursor-not-allowed text-red-500 border-red-200 bg-red-50 hover:bg-red-50">
                        Agotado
                      </Button>
                    </div>
                  ) : (
                    <Link to={`/checkout/${size}`} className="block mt-auto">
                      <Button
                        variant="primary"
                        className="w-full"
                        icon={<ArrowRight size={16} />}
                      >
                        Contratar
                      </Button>
                    </Link>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </div>
        
        <div className="mt-12 bg-white rounded-[var(--radius-lg)] p-6 shadow-sm border border-gray-100 text-sm text-gray-600 space-y-2">
          <h4 className="font-bold text-gray-900 mb-4">Información importante</h4>
          <p>• Los valores corresponden a la edición actual ({edition.title}).</p>
          <p>• Promoción: Contratando 3 ediciones consecutivas con pago completo en la actual, obtenés tu publicidad a valor congelado + 10% de descuento.</p>
          <p>• No realizamos el diseño de la pieza publicitaria ni fotografía. Se deberán respetar los tamaños y contemplar el espacio para el QR.</p>
        </div>
      </div>
    </div>
  );
}
