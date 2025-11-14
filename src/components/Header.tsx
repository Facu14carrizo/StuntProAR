import { Flame, User, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  onShowAuth: () => void;
}

export function Header({ onShowAuth }: HeaderProps) {
  const { user, isGuest, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-black/95 backdrop-blur-md border-b border-red-900/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="relative">
              <Flame className="w-8 h-8 sm:w-10 sm:h-10 text-red-600" strokeWidth={2.5} />
              <div className="absolute inset-0 blur-xl opacity-50 bg-red-600"></div>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-wider">
              <span className="text-white">STUNTS</span>
              <span className="text-red-600">PRO</span>
              <span className="text-blue-500">AR</span>
            </h1>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <div className="flex items-center space-x-2 text-gray-300">
                  <User className="w-5 h-5" />
                  <span className="text-sm font-medium truncate max-w-[150px]">{user.email}</span>
                </div>
                <button
                  onClick={() => signOut()}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white rounded-lg transition-all duration-200 border border-gray-700"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Salir</span>
                </button>
              </>
            ) : isGuest ? (
              <>
                <span className="text-sm text-gray-400">Modo Invitado</span>
                <button
                  onClick={onShowAuth}
                  className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-red-600/30"
                >
                  Iniciar Sesión
                </button>
              </>
            ) : (
              <button
                onClick={onShowAuth}
                className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-red-600/30"
              >
                Iniciar Sesión
              </button>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800 animate-in slide-in-from-top duration-200">
            <div className="space-y-3">
              {user ? (
                <>
                  <div className="flex items-center space-x-2 px-4 py-2 bg-gray-800/50 rounded-lg">
                    <User className="w-5 h-5 text-gray-300" />
                    <span className="text-sm text-gray-300 truncate">{user.email}</span>
                  </div>
                  <button
                    onClick={() => {
                      signOut();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white rounded-lg transition-all duration-200 border border-gray-700"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Cerrar Sesión</span>
                  </button>
                </>
              ) : (
                <>
                  {isGuest && (
                    <div className="px-4 py-2 bg-yellow-900/20 border border-yellow-700/50 rounded-lg">
                      <span className="text-sm text-yellow-300">Navegando como invitado</span>
                    </div>
                  )}
                  <button
                    onClick={() => {
                      onShowAuth();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold rounded-lg transition-all duration-200 shadow-lg shadow-red-600/30"
                  >
                    Iniciar Sesión
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
