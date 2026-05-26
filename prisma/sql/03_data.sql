-- ==========================================
-- 03_DATA.SQL
-- Datos de muestra para desarrollo y pruebas
-- ==========================================
 
 
-- ==========================================
-- 1. USUARIOS DE MUESTRA
-- ==========================================
 
-- Contraseña de todos los usuarios: User1234!
-- psw_hash es SHA-256 de 'User1234!'
 
INSERT INTO users (id_user, username, email, psw_hash, name, surnames, description, location, country, language, born_date, role, status, penalties_count) VALUES
(
    'c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2',
    'pablogarcia92',
    'pablo.garcia@gmail.com',
    '2b4c6d8e0f1a3b5c7d9e0f2a4b6c8d0e2f4a6b8c0d2e4f6a8b0c2d4e6f8a0b2',
    'Pablo',
    'García López',
    'Ingeniero de software apasionado por la música. Toco la guitarra desde los 12 años.',
    'Madrid, Comunidad de Madrid',
    'España',
    'es',
    '1992-04-18',
    'user',
    true,
    0
),
(
    'd2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3',
    'lucia_martinez',
    'lucia.martinez@hotmail.com',
    '2b4c6d8e0f1a3b5c7d9e0f2a4b6c8d0e2f4a6b8c0d2e4f6a8b0c2d4e6f8a0b2',
    'Lucía',
    'Martínez Sánchez',
    'Profesora de yoga y pilates. Busco aprender idiomas a cambio de clases.',
    'Valencia, Comunitat Valenciana',
    'España',
    'es',
    '1995-09-03',
    'user',
    true,
    0
),
(
    'e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4',
    'danicocinero',
    'daniel.fernandez@yahoo.es',
    '2b4c6d8e0f1a3b5c7d9e0f2a4b6c8d0e2f4a6b8c0d2e4f6a8b0c2d4e6f8a0b2',
    'Daniel',
    'Fernández Torres',
    'Chef amateur y amante de la gastronomía mediterránea. Ofrezco clases de cocina.',
    'Sevilla, Andalucía',
    'España',
    'es',
    '1989-12-27',
    'user',
    true,
    0
),
(
    'f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5',
    'ana_foto',
    'ana.rodriguez@outlook.com',
    '2b4c6d8e0f1a3b5c7d9e0f2a4b6c8d0e2f4a6b8c0d2e4f6a8b0c2d4e6f8a0b2',
    'Ana',
    'Rodríguez Blanco',
    'Fotógrafa freelance especializada en retrato y naturaleza. Doy talleres de fotografía.',
    'Bilbao, País Vasco',
    'España',
    'es',
    '1993-06-11',
    'user',
    true,
    0
),
(
    'a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6',
    'miguel_ingles',
    'miguel.lopez@gmail.com',
    '2b4c6d8e0f1a3b5c7d9e0f2a4b6c8d0e2f4a6b8c0d2e4f6a8b0c2d4e6f8a0b2',
    'Miguel',
    'López Jiménez',
    'Traductor inglés-español. Busco intercambiar clases de idiomas por otras habilidades.',
    'Zaragoza, Aragón',
    'España',
    'es',
    '1987-02-14',
    'user',
    true,
    0
),
(
    'b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7',
    'sofia_diseno',
    'sofia.garcia@gmail.com',
    '2b4c6d8e0f1a3b5c7d9e0f2a4b6c8d0e2f4a6b8c0d2e4f6a8b0c2d4e6f8a0b2',
    'Sofía',
    'García Moreno',
    'Diseñadora gráfica y UX. Creo logos, identidades visuales y prototipo apps.',
    'Málaga, Andalucía',
    'España',
    'es',
    '1996-08-30',
    'user',
    true,
    0
),
(
    'c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8',
    'jordi_musica',
    'jordi.puig@gmail.com',
    '2b4c6d8e0f1a3b5c7d9e0f2a4b6c8d0e2f4a6b8c0d2e4f6a8b0c2d4e6f8a0b2',
    'Jordi',
    'Puig Valls',
    'Músico y productor. Toco el piano desde los 6 años y produzco música electrónica.',
    'Barcelona, Cataluña',
    'España',
    'ca',
    '1990-11-05',
    'user',
    true,
    0
),
(
    'd8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9',
    'carmen_yoga',
    'carmen.navarro@hotmail.com',
    '2b4c6d8e0f1a3b5c7d9e0f2a4b6c8d0e2f4a6b8c0d2e4f6a8b0c2d4e6f8a0b2',
    'Carmen',
    'Navarro Ortega',
    'Instructora de yoga certificada. Especialista en yoga restaurativo y meditación.',
    'Granada, Andalucía',
    'España',
    'es',
    '1984-05-19',
    'user',
    true,
    0
),
(
    'e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0',
    'roberto_dev',
    'roberto.herrera@gmail.com',
    '2b4c6d8e0f1a3b5c7d9e0f2a4b6c8d0e2f4a6b8c0d2e4f6a8b0c2d4e6f8a0b2',
    'Roberto',
    'Herrera Castillo',
    'Desarrollador fullstack con 8 años de experiencia. Imparto clases de programación.',
    'Valladolid, Castilla y León',
    'España',
    'es',
    '1986-01-08',
    'user',
    true,
    0
),
(
    'f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1',
    'marta_idiomas',
    'marta.gil@outlook.com',
    '2b4c6d8e0f1a3b5c7d9e0f2a4b6c8d0e2f4a6b8c0d2e4f6a8b0c2d4e6f8a0b2',
    'Marta',
    'Gil Serrano',
    'Filóloga y profesora de francés e italiano. Me encanta el intercambio cultural.',
    'Salamanca, Castilla y León',
    'España',
    'es',
    '1994-03-25',
    'user',
    true,
    0
);
 
 
-- ==========================================
-- 2. CONTACTOS (AMISTADES)
-- ==========================================
 
INSERT INTO contacts (id_user, friend_id_user) VALUES
-- Pablo <-> Lucía
('c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2', 'd2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3'),
('d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3', 'c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2'),
-- Pablo <-> Roberto
('c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2', 'e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0'),
('e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0', 'c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2'),
-- Lucía <-> Carmen
('d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3', 'd8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9'),
('d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9', 'd2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3'),
-- Ana <-> Sofía
('f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5', 'b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7'),
('b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7', 'f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5'),
-- Jordi <-> Miguel
('c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8', 'a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6'),
('a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6', 'c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8'),
-- Marta <-> Miguel
('f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1', 'a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6'),
('a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6', 'f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1');
 
 
-- ==========================================
-- 3. ACTIVIDADES
-- ==========================================
 
INSERT INTO activities (id_user, name, description, topic, type, date, location, latitude, longitude, status) VALUES
-- Pablo: clases de guitarra
('c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2', 
 'Clases de guitarra acústica', 
 'Enseño guitarra acústica a principiantes y nivel intermedio. Aprenderás acordes, ritmos flamencos y pop español. Traes tu guitarra o usas la mía.',
 'Música', 'presencial', '2025-06-15 17:00:00', 
 'Madrid, Malasaña', 40.42638, -3.70379, 'active'),
 
-- Pablo: mentoría programación
('c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2',
 'Mentoría de JavaScript para principiantes',
 'Sesiones de introducción a JavaScript desde cero. Aprende variables, funciones, DOM y tu primer proyecto web. Material incluido.',
 'Tecnología', 'online', '2025-06-20 19:00:00',
 NULL, NULL, NULL, 'active'),
 
-- Lucía: clases de yoga
('d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3',
 'Yoga para principiantes - Hatha',
 'Clase de yoga Hatha para personas sin experiencia previa. Trabajaremos posturas básicas, respiración y relajación. Trae tu esterilla.',
 'Deporte', 'presencial', '2025-06-12 09:00:00',
 'Valencia, Jardines del Turia', 39.47433, -0.37579, 'active'),
 
-- Lucía: pilates online
('d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3',
 'Pilates mat - nivel intermedio',
 'Clase de pilates en suelo para quienes ya tienen nociones básicas. Mejorarás la fuerza del core y la postura. Solo necesitas esterilla.',
 'Deporte', 'online', NULL,
 NULL, NULL, NULL, 'active'),
 
-- Daniel: taller de cocina
('e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4',
 'Taller de cocina mediterránea',
 'Aprende a cocinar platos tradicionales mediterráneos: paella valenciana, gazpacho andaluz y pescado al horno. Ingredientes incluidos.',
 'Cocina', 'presencial', '2025-06-28 11:00:00',
 'Sevilla, Triana', 37.38283, -6.00119, 'active'),
 
-- Daniel: repostería
('e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4',
 'Introducción a la repostería artesanal',
 'Taller de repostería: aprende a hacer bizcochos, magdalenas y tartas caseras sin conservantes. Todo el material lo ponemos yo.',
 'Cocina', 'presencial', '2025-07-05 10:00:00',
 'Sevilla, Centro', 37.38874, -5.98426, 'active'),
 
-- Ana: taller de fotografía
('f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5',
 'Fotografía de retrato con luz natural',
 'Aprende a hacer retratos profesionales solo con luz natural. Veremos composición, ángulos y edición básica en Lightroom. Trae tu cámara.',
 'Arte', 'presencial', '2025-06-22 10:30:00',
 'Bilbao, Casco Viejo', 43.25696, -2.92396, 'active'),
 
-- Miguel: clases de inglés
('a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6',
 'Conversación en inglés - nivel B1/B2',
 'Sesiones de conversación en inglés para practicar y perder el miedo a hablar. Nos centramos en situaciones cotidianas y de trabajo.',
 'Idiomas', 'online', NULL,
 NULL, NULL, NULL, 'active'),
 
-- Sofía: diseño de logo
('b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7',
 'Diseño de logotipo e identidad visual',
 'Te diseño un logotipo profesional con identidad visual completa: paleta de colores, tipografía y guía de marca. Entrega en 1 semana.',
 'Diseño', 'online', NULL,
 NULL, NULL, NULL, 'active'),
 
-- Jordi: clases de piano
('c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8',
 'Clases de piano clásico y moderno',
 'Doy clases de piano para todos los niveles. Trabajamos lectura de partituras, técnica y repertorio (clásico, jazz o pop, a tu elección).',
 'Música', 'presencial', '2025-06-18 18:00:00',
 'Barcelona, Gràcia', 41.40363, 2.15899, 'active'),
 
-- Carmen: meditación
('d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9',
 'Meditación mindfulness para el estrés',
 'Sesión guiada de meditación mindfulness para reducir el estrés y la ansiedad. Aprenderás técnicas que podrás aplicar en el día a día.',
 'Bienestar', 'online', NULL,
 NULL, NULL, NULL, 'active'),
 
-- Roberto: clases de Python
('e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0',
 'Python desde cero para adultos',
 'Aprende Python desde cero con ejemplos prácticos. Cubrimos sintaxis, listas, funciones y un pequeño proyecto final. Sin conocimientos previos.',
 'Tecnología', 'online', '2025-07-01 20:00:00',
 NULL, NULL, NULL, 'active'),
 
-- Marta: clases de francés
('f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1',
 'Francés conversacional A2/B1',
 'Clases de conversación en francés para niveles A2 y B1. Practicamos situaciones reales: viajes, trabajo, compras. Material incluido.',
 'Idiomas', 'online', NULL,
 NULL, NULL, NULL, 'active'),
 
-- Marta: italiano básico
('f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1',
 'Italiano básico para viajeros',
 'Aprende lo esencial del italiano para viajar: saludos, pedir en restaurantes, moverse por la ciudad y situaciones de emergencia.',
 'Idiomas', 'presencial', '2025-06-30 17:30:00',
 'Salamanca, Centro Histórico', 40.96480, -5.66380, 'active');
 
 
-- ==========================================
-- 4. INTERCAMBIOS
-- ==========================================
 
INSERT INTO exchanges (requester_id_user, target_id_user, requested_activity, offered_activity, status, chain_id, creation_date) VALUES
-- Pablo pide yoga a Lucía, ofrece clases de guitarra (aceptado y completado)
('c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2',
 'd2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3',
 3, 1, 'completed', NULL, '2025-05-01 10:00:00'),
 
-- Miguel pide diseño a Sofía, ofrece clases de inglés (aceptado)
('a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6',
 'b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7',
 9, 8, 'completed', NULL, '2025-05-10 16:30:00'),
 
-- Roberto pide guitarra a Pablo, ofrece Python (pendiente)
('e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0',
 'c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2',
 1, 12, 'pending', NULL, '2025-05-18 09:15:00'),
 
-- Ana pide piano a Jordi, ofrece sesión de fotos (pendiente)
('f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5',
 'c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8',
 10, 7, 'pending', NULL, '2025-05-20 14:00:00'),
 
-- Daniel pide meditación a Carmen, ofrece taller de cocina (rechazado)
('e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4',
 'd8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9',
 11, 5, 'refused', NULL, '2025-05-05 11:45:00'),
 
-- Marta pide cocina a Daniel, ofrece francés - intercambio en cadena
('f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1',
 'e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4',
 5, 13, 'accepted', 1, '2025-05-15 12:00:00'),
 
-- Daniel pide inglés a Miguel - parte de la misma cadena
('e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4',
 'a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6',
 8, 6, 'accepted', 1, '2025-05-15 12:05:00');
 
 
-- ==========================================
-- 5. RESEÑAS
-- ==========================================
 
INSERT INTO reviews (written_by, written_to_user, id_exchange, content, valoration, date, is_flagged) VALUES
-- Lucía reseña a Pablo (intercambio 1: guitarra por yoga completado)
('d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3',
 'c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2',
 1, 
 'Pablo es un profesor increíble, muy paciente y con mucho buen rollo. Aprendí los primeros acordes en una sola sesión. ¡Totalmente recomendable!',
 5, '2025-05-20 18:30:00', false),
 
-- Pablo reseña a Lucía (intercambio 1)
('c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2',
 'd2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3',
 1,
 'Lucía es una profesora excepcional. La clase de yoga estuvo muy bien estructurada y me ayudó muchísimo con el estrés del trabajo. Repetiría sin duda.',
 5, '2025-05-21 09:15:00', false),
 
-- Sofía reseña a Miguel (intercambio 2: inglés por diseño, aceptado)
('b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7',
 'a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6',
 2,
 'Las clases de inglés con Miguel son muy dinámicas y entretenidas. Nota una clara mejoría en mi fluidez oral. Buen ambiente y muy puntual.',
 4, '2025-05-25 20:00:00', false);
 
 
-- ==========================================
-- 6. CONVERSACIONES Y MENSAJES
-- ==========================================
 
-- Conversación ligada al intercambio 1 (Pablo y Lucía)
INSERT INTO conversations (id_exchange, type, creation_date) VALUES
(1, 'direct', '2025-05-01 10:05:00');
 
INSERT INTO participants (id_conversation, id_user, rol) VALUES
(1, 'c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2', 'member'),
(1, 'd2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3', 'member');
 
INSERT INTO messages (id_conversation, id_user_sender, content, send_at) VALUES
(1, 'c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2',
 '¡Hola Lucía! He visto tu anuncio de clases de yoga y me interesa mucho. Yo ofrezco clases de guitarra a cambio, ¿te parece bien el intercambio?',
 '2025-05-01 10:05:00'),
(1, 'd2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3',
 '¡Hola Pablo! Claro que sí, me parece perfecto. Siempre he querido aprender guitarra. ¿Cuándo te viene bien empezar?',
 '2025-05-01 10:32:00'),
(1, 'c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2',
 'Perfecto! ¿Qué te parece el 15 de junio a las 17h en Malasaña? Yo tengo otra guitarra de repuesto por si no tienes.',
 '2025-05-01 10:45:00'),
(1, 'd2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3',
 'Me viene genial! Yo te paso la dirección del estudio de yoga. El 12 de junio a las 9h, ¿te va bien?',
 '2025-05-01 11:00:00'),
(1, 'c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2',
 '¡Perfecto, trato hecho! Nos vemos el 12. 🎸🧘',
 '2025-05-01 11:05:00');
 
 
-- Conversación ligada al intercambio 2 (Miguel y Sofía)
INSERT INTO conversations (id_exchange, type, creation_date) VALUES
(2, 'direct', '2025-05-10 17:00:00');
 
INSERT INTO participants (id_conversation, id_user, rol) VALUES
(2, 'a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6', 'member'),
(2, 'b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7', 'member');
 
INSERT INTO messages (id_conversation, id_user_sender, content, send_at) VALUES
(2, 'a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6',
 'Hola Sofía, necesito un logo para mi marca personal como traductor. ¿Hacemos el intercambio?',
 '2025-05-10 17:00:00'),
(2, 'b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7',
 '¡Hola Miguel! Me parece genial, justo quiero mejorar mi inglés para proyectos internacionales. ¿Hacemos unas 4 sesiones de conversación?',
 '2025-05-10 17:20:00'),
(2, 'a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6',
 'Perfecto. Cuatro sesiones de inglés por el logo y la identidad visual completa. ¿Cuándo empezamos?',
 '2025-05-10 17:35:00');
 
 
-- Chat grupal social (sin intercambio)
INSERT INTO conversations (id_exchange, type, creation_date) VALUES
(NULL, 'group', '2025-05-12 09:00:00');
 
INSERT INTO participants (id_conversation, id_user, rol) VALUES
(3, 'c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2', 'admin'),
(3, 'd2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3', 'member'),
(3, 'e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0', 'member');
 
INSERT INTO messages (id_conversation, id_user_sender, content, send_at) VALUES
(3, 'c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2',
 '¡Buenas a todos! ¿Alguien se apunta a un quedada de SkillSwap en Madrid este mes?',
 '2025-05-12 09:00:00'),
(3, 'd2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3',
 'Yo me apunto sin dudarlo! ¿Dónde pensabas hacerlo?',
 '2025-05-12 09:14:00'),
(3, 'e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0',
 'Buena idea, yo también podría pasarme si es fin de semana. ¿El 28 quizás?',
 '2025-05-12 09:22:00');
 
 
-- ==========================================
-- 7. SANCIONES
-- ==========================================
 
-- Sanción manual por un admin a un usuario ficticio (basada en reseña inapropiada)
INSERT INTO penalties (id_user, admin_id_user, id_review, id_exchange, reason, given_at, expires_at) VALUES
-- Sanción de 30 días a danicocinero por comportamiento en el intercambio rechazado
('e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4',
 'a3f1c2e4b5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2',
 NULL, 5,
 'El usuario realizó comentarios inapropiados en el chat del intercambio tras recibir el rechazo. Se aplica sanción temporal de 30 días según el artículo 4.2 de las normas de conducta.',
 '2025-05-08 10:00:00', '2025-06-08 10:00:00');
 
-- Actualizar el contador de sanciones del usuario sancionado
UPDATE users SET penalties_count = 1 
WHERE id_user = 'e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4';