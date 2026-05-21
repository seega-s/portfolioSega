-- Limpiar datos existentes
TRUNCATE TABLE main_config, about_config, projects, experience_nodes, experience_edges, stack_lists, stack_techs CASCADE;

-- Insertar configuración principal
INSERT INTO main_config (site_name, favicon_url, titles, subtitle_es, subtitle_en, email, linkedin)
VALUES (
    'Dwight K. Schrute',
    'https://upload.wikimedia.org/wikipedia/en/e/e5/Dwight_Schrute.jpg',
    ARRAY['Assistant (to the) Regional Manager', 'Beet Farmer', 'Bed and Breakfast Owner', 'Sales Top Performer'],
    'Firme creyente en la superioridad de la remolacha y la lealtad incuestionable a Dunder Mifflin. Determinado, calculador y preparado para sobrevivir a cualquier apocalipsis.',
    'Firm believer in beet superiority and unquestionable loyalty to Dunder Mifflin. Determined, calculating, and prepared to survive any apocalypse.',
    'dwight.schrute@dundermifflin.com',
    'https://linkedin.com/in/dwightkschrute'
);

-- Insertar configuración sobre mí
INSERT INTO about_config (bio_es, bio_en, avatar_url)
VALUES (
    'Soy Dwight Kurt Schrute III. Cuando mis ancestros llegaron a América, descubrieron la remolacha, que es, científica y objetivamente, el vegetal más poderoso del planeta. He estado trabajando en ventas toda mi vida, incluso antes de saber qué eran las ventas. Como Asistente (del) Gerente Regional en Dunder Mifflin Scranton, aseguro la supervivencia y el crecimiento de la sucursal. Experto en artes marciales, supervivencia táctica y agricultura.',
    'I am Dwight Kurt Schrute III. When my ancestors arrived in America, they discovered the beet, which is, scientifically and objectively, the most powerful vegetable on the planet. I have been working in sales my whole life, even before I knew what sales were. As Assistant (to the) Regional Manager at Dunder Mifflin Scranton, I ensure the survival and growth of the branch. Expert in martial arts, tactical survival, and agriculture.',
    'https://upload.wikimedia.org/wikipedia/en/e/e5/Dwight_Schrute.jpg'
);

-- Insertar proyectos
INSERT INTO projects (id, name_es, name_en, desc_es, desc_en, techs, is_private, category, features_es, features_en, display_order)
VALUES 
(
    'schrute-farms',
    'Schrute Farms B&B',
    'Schrute Farms B&B',
    'El refugio agroturístico número uno en Trip Advisor en Pensilvania.',
    'The number one agritourism bed and breakfast on Trip Advisor in Pennsylvania.',
    ARRAY['Hospitality', 'Beet Cultivation', 'Table Making', 'Manure Handling'],
    false,
    'business',
    ARRAY['Habitaciones temáticas de Irrigación', 'Demostraciones de fabricación de mesas', 'Lecturas de Harry Potter a medianoche'],
    ARRAY['Irrigation themed rooms', 'Table making demonstrations', 'Midnight Harry Potter readings'],
    1
),
(
    'dunder-mifflin-security',
    'Sistema de Seguridad Dunder Mifflin',
    'Dunder Mifflin Security System',
    'Auditoría integral y reestructuración de la seguridad de la oficina (Simulación de incendio incl.).',
    'Comprehensive audit and restructuring of office security (Fire drill included).',
    ARRAY['Tactical Gear', 'Fire Alarms', 'Blowtorch', 'Bear Mace'],
    true,
    'security',
    ARRAY['Bloqueo total de puertas', 'Pruebas de estrés para empleados', 'Evacuación de emergencia rápida'],
    ARRAY['Total door lockdown', 'Employee stress testing', 'Rapid emergency evacuation'],
    2
);

-- Insertar experiencia
INSERT INTO experience_nodes (node_type, graph_type, company_name, role_es, role_en, description_es, description_en, date_start, date_end, techs, position_x, position_y, display_order)
VALUES
(
    'work',
    'professional',
    'Dunder Mifflin',
    'Asistente del Gerente Regional',
    'Assistant to the Regional Manager',
    'Cerré las ventas más grandes de la empresa. Gestioné disciplina, insubordinación y seguridad de oficina bajo el mandato de Michael Scott.',
    'Closed the company''s largest sales. Managed discipline, insubordination, and office security under Michael Scott.',
    '1998',
    'Presente',
    ARRAY['Sales', 'Management', 'Investigative skills'],
    0, 
    0,
    0
),
(
    'work',
    'professional',
    'Schrute Farms',
    'Propietario y Agricultor',
    'Owner & Farmer',
    'Gestión de más de 60 acres de cultivo de remolachas. Administración de personal (Mose).',
    'Management of over 60 acres of beet farming. Staff administration (Mose).',
    'Nacimiento',
    'Presente',
    ARRAY['Agriculture', 'Agritourism', 'Leadership'],
    100, 
    -100,
    1
);
