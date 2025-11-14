import { Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase, Specialty } from '../lib/supabase';

interface SearchFiltersProps {
  onSearch: (filters: SearchFilters) => void;
}

export interface SearchFilters {
  name: string;
  specialty: string;
  gender: string;
  profileType: string;
  available: string;
}

export function SearchFilters({ onSearch }: SearchFiltersProps) {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({
    name: '',
    specialty: '',
    gender: '',
    profileType: '',
    available: '',
  });

  useEffect(() => {
    loadSpecialties();
  }, []);

  const loadSpecialties = async () => {
    const { data } = await supabase
      .from('specialties')
      .select('*')
      .order('name');

    if (data) setSpecialties(data);
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleClear = () => {
    const clearedFilters = {
      name: '',
      specialty: '',
      gender: '',
      profileType: '',
      available: '',
    };
    setFilters(clearedFilters);
    onSearch(clearedFilters);
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8 border border-gray-700 shadow-2xl">
      <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
        <Search className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 flex-shrink-0" />
        <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-wide">
          Buscar Dobles de Riesgo
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div>
          <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-1.5 sm:mb-2">
            Buscar por nombre
          </label>
          <input
            type="text"
            value={filters.name}
            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
            placeholder="Nombre del doble..."
            className="w-full bg-black/50 border border-gray-600 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-1.5 sm:mb-2">
            Especialidad
          </label>
          <select
            value={filters.specialty}
            onChange={(e) => setFilters({ ...filters, specialty: e.target.value })}
            className="w-full bg-black/50 border border-gray-600 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option value="">Todas las especialidades</option>
            {specialties.map((spec) => (
              <option key={spec.id} value={spec.id}>
                {spec.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-1.5 sm:mb-2">
            Género
          </label>
          <select
            value={filters.gender}
            onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
            className="w-full bg-black/50 border border-gray-600 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option value="">Todos</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
            <option value="Otro">Otro</option>
          </select>
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-1.5 sm:mb-2">
            Tipo
          </label>
          <select
            value={filters.profileType}
            onChange={(e) => setFilters({ ...filters, profileType: e.target.value })}
            className="w-full bg-black/50 border border-gray-600 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option value="">Todos</option>
            <option value="basic">Básico</option>
            <option value="premium">Premium</option>
          </select>
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-1.5 sm:mb-2">
            Disponibilidad
          </label>
          <select
            value={filters.available}
            onChange={(e) => setFilters({ ...filters, available: e.target.value })}
            className="w-full bg-black/50 border border-gray-600 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option value="">Todos</option>
            <option value="true">Disponibles</option>
            <option value="false">Ocupados</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
        <button
          onClick={handleSearch}
          className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg shadow-red-600/30 hover:shadow-red-600/50 touch-manipulation"
        >
          Buscar
        </button>
        <button
          onClick={handleClear}
          className="flex items-center justify-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 touch-manipulation"
        >
          <X className="w-4 h-4" />
          <span>Limpiar</span>
        </button>
      </div>
    </div>
  );
}
