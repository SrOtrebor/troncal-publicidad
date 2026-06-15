import { Link } from 'react-router-dom';
import { ExternalLink, Mail, Phone, MapPin } from 'lucide-react';

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
                <p className="text-xs text-gray-500 uppercase tracking-widest">Publicidad</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              La revista bimestral de Nordelta, Tigre y alrededores. 
              Conectamos marcas con la comunidad a través de publicidad impresa e interactiva digital.
            </p>
            <div className="flex gap-3 mt-5">
              {[
                { icon: ExternalLink, href: '#' },
                { icon: ExternalLink, href: '#' },
                { icon: ExternalLink, href: '#' },
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
                <Mail size={16} className="text-teal shrink-0" />
                <a href="mailto:publicidad@latroncal.com.ar" className="hover:text-teal transition-colors">
                  publicidad@latroncal.com.ar
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Phone size={16} className="text-teal shrink-0" />
                <a href="tel:+5491100000000" className="hover:text-teal transition-colors">
                  +54 9 11 0000-0000
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
            © {new Date().getFullYear()} La Troncal. Todos los derechos reservados.
          </p>
          <p className="text-xs text-gray-600">
            Plataforma de gestión publicitaria
          </p>
        </div>
      </div>
    </footer>
  );
}
