-- Fix database schema issues for ParroquiaSA database
-- Run this script before starting the Spring Boot application

-- Connect to the database
\c ParroquiaSA;

-- Update null values in usuario table
UPDATE usuario 
SET 
    activo = true 
WHERE activo IS NULL;

UPDATE usuario 
SET 
    apellido = 'Sin Apellido' 
WHERE apellido IS NULL;

UPDATE usuario 
SET 
    nombre = 'Sin Nombre' 
WHERE nombre IS NULL;

UPDATE usuario 
SET 
    password = 'temp_password_needs_reset' 
WHERE password IS NULL;

-- Verify the updates
SELECT 
    COUNT(*) as total_users,
    COUNT(CASE WHEN activo IS NULL THEN 1 END) as null_activo,
    COUNT(CASE WHEN apellido IS NULL THEN 1 END) as null_apellido,
    COUNT(CASE WHEN nombre IS NULL THEN 1 END) as null_nombre,
    COUNT(CASE WHEN password IS NULL THEN 1 END) as null_password
FROM usuario;
