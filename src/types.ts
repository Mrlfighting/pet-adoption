import { LucideIcon } from 'lucide-react';

export type PetType = 'dog' | 'cat' | 'rabbit' | 'other';

export interface Pet {
  id: string;
  name: string;
  type: PetType;
  breed: string;
  age: string;
  gender: '公' | '母';
  weight: string;
  location: string;
  imageUrl: string;
  description: string;
  isNew?: boolean;
  healthStatus: string[];
  requirements: string[];
}

export interface User {
  name: string;
  role: string;
  avatarUrl: string;
  stats: {
    favorites: number;
    applications: number;
    successful: number;
  };
}

export interface AdoptionProgress {
  id: string;
  petName: string;
  petBreed: string;
  petImageUrl: string;
  status: '审核中' | '已通过' | '已拒绝';
  progress: number;
  currentStage: string;
  date: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isMe: boolean;
}

export interface Chat {
  id: string;
  petId: string;
  petName: string;
  petImageUrl: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: Message[];
}

export type ViewType = 'landing' | 'discovery' | 'detail' | 'form' | 'profile' | 'favorites' | 'message' | 'chat' | 'applications';
