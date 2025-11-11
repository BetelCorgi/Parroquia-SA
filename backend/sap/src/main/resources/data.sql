-- Script de inicialización de datos para testing
-- Este archivo se ejecuta automáticamente al iniciar la aplicación

-- Insertar usuario administrador de prueba
-- Email: admin@parroquia.com
-- Password: admin123 (encriptado con BCrypt)
INSERT INTO usuario (email, password, nombre, apellido, rol, activo, fecha_creacion, fecha_actualizacion)
VALUES (
    'admin@parroquia.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'Administrador',
    'Sistema',
    'ADMINISTRADOR',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT (email) DO NOTHING;

-- Insertar usuario fiel de prueba
-- Email: fiel@parroquia.com
-- Password: fiel123 (encriptado con BCrypt)
INSERT INTO usuario (email, password, nombre, apellido, rol, activo, fecha_creacion, fecha_actualizacion)
VALUES (
    'fiel@parroquia.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'Juan',
    'Pérez',
    'FIEL',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT (email) DO NOTHING;
