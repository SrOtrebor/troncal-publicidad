import { motion } from 'framer-motion';
import { MagazineViewer } from '../components/magazine/MagazineViewer';
import { mockSlots, mockPricing, mockEdition, mockSettings } from '../lib/mockData';

export default function SelectSlot() {
  return (
    <div className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Espacios Publicitarios
          </h1>
          <p className="mt-3 text-gray-500 max-w-2xl mx-auto">
            Hojeá la revista y seleccioná el espacio que más te convenga. 
            Los espacios en <span className="text-green font-medium">verde</span> están disponibles.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 bg-teal-50 text-teal-dark px-4 py-2 rounded-full text-sm font-medium">
            <span className="w-2 h-2 bg-teal rounded-full animate-pulse-soft" />
            {mockEdition.title} — {mockEdition.soldSlots} de {mockEdition.totalSlots} espacios vendidos
          </div>
        </motion.div>

        {/* Magazine Viewer */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <MagazineViewer
            slots={mockSlots}
            pricing={mockPricing}
            showSoldAds={mockSettings.showSoldAds}
            pageCount={mockEdition.pageCount}
          />
        </motion.div>

        {/* Tip */}
        <motion.div
          className="mt-10 text-center text-sm text-gray-400 max-w-md mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          💡 Hacé click en un espacio disponible para ver el detalle y comprarlo. 
          Arrastrá las páginas o usá las flechas para navegar.
        </motion.div>
      </div>
    </div>
  );
}
