-- Run in Supabase Dashboard → SQL Editor → New query

-- 1) Verify tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- 2) List staff / admin users
SELECT
  id,
  email,
  first_name,
  last_name,
  role,
  status,
  is_verified,
  created_at
FROM users
WHERE role IN ('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'TRAINER', 'SUPPORT')
  AND deleted_at IS NULL
ORDER BY created_at DESC;

-- 3) Count members vs staff
SELECT role, COUNT(*) AS total
FROM users
WHERE deleted_at IS NULL
GROUP BY role
ORDER BY total DESC;

-- 4) Verify permissions seeded
SELECT COUNT(*) AS permission_count FROM permissions;

SELECT role, COUNT(*) AS permission_count
FROM role_permissions
GROUP BY role
ORDER BY role;

-- 5) Promote an existing user to SUPER_ADMIN (replace email)
-- UPDATE users
-- SET role = 'SUPER_ADMIN', status = 'ACTIVE', is_verified = true
-- WHERE email = 'your@email.com';

-- 6) Recent login activity
SELECT
  lh.email,
  lh.success,
  lh.device,
  lh.ip_address,
  lh.created_at,
  u.role
FROM login_history lh
LEFT JOIN users u ON u.id = lh.user_id
ORDER BY lh.created_at DESC
LIMIT 20;
