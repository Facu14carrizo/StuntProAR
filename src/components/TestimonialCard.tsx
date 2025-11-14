import { Star, Award, Briefcase } from 'lucide-react';

interface Testimonial {
  id: string;
  author_name: string;
  author_role: string;
  company: string;
  content: string;
  rating: number;
  project_name: string;
  is_verified: boolean;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-lg p-6 border border-gray-700 hover:border-yellow-600/50 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h4 className="text-lg font-bold text-white">{testimonial.author_name}</h4>
            {testimonial.is_verified && (
              <Award className="w-4 h-4 text-yellow-500" title="Verificado" />
            )}
          </div>
          <p className="text-sm text-gray-400">{testimonial.author_role}</p>
          <p className="text-xs text-gray-500">{testimonial.company}</p>
        </div>
        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < testimonial.rating
                  ? 'text-yellow-500 fill-yellow-500'
                  : 'text-gray-600'
              }`}
            />
          ))}
        </div>
      </div>

      <p className="text-gray-300 text-sm leading-relaxed mb-3">
        "{testimonial.content}"
      </p>

      <div className="flex items-center space-x-2 pt-3 border-t border-gray-700">
        <Briefcase className="w-3 h-3 text-blue-400" />
        <span className="text-xs text-blue-300">{testimonial.project_name}</span>
      </div>
    </div>
  );
}
