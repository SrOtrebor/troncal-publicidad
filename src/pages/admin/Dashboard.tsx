import { useState } from 'react';

import { motion } from 'framer-motion';
import {
  LayoutDashboard, BookOpen, Grid3x3, Image, Download, DollarSign,
  Bell, Settings, LogOut, ChevronDown, Plus, Eye, EyeOff,
  Printer, Calendar, TrendingUp, Users, Package, Trash2
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useActiveEdition, useSlots, usePricing, useNotifications, useSettings, useClients, useAuth } from '../../hooks/useFirebase';
import { doc, updateDoc, deleteField } from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { db, auth } from '../../lib/firebase';
import { SLOT_DIMENSIONS } from '../../types';
import type { SlotSize, PricingConfig, Slot, Notification, ClientRecord } from '../../types';

type AdminView = 'overview' | 'editions' | 'slots' | 'materials' | 'pricing' | 'export' | 'clients';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState(0);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutTime > 0) return;
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setAttempts(0);
    } catch (err: any) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setError('Credenciales inválidas. Por favor intenta de nuevo.');
      
      if (newAttempts >= 3) {
        setLockoutTime(30);
        setError('Demasiados intentos. Esperá 30 segundos.');
        const interval = setInterval(() => {
          setLockoutTime((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-gray-900 mb-2">Panel de Control</h1>
          <p className="text-gray-500">Ingresá tus credenciales para continuar</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-[var(--radius-md)] border border-red-100">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-[var(--radius-md)] focus:ring-2 focus:ring-teal focus:border-transparent outline-none transition-shadow"
              placeholder="admin@latroncal.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-[var(--radius-md)] focus:ring-2 focus:ring-teal focus:border-transparent outline-none transition-shadow"
              placeholder="••••••••"
              required
            />
          </div>
          
          <Button type="submit" loading={loading} disabled={lockoutTime > 0} className="w-full" size="lg">
            {lockoutTime > 0 ? `Esperá ${lockoutTime}s` : 'Ingresar'}
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default function AdminDashboard() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Verificando sesión...</div>;
  }

  if (!user) {
    return <AdminLogin />;
  }

  return <AdminDashboardContent />;
}

function AdminDashboardContent() {
  const { edition, loading: loadingEd } = useActiveEdition();
  const { slots, loading: loadingSlots } = useSlots(edition?.id);
  const { pricing, loading: loadingPricing } = usePricing();
  const { notifications, loading: loadingNotifs } = useNotifications();
  const { settings, loading: loadingSettings } = useSettings();
  const { clients, loading: loadingClients } = useClients();

  const [currentView, setCurrentView] = useState<AdminView>('overview');
  const [showNotifications, setShowNotifications] = useState(false);
  const [localPricing, setLocalPricing] = useState<PricingConfig | null>(null);
  const [pricingSaved, setPricingSaved] = useState(false);
  const [optimisticShowSoldAds, setOptimisticShowSoldAds] = useState<boolean | null>(null);

  // Initialize local states once data is loaded
  if (!localPricing && pricing) {
    setLocalPricing(pricing);
  }

  // Clear optimistic state when settings from Firebase matches it
  if (optimisticShowSoldAds !== null && settings?.showSoldAds === optimisticShowSoldAds) {
    setOptimisticShowSoldAds(null);
  }

  const displayShowSoldAds = optimisticShowSoldAds !== null ? optimisticShowSoldAds : settings?.showSoldAds;

  const loading = loadingEd || loadingSlots || loadingPricing || loadingNotifs || loadingSettings || loadingClients;

  if (loading || !edition || !pricing || !settings || !localPricing) {
    return <div className="min-h-screen flex items-center justify-center">Cargando dashboard...</div>;
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  const sidebarLinks: { key: AdminView; label: string; icon: React.ReactNode }[] = [
    { key: 'overview', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { key: 'pricing', label: 'Precios', icon: <DollarSign size={18} /> },
    { key: 'editions', label: 'Ediciones', icon: <BookOpen size={18} /> },
    { key: 'slots', label: 'Espacios', icon: <Grid3x3 size={18} /> },
    { key: 'materials', label: 'Materiales', icon: <Image size={18} /> },
    { key: 'clients', label: 'Clientes', icon: <Users size={18} /> },
    { key: 'export', label: 'Exportar', icon: <Download size={18} /> },
  ];

  const soldSlots = slots.filter((s) => s.status === 'sold');
  const availableSlots = slots.filter((s) => s.status === 'available');
  const totalRevenue = soldSlots.reduce((sum, s) => sum + s.price, 0);

  // Days until print deadline
  const daysUntilDeadline = Math.ceil(
    (edition.printDeadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col fixed h-screen">
        {/* Logo */}
        <div className="p-5 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <img src="/favicon.svg" alt="La Troncal" className="w-9 h-9" />
            <div>
              <p className="font-bold text-sm">La Troncal</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {sidebarLinks.map((link) => (
            <button
              key={link.key}
              onClick={() => setCurrentView(link.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] text-sm font-medium transition-all duration-200
                ${currentView === link.key
                  ? 'bg-teal text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
            >
              {link.icon}
              {link.label}
            </button>
          ))}
        </nav>

        {/* Settings bottom */}
        <div className="p-3 border-t border-gray-800 space-y-1">
          <button 
            onClick={() => signOut(auth)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-[var(--radius-md)] text-sm text-gray-400 hover:text-red-400 hover:bg-gray-800 transition-colors"
          >
            <LogOut size={18} /> Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 ml-64">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-30">
          <div>
            <h1 className="text-lg font-bold text-gray-900">{sidebarLinks.find((l) => l.key === currentView)?.label}</h1>
            <p className="text-xs text-gray-400">{edition.title}</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Show sold ads toggle */}
            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
              <span className="text-xs text-gray-500">Mostrar anuncios</span>
              <button
                onClick={async () => {
                  const newValue = !displayShowSoldAds;
                  setOptimisticShowSoldAds(newValue);
                  await updateDoc(doc(db, 'config', 'settings'), {
                    showSoldAds: newValue
                  });
                }}
                className={`relative w-10 h-5 shrink-0 rounded-full transition-colors duration-200 ${displayShowSoldAds ? 'bg-green' : 'bg-gray-300'}`}
              >
                <span className={`absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${displayShowSoldAds ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
              {displayShowSoldAds ? <Eye size={14} className="text-green" /> : <EyeOff size={14} className="text-gray-400" />}
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-[var(--radius-md)] text-gray-500 hover:bg-gray-100 transition-colors"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification dropdown */}
              {showNotifications && (
                <motion.div
                  className="absolute right-0 mt-2 w-80 bg-white rounded-[var(--radius-lg)] shadow-xl border border-gray-200 overflow-hidden z-50"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-900">Notificaciones</h3>
                    <button className="text-xs text-teal hover:underline">Marcar todas como leídas</button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer ${
                          !notif.read ? 'bg-teal-50/30' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!notif.read ? 'bg-teal' : 'bg-transparent'}`} />
                          <div>
                            <p className="text-sm text-gray-800">{notif.message}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {notif.createdAt.toLocaleDateString('es-AR')} · ${notif.amount.toLocaleString('es-AR')}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
            


            <div className="w-8 h-8 rounded-full bg-teal text-white flex items-center justify-center text-xs font-bold">
              A
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="p-6">
          {currentView === 'overview' && (
            <OverviewView
              soldCount={soldSlots.length}
              availableCount={availableSlots.length}
              totalRevenue={totalRevenue}
              daysUntilDeadline={daysUntilDeadline}
              edition={edition}
              notifications={notifications}
            />
          )}
          {currentView === 'pricing' && (
            <PricingView
              pricing={localPricing}
              setPricing={setLocalPricing}
              saved={pricingSaved}
              onSave={async () => {
                await updateDoc(doc(db, 'config', 'pricing'), localPricing as any);
                setPricingSaved(true); setTimeout(() => setPricingSaved(false), 3000); 
              }}
            />
          )}
          {currentView === 'editions' && <EditionsView edition={edition} />}
          {currentView === 'slots' && <SlotsView slots={slots} />}
          {currentView === 'materials' && <MaterialsView slots={soldSlots} />}
          {currentView === 'clients' && <ClientsView clients={clients} />}
          {currentView === 'export' && <ExportView edition={edition} />}
        </div>
      </div>
    </div>
  );
}

// =========================================
// Overview View
// =========================================
function OverviewView({ soldCount, availableCount, totalRevenue, daysUntilDeadline, edition, notifications }: any) {
  const stats = [
    { label: 'Espacios vendidos', value: soldCount, icon: <Package size={20} />, color: 'text-green', bg: 'bg-green-50' },
    { label: 'Espacios disponibles', value: availableCount, icon: <Grid3x3 size={20} />, color: 'text-teal', bg: 'bg-teal-50' },
    { label: 'Revenue total', value: `$${totalRevenue.toLocaleString('es-AR')}`, icon: <TrendingUp size={20} />, color: 'text-green', bg: 'bg-green-50' },
    { label: 'Días para cierre', value: daysUntilDeadline, icon: <Printer size={20} />, color: daysUntilDeadline <= 7 ? 'text-red-500' : 'text-teal', bg: daysUntilDeadline <= 7 ? 'bg-red-50' : 'bg-teal-50' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-[var(--radius-lg)] ${stat.bg} ${stat.color} flex items-center justify-center`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-xs text-gray-400">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Edition info */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Edición actual</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Título</span>
              <span className="font-medium">{edition.title}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Bimestre</span>
              <Badge variant="teal">{edition.period}</Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Páginas</span>
              <span className="font-medium">{edition.pageCount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Estado</span>
              <Badge variant="green" dot>{edition.status}</Badge>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            <Printer size={14} className="inline mr-1.5" />
            Fechas de imprenta
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Cierre de materiales</span>
              <span className="font-medium">{edition.printDeadline.toLocaleDateString('es-AR')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Envío a imprenta</span>
              <span className="font-medium">{edition.printDate.toLocaleDateString('es-AR')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Publicación</span>
              <span className="font-medium">{edition.publicationDate.toLocaleDateString('es-AR')}</span>
            </div>
            {daysUntilDeadline <= 7 && (
              <div className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded-[var(--radius-md)] font-medium flex items-center gap-2">
                <Calendar size={14} />
                ⚠️ Faltan {daysUntilDeadline} días para el cierre
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Recent sales */}
      <Card>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Últimas ventas</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 text-gray-400 font-medium">Cliente</th>
                <th className="text-left py-2 text-gray-400 font-medium">Espacio</th>
                <th className="text-left py-2 text-gray-400 font-medium">Monto</th>
                <th className="text-left py-2 text-gray-400 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {notifications.map((n: Notification) => (
                <tr key={n.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 font-medium text-gray-800">{n.clientName}</td>
                  <td className="py-3 text-gray-600">{SLOT_DIMENSIONS[n.slotSize].label}</td>
                  <td className="py-3 text-gray-800 font-medium">${n.amount.toLocaleString('es-AR')}</td>
                  <td className="py-3"><Badge variant="green" size="sm" dot>Pagado</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// =========================================
// Pricing View
// =========================================
function PricingView({ pricing, setPricing, saved, onSave }: { pricing: PricingConfig; setPricing: (p: PricingConfig) => void; saved: boolean; onSave: () => void }) {
  return (
    <div className="max-w-2xl space-y-6">
      <Card>
        <h3 className="text-lg font-bold text-gray-900 mb-1">Configuración de Precios</h3>
        <p className="text-sm text-gray-400 mb-6">Modificá los precios de cada tamaño de espacio. Los cambios se reflejan inmediatamente en la plataforma.</p>

        <div className="space-y-4">
          {(Object.keys(SLOT_DIMENSIONS) as SlotSize[]).map((size) => {
            const dim = SLOT_DIMENSIONS[size];
            return (
              <div key={size} className="flex items-center gap-4 p-4 bg-gray-50 rounded-[var(--radius-md)]">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">{dim.label}</p>
                  <p className="text-xs text-gray-400">{dim.width} × {dim.height} cm</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">$</span>
                  <input
                    type="number"
                    value={pricing[size]}
                    onChange={(e) => setPricing({ ...pricing, [size]: Number(e.target.value) })}
                    className="w-32 px-3 py-2 rounded-[var(--radius-md)] border border-gray-300 text-sm text-right font-mono focus:outline-none focus:ring-2 focus:ring-teal focus:border-teal"
                  />
                  <span className="text-xs text-gray-400">ARS</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <p className="text-xs text-gray-400">Última actualización: {new Date().toLocaleDateString('es-AR')}</p>
          <div className="flex items-center gap-3">
            {saved && (
              <motion.span
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-sm text-green font-medium"
              >
                ✓ Precios guardados
              </motion.span>
            )}
            <Button onClick={onSave} icon={<DollarSign size={16} />}>
              Guardar precios
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

// =========================================
// Editions View
// =========================================
function EditionsView({ edition }: { edition: any }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Gestión de Ediciones</h2>
        <Button icon={<Plus size={16} />}>Nueva Edición</Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 text-gray-500 font-medium">Edición</th>
                <th className="text-left py-3 text-gray-500 font-medium">Bimestre</th>
                <th className="text-left py-3 text-gray-500 font-medium">Estado</th>
                <th className="text-left py-3 text-gray-500 font-medium">Cierre imprenta</th>
                <th className="text-left py-3 text-gray-500 font-medium">Espacios</th>
                <th className="text-left py-3 text-gray-500 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-50 hover:bg-gray-50">
                <td className="py-3 font-medium">{edition.title}</td>
                <td className="py-3"><Badge variant="teal">{edition.period}</Badge></td>
                <td className="py-3"><Badge variant="green" dot>Activa</Badge></td>
                <td className="py-3 text-gray-600">{edition.printDeadline.toLocaleDateString('es-AR')}</td>
                <td className="py-3 text-gray-600">{edition.soldSlots}/{edition.totalSlots}</td>
                <td className="py-3">
                  <Button variant="ghost" size="sm">Editar</Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// =========================================
// Slots View
// =========================================
function SlotsView({ slots }: { slots: Slot[] }) {
  const handleFreeSlot = async (slotId: string) => {
    if (!window.confirm('¿Estás seguro de liberar este espacio? Se borrarán los datos del cliente y el archivo.')) return;
    try {
      await updateDoc(doc(db, 'slots', slotId), {
        status: 'available',
        clientInfo: deleteField(),
        paymentId: deleteField(),
        fileUrl: deleteField(),
        fileName: deleteField(),
        renamedFileName: deleteField(),
        destinationLink: deleteField(),
        linkType: deleteField(),
        updatedAt: new Date()
      });
    } catch (e) {
      alert('Error al liberar espacio');
    }
  };

  const handleFreeAll = async () => {
    const soldSlots = slots.filter(s => s.status !== 'available');
    if (soldSlots.length === 0) return alert('No hay espacios ocupados para liberar.');
    if (!window.confirm(`¿Estás seguro de liberar TODOS los espacios ocupados (${soldSlots.length})?`)) return;
    
    try {
      for (const slot of soldSlots) {
        await updateDoc(doc(db, 'slots', slot.id), {
          status: 'available',
          clientInfo: deleteField(),
          paymentId: deleteField(),
          fileUrl: deleteField(),
          fileName: deleteField(),
          renamedFileName: deleteField(),
          destinationLink: deleteField(),
          linkType: deleteField(),
          updatedAt: new Date()
        });
      }
      alert('Todos los espacios han sido liberados.');
    } catch(e: any) {
      alert('Ocurrió un error al liberar los espacios.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Gestión de Espacios</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleFreeAll} className="text-red-600 border-red-200 hover:bg-red-50" icon={<Trash2 size={14} />}>Liberar Todos</Button>
          <Button variant="outline" size="sm" icon={<Plus size={14} />}>Agregar Página</Button>
          <Button size="sm" icon={<Plus size={14} />}>Nuevo Espacio</Button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {slots.map((slot) => {
          const dim = SLOT_DIMENSIONS[slot.size];
          return (
            <Card key={slot.id} hover padding="sm">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs text-gray-400 font-mono">{slot.id}</p>
                  <p className="text-sm font-semibold text-gray-800">{dim.label}</p>
                </div>
                <Badge
                  variant={slot.status === 'available' ? 'green' : slot.status === 'sold' ? 'red' : 'yellow'}
                  size="sm"
                  dot
                >
                  {slot.status === 'available' ? 'Libre' : slot.status === 'sold' ? 'Vendido' : 'Reservado'}
                </Badge>
              </div>

              <div className="text-xs text-gray-500 space-y-1">
                <div className="flex justify-between">
                  <span>Página</span>
                  <span className="font-medium text-gray-700">{slot.pageNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>Precio</span>
                  <span className="font-medium text-gray-700">${slot.price.toLocaleString('es-AR')}</span>
                </div>
                {slot.clientInfo && (
                  <div className="flex justify-between">
                    <span>Cliente</span>
                    <span className="font-medium text-gray-700 truncate max-w-[120px]">{slot.clientInfo.name}</span>
                  </div>
                )}
              </div>

              <div className="mt-3 flex gap-2">
                <Button variant="ghost" size="sm" className="flex-1 text-xs">Ver detalle</Button>
                {slot.status !== 'available' && (
                  <Button variant="ghost" size="sm" onClick={() => handleFreeSlot(slot.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50">Liberar</Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// =========================================
// Materials View
// =========================================
function MaterialsView({ slots }: { slots: Slot[] }) {
  const handleFreeSlot = async (slotId: string) => {
    if (!window.confirm('¿Estás seguro de liberar este espacio? Se borrarán los datos del cliente y el archivo.')) return;
    try {
      await updateDoc(doc(db, 'slots', slotId), {
        status: 'available',
        clientInfo: deleteField(),
        paymentId: deleteField(),
        fileUrl: deleteField(),
        fileName: deleteField(),
        renamedFileName: deleteField(),
        destinationLink: deleteField(),
        linkType: deleteField(),
        updatedAt: new Date()
      });
    } catch (e) {
      alert('Error al liberar espacio');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-gray-900">Materiales Recibidos</h2>

      {slots.length === 0 ? (
        <Card className="text-center py-12">
          <Image size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No hay materiales todavía</p>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {slots.map((slot) => (
            <Card key={slot.id} hover padding="sm">
              {/* Placeholder for image */}
              <div className="aspect-[0.685] bg-gray-100 rounded-[var(--radius-md)] mb-3 flex items-center justify-center border border-gray-200">
                <div className="text-center">
                  <Image size={24} className="text-gray-300 mx-auto mb-1" />
                  <p className="text-[10px] text-gray-400">{slot.renamedFileName || 'Sin archivo'}</p>
                </div>
              </div>
              <p className="text-sm font-semibold text-gray-800">{slot.clientInfo?.name}</p>
              <p className="text-xs text-gray-400">{SLOT_DIMENSIONS[slot.size].label} · Pág. {slot.pageNumber}</p>
              {slot.destinationLink && (
                <p className="text-xs text-teal mt-1 truncate">{slot.destinationLink}</p>
              )}
              <div className="mt-3">
                 <Button variant="outline" size="sm" onClick={() => handleFreeSlot(slot.id)} className="w-full text-red-500 text-xs border-red-200 hover:bg-red-50">Liberar espacio</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// =========================================
// Export View
// =========================================
function ExportView({ edition }: { edition: any }) {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    // Simulate export
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setExporting(false);
    alert('✅ Archivo ZIP generado (demo). En producción, se descargaría un .zip con todos los activos.');
  };

  return (
    <div className="max-w-2xl space-y-6">
      <Card>
        <h3 className="text-lg font-bold text-gray-900 mb-2">Exportar Edición</h3>
        <p className="text-sm text-gray-500 mb-6">
          Descargá todos los materiales de la edición organizados por carpetas para imprenta y maquetación digital.
        </p>

        <div className="bg-gray-50 rounded-[var(--radius-md)] p-4 mb-6">
          <p className="text-xs text-gray-500 font-mono mb-2">Estructura del ZIP:</p>
          <pre className="text-xs text-gray-600 leading-relaxed">
{`Edicion_Jul-Ago_2026/
├── imprenta/
│   ├── pag_02/
│   │   ├── slot-p02-full_CasinoNordelta_20260610.jpg
│   │   └── manifest.json
│   ├── pag_03/
│   └── ...
└── digital/
    ├── pag_02/
    │   ├── slot-p02-full_CasinoNordelta_20260610.jpg
    │   └── links.json
    └── ...`}
          </pre>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            <p>{edition?.soldSlots} archivos · {edition?.title}</p>
          </div>
          <Button onClick={handleExport} loading={exporting} icon={<Download size={16} />} size="lg">
            Descargar ZIP
          </Button>
        </div>
      </Card>
    </div>
  );
}

// =========================================
// Clients View
// =========================================
function ClientsView({ clients }: { clients: ClientRecord[] }) {
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState<'all' | '30days' | '6months' | 'year'>('all');

  const filteredClients = clients.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase());
    let matchDate = true;
    if (dateFilter !== 'all' && c.lastPurchaseDate) {
       const now = new Date();
       const diffTime = Math.abs(now.getTime() - c.lastPurchaseDate.getTime());
       const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
       if (dateFilter === '30days') matchDate = diffDays <= 30;
       if (dateFilter === '6months') matchDate = diffDays <= 180;
       if (dateFilter === 'year') matchDate = diffDays <= 365;
    }
    return matchSearch && matchDate;
  });

  const exportCSV = () => {
    const csvHeaders = ['Nombre', 'Email', 'Teléfono', 'Primera Compra', 'Última Compra', 'Total Compras'];
    const rows = filteredClients.map(c => [
      `"${c.name}"`,
      `"${c.email}"`,
      `"${c.phone}"`,
      `"${c.firstPurchaseDate ? c.firstPurchaseDate.toLocaleDateString('es-AR') : ''}"`,
      `"${c.lastPurchaseDate ? c.lastPurchaseDate.toLocaleDateString('es-AR') : ''}"`,
      c.totalPurchases || 0
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [csvHeaders.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'clientes_latroncal.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Base de Datos de Clientes</h2>
        <Button onClick={exportCSV} icon={<Download size={16} />} size="sm">Exportar CSV</Button>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-[var(--radius-md)] text-sm focus:outline-none focus:ring-2 focus:ring-teal"
          />
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-[var(--radius-md)] text-sm focus:outline-none focus:ring-2 focus:ring-teal"
          >
            <option value="all">Todas las fechas (Última compra)</option>
            <option value="30days">Últimos 30 días</option>
            <option value="6months">Últimos 6 meses</option>
            <option value="year">Último año</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 text-gray-500 font-medium">Cliente</th>
                <th className="text-left py-3 text-gray-500 font-medium">Contacto</th>
                <th className="text-left py-3 text-gray-500 font-medium">Última Compra</th>
                <th className="text-center py-3 text-gray-500 font-medium">Total Compras</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-500">
                    No se encontraron clientes que coincidan con los filtros.
                  </td>
                </tr>
              ) : (
                filteredClients.map(client => (
                  <tr key={client.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 font-medium text-gray-900">{client.name}</td>
                    <td className="py-3">
                      <div className="text-gray-800">{client.email}</div>
                      <div className="text-xs text-gray-500">{client.phone}</div>
                    </td>
                    <td className="py-3 text-gray-600">
                      {client.lastPurchaseDate ? client.lastPurchaseDate.toLocaleDateString('es-AR') : '-'}
                    </td>
                    <td className="py-3 text-center">
                      <Badge variant="teal" size="sm">{client.totalPurchases || 0}</Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
