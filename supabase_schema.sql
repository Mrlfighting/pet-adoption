-- =============================================
-- PawAdopt 数据库 Schema
-- 在 Supabase Dashboard -> SQL Editor 中执行
-- =============================================

-- 1. 用户表
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT DEFAULT '宠物领养人',
  avatar_url TEXT,
  favorites_count INT DEFAULT 0,
  applications_count INT DEFAULT 0,
  successful_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. 宠物表
CREATE TABLE IF NOT EXISTS pets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('dog', 'cat', 'rabbit', 'other')),
  breed TEXT NOT NULL,
  age TEXT NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('公', '母')),
  weight TEXT NOT NULL,
  location TEXT NOT NULL,
  image_url TEXT NOT NULL,
  description TEXT,
  is_new BOOLEAN DEFAULT false,
  health_status TEXT[] DEFAULT '{}',
  requirements TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. 领养申请表
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  status TEXT DEFAULT '审核中' CHECK (status IN ('审核中', '已通过', '已拒绝')),
  progress INT DEFAULT 0,
  current_stage TEXT DEFAULT '申请已提交，等待初审',
  applicant_name TEXT,
  phone TEXT,
  address TEXT,
  living_environment TEXT,
  experience TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. 收藏表
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, pet_id)
);

-- 5. 聊天会话表
CREATE TABLE IF NOT EXISTS chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  last_message TEXT,
  last_message_time TEXT,
  unread_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. 聊天消息表
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID REFERENCES chats(id) ON DELETE CASCADE,
  sender_id TEXT NOT NULL,
  text TEXT NOT NULL,
  is_me BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- 种子数据
-- =============================================

-- 插入默认用户
INSERT INTO users (id, name, role, avatar_url, favorites_count, applications_count, successful_count) VALUES
  ('00000000-0000-0000-0000-000000000001', '小张', '资深宠物领养官', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200', 12, 5, 3);

-- 插入宠物数据
INSERT INTO pets (id, name, type, breed, age, gender, weight, location, image_url, description, is_new, health_status, requirements) VALUES
  ('00000000-0000-0000-0000-000000000101', 'Bella', 'dog', '巴哥犬', '2岁', '母', '8公斤', 'San Francisco, CA',
   'https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?auto=format&fit=crop&q=80&w=800',
   'Bella 是一只非常温顺的巴哥犬，喜欢在沙发上打盹，也喜欢短途散步。她对小朋友非常友好。',
   false, ARRAY['已接种疫苗', '已绝育', '已植入芯片'], ARRAY['需要有围栏的院子', '偏好安静的家庭', '有养犬经验者优先']),

  ('00000000-0000-0000-0000-000000000102', 'Cooper', 'dog', '比格犬', '1岁', '公', '12公斤', 'Los Angeles, CA',
   'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=800',
   'Cooper 是一只精力充沛的比格犬，喜欢探索新事物。他需要大量的运动和互动。',
   false, ARRAY['已接种疫苗', '已绝育'], ARRAY['每天至少散步两次', '需要有围栏的院子', '不建议与猫同住']),

  ('00000000-0000-0000-0000-000000000103', 'Whiskers', 'cat', '波斯猫', '6个月', '母', '3公斤', 'Seattle, WA',
   'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=800',
   'Whiskers 是一只优雅的波斯猫，性格安静，喜欢被人抚摸。',
   true, ARRAY['已接种疫苗', '已绝育'], ARRAY['室内喂养', '定期梳毛', '安静的环境']),

  ('00000000-0000-0000-0000-000000000104', 'Thumper', 'rabbit', '荷兰垂耳兔', '4个月', '公', '1.5公斤', 'Portland, OR',
   'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&q=80&w=800',
   'Thumper 是一只活泼的小兔子，喜欢吃胡萝卜和在草地上跳跃。',
   true, ARRAY['已接种疫苗'], ARRAY['充足的活动空间', '新鲜的干草供应', '避免强光直射']),

  ('00000000-0000-0000-0000-000000000105', 'Rex', 'dog', '边境牧羊犬', '3岁', '公', '20公斤', 'Denver, CO',
   'https://images.unsplash.com/photo-1503256207526-0d5d80fa2f47?auto=format&fit=crop&q=80&w=800',
   'Rex 是一只极其聪明的边牧，已经学会了多种指令。他需要高强度的精神和体力活动。',
   true, ARRAY['已接种疫苗', '已绝育', '已植入芯片'], ARRAY['有大草坪的家庭', '每天至少两小时运动', '有边牧饲养经验']);

-- 插入领养申请数据
INSERT INTO applications (id, user_id, pet_id, status, progress, current_stage, created_at) VALUES
  ('00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000102',
   '审核中', 65, '资质初审已通过，待视频回访', '2024-03-05'),
  ('00000000-0000-0000-0000-000000000202', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000102',
   '已通过', 100, '领养协议已签署，准备接回家', '2024-02-20'),
  ('00000000-0000-0000-0000-000000000203', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000101',
   '已通过', 100, '已成功领养', '2024-01-15'),
  ('00000000-0000-0000-0000-000000000204', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000103',
   '已通过', 100, '已成功领养', '2023-12-10'),
  ('00000000-0000-0000-0000-000000000205', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000105',
   '审核中', 30, '申请已提交，等待初审', '2024-03-06');

-- 插入收藏数据
INSERT INTO favorites (user_id, pet_id) VALUES
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000101'),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000102'),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000103');

-- 插入聊天数据
INSERT INTO chats (id, user_id, pet_id, last_message, last_message_time, unread_count) VALUES
  ('00000000-0000-0000-0000-000000000301', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000102',
   '您好，请问 Cooper 还在待领养状态吗？', '10:30', 2),
  ('00000000-0000-0000-0000-000000000302', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000101',
   'Bella 非常乖，谢谢您的推荐！', '昨天', 0);

-- 插入消息数据
INSERT INTO messages (chat_id, sender_id, text, is_me, created_at) VALUES
  ('00000000-0000-0000-0000-000000000301', 'u1', '您好，请问 Cooper 还在待领养状态吗？', false, '2024-03-10 10:30:00'),
  ('00000000-0000-0000-0000-000000000301', 'me', '是的，目前还在审核中。', true, '2024-03-10 10:35:00'),
  ('00000000-0000-0000-0000-000000000302', 'u2', 'Bella 非常乖，谢谢您的推荐！', false, '2024-03-09 15:00:00');

-- 关闭 RLS (简化开发，生产环境应开启)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- 为匿名用户创建允许全部访问的策略（开发用）
CREATE POLICY "Allow all for anon" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON pets FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON applications FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON favorites FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON chats FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON messages FOR ALL USING (true) WITH CHECK (true);
