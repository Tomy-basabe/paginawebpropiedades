-- ========================================================
-- SCRIPT DE INICIALIZACIÓN PARA SUPABASE
-- Ejecuta este script en el "SQL Editor" de tu panel de Supabase
-- ========================================================

-- 1. TABLA: properties (Propiedades inmobiliarias)
CREATE TABLE IF NOT EXISTS public.properties (
    id TEXT PRIMARY KEY,
    title TEXT,
    operation TEXT,
    type TEXT,
    status TEXT,
    price NUMERIC,
    currency TEXT DEFAULT 'USD',
    location JSONB,
    features JSONB,
    images JSONB,
    description TEXT,
    is_featured BOOLEAN DEFAULT false,
    is_opportunity BOOLEAN DEFAULT false,
    data JSONB,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 2. TABLA: featured_banners (Banners destacados del carrusel)
CREATE TABLE IF NOT EXISTS public.featured_banners (
    id TEXT PRIMARY KEY,
    title TEXT,
    subtitle TEXT,
    badge TEXT,
    image_url TEXT,
    link TEXT,
    cta_text TEXT,
    is_active BOOLEAN DEFAULT true,
    data JSONB,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 3. TABLA: bank_rates (Tasas y créditos hipotecarios)
CREATE TABLE IF NOT EXISTS public.bank_rates (
    id TEXT PRIMARY KEY,
    bank_name TEXT,
    tna NUMERIC,
    cft NUMERIC,
    max_financing_percent NUMERIC,
    max_years_term INT,
    logo_url TEXT,
    data JSONB,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 4. TABLA: agent_profile (Perfil del agente y métricas)
CREATE TABLE IF NOT EXISTS public.agent_profile (
    id TEXT PRIMARY KEY DEFAULT 'default_agent',
    name TEXT,
    role_title TEXT,
    license_number TEXT,
    phone TEXT,
    whatsapp_number TEXT,
    email TEXT,
    data JSONB,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- ========================================================
-- POLÍTICAS DE ACCESO (Permitir lectura y escritura anónima para la app)
-- ========================================================
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.featured_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_profile ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Acceso público lectura properties" ON public.properties;
CREATE POLICY "Acceso público lectura properties" ON public.properties FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Acceso público lectura banners" ON public.featured_banners;
CREATE POLICY "Acceso público lectura banners" ON public.featured_banners FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Acceso público lectura bank_rates" ON public.bank_rates;
CREATE POLICY "Acceso público lectura bank_rates" ON public.bank_rates FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Acceso público lectura profile" ON public.agent_profile;
CREATE POLICY "Acceso público lectura profile" ON public.agent_profile FOR ALL USING (true) WITH CHECK (true);

-- ========================================================
-- BUCKETS DE STORAGE (Imágenes y Videos)
-- ========================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public)
VALUES ('property-videos', 'property-videos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Políticas de Storage para subida pública
DROP POLICY IF EXISTS "Public Access Images" ON storage.objects;
CREATE POLICY "Public Access Images" ON storage.objects
FOR ALL USING (bucket_id IN ('property-images', 'property-videos'))
WITH CHECK (bucket_id IN ('property-images', 'property-videos'));
