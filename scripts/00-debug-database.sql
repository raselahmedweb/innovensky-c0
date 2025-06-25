-- Debug: Check if database connection works
SELECT 'Database connection successful' as status;

-- Check if tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check users table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users';

-- Check if admin user exists
SELECT id, name, email, role, created_at 
FROM users 
WHERE email = 'admin@innovensky.com';
