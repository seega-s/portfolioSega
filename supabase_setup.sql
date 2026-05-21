-- Portfolio Database Setup Script
-- Run this script in the Supabase SQL Editor to create all necessary tables and policies

-- 1. Create main_config table
CREATE TABLE IF NOT EXISTS main_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_name TEXT NOT NULL DEFAULT 'My Portfolio',
    favicon_url TEXT,
    titles TEXT[] NOT NULL DEFAULT '{}',
    subtitle_es TEXT NOT NULL DEFAULT '',
    subtitle_en TEXT NOT NULL DEFAULT '',
    github TEXT,
    linkedin TEXT,
    email TEXT,
    youtube TEXT,
    x TEXT,
    instagram TEXT,
    reddit TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Create about_config table
CREATE TABLE IF NOT EXISTS about_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bio_es TEXT NOT NULL DEFAULT '',
    bio_en TEXT NOT NULL DEFAULT '',
    avatar_url TEXT,
    cv_url_es TEXT,
    cv_url_en TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Create stack_lists table
CREATE TABLE IF NOT EXISTS stack_lists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_es TEXT NOT NULL,
    name_en TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Create stack_techs table
CREATE TABLE IF NOT EXISTS stack_techs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    list_id UUID NOT NULL REFERENCES stack_lists(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    icon_url TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Create projects table
CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    name_es TEXT NOT NULL,
    name_en TEXT NOT NULL,
    desc_es TEXT NOT NULL,
    desc_en TEXT NOT NULL,
    techs TEXT[] NOT NULL DEFAULT '{}',
    is_private BOOLEAN NOT NULL DEFAULT false,
    category TEXT NOT NULL,
    github TEXT,
    features_es TEXT[] NOT NULL DEFAULT '{}',
    features_en TEXT[] NOT NULL DEFAULT '{}',
    architecture_es TEXT[] NOT NULL DEFAULT '{}',
    architecture_en TEXT[] NOT NULL DEFAULT '{}',
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. Create experience_nodes table
CREATE TABLE IF NOT EXISTS experience_nodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    node_type TEXT NOT NULL DEFAULT 'work',
    graph_type TEXT NOT NULL DEFAULT 'professional',
    company_name TEXT NOT NULL DEFAULT '',
    logo_url TEXT,
    role_es TEXT NOT NULL DEFAULT '',
    role_en TEXT NOT NULL DEFAULT '',
    description_es TEXT NOT NULL DEFAULT '',
    description_en TEXT NOT NULL DEFAULT '',
    date_start TEXT NOT NULL DEFAULT '',
    date_end TEXT,
    position_x FLOAT NOT NULL DEFAULT 0,
    position_y FLOAT NOT NULL DEFAULT 0,
    display_order INTEGER NOT NULL DEFAULT 0,
    techs TEXT[] NOT NULL DEFAULT '{}',
    related_project_id TEXT REFERENCES projects(id) ON DELETE SET NULL,
    study_name_es TEXT NOT NULL DEFAULT '',
    study_name_en TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 7. Create experience_edges table
CREATE TABLE IF NOT EXISTS experience_edges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_node_id UUID NOT NULL REFERENCES experience_nodes(id) ON DELETE CASCADE,
    target_node_id UUID NOT NULL REFERENCES experience_nodes(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(source_node_id, target_node_id)
);

-- 8. Insert default config rows to ensure single configuration entry
INSERT INTO main_config (site_name, titles, subtitle_es, subtitle_en, github, linkedin, email)
SELECT 
    'Portfolio',
    ARRAY['Developer', 'Engineer'], 
    'Creando soluciones.', 
    'Building solutions.',
    'https://github.com/',
    'https://linkedin.com/',
    'mailto:contacto@example.com'
WHERE NOT EXISTS (SELECT 1 FROM main_config);

INSERT INTO about_config (bio_es, bio_en)
SELECT 
    'Hola, soy un desarrollador...', 
    'Hello, I am a developer...'
WHERE NOT EXISTS (SELECT 1 FROM about_config);

-- 9. Storage Bucket for portfolio assets
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio_assets', 'portfolio_assets', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Policies
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Public Access' AND tablename = 'objects' AND schemaname = 'storage'
    ) THEN
        CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id = 'portfolio_assets' );
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Service Role Access' AND tablename = 'objects' AND schemaname = 'storage'
    ) THEN
        CREATE POLICY "Service Role Access" ON storage.objects FOR ALL USING ( bucket_id = 'portfolio_assets' );
    END IF;
END $$;
