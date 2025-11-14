import { Instagram, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center space-y-6">
          <h3 className="text-2xl font-bold text-white">
            Creado por Matías Ivanobski
          </h3>

          <div className="flex items-center justify-center space-x-6">
            <a
              href="https://instagram.com/matias.stuntman"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors duration-200"
            >
              <Instagram className="w-5 h-5" />
              <span>@matias.stuntman</span>
            </a>

            <a
              href="mailto:contacto@stuntspro.ar"
              className="flex items-center space-x-2 text-red-400 hover:text-red-300 transition-colors duration-200"
            >
              <Mail className="w-5 h-5" />
              <span>Contacto Directo</span>
            </a>
          </div>

          <div className="pt-6 border-t border-gray-800">
            <p className="text-gray-400 text-sm">
              © 2024 StuntsProAr - Todos los derechos reservados
            </p>
            <p className="text-gray-500 text-xs mt-2">
              Plataforma profesional para dobles de riesgo en Argentina
            </p>
            <p className="text-gray-600 text-xs mt-1">
              Los datos personales se publican con autorización expresa de cada individuo
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
