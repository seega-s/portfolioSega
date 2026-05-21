export type Project = {
  id: string;
  name_es: string;
  name_en: string;
  desc_es: string;
  desc_en: string;
  techs: string[];
  is_private: boolean;
  category: string;
  github: string | null;
  features_es: string[];
  features_en: string[];
  architecture_es: string[];
  architecture_en: string[];
  display_order: number;
  created_at?: string;
};

export type ExperienceNode = {
  id: string;
  node_type: 'work' | 'project' | 'study';
  graph_type: 'education' | 'professional' | 'personal';
  company_name: string;
  logo_url: string | null;
  role_es: string;
  role_en: string;
  description_es: string;
  description_en: string;
  date_start: string;
  date_end: string | null;
  position_x: number;
  position_y: number;
  display_order: number;
  techs: string[];
  related_project_id: string | null;
  study_name_es: string;
  study_name_en: string;
  created_at?: string;
};

export type ExperienceEdge = {
  id: string;
  source_node_id: string;
  target_node_id: string;
  created_at?: string;
};
