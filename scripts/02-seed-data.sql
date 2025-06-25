-- Seed initial data for team members
INSERT INTO team_members (name, role, bio, order_index) VALUES
('Rasel', 'Founder & Full-Stack Developer', 'Visionary leader with expertise in modern web technologies and business strategy. Passionate about creating innovative solutions that drive business growth.', 1),
('Mostafiz', 'Software Developer', 'Skilled software developer with experience in building scalable applications and solving complex technical challenges.', 2),
('Halima', 'Digital Marketer', 'Creative digital marketing specialist focused on building brand presence and driving customer engagement through strategic campaigns.', 3),
('Ahmad Saifullah', 'Graphic Designer', 'Talented graphic designer with an eye for detail and passion for creating visually stunning designs that communicate effectively.', 4)
ON CONFLICT DO NOTHING;

-- Seed sample projects
INSERT INTO projects (title, description, technologies, category, featured) VALUES
('E-Commerce Platform', 'Modern e-commerce solution with advanced features including inventory management, payment processing, and analytics dashboard.', ARRAY['Next.js', 'TypeScript', 'PostgreSQL', 'Stripe'], 'Web Development', true),
('Mobile Banking App', 'Secure mobile banking application with biometric authentication and real-time transaction processing.', ARRAY['React Native', 'Node.js', 'MongoDB', 'JWT'], 'Mobile Development', true),
('Brand Identity Package', 'Complete brand identity design including logo, business cards, and marketing materials for a tech startup.', ARRAY['Adobe Illustrator', 'Photoshop', 'Figma'], 'Graphic Design', false)
ON CONFLICT DO NOTHING;
