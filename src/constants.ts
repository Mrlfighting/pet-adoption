import { Pet, User, AdoptionProgress, Chat } from './types';

export const MOCK_PETS: Pet[] = [
  {
    id: '1',
    name: 'Bella',
    type: 'dog',
    breed: '巴哥犬',
    age: '2岁',
    gender: '母',
    weight: '8公斤',
    location: 'San Francisco, CA',
    imageUrl: 'https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?auto=format&fit=crop&q=80&w=800',
    description: 'Bella 是一只非常温顺的巴哥犬，喜欢在沙发上打盹，也喜欢短途散步。她对小朋友非常友好。',
    healthStatus: ['已接种疫苗', '已绝育', '已植入芯片'],
    requirements: ['需要有围栏的院子', '偏好安静的家庭', '有养犬经验者优先'],
  },
  {
    id: '2',
    name: 'Cooper',
    type: 'dog',
    breed: '比格犬',
    age: '1岁',
    gender: '公',
    weight: '12公斤',
    location: 'Los Angeles, CA',
    imageUrl: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=800',
    description: 'Cooper 是一只精力充沛的比格犬，喜欢探索新事物。他需要大量的运动和互动。',
    healthStatus: ['已接种疫苗', '已绝育'],
    requirements: ['每天至少散步两次', '需要有围栏的院子', '不建议与猫同住'],
  },
  {
    id: '3',
    name: 'Whiskers',
    type: 'cat',
    breed: '波斯猫',
    age: '6个月',
    gender: '母',
    weight: '3公斤',
    location: 'Seattle, WA',
    imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=800',
    description: 'Whiskers 是一只优雅的波斯猫，性格安静，喜欢被人抚摸。',
    isNew: true,
    healthStatus: ['已接种疫苗', '已绝育'],
    requirements: ['室内喂养', '定期梳毛', '安静的环境'],
  },
  {
    id: '4',
    name: 'Thumper',
    type: 'rabbit',
    breed: '荷兰垂耳兔',
    age: '4个月',
    gender: '公',
    weight: '1.5公斤',
    location: 'Portland, OR',
    imageUrl: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&q=80&w=800',
    description: 'Thumper 是一只活泼的小兔子，喜欢吃胡萝卜和在草地上跳跃。',
    isNew: true,
    healthStatus: ['已接种疫苗'],
    requirements: ['充足的活动空间', '新鲜的干草供应', '避免强光直射'],
  },
  {
    id: '5',
    name: 'Rex',
    type: 'dog',
    breed: '边境牧羊犬',
    age: '3岁',
    gender: '公',
    weight: '20公斤',
    location: 'Denver, CO',
    imageUrl: 'https://images.unsplash.com/photo-1503256207526-0d5d80fa2f47?auto=format&fit=crop&q=80&w=800',
    description: 'Rex 是一只极其聪明的边牧，已经学会了多种指令。他需要高强度的精神和体力活动。',
    isNew: true,
    healthStatus: ['已接种疫苗', '已绝育', '已植入芯片'],
    requirements: ['有大草坪的家庭', '每天至少两小时运动', '有边牧饲养经验'],
  }
];

export const MOCK_USER: User = {
  name: '小张',
  role: '资深宠物领养官',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
  stats: {
    favorites: 12,
    applications: 5,
    successful: 3,
  }
};

export const MOCK_PROGRESS: AdoptionProgress[] = [
  {
    id: 'a1',
    petName: '旺财',
    petBreed: '柯基犬',
    petImageUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=200',
    status: '审核中',
    progress: 65,
    currentStage: '资质初审已通过，待视频回访',
    date: '2024-03-05',
  },
  {
    id: 'a2',
    petName: 'Cooper',
    petBreed: '比格犬',
    petImageUrl: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=200',
    status: '已通过',
    progress: 100,
    currentStage: '领养协议已签署，准备接回家',
    date: '2024-02-20',
  },
  {
    id: 'a3',
    petName: 'Bella',
    petBreed: '巴哥犬',
    petImageUrl: 'https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?auto=format&fit=crop&q=80&w=200',
    status: '已通过',
    progress: 100,
    currentStage: '已成功领养',
    date: '2024-01-15',
  },
  {
    id: 'a4',
    petName: 'Whiskers',
    petBreed: '波斯猫',
    petImageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=200',
    status: '已通过',
    progress: 100,
    currentStage: '已成功领养',
    date: '2023-12-10',
  },
  {
    id: 'a5',
    petName: 'Rex',
    petBreed: '边境牧羊犬',
    petImageUrl: 'https://images.unsplash.com/photo-1503256207526-0d5d80fa2f47?auto=format&fit=crop&q=80&w=200',
    status: '审核中',
    progress: 30,
    currentStage: '申请已提交，等待初审',
    date: '2024-03-06',
  }
];

export const MOCK_CHATS: Chat[] = [
  {
    id: 'c1',
    petId: '2',
    petName: 'Cooper',
    petImageUrl: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=200',
    lastMessage: '您好，请问 Cooper 还在待领养状态吗？',
    lastMessageTime: '10:30',
    unreadCount: 2,
    messages: [
      { id: 'm1', senderId: 'u1', text: '您好，请问 Cooper 还在待领养状态吗？', timestamp: '10:30', isMe: false },
      { id: 'm2', senderId: 'me', text: '是的，目前还在审核中。', timestamp: '10:35', isMe: true },
    ]
  },
  {
    id: 'c2',
    petId: '1',
    petName: 'Bella',
    petImageUrl: 'https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?auto=format&fit=crop&q=80&w=200',
    lastMessage: 'Bella 非常乖，谢谢您的推荐！',
    lastMessageTime: '昨天',
    unreadCount: 0,
    messages: [
      { id: 'm3', senderId: 'u2', text: 'Bella 非常乖，谢谢您的推荐！', timestamp: '昨天', isMe: false },
    ]
  }
];
