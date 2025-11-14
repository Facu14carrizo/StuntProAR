import { X, Mail, Phone, Star, UserCircle, Image as ImageIcon, Video, Award, Briefcase } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Profile, ProfileSpecialty, GalleryItem, supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { ProfileStats } from './ProfileStats';
import { TestimonialCard } from './TestimonialCard';
import { ProjectCard } from './ProjectCard';

interface ProfileDetailProps {
  profile: Profile;
  onClose: () => void;
}

export function ProfileDetail({ profile, onClose }: ProfileDetailProps) {
  const { user } = useAuth();
  const [specialties, setSpecialties] = useState<ProfileSpecialty[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [skills, setSkills] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const canViewPremium = user !== null && profile.profile_type === 'premium';

  useEffect(() => {
    loadProfileData();
  }, [profile.id]);

  const loadProfileData = async () => {
    setLoading(true);

    const { data: specialtiesData } = await supabase
      .from('profile_specialties')
      .select('*, specialty:specialties(*)')
      .eq('profile_id', profile.id);

    const { data: galleryData } = await supabase
      .from('gallery_items')
      .select('*')
      .eq('profile_id', profile.id)
      .order('order_index');

    const { data: statsData } = await supabase
      .from('profile_stats')
      .select('*')
      .eq('profile_id', profile.id)
      .maybeSingle();

    const { data: skillsData } = await supabase
      .from('profile_skills')
      .select('*, skill:skills(*)')
      .eq('profile_id', profile.id);

    const { data: projectsData } = await supabase
      .from('profile_projects')
      .select('*, project:projects(*)')
      .eq('profile_id', profile.id);

    const { data: testimonialsData } = await supabase
      .from('testimonials')
      .select('*')
      .eq('profile_id', profile.id)
      .eq('is_verified', true)
      .order('created_at', { ascending: false });

    if (specialtiesData) setSpecialties(specialtiesData);
    if (galleryData) {
      if (user) {
        setGallery(galleryData);
      } else {
        setGallery(galleryData.filter(item => !item.is_premium));
      }
    }
    if (statsData) setStats(statsData);
    if (skillsData) setSkills(skillsData);
    if (projectsData) setProjects(projectsData);
    if (testimonialsData) setTestimonials(testimonialsData);

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/95 backdrop-blur-sm">
      <div className="min-h-screen px-2 sm:px-4 py-4 sm:py-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl sm:rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
            <div className="relative h-48 sm:h-56 md:h-64 bg-gradient-to-br from-red-950/30 to-blue-950/30">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <UserCircle className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 text-gray-600" />
                </div>
              )}

              <button
                onClick={onClose}
                className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-black/70 hover:bg-black active:scale-95 text-white p-2 rounded-full transition-all duration-200 touch-manipulation z-10"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              {profile.profile_type === 'premium' && (
                <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold flex items-center space-x-1 sm:space-x-2 shadow-lg">
                  <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
                  <span>PERFIL PREMIUM</span>
                </div>
              )}
            </div>

            <div className="p-4 sm:p-6 md:p-8">
              <div className="mb-4 sm:mb-6">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-2">
                  {profile.stage_name || profile.full_name}
                </h2>
                {profile.stage_name && (
                  <p className="text-base sm:text-lg text-gray-400">{profile.full_name}</p>
                )}
                {profile.gender && (
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">{profile.gender}</p>
                )}
              </div>

              {stats && (
                <div className="mb-6">
                  <ProfileStats stats={stats} />
                </div>
              )}

              {profile.bio && (
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">Biografía</h3>
                  <p className="text-sm sm:text-base text-gray-300 leading-relaxed">{profile.bio}</p>
                </div>
              )}

              {specialties.length > 0 && (
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">Especialidades</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
                    {specialties.map((ps) => (
                      <div
                        key={ps.specialty_id}
                        className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-2 sm:p-3"
                      >
                        <p className="text-sm sm:text-base text-blue-300 font-semibold">{ps.specialty?.name}</p>
                        <p className="text-[10px] sm:text-xs text-gray-400 mt-1 capitalize">
                          Nivel: {ps.experience_level}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {skills.length > 0 && (
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3 flex items-center space-x-2">
                    <Award className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
                    <span>Habilidades Técnicas</span>
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
                    {skills.map((ps) => (
                      <div
                        key={ps.skill_id}
                        className="bg-green-900/20 border border-green-700/50 rounded-lg p-2 sm:p-3"
                      >
                        <p className="text-sm sm:text-base text-green-300 font-semibold">{ps.skill?.name}</p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-[10px] sm:text-xs text-gray-400 capitalize">
                            {ps.proficiency}
                          </p>
                          {ps.certified && (
                            <Award className="w-3 h-3 text-yellow-500" title="Certificado" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">Contacto</h3>
                {user ? (
                  <div className="space-y-1.5 sm:space-y-2">
                    {profile.email && (
                      <a
                        href={`mailto:${profile.email}`}
                        className="flex items-center space-x-2 sm:space-x-3 text-sm sm:text-base text-gray-300 hover:text-red-400 active:text-red-300 transition-colors duration-200 py-1"
                      >
                        <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0" />
                        <span>{profile.email}</span>
                      </a>
                    )}
                    {profile.phone && (
                      <a
                        href={`tel:${profile.phone}`}
                        className="flex items-center space-x-2 sm:space-x-3 text-sm sm:text-base text-gray-300 hover:text-blue-400 active:text-blue-300 transition-colors duration-200 py-1"
                      >
                        <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0" />
                        <span>{profile.phone}</span>
                      </a>
                    )}
                  </div>
                ) : (
                  <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-4">
                    <p className="text-yellow-300 text-center">
                      Registrate para ver información de contacto
                    </p>
                  </div>
                )}
              </div>

              {projects.length > 0 && (
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3 flex items-center space-x-2">
                    <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                    <span>Proyectos Destacados</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    {projects.map((pp) => (
                      <ProjectCard
                        key={pp.project_id}
                        project={{
                          ...pp.project,
                          role_description: pp.role_description,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {testimonials.length > 0 && (
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3 flex items-center space-x-2">
                    <Star className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
                    <span>Testimonios</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    {testimonials.map((testimonial) => (
                      <TestimonialCard
                        key={testimonial.id}
                        testimonial={testimonial}
                      />
                    ))}
                  </div>
                </div>
              )}

              {gallery.length > 0 && (
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3 flex items-center space-x-2">
                    <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span>Galería y Videos</span>
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {gallery.map((item) => (
                      <div
                        key={item.id}
                        className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden border border-gray-700 hover:border-red-600/50 transition-all duration-200"
                      >
                        {item.media_type === 'image' ? (
                          <img
                            src={item.media_url}
                            alt={item.title || 'Gallery item'}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-950/30 to-blue-950/30">
                            <Video className="w-8 h-8 sm:w-12 sm:h-12 text-gray-600" />
                          </div>
                        )}
                        {item.is_premium && (
                          <div className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-yellow-500 text-black px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-[10px] sm:text-xs font-bold">
                            PREMIUM
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  {!user && gallery.length < 3 && (
                    <p className="text-gray-400 text-xs sm:text-sm mt-2 sm:mt-3 text-center">
                      Registrate para ver la galería completa
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
