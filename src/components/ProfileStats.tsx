import { Briefcase, Clock, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';

interface ProfileStatsProps {
  stats: {
    years_experience: number;
    total_projects: number;
    height_cm: number;
    weight_kg: number;
    available: boolean;
    response_time_hours: number;
  };
}

export function ProfileStats({ stats }: ProfileStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 rounded-lg p-3 border border-blue-700/30">
        <div className="flex items-center space-x-2 mb-1">
          <TrendingUp className="w-4 h-4 text-blue-400" />
          <span className="text-xs text-gray-400">Experiencia</span>
        </div>
        <p className="text-xl font-bold text-white">{stats.years_experience} años</p>
      </div>

      <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 rounded-lg p-3 border border-green-700/30">
        <div className="flex items-center space-x-2 mb-1">
          <Briefcase className="w-4 h-4 text-green-400" />
          <span className="text-xs text-gray-400">Proyectos</span>
        </div>
        <p className="text-xl font-bold text-white">{stats.total_projects}</p>
      </div>

      <div className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/20 rounded-lg p-3 border border-yellow-700/30">
        <div className="flex items-center space-x-2 mb-1">
          <Clock className="w-4 h-4 text-yellow-400" />
          <span className="text-xs text-gray-400">Respuesta</span>
        </div>
        <p className="text-xl font-bold text-white">{stats.response_time_hours}h</p>
      </div>

      <div className={`bg-gradient-to-br rounded-lg p-3 border ${
        stats.available
          ? 'from-green-900/30 to-green-800/20 border-green-700/30'
          : 'from-red-900/30 to-red-800/20 border-red-700/30'
      }`}>
        <div className="flex items-center space-x-2 mb-1">
          {stats.available ? (
            <CheckCircle className="w-4 h-4 text-green-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400" />
          )}
          <span className="text-xs text-gray-400">Estado</span>
        </div>
        <p className={`text-sm font-bold ${stats.available ? 'text-green-400' : 'text-red-400'}`}>
          {stats.available ? 'Disponible' : 'Ocupado'}
        </p>
      </div>
    </div>
  );
}
