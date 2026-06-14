import { useState, useCallback, useRef, forwardRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { SLOT_DIMENSIONS } from '../../types';
import type { Slot, SlotSize, PricingConfig } from '../../types';
import { Link } from 'react-router-dom';

// ---- Slot Overlay on each page ----
function SlotOverlay({
  slot,
  showSoldAds,
  onClick,
}: {
  slot: Slot;
  showSoldAds: boolean;
  onClick: (slot: Slot) => void;
}) {
  const positionStyles = getSlotPosition(slot.position, slot.size);
  const isSold = slot.status === 'sold';
  const isAvailable = slot.status === 'available';

  return (
    <motion.div
      className={`absolute rounded-md border-2 transition-all duration-200 flex items-center justify-center overflow-hidden cursor-pointer
        ${isAvailable
          ? 'border-green/60 bg-green/10 hover:bg-green/20 hover:border-green hover:shadow-md hover:scale-[1.02]'
          : isSold
            ? 'border-red-300 bg-red-50/80'
            : 'border-yellow-300 bg-yellow-50/80'
        }`}
      style={positionStyles}
      onClick={() => onClick(slot)}
      whileHover={isAvailable ? { scale: 1.02 } : undefined}
      layout
    >
      {isSold && showSoldAds && slot.fileUrl ? (
        // Show actual ad image
        <div className="relative w-full h-full">
          <img src={slot.fileUrl} alt="Anuncio" className="w-full h-full object-cover" />
          <div className="absolute top-1 right-1">
            <Badge variant="red" size="sm">VENDIDO</Badge>
          </div>
        </div>
      ) : isSold ? (
        // Show sold overlay without image
        <div className="text-center p-1">
          <Badge variant="red" size="sm">VENDIDO</Badge>
          {slot.clientInfo && (
            <p className="text-[8px] text-gray-400 mt-1 truncate max-w-full">{slot.clientInfo.name}</p>
          )}
        </div>
      ) : isAvailable ? (
        // Available slot
        <div className="text-center p-1">
          <p className="text-[9px] font-semibold text-green-700">{SLOT_DIMENSIONS[slot.size].label}</p>
          <p className="text-xs font-bold text-gray-800 mt-0.5">
            ${slot.price.toLocaleString('es-AR')}
          </p>
          <ZoomIn size={12} className="text-green mx-auto mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      ) : (
        // Reserved
        <div className="text-center">
          <Badge variant="yellow" size="sm">RESERVADO</Badge>
        </div>
      )}
    </motion.div>
  );
}

// ---- Single Page component ----
const MagazinePage = forwardRef<HTMLDivElement, {
  pageNumber: number;
  slots: Slot[];
  showSoldAds: boolean;
  onSlotClick: (slot: Slot) => void;
  isCover?: boolean;
}>(({ pageNumber, slots, showSoldAds, onSlotClick, isCover }, ref) => {
  return (
    <div ref={ref} className="bg-white relative overflow-hidden" style={{ boxShadow: 'inset -2px 0 8px rgba(0,0,0,0.05)' }}>
      {isCover ? (
        // Cover page
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-6">
          <div className="w-16 h-16 rounded-full gradient-teal flex items-center justify-center mb-4 shadow-md">
            <span className="text-white font-bold text-xl">LT</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 font-[family-name:var(--font-display)]">La Troncal</h2>
          <p className="text-sm text-gray-500 mt-1">Edición Jul-Ago 2026</p>
          <p className="text-xs text-teal mt-3 font-medium">Nordelta · Tigre · Alrededores</p>
          <div className="mt-6 text-xs text-gray-400">Hacé click o arrastrá para hojear →</div>
        </div>
      ) : (
        // Content page with slots
        <div className="w-full h-full relative p-3">
          {/* Page number */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-gray-300 font-medium">
            — {pageNumber} —
          </div>

          {/* Page content lines (decorative) */}
          <div className="absolute top-3 left-3 right-3 space-y-1.5 opacity-20">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="h-1.5 bg-gray-200 rounded-full" style={{ width: `${60 + Math.random() * 30}%` }} />
            ))}
          </div>

          {/* Slot overlays */}
          {slots.map((slot) => (
            <SlotOverlay
              key={slot.id}
              slot={slot}
              showSoldAds={showSoldAds}
              onClick={onSlotClick}
            />
          ))}

          {/* Empty page indicator if no slots */}
          {slots.length === 0 && (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-xs text-gray-300">Contenido editorial</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

MagazinePage.displayName = 'MagazinePage';

// ---- Main Magazine Viewer ----
export function MagazineViewer({
  slots,
  pricing,
  showSoldAds,
  pageCount,
}: {
  slots: Slot[];
  pricing: PricingConfig;
  showSoldAds: boolean;
  pageCount: number;
}) {
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const flipBookRef = useRef<any>(null);

  const handleSlotClick = useCallback((slot: Slot) => {
    setSelectedSlot(slot);
  }, []);

  const getPageSlots = (pageNum: number) =>
    slots.filter((s) => s.pageNumber === pageNum);

  // Build page array
  const pages: { pageNumber: number; isCover: boolean; slots: Slot[] }[] = [
    { pageNumber: 0, isCover: true, slots: [] }, // Cover
  ];
  for (let i = 2; i <= Math.max(pageCount, 6); i++) {
    pages.push({ pageNumber: i, isCover: false, slots: getPageSlots(i) });
  }
  // Ensure even number of pages for book layout
  if (pages.length % 2 !== 0) {
    pages.push({ pageNumber: pages.length + 1, isCover: false, slots: [] });
  }

  const totalPages = pages.length;

  return (
    <div className="flex flex-col items-center">
      {/* Magazine header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => flipBookRef.current?.pageFlip()?.flipPrev()}
          disabled={currentPage <= 0}
          icon={<ChevronLeft size={18} />}
        >
          Anterior
        </Button>
        <span className="text-sm text-gray-500 min-w-[120px] text-center">
          Página {currentPage + 1} de {totalPages}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => flipBookRef.current?.pageFlip()?.flipNext()}
          disabled={currentPage >= totalPages - 1}
          icon={<ChevronRight size={18} />}
        >
          Siguiente
        </Button>
      </div>

      {/* FlipBook */}
      <div className="relative">
        <HTMLFlipBook
          ref={flipBookRef}
          width={340}
          height={496}
          size="stretch"
          minWidth={280}
          maxWidth={500}
          minHeight={400}
          maxHeight={730}
          showCover={true}
          mobileScrollSupport={true}
          className="magazine-flipbook"
          style={{}}
          startPage={0}
          drawShadow={true}
          flippingTime={800}
          usePortrait={false}
          startZIndex={0}
          autoSize={true}
          maxShadowOpacity={0.5}
          showPageCorners={true}
          disableFlipByClick={false}
          useMouseEvents={true}
          swipeDistance={30}
          clickEventForward={true}
          onFlip={(e: any) => setCurrentPage(e.data)}
        >
          {pages.map((page, idx) => (
            <MagazinePage
              key={idx}
              pageNumber={page.pageNumber}
              slots={page.slots}
              showSoldAds={showSoldAds}
              onSlotClick={handleSlotClick}
              isCover={page.isCover}
            />
          ))}
        </HTMLFlipBook>
      </div>

      {/* Page dots */}
      <div className="flex gap-1.5 mt-6">
        {pages.map((_, i) => (
          <button
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              i === currentPage ? 'bg-teal w-5' : 'bg-gray-300 hover:bg-gray-400'
            }`}
            onClick={() => flipBookRef.current?.pageFlip()?.turnToPage(i)}
            aria-label={`Ir a página ${i + 1}`}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="flex gap-5 mt-5 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-green/20 border border-green/40" /> Disponible
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-red-50 border border-red-300" /> Vendido
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-yellow-50 border border-yellow-300" /> Reservado
        </span>
      </div>

      {/* Slot Detail Modal */}
      <AnimatePresence>
        {selectedSlot && (
          <SlotDetailModal
            slot={selectedSlot}
            pricing={pricing}
            onClose={() => setSelectedSlot(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ---- Slot Detail Modal ----
function SlotDetailModal({
  slot,
  pricing,
  onClose,
}: {
  slot: Slot;
  pricing: PricingConfig;
  onClose: () => void;
}) {
  const dim = SLOT_DIMENSIONS[slot.size];
  const isAvailable = slot.status === 'available';

  return (
    <Modal isOpen={true} onClose={onClose} title={dim.label} size="md">
      <div className="space-y-5">
        {/* Visual preview */}
        <div className="aspect-[0.685] w-full max-w-[200px] mx-auto bg-gray-50 rounded-lg border border-gray-200 relative flex items-center justify-center">
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

        {/* Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-400 text-xs">Tamaño</p>
            <p className="font-medium text-gray-800">{dim.label}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs">Dimensiones</p>
            <p className="font-medium text-gray-800">{dim.width} × {dim.height} cm</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs">Página</p>
            <p className="font-medium text-gray-800">{slot.pageNumber}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs">Estado</p>
            <Badge
              variant={isAvailable ? 'green' : slot.status === 'sold' ? 'red' : 'yellow'}
              dot
            >
              {isAvailable ? 'Disponible' : slot.status === 'sold' ? 'Vendido' : 'Reservado'}
            </Badge>
          </div>
        </div>

        {/* Price */}
        <div className="bg-gray-50 rounded-[var(--radius-md)] p-4 text-center">
          <p className="text-xs text-gray-400 mb-1">Precio</p>
          <p className="text-3xl font-bold text-gray-900">
            ${pricing[slot.size].toLocaleString('es-AR')}
          </p>
          <p className="text-xs text-gray-400">ARS · IVA incluido</p>
        </div>

        {/* Includes */}
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-center gap-2">
            <span className="text-green">✓</span> Publicación impresa + digital
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green">✓</span> Hipervínculo interactivo (Web o WhatsApp)
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green">✓</span> Formatos: JPG, PNG, TIFF (min. 300 DPI)
          </li>
        </ul>

        {/* CTA */}
        {isAvailable ? (
          <Link to={`/checkout/${slot.id}`}>
            <Button size="lg" className="w-full">
              Comprar este espacio — ${pricing[slot.size].toLocaleString('es-AR')}
            </Button>
          </Link>
        ) : (
          <Button size="lg" className="w-full" disabled>
            {slot.status === 'sold' ? 'Espacio vendido' : 'Espacio reservado'}
          </Button>
        )}
      </div>
    </Modal>
  );
}

// ---- Position helpers ----
function getSlotPosition(position: string, size: SlotSize): React.CSSProperties {
  const base: React.CSSProperties = { position: 'absolute' };
  
  switch (size) {
    case 'full':
      return { ...base, top: '8%', left: '5%', right: '5%', bottom: '8%' };
    case 'half':
      if (position === 'top') {
        return { ...base, top: '8%', left: '5%', right: '5%', height: '42%' };
      }
      return { ...base, bottom: '8%', left: '5%', right: '5%', height: '42%' };
    case 'quarter':
      if (position === 'top-left' || position === 'left') {
        return { ...base, top: '52%', left: '5%', width: '43%', height: '40%' };
      }
      if (position === 'top-right' || position === 'right') {
        return { ...base, top: '52%', right: '5%', width: '43%', height: '40%' };
      }
      if (position === 'bottom-left') {
        return { ...base, bottom: '8%', left: '5%', width: '43%', height: '40%' };
      }
      return { ...base, bottom: '8%', right: '5%', width: '43%', height: '40%' };
    case 'eighth':
      if (position === 'bottom-left') {
        return { ...base, bottom: '8%', left: '5%', width: '43%', height: '18%' };
      }
      if (position === 'bottom-right') {
        return { ...base, bottom: '8%', right: '5%', width: '43%', height: '18%' };
      }
      if (position === 'top-left') {
        return { ...base, top: '52%', left: '5%', width: '43%', height: '18%' };
      }
      return { ...base, top: '52%', right: '5%', width: '43%', height: '18%' };
    default:
      return { ...base, top: '8%', left: '5%', right: '5%', bottom: '8%' };
  }
}
