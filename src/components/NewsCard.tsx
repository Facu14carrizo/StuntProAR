import { AlertTriangle, Megaphone, CheckCircle, Info } from 'lucide-react';
import { News } from '../lib/supabase';

interface NewsCardProps {
  news: News;
}

export function NewsCard({ news }: NewsCardProps) {
  const getIcon = () => {
    switch (news.icon_type) {
      case 'warning':
        return <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8" />;
      case 'announcement':
        return <Megaphone className="w-6 h-6 sm:w-8 sm:h-8" />;
      case 'success':
        return <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8" />;
      default:
        return <Info className="w-6 h-6 sm:w-8 sm:h-8" />;
    }
  };

  const getBorderColor = () => {
    switch (news.border_color) {
      case 'red':
        return 'border-red-600/50 bg-gradient-to-br from-red-950/30 to-gray-900/50';
      case 'blue':
        return 'border-blue-600/50 bg-gradient-to-br from-blue-950/30 to-gray-900/50';
      case 'green':
        return 'border-green-600/50 bg-gradient-to-br from-green-950/30 to-gray-900/50';
      default:
        return 'border-gray-600/50 bg-gradient-to-br from-gray-800/30 to-gray-900/50';
    }
  };

  const getIconColor = () => {
    switch (news.border_color) {
      case 'red':
        return 'text-red-500';
      case 'blue':
        return 'text-blue-500';
      case 'green':
        return 'text-green-500';
      default:
        return 'text-gray-400';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={`border-l-4 ${getBorderColor()} rounded-lg p-4 sm:p-6 backdrop-blur-sm active:scale-[0.98] sm:hover:scale-[1.02] transition-all duration-300 shadow-lg touch-manipulation`}>
      <div className="flex items-start space-x-3 sm:space-x-4">
        <div className={`${getIconColor()} flex-shrink-0`}>
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg sm:text-xl font-bold text-white mb-1.5 sm:mb-2">{news.title}</h3>
          <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">{news.content}</p>
          <p className="text-gray-500 text-[10px] sm:text-xs mt-2 sm:mt-3">
            {formatDate(news.created_at)}
          </p>
        </div>
      </div>
    </div>
  );
}
