import { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { NewsCard } from './components/NewsCard';
import { SearchFilters, SearchFilters as SearchFiltersType } from './components/SearchFilters';
import { ProfileCard } from './components/ProfileCard';
import { ProfileDetail } from './components/ProfileDetail';
import { MultimediaSection } from './components/MultimediaSection';
import { AuthModal } from './components/AuthModal';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { supabase, News, Profile, ProfileSpecialty } from './lib/supabase';
import { Newspaper, Users, TheaterIcon } from 'lucide-react';

function AppContent() {
  const { loading: authLoading } = useAuth();
  const [news, setNews] = useState<News[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [profileSpecialties, setProfileSpecialties] = useState<Record<string, ProfileSpecialty[]>>({});
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      loadInitialData();
    }
  }, [authLoading]);

  const loadInitialData = async () => {
    setLoading(true);

    const { data: newsData } = await supabase
      .from('news')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    const { data: profilesData } = await supabase
      .from('profiles')
      .select('*')
      .eq('is_stuntman', true)
      .order('created_at', { ascending: false });

    if (newsData) setNews(newsData);
    if (profilesData) {
      setProfiles(profilesData);
      await loadProfileSpecialties(profilesData);
    }

    setLoading(false);
  };

  const loadProfileSpecialties = async (profiles: Profile[]) => {
    const specialtiesMap: Record<string, ProfileSpecialty[]> = {};

    for (const profile of profiles) {
      const { data } = await supabase
        .from('profile_specialties')
        .select('*, specialty:specialties(*)')
        .eq('profile_id', profile.id);

      if (data) {
        specialtiesMap[profile.id] = data;
      }
    }

    setProfileSpecialties(specialtiesMap);
  };

  const handleSearch = async (filters: SearchFiltersType) => {
    setLoading(true);

    let query = supabase
      .from('profiles')
      .select('*')
      .eq('is_stuntman', true);

    if (filters.name) {
      query = query.or(`full_name.ilike.%${filters.name}%,stage_name.ilike.%${filters.name}%`);
    }

    if (filters.gender) {
      query = query.eq('gender', filters.gender);
    }

    if (filters.profileType) {
      query = query.eq('profile_type', filters.profileType);
    }

    const { data: profilesData } = await query.order('created_at', { ascending: false });

    if (profilesData) {
      let filteredProfiles = profilesData;

      if (filters.specialty) {
        const profilesWithSpecialty: Profile[] = [];

        for (const profile of profilesData) {
          const { data: specialties } = await supabase
            .from('profile_specialties')
            .select('specialty_id')
            .eq('profile_id', profile.id)
            .eq('specialty_id', filters.specialty);

          if (specialties && specialties.length > 0) {
            profilesWithSpecialty.push(profile);
          }
        }

        filteredProfiles = profilesWithSpecialty;
      }

      if (filters.available) {
        const profilesWithAvailability: Profile[] = [];
        const isAvailable = filters.available === 'true';

        for (const profile of filteredProfiles) {
          const { data: stats } = await supabase
            .from('profile_stats')
            .select('available')
            .eq('profile_id', profile.id)
            .eq('available', isAvailable)
            .maybeSingle();

          if (stats) {
            profilesWithAvailability.push(profile);
          }
        }

        filteredProfiles = profilesWithAvailability;
      }

      setProfiles(filteredProfiles);
      await loadProfileSpecialties(filteredProfiles);
    }

    setLoading(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl">Cargando StuntsProAr...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header onShowAuth={() => setShowAuthModal(true)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 space-y-6 sm:space-y-8 md:space-y-12">
        {news.length > 0 && (
          <section>
            <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
              <Newspaper className="w-6 h-6 sm:w-8 sm:h-8 text-red-500 flex-shrink-0" />
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-wide">
                Novedades de StuntsProAr
              </h2>
            </div>
            <div className="space-y-3 sm:space-y-4">
              {news.map((item) => (
                <NewsCard key={item.id} news={item} />
              ))}
            </div>
          </section>
        )}

        <section>
          <SearchFilters onSearch={handleSearch} />
        </section>

        <section>
          <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
            <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 flex-shrink-0" />
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-wide">
              Perfiles de Dobles de Riesgo
            </h2>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : profiles.length === 0 ? (
            <div className="text-center py-12 sm:py-16 md:py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-900/30 to-yellow-900/30 rounded-full mb-4 sm:mb-6">
                <TheaterIcon className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-blue-400" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-1.5 sm:mb-2 px-4">No hay perfiles aún</h3>
              <p className="text-sm sm:text-base text-gray-400 max-w-md mx-auto px-4">
                Comienza agregando el primer perfil de doble de riesgo
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {profiles.map((profile) => (
                <ProfileCard
                  key={profile.id}
                  profile={profile}
                  specialties={profileSpecialties[profile.id] || []}
                  onViewDetails={setSelectedProfile}
                />
              ))}
            </div>
          )}
        </section>

        <section>
          <MultimediaSection />
        </section>
      </main>

      <Footer />

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      {selectedProfile && (
        <ProfileDetail
          profile={selectedProfile}
          onClose={() => setSelectedProfile(null)}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
