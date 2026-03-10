import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config(); // fallback to .env

const app = express();
app.use(express.json());

// --- Supabase 客户端 ---
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 缺少 SUPABASE_URL 或 SUPABASE_ANON_KEY 环境变量');
  console.error('请在 .env.local 文件中配置这两个变量');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// 默认用户 ID（简化版，无登录系统）
const DEFAULT_USER_ID = '00000000-0000-0000-0000-000000000001';

// --- 宠物 API ---

// 获取宠物列表
app.get('/api/pets', async (req, res) => {
  try {
    const { type } = req.query;
    let query = supabase.from('pets').select('*').order('created_at', { ascending: false });
    if (type && type !== 'all') {
      query = query.eq('type', type);
    }
    const { data, error } = await query;
    if (error) throw error;

    // 转换字段名为前端 camelCase 格式
    const pets = (data || []).map(mapPetRow);
    res.json(pets);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 获取单个宠物
app.get('/api/pets/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .eq('id', req.params.id)
      .single();
    if (error) throw error;
    if (!data) return res.status(404).json({ error: '宠物不存在' });
    res.json(mapPetRow(data));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- 用户 API ---

app.get('/api/user/profile', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', DEFAULT_USER_ID)
      .single();
    if (error) throw error;
    res.json({
      name: data.name,
      role: data.role,
      avatarUrl: data.avatar_url,
      stats: {
        favorites: data.favorites_count,
        applications: data.applications_count,
        successful: data.successful_count,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- 收藏 API ---

app.get('/api/favorites', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('favorites')
      .select('pet_id, pets(*)')
      .eq('user_id', DEFAULT_USER_ID);
    if (error) throw error;

    const pets = (data || []).map((row: any) => mapPetRow(row.pets));
    res.json(pets);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/favorites', async (req, res) => {
  try {
    const { petId } = req.body;
    const { error } = await supabase
      .from('favorites')
      .insert({ user_id: DEFAULT_USER_ID, pet_id: petId });
    if (error) throw error;

    // 更新用户收藏计数
    await supabase.rpc('increment_user_stat', {
      user_id_input: DEFAULT_USER_ID,
      stat_name: 'favorites_count',
      amount: 1,
    }).catch(() => {
      // RPC 可能不存在，忽略
    });

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/favorites/:petId', async (req, res) => {
  try {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', DEFAULT_USER_ID)
      .eq('pet_id', req.params.petId);
    if (error) throw error;
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 检查是否已收藏
app.get('/api/favorites/check/:petId', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', DEFAULT_USER_ID)
      .eq('pet_id', req.params.petId)
      .maybeSingle();
    if (error) throw error;
    res.json({ isFavorited: !!data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- 领养申请 API ---

app.get('/api/applications', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('applications')
      .select('*, pets(name, breed, image_url)')
      .eq('user_id', DEFAULT_USER_ID)
      .order('created_at', { ascending: false });
    if (error) throw error;

    const applications = (data || []).map((row: any) => ({
      id: row.id,
      petName: row.pets?.name || '',
      petBreed: row.pets?.breed || '',
      petImageUrl: row.pets?.image_url || '',
      status: row.status,
      progress: row.progress,
      currentStage: row.current_stage,
      date: new Date(row.created_at).toISOString().split('T')[0],
    }));
    res.json(applications);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/applications', async (req, res) => {
  try {
    const { petId, applicantName, phone, address, livingEnvironment, experience } = req.body;
    const { data, error } = await supabase
      .from('applications')
      .insert({
        user_id: DEFAULT_USER_ID,
        pet_id: petId,
        applicant_name: applicantName,
        phone,
        address,
        living_environment: livingEnvironment,
        experience,
        status: '审核中',
        progress: 10,
        current_stage: '申请已提交，等待初审',
      })
      .select()
      .single();
    if (error) throw error;
    res.json({ success: true, id: data.id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- 聊天 API ---

app.get('/api/chats', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('chats')
      .select('*, pets(name, image_url)')
      .eq('user_id', DEFAULT_USER_ID)
      .order('created_at', { ascending: false });
    if (error) throw error;

    const chats = (data || []).map((row: any) => ({
      id: row.id,
      petId: row.pet_id,
      petName: row.pets?.name || '',
      petImageUrl: row.pets?.image_url || '',
      lastMessage: row.last_message,
      lastMessageTime: row.last_message_time,
      unreadCount: row.unread_count,
    }));
    res.json(chats);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/chats/:id/messages', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', req.params.id)
      .order('created_at', { ascending: true });
    if (error) throw error;

    const messages = (data || []).map((row: any) => ({
      id: row.id,
      senderId: row.sender_id,
      text: row.text,
      timestamp: new Date(row.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: row.is_me,
    }));
    res.json(messages);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/chats/:id/messages', async (req, res) => {
  try {
    const chatId = req.params.id;
    const { text } = req.body;

    const { data, error } = await supabase
      .from('messages')
      .insert({
        chat_id: chatId,
        sender_id: 'me',
        text,
        is_me: true,
      })
      .select()
      .single();
    if (error) throw error;

    // 更新聊天的最后消息
    await supabase
      .from('chats')
      .update({
        last_message: text,
        last_message_time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      })
      .eq('id', chatId);

    res.json({
      id: data.id,
      senderId: data.sender_id,
      text: data.text,
      timestamp: new Date(data.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: data.is_me,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- 辅助函数 ---

function mapPetRow(row: any) {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    breed: row.breed,
    age: row.age,
    gender: row.gender,
    weight: row.weight,
    location: row.location,
    imageUrl: row.image_url,
    description: row.description,
    isNew: row.is_new,
    healthStatus: row.health_status || [],
    requirements: row.requirements || [],
  };
}

// --- 启动服务器 ---

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 PawAdopt 后端服务已启动: http://localhost:${PORT}`);
  console.log(`📦 Supabase 连接: ${supabaseUrl}`);
});
