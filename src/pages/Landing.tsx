import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Eye, Globe, Zap, BookOpen, Smartphone, TrendingUp, ExternalLink, CreditCard } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { SLOT_DIMENSIONS } from '../types';
import type { SlotSize } from '../types';
import { usePricing } from '../hooks/useFirebase';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.6, ease: 'easeOut' as const },
};

const stagger = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

export default function Landing() {
  const { pricing, loading } = usePricing();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-teal font-medium">Cargando La Troncal...</div>
      </div>
    );
  }

  return (
    <div>
      {/* ================================================================
          HERO SECTION
          ================================================================ */}
      <section className="relative overflow-hidden gradient-hero min-h-[85vh] flex items-center">
        {/* Decorative circles */}
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-teal/10 blur-3xl" />
        <div className="absolute bottom-[-30%] left-[-15%] w-[600px] h-[600px] rounded-full bg-teal/5 blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' as const }}
            >
              <Badge variant="teal" size="md" dot>
                Agosto 2026 — Espacios disponibles
              </Badge>
              <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1]">
                Publicitá en <br /><span className="text-gradient-teal whitespace-nowrap">La Troncal</span>
              </h1>
              <p className="mt-5 text-lg text-gray-300 max-w-xl leading-relaxed">
                Guía Ruta Comercial 27<br />
                gráfica y digital.<br />
                Hiperlocal, interactiva y multimedial.<br />
                Alcance directo a tu público objetivo.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/espacios">
                  <Button size="lg" icon={<BookOpen size={20} />}>
                    Ver espacios disponibles
                  </Button>
                </Link>
                <a href="#precios">
                  <Button variant="secondary" size="lg">
                    Ver Precios
                  </Button>
                </a>
                <a href="https://linktr.ee/LatroncaldeNordelta" target="_blank" rel="noopener noreferrer" className="lg:hidden w-full sm:w-auto">
                  <Button variant="secondary" size="lg" className="w-full" icon={<ExternalLink size={20} />}>
                    Ver ediciones digitales
                  </Button>
                </a>
              </div>

              {/* Stats */}
              <div className="mt-10 flex gap-8">
                {[
                  { value: '12K+', label: 'Lectores por edición' },
                  { value: '42', label: 'Ediciones publicadas' },
                  { value: '300+', label: 'Anunciantes satisfechos' },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.15, duration: 0.5 }}
                  >
                    <p className="text-2xl font-bold text-teal">{stat.value}</p>
                    <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Hero Visual — Magazine Preview */}
            <motion.div
              className="hidden lg:block"
              initial={{ opacity: 0, x: 40, rotateY: -5 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: 'easeOut' as const }}
            >
              <div className="relative">
                {/* Magazine mockup */}
                <div className="relative w-[380px] mx-auto">
                  <div className="bg-white rounded-lg shadow-xl overflow-hidden aspect-[0.685] relative border border-gray-200">
                    {/* Simulated cover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-8">
                      <div className="w-20 h-20 rounded-full bg-white shadow-md flex items-center justify-center mb-4 p-3 border border-gray-100">
                        <img src="/favicon.svg" alt="La Troncal" className="w-full h-full object-contain" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 font-[family-name:var(--font-display)] text-center">
                        La Troncal
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 text-center px-4">Guía Ruta Comercial 27 edición Agosto 2026</p>
                      <div className="mt-6 w-full space-y-2">
                        <div className="h-2 bg-gray-200 rounded-full w-full" />
                        <div className="h-2 bg-gray-200 rounded-full w-4/5" />
                        <div className="h-2 bg-gray-200 rounded-full w-3/5" />
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-2 w-full">
                        <div className="h-20 bg-teal/10 rounded-md border border-teal/20 flex items-center justify-center">
                          <span className="text-[10px] text-teal font-medium">ESPACIO DISPONIBLE</span>
                        </div>
                        <div className="h-20 bg-green/10 rounded-md border border-green/20 flex items-center justify-center">
                          <span className="text-[10px] text-green font-medium">✓ VENDIDO</span>
                        </div>
                      </div>
                      <a href="https://linktr.ee/LatroncaldeNordelta" target="_blank" rel="noopener noreferrer" className="mt-4 w-full bg-teal text-white text-xs font-bold py-2 rounded-md hover:bg-teal-dark transition-colors flex items-center justify-center gap-2">
                        Ver ediciones digitales <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                  {/* Shadow pages behind */}
                  <div className="absolute -right-2 top-2 w-[380px] h-full bg-gray-200 rounded-lg -z-10 opacity-50" />
                  <div className="absolute -right-4 top-4 w-[380px] h-full bg-gray-300 rounded-lg -z-20 opacity-30" />
                </div>

                {/* Floating badge */}
                <motion.div
                  className="absolute -top-4 -right-4 bg-green text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  Espacios disponibles
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================================================================
          6x1 SECTION
          ================================================================ */}
      <section className="py-20 bg-teal text-white overflow-hidden relative">
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-[-30%] left-[-15%] w-[600px] h-[600px] rounded-full bg-white/5 blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div className="text-center mb-16" {...fadeInUp}>
            <h2 className="text-4xl sm:text-5xl font-bold font-[family-name:var(--font-display)] text-white drop-shadow-sm">
              6 Formatos Publicitarios <br />
              <span className="text-green-300 whitespace-nowrap">al precio de 1</span>
            </h2>
            <p className="mt-6 text-xl text-teal-50 max-w-2xl mx-auto font-medium">
              Tu marca por todos lados. Más visibilidad, más alcance, mejores resultados.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Aviso Impreso', desc: '6.000 Ejemplares. Distribución gratuita puerta a puerta, en eventos exclusivos y puntos estratégicos con revisteros propios.', icon: <BookOpen size={24} /> },
              { title: 'Guía Digital', desc: 'Tu marca siempre disponible online de forma interactiva.', icon: <Globe size={24} /> },
              { title: 'Reposteo en Redes', desc: 'Más alcance para tu marca a través de nuestros canales.', icon: <Smartphone size={24} /> },
              { title: 'Publinota', desc: 'Artículo en La Troncal (medio de noticias online).', icon: <Eye size={24} /> },
              { title: 'Entrevista', desc: 'En Camino Emprendedor. Contá la historia de tu marca.', icon: <Zap size={24} /> },
              { title: 'Eventos Exclusivos', desc: 'Networking y experiencias que generan oportunidades.', icon: <TrendingUp size={24} /> },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-teal-50 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          BENEFITS SECTION
          ================================================================ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-14" {...fadeInUp}>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              ¿Por qué publicitar en La Troncal?
            </h2>
            <p className="mt-4 text-xl text-gray-500 max-w-3xl mx-auto">
              Más que una Guía: una plataforma multimedial que conecta tu marca con la comunidad de Nordelta y alrededores.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <Eye size={28} />,
                title: 'Alcance Hiperlocal',
                description: 'Llegá a miles de vecinos con alto poder de consumo en Nordelta, Villanueva, Bancalari, Maschwitz y Puertos.',
                color: 'teal',
              },
              {
                icon: <Globe size={28} />,
                title: 'Interactividad Digital',
                description: 'Cada anuncio incluye un hipervínculo interactivo a tu web, WhatsApp o Instagram.',
                color: 'green',
              },
              {
                icon: <Zap size={28} />,
                title: 'Publicitá de manera simple y ágil',
                description: 'Elegí tu tamaño, pagá online y subí tu contenido. ¡Y ya estas publicitando en la próxima edición! Espacios limitados',
                color: 'teal',
              },
            ].map((benefit, i) => (
              <motion.div
                key={i}
                {...stagger}
                transition={{ delay: i * 0.15, duration: 0.5 }}
              >
                <Card hover className="h-full text-center">
                  <div className={`w-14 h-14 rounded-[var(--radius-lg)] mx-auto flex items-center justify-center mb-5 ${
                    benefit.color === 'teal' ? 'bg-teal-50 text-teal' : 'bg-green-50 text-green'
                  }`}>
                    {benefit.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {benefit.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          HOW IT WORKS
          ================================================================ */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-14" {...fadeInUp}>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              ¿Cómo funciona?
            </h2>
            <p className="mt-4 text-gray-500">3 pasos simples para publicitar en la próxima edición</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-teal via-teal-light to-green" />

            {[
              {
                step: '01',
                icon: <BookOpen size={24} />,
                title: 'Elegí tu espacio',
                desc: 'Mirá la guia digital, imaginando que en la próxima ya aparecerá tu marca. Seleccioná el tamaño que queres publicitar.',
              },
              {
                step: '02',
                title: 'Pagá online por tarjeta o transferencia',
                desc: 'Ya estás muy cerca de que tu marca se luzca en la próxima edición de la Guía RC27.',
                icon: <CreditCard size={24} />,
              },
              {
                step: '03',
                icon: <TrendingUp size={24} />,
                title: 'Subí tu contenido',
                desc: 'Cargá tu diseño y elegí el link de destino del QR (web / WhatsApp / Instagram). El QR podes ponerlo vos o lo agregamos nosotros.',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="text-center relative z-10"
                {...stagger}
                transition={{ delay: i * 0.2, duration: 0.5 }}
              >
                <div className="w-24 h-24 mx-auto rounded-full bg-white shadow-lg border-2 border-teal/20 flex items-center justify-center mb-5">
                  <div className="text-teal">
                    {item.icon}
                  </div>
                </div>
                <span className="text-xs font-bold text-teal uppercase tracking-widest">
                  Paso {item.step}
                </span>
                <h3 className="text-lg font-semibold text-gray-900 mt-2 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          PRICING SECTION
          ================================================================ */}
      <section id="precios" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-14" {...fadeInUp}>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Espacios y Precios
            </h2>
            <p className="mt-4 text-gray-500 max-w-xl mx-auto">
              Elegí el tamaño ideal para tu marca. Los precios son sin IVA (+ IVA 2.5%). ¡Aprovechá nuestra promoción por 3 ediciones!
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(Object.keys(SLOT_DIMENSIONS) as SlotSize[]).map((size, i) => {
              const dim = SLOT_DIMENSIONS[size];
              const price = pricing ? pricing[size] : 0;
              const isFeatured = size === 'full';

              return (
                <motion.div
                  key={size}
                  {...stagger}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  <Card
                    hover
                    className={`relative overflow-hidden ${isFeatured ? 'ring-2 ring-teal shadow-lg' : ''}`}
                  >
                    {isFeatured && (
                      <div className="absolute top-0 right-0 bg-teal text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg">
                        POPULAR
                      </div>
                    )}

                    {/* Visual representation */}
                    <div className="aspect-[0.685] w-full bg-gray-50 rounded-[var(--radius-md)] mb-4 border border-gray-200 relative overflow-hidden flex items-center justify-center">
                      <div
                        className={`bg-teal/10 border-2 border-dashed border-teal/40 rounded-sm flex items-center justify-center`}
                        style={{
                          width: size === 'full' ? '80%' : size === 'half' ? '80%' : '45%',
                          height: size === 'full' ? '85%' : size === 'half' ? '42%' : size === 'quarter' ? '42%' : '20%',
                        }}
                      >
                        <span className="text-[10px] text-teal font-medium">Tu aviso aquí</span>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900">{dim.label}</h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {dim.width} × {dim.height} cm
                    </p>

                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-gray-900">
                        ${price.toLocaleString('es-AR')}
                      </span>
                      <span className="text-sm text-gray-400">ARS</span>
                    </div>

                    <ul className="mt-4 space-y-1.5 text-xs text-gray-500">
                      <li className="flex items-center gap-2">
                        <span className="text-green">✓</span> Impreso + Digital c/ QR interactivo
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green">✓</span> Publinota
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green">✓</span> Entrevista radial
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green">✓</span> Redes sociales
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green">✓</span> Eventos exclusivos
                      </li>
                    </ul>

                    <Link to="/espacios" className="block mt-5">
                      <Button
                        variant={isFeatured ? 'primary' : 'outline'}
                        size="sm"
                        className="w-full"
                        icon={<ArrowRight size={16} />}
                      >
                        Elegir espacio
                      </Button>
                    </Link>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================================
          CTA SECTION
          ================================================================ */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="gradient-teal rounded-[var(--radius-xl)] p-10 sm:p-14 text-center text-white relative overflow-hidden"
            {...fadeInUp}
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/3 -translate-x-1/4" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold">
                ¿Tu marca lista para publicitar?
              </h2>
              <p className="mt-4 text-white/80 max-w-lg mx-auto">
                La próxima edición cierra pronto. Reservá tu espacio ahora y llegá a toda la comunidad de Nordelta, Villanueva, Maschwitz, Puertos y mucho más.
              </p>
              <div className="mt-8">
                <Link to="/espacios">
                  <Button
                    size="lg"
                    variant="secondary"
                    icon={<ArrowRight size={20} />}
                    className="!bg-white !text-teal-dark hover:!bg-gray-100"
                  >
                    Explorar espacios disponibles
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
