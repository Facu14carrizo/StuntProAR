import { Video, Play, Lock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase, EducationalVideo } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export function MultimediaSection() {
  const { user } = useAuth();
  const [videos, setVideos] = useState<EducationalVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVideos();
  }, [user]);

  const loadVideos = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('educational_videos')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      if (user) {
        setVideos(data);
      } else {
        setVideos(data.filter(video => !video.is_premium));
      }
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8 border border-gray-700 shadow-2xl">
      <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
        <Video className="w-6 h-6 sm:w-8 sm:h-8 text-red-500 flex-shrink-0" />
        <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-wide">
          Videos Educativos y Cultura de Stunts
        </h2>
      </div>

      {videos.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <Video className="w-12 h-12 sm:w-16 sm:h-16 text-gray-600 mx-auto mb-3 sm:mb-4" />
          <p className="text-gray-400 text-base sm:text-lg">
            No hay videos disponibles en este momento
          </p>
          <p className="text-gray-500 text-xs sm:text-sm mt-1.5 sm:mt-2">
            Pronto agregaremos contenido educativo sobre el mundo de los dobles de riesgo
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {videos.map((video) => (
            <div
              key={video.id}
              className="bg-black/50 rounded-lg overflow-hidden border border-gray-700 hover:border-red-600/50 transition-all duration-300 active:scale-[0.98] sm:hover:scale-[1.02] group touch-manipulation"
            >
              <div className="relative aspect-video bg-gradient-to-br from-red-950/30 to-blue-950/30">
                {video.thumbnail_url ? (
                  <img
                    src={video.thumbnail_url}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Video className="w-12 h-12 sm:w-16 sm:h-16 text-gray-600" />
                  </div>
                )}

                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  {video.is_premium && !user ? (
                    <div className="text-center">
                      <Lock className="w-8 h-8 sm:w-12 sm:h-12 text-yellow-400 mx-auto mb-1.5 sm:mb-2" />
                      <p className="text-white text-sm sm:text-base font-semibold">Contenido Premium</p>
                    </div>
                  ) : (
                    <Play className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
                  )}
                </div>

                {video.is_premium && (
                  <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 bg-yellow-500 text-black px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-[10px] sm:text-xs font-bold">
                    PREMIUM
                  </div>
                )}
              </div>

              <div className="p-3 sm:p-4">
                <h3 className="text-base sm:text-lg font-bold text-white mb-1.5 sm:mb-2 line-clamp-2">
                  {video.title}
                </h3>
                {video.description && (
                  <p className="text-gray-400 text-xs sm:text-sm line-clamp-2">
                    {video.description}
                  </p>
                )}
                {video.category && (
                  <span className="inline-block mt-2 sm:mt-3 px-2 sm:px-3 py-0.5 sm:py-1 bg-blue-900/30 border border-blue-700/50 text-blue-300 text-[10px] sm:text-xs rounded-full">
                    {video.category}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {!user && videos.length > 0 && (
        <div className="mt-6 sm:mt-8 bg-gradient-to-r from-yellow-900/20 to-yellow-800/20 border border-yellow-700/50 rounded-lg p-4 sm:p-6 text-center">
          <p className="text-yellow-300 text-sm sm:text-base font-semibold mb-1.5 sm:mb-2">
            Registrate para acceder a contenido premium
          </p>
          <p className="text-yellow-400/70 text-xs sm:text-sm">
            Descubre técnicas avanzadas, tutoriales exclusivos y entrevistas con profesionales
          </p>
        </div>
      )}
    </div>
  );
}
