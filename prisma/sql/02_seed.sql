-- ==========================================
-- 02_SEED.SQL
-- Datos base esenciales del sistema
-- ==========================================
 
 
-- ==========================================
-- 1. USUARIOS ADMINISTRADORES
-- ==========================================
 
-- Contraseña de todos los admins: Admin1234!
-- psw_hash es SHA-256 de 'Admin1234!'
 
INSERT INTO users (id_user, username, email, psw_hash, name, surnames, description, location, country, language, born_date, role, status, penalties_count) VALUES
(
    'a3f1c2e4b5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2',
    'admin_principal',
    'admin@skillswap.es',
    'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f',
    'Carlos',
    'Martínez Ruiz',
    'Administrador principal de la plataforma SkillSwap.',
    'Madrid, Comunidad de Madrid',
    'España',
    'es',
    '1988-03-15',
    'admin',
    true,
    0
),
(
    'b4e2d3f5c6a7b8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3',
    'admin_soporte',
    'soporte@skillswap.es',
    'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f',
    'Laura',
    'González Fernández',
    'Administradora de soporte y gestión de sanciones.',
    'Barcelona, Cataluña',
    'España',
    'es',
    '1991-07-22',
    'admin',
    true,
    0
);