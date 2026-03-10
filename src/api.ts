import { Pet, User, AdoptionProgress, Chat, Message } from './types';

const API_BASE = '/api';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || '请求失败');
  }
  return res.json();
}

// --- 宠物 ---
export async function fetchPets(type?: string): Promise<Pet[]> {
  const query = type && type !== 'all' ? `?type=${type}` : '';
  return request<Pet[]>(`/pets${query}`);
}

export async function fetchPetById(id: string): Promise<Pet> {
  return request<Pet>(`/pets/${id}`);
}

// --- 用户 ---
export async function fetchUserProfile(): Promise<User> {
  return request<User>('/user/profile');
}

// --- 收藏 ---
export async function fetchFavorites(): Promise<Pet[]> {
  return request<Pet[]>('/favorites');
}

export async function addFavorite(petId: string): Promise<void> {
  await request('/favorites', {
    method: 'POST',
    body: JSON.stringify({ petId }),
  });
}

export async function removeFavorite(petId: string): Promise<void> {
  await request(`/favorites/${petId}`, { method: 'DELETE' });
}

export async function checkFavorite(petId: string): Promise<boolean> {
  const res = await request<{ isFavorited: boolean }>(`/favorites/check/${petId}`);
  return res.isFavorited;
}

// --- 领养申请 ---
export async function fetchApplications(): Promise<AdoptionProgress[]> {
  return request<AdoptionProgress[]>('/applications');
}

export interface ApplicationFormData {
  petId: string;
  applicantName: string;
  phone: string;
  address: string;
  livingEnvironment: string;
  experience: string;
}

export async function submitApplication(data: ApplicationFormData): Promise<{ success: boolean; id: string }> {
  return request('/applications', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// --- 聊天 ---
export async function fetchChats(): Promise<Chat[]> {
  const chats = await request<any[]>('/chats');
  // messages 在列表页不需要，设为空数组
  return chats.map(c => ({ ...c, messages: [] }));
}

export async function fetchMessages(chatId: string): Promise<Message[]> {
  return request<Message[]>(`/chats/${chatId}/messages`);
}

export async function sendMessageApi(chatId: string, text: string): Promise<Message> {
  return request<Message>(`/chats/${chatId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ text }),
  });
}
