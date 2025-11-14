/*
  # Agregar características mejoradas a StuntsProAR
  
  1. Nuevas Tablas
    - `skills` (habilidades y certificaciones)
      - `id` (uuid, primary key)
      - `name` (text)
      - `category` (text) - 'technical', 'physical', 'certification'
      - `icon` (text)
      - `created_at` (timestamptz)
    
    - `profile_skills` (relación perfiles-habilidades)
      - `profile_id` (uuid)
      - `skill_id` (uuid)
      - `proficiency` (text) - 'basic', 'intermediate', 'advanced', 'expert'
      - `certified` (boolean)
      - `certification_date` (timestamptz)
      - `created_at` (timestamptz)
    
    - `projects` (proyectos/producciones)
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `project_type` (text) - 'film', 'tv', 'commercial', 'streaming'
      - `year` (integer)
      - `role` (text)
      - `thumbnail_url` (text)
      - `is_featured` (boolean)
      - `created_at` (timestamptz)
    
    - `profile_projects` (relación perfiles-proyectos)
      - `profile_id` (uuid)
      - `project_id` (uuid)
      - `role_description` (text)
      - `created_at` (timestamptz)
    
    - `testimonials` (testimonios y reseñas)
      - `id` (uuid, primary key)
      - `profile_id` (uuid)
      - `author_name` (text)
      - `author_role` (text)
      - `company` (text)
      - `content` (text)
      - `rating` (integer) - 1-5
      - `project_name` (text)
      - `is_verified` (boolean)
      - `created_at` (timestamptz)
    
    - `profile_stats` (estadísticas de perfiles)
      - `profile_id` (uuid, primary key)
      - `years_experience` (integer)
      - `total_projects` (integer)
      - `height_cm` (integer)
      - `weight_kg` (integer)
      - `available` (boolean)
      - `availability_date` (timestamptz)
      - `response_time_hours` (integer)
      - `updated_at` (timestamptz)
  
  2. Seguridad
    - Habilitar RLS en todas las nuevas tablas
    - Políticas apropiadas para lectura y escritura
*/

-- Crear tabla de habilidades
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  category text NOT NULL CHECK (category IN ('technical', 'physical', 'certification')),
  icon text,
  created_at timestamptz DEFAULT now()
);

-- Crear tabla de relación perfiles-habilidades
CREATE TABLE IF NOT EXISTS profile_skills (
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  skill_id uuid REFERENCES skills(id) ON DELETE CASCADE,
  proficiency text DEFAULT 'intermediate' CHECK (proficiency IN ('basic', 'intermediate', 'advanced', 'expert')),
  certified boolean DEFAULT false,
  certification_date timestamptz,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (profile_id, skill_id)
);

-- Crear tabla de proyectos
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  project_type text CHECK (project_type IN ('film', 'tv', 'commercial', 'streaming')),
  year integer,
  role text,
  thumbnail_url text,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Crear tabla de relación perfiles-proyectos
CREATE TABLE IF NOT EXISTS profile_projects (
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  role_description text,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (profile_id, project_id)
);

-- Crear tabla de testimonios
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  author_name text NOT NULL,
  author_role text,
  company text,
  content text NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  project_name text,
  is_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Crear tabla de estadísticas de perfiles
CREATE TABLE IF NOT EXISTS profile_stats (
  profile_id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  years_experience integer DEFAULT 0,
  total_projects integer DEFAULT 0,
  height_cm integer,
  weight_kg integer,
  available boolean DEFAULT true,
  availability_date timestamptz,
  response_time_hours integer DEFAULT 24,
  updated_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_stats ENABLE ROW LEVEL SECURITY;

-- Políticas para skills
CREATE POLICY "Habilidades visibles para todos"
  ON skills FOR SELECT
  USING (true);

-- Políticas para profile_skills
CREATE POLICY "Habilidades de perfiles visibles para todos"
  ON profile_skills FOR SELECT
  USING (true);

CREATE POLICY "Usuarios pueden agregar habilidades a su perfil"
  ON profile_skills FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = profile_id
      AND profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Usuarios pueden eliminar habilidades de su perfil"
  ON profile_skills FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = profile_id
      AND profiles.user_id = auth.uid()
    )
  );

-- Políticas para projects
CREATE POLICY "Proyectos visibles para todos"
  ON projects FOR SELECT
  USING (true);

-- Políticas para profile_projects
CREATE POLICY "Proyectos de perfiles visibles para todos"
  ON profile_projects FOR SELECT
  USING (true);

CREATE POLICY "Usuarios pueden agregar proyectos a su perfil"
  ON profile_projects FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = profile_id
      AND profiles.user_id = auth.uid()
    )
  );

-- Políticas para testimonials
CREATE POLICY "Testimonios verificados visibles para todos"
  ON testimonials FOR SELECT
  USING (is_verified = true);

-- Políticas para profile_stats
CREATE POLICY "Estadísticas de perfiles visibles para todos"
  ON profile_stats FOR SELECT
  USING (true);

CREATE POLICY "Usuarios pueden actualizar sus estadísticas"
  ON profile_stats FOR UPDATE
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

CREATE POLICY "Usuarios pueden insertar sus estadísticas"
  ON profile_stats FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = profile_id
      AND profiles.user_id = auth.uid()
    )
  );

-- Insertar habilidades predeterminadas
INSERT INTO skills (name, category, icon) VALUES
  ('Rigging', 'technical', 'Wrench'),
  ('Rappelling', 'technical', 'ArrowDown'),
  ('Ratchets', 'technical', 'Zap'),
  ('Air Rams', 'technical', 'Wind'),
  ('Wire Work', 'technical', 'Cable'),
  ('Fuego Controlado', 'technical', 'Flame'),
  ('Armas de Fuego', 'technical', 'Target'),
  ('Equitación', 'physical', 'Horse'),
  ('Natación', 'physical', 'Waves'),
  ('Buceo', 'physical', 'Anchor'),
  ('Escalada', 'physical', 'Mountain'),
  ('Parkour', 'physical', 'Activity'),
  ('Gimnasia', 'physical', 'Trophy'),
  ('Certificación SAG-AFTRA', 'certification', 'Award'),
  ('Primeros Auxilios', 'certification', 'Heart'),
  ('Seguridad en Set', 'certification', 'Shield')
ON CONFLICT (name) DO NOTHING;