import { Mail, Phone, Star, UserCircle } from 'lucide-react';
import { Profile, ProfileSpecialty } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface ProfileCardProps {
  profile: Profile;
  specialties: ProfileSpecialty[];
  onViewDetails: (profile: Profile) => void;
}

export function ProfileCard({ profile, specialties, onViewDetails }: ProfileCardProps) {
  const { user, isGuest } = useAuth();
  const canViewContact = user !== null;

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg sm:rounded-xl overflow-hidden border border-gray-700 hover:border-red-600/50 transition-all duration-300 active:scale-[0.98] sm:hover:scale-[1.02] shadow-lg hover:shadow-red-600/20 touch-manipulation">
      <div className="relative h-40 sm:h-48 bg-gradient-to-br from-red-950/20 to-blue-950/20 flex items-center justify-center">
        {profile.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt={profile.full_name}
            className="w-full h-full object-cover"
          />
        ) : (
          <UserCircle className="w-16 h-16 sm:w-24 sm:h-24 text-gray-600" />
        )}
        {profile.profile_type === 'premium' && (
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold flex items-center space-x-1 shadow-lg">
            <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current" />
            <span>PREMIUM</span>
          </div>
        )}
      </div>

      <div className="p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1">
          {profile.stage_name || profile.full_name}
        </h3>
        {profile.stage_name && (
          <p className="text-xs sm:text-sm text-gray-400 mb-2 sm:mb-3">{profile.full_name}</p>
        )}

        {profile.bio && (
          <p className="text-gray-300 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
            {profile.bio}
          </p>
        )}

        {specialties.length > 0 && (
          <div className="mb-3 sm:mb-4">
            <h4 className="text-[10px] sm:text-xs font-semibold text-gray-400 mb-1.5 sm:mb-2 uppercase tracking-wide">Especialidades</h4>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {specialties.slice(0, 3).map((ps) => (
                <span
                  key={ps.specialty_id}
                  className="px-2 py-0.5 sm:py-1 bg-blue-900/30 border border-blue-700/50 text-blue-300 text-[10px] sm:text-xs rounded-full"
                >
                  {ps.specialty?.name}
                </span>
              ))}
              {specialties.length > 3 && (
                <span className="px-2 py-0.5 sm:py-1 bg-gray-700/50 text-gray-400 text-[10px] sm:text-xs rounded-full">
                  +{specialties.length - 3} más
                </span>
              )}
            </div>
          </div>
        )}

        <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
          {canViewContact ? (
            <>
              {profile.email && (
                <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-300">
                  <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500 flex-shrink-0" />
                  <span>{profile.email}</span>
                </div>
              )}
              {profile.phone && (
                <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-300">
                  <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0" />
                  <span>{profile.phone}</span>
                </div>
              )}
            </>
          ) : (
            <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-2.5 sm:p-3 text-center">
              <p className="text-yellow-300 text-[10px] sm:text-xs">
                Registrate para ver contacto
              </p>
            </div>
          )}
        </div>

        <button
          onClick={() => onViewDetails(profile)}
          className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 active:scale-95 text-white font-semibold py-2.5 sm:py-2 rounded-lg transition-all duration-200 touch-manipulation"
        >
          Ver Perfil Completo
        </button>
      </div>
    </div>
  );
}
