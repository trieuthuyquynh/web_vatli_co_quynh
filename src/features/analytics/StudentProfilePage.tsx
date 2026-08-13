import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { profileService } from '../../services/profileService';
import { gamesService } from '../../services/gamesService';
import { Badge, GameAttempt } from '../../types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { 
  User, 
  Flame, 
  Zap, 
  Award, 
  Trophy, 
  Clock, 
  CheckCircle2, 
  Compass, 
  Atom, 
  Layers
} from 'lucide-react';

export const StudentProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [attempts, setAttempts] = useState<GameAttempt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfileData() {
      if (!user) return;
      setLoading(true);
      try {
        const [bList, aList] = await Promise.all([
          profileService.getBadges(user.id),
          gamesService.getStudentAttempts(user.id)
        ]);
        setBadges(bList);
        setAttempts(aList);
      } finally {
        setLoading(false);
      }
    }
    loadProfileData();
  }, [user]);

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flame': return <Flame className="w-6 h-6 text-amber-400" />;
      case 'Atom': return <Atom className="w-6 h-6 text-emerald-400" />;
      case 'Trophy': return <Trophy className="w-6 h-6 text-yellow-400" />;
      case 'Zap': return <Zap className="w-6 h-6 text-cyan-400" />;
      default: return <Compass className="w-6 h-6 text-blue-400" />;
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      
      {/* Profile Header Card */}
      <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-soft flex flex-col sm:flex-row items-center gap-6">
        <img
          src={user.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.full_name}`}
          alt={user.full_name}
          className="w-24 h-24 rounded-full border-4 border-sky-100 object-cover shadow-sm"
        />

        <div className="space-y-2 text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">{user.full_name}</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-sky-50 text-sky-800 border border-sky-200 uppercase">
              {user.role}
            </span>
          </div>

          <p className="text-xs text-slate-600">{user.email} • {user.school || 'THPT Kết Nối Tri Thức'}</p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 font-bold text-xs">
              <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>Chuỗi {user.streak || 1} ngày</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-sky-50 border border-sky-200 text-sky-800 font-bold text-xs">
              <Zap className="w-4 h-4 fill-sky-600 text-sky-600" />
              <span>{user.xp || 0} XP Tích Lũy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Badges Collection */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          <span>Bộ Sưu Tập Huy Hiệu Vật Lí</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {badges.map((b) => (
            <div
              key={b.id}
              className={`p-4 rounded-2xl border text-center space-y-2 transition ${
                b.unlocked !== false
                  ? 'bg-white border-slate-200 shadow-soft'
                  : 'bg-slate-50 border-slate-200 opacity-50 grayscale'
              }`}
            >
              <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center">
                {getBadgeIcon(b.icon)}
              </div>
              <h5 className="text-xs font-bold text-slate-900 truncate">{b.title}</h5>
              <p className="text-[10px] text-slate-500 line-clamp-2">{b.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Attempts History */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Clock className="w-5 h-5 text-sky-600" />
          <span>Lịch Sử Làm Bài & Kết Quả ({attempts.length} lượt)</span>
        </h3>

        {attempts.length === 0 ? (
          <div className="p-8 text-center rounded-3xl bg-white border border-slate-200 shadow-soft text-xs text-slate-500">
            Bạn chưa tham gia trò chơi nào. Hãy vào Đấu Trường Game để thử sức nhé!
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-soft">
            <div className="divide-y divide-slate-100">
              {attempts.map((att) => (
                <div key={att.id} className="p-4 sm:p-5 flex items-center justify-between gap-3 text-xs hover:bg-slate-50/70 transition">
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-900 text-sm">
                      {att.lessons?.title || 'Luyện tập tổng hợp Vật Lí 12'}
                    </div>
                    <div className="text-slate-500 text-[11px]">
                      {att.created_at ? new Date(att.created_at).toLocaleDateString('vi-VN') : 'Vừa xong'} • Thời gian: {att.time_spent}s
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-black text-sm text-sky-700">{att.score} / 10 điểm</div>
                      <div className="text-[10px] text-slate-500">{att.correct_count}/{att.total_questions} câu đúng</div>
                    </div>
                    <span className="px-2.5 py-1 rounded-xl bg-sky-50 text-sky-800 border border-sky-200 font-black text-xs">
                      +{att.xp_earned} XP
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

