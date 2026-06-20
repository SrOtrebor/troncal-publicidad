import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Globe, MessageCircle } from 'lucide-react';

const InstagramIcon = ({ size = 16 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
              <div className="flex items-center gap-3 mb-4">
                <img src="/favicon.svg" alt="La Troncal" className="w-10 h-10" />
                <div>
                  <p className="text-white font-bold text-lg font-[family-name:var(--font-display)]">La Troncal</p>
                </div>
              </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Guía Ruta Comercial 27<br />
              Publicidad gráfica y digital.<br />
              Alcance directo a tu público objetivo.
            </p>
            <div className="flex gap-3 mt-5">
              {[
                { icon: MessageCircle, href: 'https://wa.me/5491140300942' },
                { icon: InstagramIcon, href: 'https://instagram.com/latroncaldenordelta' },
                { icon: Mail, href: 'mailto:latroncaldenordelta@gmail.com' },
              ].map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-teal hover:text-white transition-all duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Navegación
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Inicio', href: '/' },
                { label: 'Espacios Publicitarios', href: '/espacios' },
                { label: 'Contacto', href: '#contacto' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-400 hover:text-teal transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Contacto
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm">
                <Globe size={16} className="text-teal shrink-0" />
                <a href="https://www.latroncal.com.ar" target="_blank" rel="noopener noreferrer" className="hover:text-teal transition-colors">
                  www.latroncal.com.ar
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Mail size={16} className="text-teal shrink-0" />
                <a href="mailto:latroncaldenordelta@gmail.com" className="hover:text-teal transition-colors">
                  latroncaldenordelta@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <span className="text-teal font-bold shrink-0">@</span>
                <a href="https://instagram.com/latroncaldenordelta" target="_blank" rel="noopener noreferrer" className="hover:text-teal transition-colors">
                  @latroncaldenordelta
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Phone size={16} className="text-teal shrink-0" />
                <a href="tel:+5491140300942" className="hover:text-teal transition-colors">
                  +54 9 11 4030-0942
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <MapPin size={16} className="text-teal shrink-0 mt-0.5" />
                <span>Nordelta, Tigre<br />Buenos Aires, Argentina</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-500">
            © 2026 La Troncal. Todos los derechos reservados.
          </p>
          <p className="text-xs text-gray-600">
            Desarrollado por <a href="https://estudioprecinto.com" target="_blank" rel="noopener noreferrer" className="hover:text-teal transition-colors">estudioprecinto.com</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
