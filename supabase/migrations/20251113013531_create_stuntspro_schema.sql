/*
  # Crear esquema completo de StuntsProAR
  
  1. Nuevas Tablas
    - `profiles` (perfiles de usuarios/dobles de riesgo)
      - `id` (uuid, primary key)
      - `user_id` (uuid, referencia a auth.users)
      - `full_name` (text)
      - `stage_name` (text)
      - `bio` (text)
      - `gender` (text)
      - `phone` (text)
      - `email` (text)
      - `profile_type` (text) - 'basic' o 'premium'
      - `avatar_url` (text)
      - `is_stuntman` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `specialties` (especialidades de dobles)
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `icon` (text)
      - `created_at` (timestamptz)
    
    - `profile_specialties` (relación muchos a muchos)
      - `profile_id` (uuid)
      - `specialty_id` (uuid)
      - `experience_level` (text)
      - `created_at` (timestamptz)
    
    - `gallery_items` (galería de fotos/videos)
      - `id` (uuid, primary key)
      - `profile_id` (uuid)
      - `media_type` (text) - 'image' o 'video'
      - `media_url` (text)
      - `thumbnail_url` (text)
      - `title` (text)
      - `description` (text)
      - `is_premium` (boolean)
      - `order_index` (integer)
      - `created_at` (timestamptz)
    
    - `news` (novedades de la plataforma)
      - `id` (uuid, primary key)
      - `title` (text)
      - `content` (text)
      - `icon_type` (text)
      - `border_color` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `educational_videos` (videos educativos)
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `video_url` (text)
      - `thumbnail_url` (text)
      - `category` (text)
      - `is_premium` (boolean)
      - `created_at` (timestamptz)
  
  2. Seguridad
    - Habilitar RLS en todas las tablas
    - Políticas para perfiles: lectura pública, escritura solo del dueño
    - Políticas para especialidades: lectura pública
    - Políticas para galería: lectura según premium, escritura del dueño
    - Políticas para noticias: lectura pública, escritura solo admin
    - Políticas para videos: lectura según premium
*/

-- Crear tabla de perfiles
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  stage_name text,
  bio text,
  gender text,
  phone text,
  email text,
  profile_type text DEFAULT 'basic' CHECK (profile_type IN ('basic', 'premium')),
  avatar_url text,
  is_stuntman boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Crear tabla de especialidades
CREATE TABLE IF NOT EXISTS specialties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  icon text,
  created_at timestamptz DEFAULT now()
);

-- Crear tabla de relación perfiles-especialidades
CREATE TABLE IF NOT EXISTS profile_specialties (
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  specialty_id uuid REFERENCES specialties(id) ON DELETE CASCADE,
  experience_level text DEFAULT 'intermediate' CHECK (experience_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (profile_id, specialty_id)
);

-- Crear tabla de galería
CREATE TABLE IF NOT EXISTS gallery_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  media_type text NOT NULL CHECK (media_type IN ('image', 'video')),
  media_url text NOT NULL,
  thumbnail_url text,
  title text,
  description text,
  is_premium boolean DEFAULT false,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Crear tabla de noticias
CREATE TABLE IF NOT EXISTS news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  icon_type text DEFAULT 'info' CHECK (icon_type IN ('info', 'warning', 'success', 'announcement')),
  border_color text DEFAULT 'red',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Crear tabla de videos educativos
CREATE TABLE IF NOT EXISTS educational_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  video_url text NOT NULL,
  thumbnail_url text,
  category text,
  is_premium boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE specialties ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_specialties ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE educational_videos ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Perfiles públicos son visibles para todos"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Usuarios pueden crear su propio perfil"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden actualizar su propio perfil"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden eliminar su propio perfil"
  ON profiles FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Políticas para specialties
CREATE POLICY "Especialidades visibles para todos"
  ON specialties FOR SELECT
  USING (true);

-- Políticas para profile_specialties
CREATE POLICY "Especialidades de perfiles visibles para todos"
  ON profile_specialties FOR SELECT
  USING (true);

CREATE POLICY "Usuarios pueden agregar especialidades a su perfil"
  ON profile_specialties FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = profile_id
      AND profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Usuarios pueden eliminar especialidades de su perfil"
  ON profile_specialties FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = profile_id
      AND profiles.user_id = auth.uid()
    )
  );

-- Políticas para gallery_items
CREATE POLICY "Galería no premium visible para todos"
  ON gallery_items FOR SELECT
  USING (is_premium = false OR auth.uid() IS NOT NULL);

CREATE POLICY "Usuarios pueden agregar items a su galería"
  ON gallery_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = profile_id
      AND profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Usuarios pueden actualizar su galería"
  ON gallery_items FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = profile_id
      AND profiles.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = profile_id
      AND profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Usuarios pueden eliminar items de su galería"
  ON gallery_items FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = profile_id
      AND profiles.user_id = auth.uid()
    )
  );

-- Políticas para news
CREATE POLICY "Noticias visibles para todos"
  ON news FOR SELECT
  USING (true);

-- Políticas para educational_videos
CREATE POLICY "Videos no premium visibles para todos"
  ON educational_videos FOR SELECT
  USING (is_premium = false OR auth.uid() IS NOT NULL);

-- Insertar especialidades iniciales
INSERT INTO specialties (name, description, icon) VALUES
  ('Peleas y Combate', 'Coreografías de combate, artes marciales y peleas', 'Swords'),
  ('Acrobacias', 'Saltos, volteretas y movimientos acrobáticos', 'Zap'),
  ('Caídas de Altura', 'Caídas controladas desde alturas', 'ArrowDown'),
  ('Conducción de Riesgo', 'Persecuciones, derrapes y maniobras extremas', 'Car'),
  ('Explosiones y Fuego', 'Trabajo con pirotecnia y efectos de fuego', 'Flame'),
  ('Trabajo con Cables', 'Vuelos, suspensiones y movimientos con arnés', 'Move'),
  ('Armas de Fuego', 'Manejo seguro de armas y efectos de disparos', 'Target'),
  ('Motocicletas', 'Stunts en moto y conducción extrema', 'Bike')
ON CONFLICT (name) DO NOTHING;

-- Insertar noticias de bienvenida
INSERT INTO news (title, content, icon_type, border_color) VALUES
  ('¡Bienvenidos a StuntsProAr!', 'La primera plataforma profesional de dobles de riesgo en Argentina ya está en línea. Conectá con los mejores profesionales del país.', 'warning', 'red'),
  ('Nuevo sistema de perfiles Premium', 'Los perfiles Premium ahora incluyen contacto directo, galería completa de fotos y acceso prioritario a castings.', 'announcement', 'blue')
ON CONFLICT DO NOTHING;