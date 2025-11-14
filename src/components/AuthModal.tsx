import { X, LogIn, UserPlus, Users } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface AuthModalProps {
  onClose: () => void;
}

export function AuthModal({ onClose }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register' | 'guest'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signIn, signUp, continueAsGuest } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        console.log("Login email:", email, "password:", password);
        await signIn(email.trim().toLowerCase(), password);
        onClose();
      } else if (mode === 'register') {
        if (!fullName.trim()) {
          setError('Por favor ingresa tu nombre completo');
          setLoading(false);
          return;
        }
        // Validación básica de email para prevenir envío de emails mal formados
        const emailToSend = email.trim().toLowerCase();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailToSend)) {
          setError('El correo electrónico no es válido');
          setLoading(false);
          return;
        }
        console.log("Registro email:", emailToSend, "password:", password, "fullName:", fullName);
        await signUp(emailToSend, password, fullName);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestMode = () => {
    continueAsGuest();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/95 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl sm:rounded-2xl border border-gray-700 shadow-2xl w-full max-w-md overflow-hidden">
        <div className="relative bg-gradient-to-r from-red-600 to-blue-600 p-4 sm:p-6">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-black/30 hover:bg-black/50 active:scale-95 text-white p-1.5 sm:p-2 rounded-full transition-all duration-200 touch-manipulation"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <h2 className="text-2xl sm:text-3xl font-black text-white">
            {mode === 'login' && 'Iniciar Sesión'}
            {mode === 'register' && 'Registrarse'}
            {mode === 'guest' && 'Modo Invitado'}
          </h2>
          <p className="text-white/80 text-xs sm:text-sm mt-1 sm:mt-2">
            Plataforma Profesional de Dobles de Riesgo
          </p>
        </div>

        <div className="p-4 sm:p-6">
          <div className="flex space-x-2 mb-4 sm:mb-6">
            <button
              onClick={() => {
                setMode('login');
                setError('');
              }}
              className={`flex-1 py-2 px-3 sm:px-4 rounded-lg text-sm sm:text-base font-semibold transition-all duration-200 touch-manipulation ${
                mode === 'login'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
              }`}
            >
              Ingresar
            </button>
            <button
              onClick={() => {
                setMode('register');
                setError('');
              }}
              className={`flex-1 py-2 px-3 sm:px-4 rounded-lg text-sm sm:text-base font-semibold transition-all duration-200 touch-manipulation ${
                mode === 'register'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
              }`}
            >
              Registrarse
            </button>
          </div>

          {error && (
            <div className="mb-3 sm:mb-4 bg-red-900/30 border border-red-700/50 rounded-lg p-2.5 sm:p-3">
              <p className="text-red-300 text-xs sm:text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-1.5 sm:mb-2">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-black/50 border border-gray-600 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                  placeholder="Juan Pérez"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-1.5 sm:mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/50 border border-gray-600 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                placeholder="tu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-1.5 sm:mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/50 border border-gray-600 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                placeholder="••••••••"
                required
                minLength={6}
              />
              {mode === 'register' && (
                <p className="text-gray-500 text-[10px] sm:text-xs mt-1">
                  Mínimo 6 caracteres
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 active:scale-95 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-3 rounded-lg transition-all duration-200 shadow-lg shadow-red-600/30 hover:shadow-red-600/50 flex items-center justify-center space-x-2 touch-manipulation"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  {mode === 'login' ? (
                    <LogIn className="w-5 h-5" />
                  ) : (
                    <UserPlus className="w-5 h-5" />
                  )}
                  <span>{mode === 'login' ? 'Ingresar' : 'Crear Cuenta'}</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-700">
            <button
              onClick={handleGuestMode}
              className="w-full bg-gray-700 hover:bg-gray-600 active:scale-95 text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 touch-manipulation"
            >
              <Users className="w-5 h-5" />
              <span>Continuar como Invitado</span>
            </button>
            <p className="text-gray-500 text-[10px] sm:text-xs text-center mt-2 sm:mt-3">
              Como invitado podrás explorar perfiles, pero no ver contactos ni contenido premium
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
