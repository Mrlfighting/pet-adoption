/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PawPrint, 
  Search, 
  Bell, 
  MessageCircle, 
  User as UserIcon, 
  Heart, 
  ChevronRight, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Stethoscope, 
  Users,
  Send,
  Settings,
  Edit2,
  ClipboardList,
  HelpCircle,
  Home,
  MoreHorizontal,
  MapPin
} from 'lucide-react';
import { Pet, ViewType, PetType, Chat, Message, User, AdoptionProgress } from './types';
import {
  fetchPets,
  fetchUserProfile,
  fetchFavorites,
  addFavorite,
  removeFavorite,
  checkFavorite,
  fetchApplications,
  submitApplication,
  fetchChats,
  fetchMessages,
  sendMessageApi,
} from './api';

// --- Components ---

const BottomNav = ({ activeView, setView }: { activeView: ViewType, setView: (v: ViewType) => void }) => {
  const navItems = [
    { id: 'discovery', icon: Home, label: '首页' },
    { id: 'favorites', icon: Heart, label: '收藏' },
    { id: 'message', icon: MessageCircle, label: '消息', badge: true },
    { id: 'profile', icon: UserIcon, label: '我的' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-100 px-6 py-2 flex justify-between items-center shadow-2xl z-50 max-w-md mx-auto">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setView(item.id as ViewType)}
          className={`flex flex-col items-center gap-1 transition-colors ${
            activeView === item.id || (activeView === 'chat' && item.id === 'message') ? 'text-orange-500' : 'text-slate-400 hover:text-orange-400'
          }`}
        >
          <div className="relative">
            <item.icon size={24} strokeWidth={activeView === item.id ? 2.5 : 2} />
            {item.badge && <span className="absolute -top-1 -right-1 size-2 bg-orange-500 rounded-full border-2 border-white" />}
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

// --- Pages ---

const LandingPage = ({ onStart }: { onStart: () => void }) => {
  return (
    <div className="flex flex-col min-h-screen bg-[#f8f7f6]">
      {/* Top Bar */}
      <div className="flex items-center p-4 justify-between sticky top-0 z-10 bg-[#f8f7f6]">
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-orange-500/10 text-orange-500">
          <PawPrint size={24} />
        </div>
        <h2 className="text-slate-900 text-lg font-bold flex-1 text-center">宠物领养</h2>
        <div className="w-10 h-10" />
      </div>

      {/* Hero Section */}
      <div className="px-4 py-4">
        <div 
          className="w-full h-[360px] bg-center bg-cover flex flex-col justify-end overflow-hidden rounded-3xl relative shadow-lg"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&q=80&w=1000")' }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="relative p-6">
            <span className="inline-block px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full mb-3">
              已有 5000+ 宠物找到家
            </span>
          </div>
        </div>
      </div>

      {/* Welcome Content */}
      <div className="flex flex-col items-center px-6 pt-8 pb-4">
        <h1 className="text-slate-900 tracking-tight text-3xl font-bold leading-tight text-center pb-3">
          寻找你的<span className="text-orange-500">毛孩子</span>家人
        </h1>
        <p className="text-slate-600 text-base font-normal leading-relaxed text-center max-w-md">
          在这里，每一个孤独的灵魂都能找到温暖的归宿。我们致力于连接爱心领养人与待领养宠物，让爱不再流浪。
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 gap-4 p-6">
        {[
          { icon: ShieldCheck, title: '实名认证', desc: '双向身份核实，确保领养流程透明、安全、可靠。' },
          { icon: Stethoscope, title: '健康保障', desc: '所有宠物均经过严格检疫，建立完整健康档案。' },
          { icon: Users, title: '社区交流', desc: '加入领养人社区，分享养宠快乐，获取专业指导。' },
        ].map((feature, i) => (
          <div key={i} className="flex flex-col gap-3 rounded-2xl border border-orange-500/10 bg-white p-5 shadow-sm">
            <div className="text-orange-500 bg-orange-500/10 w-12 h-12 rounded-xl flex items-center justify-center">
              <feature.icon size={28} />
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-slate-900 text-base font-bold leading-tight">{feature.title}</h2>
              <p className="text-slate-500 text-sm leading-normal">{feature.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto p-6 pb-12 flex flex-col gap-4">
        <button 
          onClick={onStart}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2 group"
        >
          <span>开始探索</span>
          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>
        <div className="flex justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-orange-500" />
          <div className="w-2 h-2 rounded-full bg-orange-500/20" />
          <div className="w-2 h-2 rounded-full bg-orange-500/20" />
        </div>
        <p className="text-slate-400 text-[10px] text-center">
          点击开始即代表您同意我们的 <span className="underline text-orange-500/80 cursor-pointer">服务协议</span> 和 <span className="underline text-orange-500/80 cursor-pointer">隐私政策</span>
        </p>
      </div>
    </div>
  );
};

const DiscoveryPage = ({ onPetClick }: { onPetClick: (pet: Pet) => void }) => {
  const [activeType, setActiveType] = useState<PetType | 'all'>('dog');
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchPets(activeType === 'all' ? undefined : activeType)
      .then(setPets)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [activeType]);

  const categories = [
    { id: 'dog', icon: PawPrint, label: '狗狗' },
    { id: 'cat', icon: MessageCircle, label: '猫咪' },
    { id: 'rabbit', icon: PawPrint, label: '兔子' },
    { id: 'other', icon: PawPrint, label: '其他' },
  ];

  const recommendedPets = pets.filter(p => !p.isNew);
  const newPets = pets.filter(p => p.isNew);

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f7f6] pb-24">
      <header className="sticky top-0 z-50 bg-[#f8f7f6]/80 backdrop-blur-md px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-orange-500/20 flex items-center justify-center overflow-hidden border-2 border-white">
              <PawPrint size={20} className="text-orange-500" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500">你好！</p>
              <h1 className="text-lg font-bold leading-none">寻找新朋友</h1>
            </div>
          </div>
          <button className="size-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 bg-white">
            <Bell size={20} />
          </button>
        </div>
      </header>

      <main className="px-4 space-y-6">
        {/* Search Bar */}
        <div className="relative mt-2">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <Search size={18} />
          </div>
          <input 
            type="text" 
            placeholder="搜索你的最佳玩伴"
            className="block w-full pl-11 pr-4 py-3 bg-white border-none rounded-2xl text-sm focus:ring-2 focus:ring-orange-500 shadow-sm"
          />
        </div>

        {/* Category Filters */}
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveType(cat.id as PetType)}
              className={`flex shrink-0 items-center gap-2 px-5 py-2.5 rounded-2xl font-medium text-sm transition-all shadow-sm ${
                activeType === cat.id 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-white text-slate-600 hover:bg-orange-50'
              }`}
            >
              <cat.icon size={18} />
              {cat.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <>
            {/* Recommended Section */}
            {recommendedPets.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold tracking-tight">为你推荐</h2>
                  <button className="text-sm font-semibold text-orange-500">查看全部</button>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                  {recommendedPets.map((pet) => (
                    <motion.div 
                      key={pet.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onPetClick(pet)}
                      className="min-w-[200px] w-52 bg-white rounded-3xl overflow-hidden shadow-sm flex-shrink-0 group cursor-pointer"
                    >
                      <div className="relative h-48">
                        <img src={pet.imageUrl} alt={pet.name} className="w-full h-full object-cover" />
                        <button className="absolute top-3 right-3 size-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/40 transition-colors">
                          <Heart size={18} />
                        </button>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-base">{pet.name}</h3>
                        <p className="text-slate-500 text-xs mb-2">{pet.breed} • {pet.age}</p>
                        <div className="flex items-center gap-1 text-slate-400 text-[10px]">
                          <MapPin size={12} />
                          <span>{pet.location}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* New Arrivals Section */}
            {newPets.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold tracking-tight">新到宠物</h2>
                  <button className="text-sm font-semibold text-orange-500">查看全部</button>
                </div>
                <div className="space-y-3">
                  {newPets.map((pet) => (
                    <motion.div 
                      key={pet.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onPetClick(pet)}
                      className="flex gap-4 p-3 bg-white rounded-2xl shadow-sm items-center cursor-pointer"
                    >
                      <div className="size-20 rounded-xl overflow-hidden shrink-0">
                        <img src={pet.imageUrl} alt={pet.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-base truncate">{pet.name}</h3>
                          <span className="text-orange-500 text-[10px] font-bold bg-orange-500/10 px-2 py-0.5 rounded-full">新到</span>
                        </div>
                        <p className="text-slate-500 text-sm">{pet.breed} • {pet.age}</p>
                        <div className="flex items-center gap-1 text-slate-400 text-xs mt-1">
                          <MapPin size={12} />
                          <span>{pet.location}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {pets.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <PawPrint size={48} strokeWidth={1} className="mb-4 opacity-20" />
                <p>暂无宠物数据</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

const PetDetailPage = ({ pet, onBack, onApply }: { pet: Pet, onBack: () => void, onApply: () => void }) => {
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    checkFavorite(pet.id).then(setIsFavorited).catch(() => {});
  }, [pet.id]);

  const handleToggleFavorite = async () => {
    try {
      if (isFavorited) {
        await removeFavorite(pet.id);
      } else {
        await addFavorite(pet.id);
      }
      setIsFavorited(!isFavorited);
    } catch (err) {
      console.error('收藏操作失败:', err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white pb-10">
      <div className="relative w-full aspect-[4/5] overflow-hidden">
        <div 
          className="w-full h-full bg-center bg-cover"
          style={{ backgroundImage: `url("${pet.imageUrl}")` }}
        />
        <div className="absolute top-4 left-4 z-10">
          <button 
            onClick={onBack}
            className="flex items-center justify-center size-10 rounded-full bg-white/80 backdrop-blur-md text-slate-900 shadow-sm border border-slate-200/50"
          >
            <ArrowLeft size={20} />
          </button>
        </div>
        <div className="absolute top-4 right-4 z-10">
          <button 
            onClick={handleToggleFavorite}
            className={`flex items-center justify-center size-10 rounded-full backdrop-blur-md shadow-sm border border-slate-200/50 transition-colors ${
              isFavorited ? 'bg-orange-500 text-white' : 'bg-white/80 text-slate-900'
            }`}
          >
            <Heart size={20} fill={isFavorited ? 'currentColor' : 'none'} />
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </div>

      <div className="px-6 -mt-12 relative z-20">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">{pet.name}</h1>
            <div className="bg-orange-500/10 text-orange-500 px-3 py-1 rounded-full text-sm font-semibold">待领养</div>
          </div>
          <div className="flex items-center gap-2 text-slate-500">
            <MapPin size={14} />
            <span className="text-sm font-medium">{pet.location}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-6">
          {[
            { label: '品种', value: pet.breed, icon: PawPrint },
            { label: '年龄', value: pet.age, icon: ClipboardList },
            { label: '性别', value: pet.gender, icon: Users },
            { label: '体重', value: pet.weight, icon: ShieldCheck },
          ].map((item, i) => (
            <div key={i} className="flex flex-col gap-2 rounded-2xl border border-orange-500/10 bg-orange-500/5 p-4">
              <item.icon size={20} className="text-orange-500" />
              <div>
                <p className="text-[10px] text-slate-500 font-medium">{item.label}</p>
                <p className="text-sm font-bold text-slate-900">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-bold text-slate-900 mb-3">宠物介绍</h2>
          <p className="text-slate-600 leading-relaxed text-sm">
            {pet.description}
          </p>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-bold text-slate-900 mb-3">健康状况</h2>
          <div className="flex flex-wrap gap-2">
            {pet.healthStatus.map((status, i) => (
              <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 bg-white">
                <CheckCircle2 size={16} className="text-green-500" />
                <span className="text-xs font-medium">{status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-bold text-slate-900 mb-3">领养要求</h2>
          <ul className="space-y-3">
            {pet.requirements.map((req, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="size-5 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0 mt-0.5">
                  <div className="size-1.5 rounded-full bg-orange-500" />
                </div>
                <span className="text-slate-600 text-sm">{req}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="py-10 flex flex-col gap-3">
          <button 
            onClick={onApply}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-2xl shadow-lg transition-colors"
          >
            立即申请领养
          </button>
          <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold py-4 rounded-2xl transition-colors flex items-center justify-center gap-2 border border-slate-200">
            <MessageCircle size={20} />
            咨询领养中心
          </button>
        </div>
      </div>
    </div>
  );
};

const ApplicationFormPage = ({ pet, onBack, onSubmit }: { pet: Pet, onBack: () => void, onSubmit: () => void }) => {
  const [formData, setFormData] = useState({
    applicantName: '',
    phone: '',
    address: '',
    livingEnvironment: '',
    experience: '有经验',
    experienceDetail: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitApplication({
        petId: pet.id,
        applicantName: formData.applicantName,
        phone: formData.phone,
        address: formData.address,
        livingEnvironment: formData.livingEnvironment,
        experience: `${formData.experience} - ${formData.experienceDetail}`,
      });
      onSubmit();
    } catch (err) {
      console.error('提交失败:', err);
      alert('提交失败，请稍后重试');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex items-center p-4 border-b border-orange-500/10 sticky top-0 bg-white z-10">
        <button onClick={onBack} className="text-orange-500 size-10 flex items-center justify-center">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-slate-900 text-lg font-bold flex-1 text-center pr-10">领养申请表</h2>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-orange-500/5 border border-orange-500/10">
          <div className="flex flex-col gap-1 flex-1">
            <p className="text-orange-500 text-[10px] font-semibold uppercase tracking-wider">正在申请的宠物</p>
            <p className="text-slate-900 text-xl font-bold leading-tight">{pet.breed} {pet.name}</p>
            <p className="text-slate-500 text-xs">{pet.age} | {pet.gender} | {pet.healthStatus.join(' | ')}</p>
          </div>
          <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
            <img src={pet.imageUrl} alt={pet.name} className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      <form className="flex flex-col gap-8 p-4 pb-10" onSubmit={handleSubmit}>
        <section className="space-y-4">
          <h3 className="text-slate-900 text-lg font-bold flex items-center gap-2">
            <span className="w-1 h-5 bg-orange-500 rounded-full" />
            申请人基本信息
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-slate-700 text-sm font-medium mb-2">姓名</label>
              <input 
                type="text" 
                placeholder="请输入您的真实姓名" 
                value={formData.applicantName}
                onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
                className="w-full rounded-2xl border-slate-200 h-12 px-4 focus:ring-orange-500 focus:border-orange-500" 
              />
            </div>
            <div>
              <label className="block text-slate-700 text-sm font-medium mb-2">联系电话</label>
              <input 
                type="tel" 
                placeholder="请输入您的手机号码" 
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full rounded-2xl border-slate-200 h-12 px-4 focus:ring-orange-500 focus:border-orange-500" 
              />
            </div>
            <div>
              <label className="block text-slate-700 text-sm font-medium mb-2">详细地址</label>
              <input 
                type="text" 
                placeholder="省、市、区、街道门牌号" 
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full rounded-2xl border-slate-200 h-12 px-4 focus:ring-orange-500 focus:border-orange-500" 
              />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-slate-900 text-lg font-bold flex items-center gap-2">
            <span className="w-1 h-5 bg-orange-500 rounded-full" />
            家庭环境描述
          </h3>
          <div>
            <label className="block text-slate-700 text-sm font-medium mb-2">居住环境 (如：自有房产、平层、有阳台等)</label>
            <textarea 
              placeholder="请简单描述您的居住条件以及家中其他成员的意见" 
              value={formData.livingEnvironment}
              onChange={(e) => setFormData({ ...formData, livingEnvironment: e.target.value })}
              className="w-full rounded-2xl border-slate-200 min-h-[100px] p-4 focus:ring-orange-500 focus:border-orange-500" 
            />
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-slate-900 text-lg font-bold flex items-center gap-2">
            <span className="w-1 h-5 bg-orange-500 rounded-full" />
            养宠经验
          </h3>
          <div className="flex gap-4">
            {['有经验', '新手小白'].map((opt) => (
              <label key={opt} className="flex-1 cursor-pointer">
                <input 
                  type="radio" 
                  name="experience" 
                  className="hidden peer" 
                  checked={formData.experience === opt}
                  onChange={() => setFormData({ ...formData, experience: opt })}
                />
                <div className="flex items-center justify-center p-3 rounded-2xl border border-slate-200 peer-checked:border-orange-500 peer-checked:bg-orange-500/5 text-slate-600 peer-checked:text-orange-500 transition-all">
                  {opt}
                </div>
              </label>
            ))}
          </div>
          <input 
            type="text" 
            placeholder="之前养过什么宠物？养了多久？" 
            value={formData.experienceDetail}
            onChange={(e) => setFormData({ ...formData, experienceDetail: e.target.value })}
            className="w-full rounded-2xl border-slate-200 h-12 px-4 focus:ring-orange-500 focus:border-orange-500" 
          />
        </section>

        <div className="pt-4">
          <button 
            type="submit" 
            disabled={submitting}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold py-4 rounded-2xl shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2"
          >
            {submitting ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <Send size={20} />
                提交领养申请
              </>
            )}
          </button>
          <p className="text-center text-slate-400 text-[10px] mt-4">
            提交即代表您同意我们的《宠物领养服务协议》
          </p>
        </div>
      </form>
    </div>
  );
};

const ProfilePage = ({ 
  onFavoritesClick, 
  onApplicationsClick,
  onSuccessfulClick,
  onSettingsClick 
}: { 
  onFavoritesClick: () => void, 
  onApplicationsClick: () => void,
  onSuccessfulClick: () => void,
  onSettingsClick: () => void
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [progress, setProgress] = useState<AdoptionProgress[]>([]);

  useEffect(() => {
    fetchUserProfile().then(setUser).catch(console.error);
    fetchApplications().then(setProgress).catch(console.error);
  }, []);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f7f6] pb-24">
      <header className="flex items-center justify-between px-6 py-4 bg-white sticky top-0 z-10 backdrop-blur-md">
        <h1 className="text-xl font-bold">个人中心</h1>
        <button 
          onClick={onSettingsClick}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-orange-50 transition-colors"
        >
          <Settings size={20} className="text-slate-700" />
        </button>
      </header>

      <section className="px-6 py-8 flex flex-col items-center">
        <div className="relative">
          <div className="w-28 h-28 rounded-full border-4 border-white shadow-xl overflow-hidden bg-orange-500/10">
            <img src={user.avatarUrl} alt="User" className="w-full h-full object-cover" />
          </div>
          <div className="absolute bottom-1 right-1 bg-orange-500 text-white p-1.5 rounded-full border-2 border-white shadow-md cursor-pointer hover:scale-110 transition-transform">
            <Edit2 size={12} />
          </div>
        </div>
        <h2 className="mt-4 text-2xl font-bold">{user.name}</h2>
        <p className="text-slate-500 text-sm mt-1">{user.role} · 已认证</p>
        
        <div className="flex gap-4 mt-8 w-full">
          {[
            { label: '我的收藏', value: user.stats.favorites, onClick: onFavoritesClick },
            { label: '申请记录', value: user.stats.applications, onClick: onApplicationsClick },
            { label: '领养成功', value: user.stats.successful, onClick: onSuccessfulClick },
          ].map((stat, i) => (
            <motion.div 
              key={i} 
              whileTap={{ scale: 0.95 }}
              onClick={stat.onClick}
              className="flex-1 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 text-center cursor-pointer hover:border-orange-200 transition-colors"
            >
              <p className="text-xl font-bold text-orange-500">{stat.value}</p>
              <p className="text-[10px] text-slate-500 mt-1 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">领养进度追踪</h3>
          <button 
            onClick={onApplicationsClick}
            className="text-orange-500 text-sm font-medium hover:underline"
          >
            查看全部
          </button>
        </div>
        {progress.map((prog, i) => (
          <motion.div 
            key={i} 
            whileTap={{ scale: 0.98 }}
            onClick={onApplicationsClick}
            className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm cursor-pointer hover:border-orange-100 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-100">
                <img src={prog.petImageUrl} alt={prog.petName} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-sm">{prog.petName} <span className="text-[10px] font-normal text-slate-500 ml-1">({prog.petBreed})</span></h4>
                  <span className="px-2 py-0.5 bg-orange-500/10 text-orange-500 text-[10px] rounded-full font-bold">{prog.status}</span>
                </div>
                <div className="mt-2 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${prog.progress}%` }}
                    className="bg-orange-500 h-full rounded-full" 
                  />
                </div>
                <p className="mt-2 text-[10px] text-slate-500 font-medium">{prog.currentStage}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </section>

      <section className="px-6 py-4 space-y-3">
        {[
          { icon: Heart, color: 'text-orange-500', bg: 'bg-orange-50', title: '我收藏的宠物', sub: '关注中意的毛孩子动态', onClick: onFavoritesClick },
          { icon: ClipboardList, color: 'text-blue-500', bg: 'bg-blue-50', title: '领养申请记录', sub: '管理所有的申请进度', onClick: onApplicationsClick },
          { icon: ShieldCheck, color: 'text-green-500', bg: 'bg-green-50', title: '领养回访记录', sub: '上传宝贝的近况照片', onClick: () => alert('回访记录功能开发中') },
          { icon: HelpCircle, color: 'text-purple-500', bg: 'bg-purple-50', title: '帮助与反馈', sub: '领养政策及常见问题', onClick: () => alert('帮助中心开发中') },
        ].map((item, i) => (
          <motion.div 
            key={i} 
            whileTap={{ scale: 0.98 }}
            onClick={item.onClick}
            className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm cursor-pointer hover:bg-slate-50 transition-colors"
          >
            <div className={`w-10 h-10 rounded-full ${item.bg} flex items-center justify-center ${item.color}`}>
              <item.icon size={20} />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">{item.title}</p>
              <p className="text-[10px] text-slate-400">{item.sub}</p>
            </div>
            <ChevronRight size={16} className="text-slate-300" />
          </motion.div>
        ))}
      </section>
    </div>
  );
};

const FavoritesPage = ({ onPetClick }: { onPetClick: (pet: Pet) => void }) => {
  const [favoritePets, setFavoritePets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites()
      .then(setFavoritePets)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleUnfavorite = async (petId: string) => {
    try {
      await removeFavorite(petId);
      setFavoritePets(prev => prev.filter(p => p.id !== petId));
    } catch (err) {
      console.error('取消收藏失败:', err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f7f6] pb-24">
      <header className="flex items-center justify-between px-6 py-4 bg-white sticky top-0 z-10 backdrop-blur-md">
        <h1 className="text-xl font-bold">我的收藏</h1>
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-orange-50 transition-colors">
          <MoreHorizontal size={20} className="text-slate-700" />
        </button>
      </header>

      <main className="px-4 py-6 space-y-4">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        ) : favoritePets.length > 0 ? (
          favoritePets.map((pet) => (
            <motion.div 
              key={pet.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => onPetClick(pet)}
              className="flex gap-4 p-3 bg-white rounded-2xl shadow-sm items-center cursor-pointer"
            >
              <div className="size-24 rounded-xl overflow-hidden shrink-0">
                <img src={pet.imageUrl} alt={pet.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-base truncate">{pet.name}</h3>
                  <button 
                    className="text-orange-500" 
                    onClick={(e) => { e.stopPropagation(); handleUnfavorite(pet.id); }}
                  >
                    <Heart size={18} fill="currentColor" />
                  </button>
                </div>
                <p className="text-slate-500 text-sm">{pet.breed} • {pet.age}</p>
                <div className="flex items-center gap-1 text-slate-400 text-xs mt-2">
                  <Home size={12} />
                  <span>{pet.location}</span>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Heart size={48} strokeWidth={1} className="mb-4 opacity-20" />
            <p>暂无收藏的毛孩子</p>
          </div>
        )}
      </main>
    </div>
  );
};

const MessagePage = ({ onChatClick }: { onChatClick: (chat: Chat) => void }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChats()
      .then(setChats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f7f6] pb-24">
      <header className="flex items-center justify-between px-6 py-4 bg-white sticky top-0 z-10 backdrop-blur-md">
        <h1 className="text-xl font-bold">消息中心</h1>
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-orange-50 transition-colors">
          <Settings size={20} className="text-slate-700" />
        </button>
      </header>

      <main className="px-4 py-6 space-y-2">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        ) : chats.length > 0 ? (
          chats.map((chat) => (
            <motion.div 
              key={chat.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => onChatClick(chat)}
              className="flex gap-4 p-4 bg-white rounded-2xl shadow-sm items-center cursor-pointer hover:bg-slate-50 transition-colors"
            >
              <div className="size-14 rounded-full overflow-hidden shrink-0 border-2 border-orange-500/10">
                <img src={chat.petImageUrl} alt={chat.petName} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-bold text-base truncate">{chat.petName} 领养咨询</h3>
                  <span className="text-[10px] text-slate-400">{chat.lastMessageTime}</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-slate-500 text-xs truncate pr-4">{chat.lastMessage}</p>
                  {chat.unreadCount > 0 && (
                    <span className="bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <MessageCircle size={48} strokeWidth={1} className="mb-4 opacity-20" />
            <p>暂无消息</p>
          </div>
        )}
      </main>
    </div>
  );
};

const ChatView = ({ chat, onBack }: { chat: Chat, onBack: () => void }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages(chat.id)
      .then(setMessages)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [chat.id]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const text = input;
    setInput('');
    
    // 乐观更新
    const tempMessage: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
    };
    setMessages(prev => [...prev, tempMessage]);

    try {
      const savedMessage = await sendMessageApi(chat.id, text);
      // 用服务器返回的消息替换临时消息
      setMessages(prev => prev.map(m => m.id === tempMessage.id ? savedMessage : m));
    } catch (err) {
      console.error('发送失败:', err);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#f8f7f6] max-w-md mx-auto">
      <header className="flex items-center p-4 border-b border-slate-100 bg-white sticky top-0 z-10">
        <button onClick={onBack} className="text-slate-900 mr-4">
          <ArrowLeft size={24} />
        </button>
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full overflow-hidden border border-orange-500/10">
            <img src={chat.petImageUrl} alt={chat.petName} className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="font-bold text-sm">{chat.petName} 领养咨询</h2>
            <p className="text-[10px] text-green-500 flex items-center gap-1">
              <span className="size-1.5 bg-green-500 rounded-full" /> 在线
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                msg.isMe 
                  ? 'bg-orange-500 text-white rounded-tr-none' 
                  : 'bg-white text-slate-900 rounded-tl-none shadow-sm'
              }`}>
                {msg.text}
                <p className={`text-[8px] mt-1 ${msg.isMe ? 'text-white/70' : 'text-slate-400'}`}>
                  {msg.timestamp}
                </p>
              </div>
            </div>
          ))
        )}
      </main>

      <div className="p-4 bg-white border-t border-slate-100 pb-8">
        <div className="flex gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="输入消息..."
            className="flex-1 rounded-2xl border-slate-200 h-12 px-4 focus:ring-orange-500 focus:border-orange-500 text-sm"
          />
          <button 
            onClick={handleSend}
            className="size-12 bg-orange-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

const ApplicationsPage = ({ onBack, initialFilter = '全部' }: { onBack: () => void, initialFilter?: string }) => {
  const [filter, setFilter] = useState(initialFilter);
  const [applications, setApplications] = useState<AdoptionProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications()
      .then(setApplications)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);
  
  const filteredApplications = applications.filter(app => {
    if (filter === '全部') return true;
    return app.status === filter;
  });

  const tabs = ['全部', '审核中', '已通过'];

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f7f6] pb-24">
      <header className="flex flex-col bg-white sticky top-0 z-10 backdrop-blur-md border-b border-slate-100">
        <div className="flex items-center p-4">
          <button onClick={onBack} className="text-slate-900 mr-4">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">领养记录</h1>
        </div>
        <div className="flex px-4 pb-2 gap-6">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`pb-2 text-sm font-bold transition-colors relative ${
                filter === tab ? 'text-orange-500' : 'text-slate-400'
              }`}
            >
              {tab}
              {filter === tab && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-full"
                />
              )}
            </button>
          ))}
        </div>
      </header>

      <main className="px-4 py-6 space-y-4">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        ) : filteredApplications.length > 0 ? (
          filteredApplications.map((app) => (
            <motion.div 
              key={app.id}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-slate-100">
                  <img src={app.petImageUrl} alt={app.petName} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-base">{app.petName}</h4>
                      <p className="text-xs text-slate-500">{app.petBreed} · {app.date}</p>
                    </div>
                    <span className={`px-2 py-0.5 text-[10px] rounded-full font-bold ${
                      app.status === '审核中' ? 'bg-orange-500/10 text-orange-500' : 'bg-green-500/10 text-green-500'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                  <div className="mt-3 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${app.progress}%` }}
                      className={`${app.status === '审核中' ? 'bg-orange-500' : 'bg-green-500'} h-full rounded-full`} 
                    />
                  </div>
                  <p className="mt-2 text-[10px] text-slate-500 font-medium">{app.currentStage}</p>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <ClipboardList size={48} strokeWidth={1} className="mb-4 opacity-20" />
            <p>暂无相关记录</p>
          </div>
        )}
      </main>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [view, setView] = useState<ViewType>('landing');
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [appFilter, setAppFilter] = useState('全部');

  const navigateToDetail = (pet: Pet) => {
    setSelectedPet(pet);
    setView('detail');
  };

  const navigateToForm = () => {
    setView('form');
  };

  const navigateToChat = (chat: Chat) => {
    setSelectedChat(chat);
    setView('chat');
  };

  const navigateToApplications = (filter: string = '全部') => {
    setAppFilter(filter);
    setView('applications');
  };

  const handleFormSubmit = () => {
    alert('申请已提交！我们将尽快与您联系。');
    setView('discovery');
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen relative shadow-2xl overflow-hidden font-sans">
      <AnimatePresence mode="wait">
        <motion.div
          key={view + (selectedPet?.id || '') + (selectedChat?.id || '')}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="min-h-screen"
        >
          {view === 'landing' && <LandingPage onStart={() => setView('discovery')} />}
          {view === 'discovery' && <DiscoveryPage onPetClick={navigateToDetail} />}
          {view === 'detail' && selectedPet && (
            <PetDetailPage 
              pet={selectedPet} 
              onBack={() => setView('discovery')} 
              onApply={navigateToForm} 
            />
          )}
          {view === 'form' && selectedPet && (
            <ApplicationFormPage 
              pet={selectedPet} 
              onBack={() => setView('detail')} 
              onSubmit={handleFormSubmit} 
            />
          )}
          {view === 'profile' && (
            <ProfilePage 
              onFavoritesClick={() => setView('favorites')}
              onApplicationsClick={() => navigateToApplications('全部')}
              onSuccessfulClick={() => navigateToApplications('已通过')}
              onSettingsClick={() => alert('设置功能开发中')}
            />
          )}
          {view === 'favorites' && <FavoritesPage onPetClick={navigateToDetail} />}
          {view === 'applications' && <ApplicationsPage onBack={() => setView('profile')} initialFilter={appFilter} />}
          {view === 'message' && <MessagePage onChatClick={navigateToChat} />}
          {view === 'chat' && selectedChat && (
            <ChatView chat={selectedChat} onBack={() => setView('message')} />
          )}
        </motion.div>
      </AnimatePresence>

      {['discovery', 'profile', 'favorites', 'message', 'applications'].includes(view) && (
        <BottomNav activeView={view === 'applications' ? 'profile' : view} setView={setView} />
      )}
    </div>
  );
}
