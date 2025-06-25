-- Create admin user with hashed password
-- Password: admin123 (hashed with bcrypt)
INSERT INTO users (name, email, password, role, created_at, updated_at) 
VALUES (
  'Admin User',
  'admin@innovensky.com',
  '$2a$12$LQv3c1yqBwEHFl5aysHdsOu/1oXzeKNyUzOU13df29HDGg.5fxws6',
  'admin',
  NOW(),
  NOW()
) ON CONFLICT (email) DO UPDATE SET
  password = EXCLUDED.password,
  updated_at = NOW();
