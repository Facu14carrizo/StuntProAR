import { Film, Tv, Video, Star } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  project_type: 'film' | 'tv' | 'commercial' | 'streaming';
  year: number;
  thumbnail_url: string;
  is_featured: boolean;
  role_description?: string;
}

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const getIcon = () => {
    switch (project.project_type) {
      case 'film':
        return <Film className="w-4 h-4" />;
      case 'tv':
        return <Tv className="w-4 h-4" />;
      case 'streaming':
        return <Video className="w-4 h-4" />;
      case 'commercial':
        return <Star className="w-4 h-4" />;
      default:
        return <Film className="w-4 h-4" />;
    }
  };

  const getTypeLabel = () => {
    switch (project.project_type) {
      case 'film':
        return 'Película';
      case 'tv':
        return 'TV';
      case 'streaming':
        return 'Streaming';
      case 'commercial':
        return 'Comercial';
      default:
        return 'Producción';
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-red-600/50 transition-all duration-300 hover:scale-[1.02] group">
      <div className="relative h-40">
        {project.thumbnail_url ? (
          <img
            src={project.thumbnail_url}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-red-950/30 to-blue-950/30 flex items-center justify-center">
            {getIcon()}
          </div>
        )}
        {project.is_featured && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold flex items-center space-x-1">
            <Star className="w-3 h-3 fill-current" />
            <span>DESTACADO</span>
          </div>
        )}
        <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded text-xs text-white flex items-center space-x-1">
          {getIcon()}
          <span>{getTypeLabel()}</span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h4 className="text-lg font-bold text-white">{project.title}</h4>
          <span className="text-sm text-gray-400">{project.year}</span>
        </div>

        {project.description && (
          <p className="text-gray-400 text-sm mb-3 line-clamp-2">
            {project.description}
          </p>
        )}

        {project.role_description && (
          <div className="pt-3 border-t border-gray-700">
            <p className="text-blue-300 text-xs font-semibold">
              {project.role_description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
