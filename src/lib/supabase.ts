import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Profile {
  id: string;
  user_id: string | null;
  full_name: string;
  stage_name: string | null;
  bio: string | null;
  gender: string | null;
  phone: string | null;
  email: string | null;
  profile_type: 'basic' | 'premium';
  avatar_url: string | null;
  is_stuntman: boolean;
  created_at: string;
  updated_at: string;
}

export interface Specialty {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  created_at: string;
}

export interface ProfileSpecialty {
  profile_id: string;
  specialty_id: string;
  experience_level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  created_at: string;
  specialty?: Specialty;
}

export interface GalleryItem {
  id: string;
  profile_id: string;
  media_type: 'image' | 'video';
  media_url: string;
  thumbnail_url: string | null;
  title: string | null;
  description: string | null;
  is_premium: boolean;
  order_index: number;
  created_at: string;
}

export interface News {
  id: string;
  title: string;
  content: string;
  icon_type: 'info' | 'warning' | 'success' | 'announcement';
  border_color: string;
  created_at: string;
  updated_at: string;
}

export interface EducationalVideo {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
  thumbnail_url: string | null;
  category: string | null;
  is_premium: boolean;
  created_at: string;
}
