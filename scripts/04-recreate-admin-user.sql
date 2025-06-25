-- Delete existing admin user if exists
DELETE FROM users WHERE email = 'admin@innovensky.com';

-- Create fresh admin user with properly hashed password
-- Using bcrypt with salt rounds 12, password: admin123
INSERT INTO users (name, email, password, role, created_at, updated_at) 
VALUES (
  'Admin User',
  'admin@innovensky.com',
  '$2a$12$LQv3c1yqBwEHFl5aysHdsOu/1oXzeKNyUzOU13df29HDGg.5fxws6',
  'admin',
  NOW(),
  NOW()
);

-- Verify the user was created
SELECT id, name, email, role, created_at, 
       LENGTH(password) as password_length,
       SUBSTRING(password, 1, 10) as password_start
FROM users 
WHERE email = 'admin@innovensky.com';
