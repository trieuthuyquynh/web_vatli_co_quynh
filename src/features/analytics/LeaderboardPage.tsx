import React, { useState, useEffect } from 'react';
import { gamesService } from '../../services/gamesService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Trophy, Flame, Zap, Award, Medal, Crown } from 'lucide-react';

export const LeaderboardPage: React.FC = () => {
  const [leaders, setLeaders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    gamesService.getLeaderboard().then((data) => {
      setLeaders(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-10 pb-16 max-w-4xl mx-auto">
      {/* Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black bg-amber-50 text-amber-800 border border-amber-200">
          <Trophy className="w-4 h-4 text-amber-600" /> Bảng Vinh Danh Vật Lí 12 KNTT
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Bảng Xếp Hạng Toàn Hệ Thống
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
          Tích lũy điểm kinh nghiệm (XP) qua mỗi lượt giải trắc nghiệm, đúng sai và nối từ để thăng hạng và giành cúp vinh dự.
        </p>
      </div>

      {loading ? (
        <LoadingSpinner text="Đang tổng hợp bảng xếp hạng..." />
      ) : (
        <div className="space-y-8">
          
          {/* Top 3 Podium (Cột vinh quang) */}
          {leaders.length >= 3 && (
            <div className="grid grid-cols-3 gap-3 sm:gap-6 items-end pt-8 pb-4">
              
              {/* Rank 2 (Bạc) */}
              <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 text-center space-y-2 order-1 shadow-soft">
                <div className="relative inline-block">
                  <img
                    src={leaders[1]?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${leaders[1]?.full_name}`}
                    alt={leaders[1]?.full_name}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full mx-auto border-2 border-slate-300 object-cover"
                  />
                  <span className="absolute -bottom-2 inset-x-0 mx-auto w-6 h-6 rounded-full bg-slate-200 text-slate-800 font-black text-xs flex items-center justify-center border border-slate-300 shadow-xs">
                    2
                  </span>
                </div>
                <div className="pt-2">
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate">{leaders[1]?.full_name}</h4>
                  <p className="text-[10px] text-slate-500 truncate">{leaders[1]?.school || 'THPT'}</p>
                </div>
                <div className="text-sky-700 font-black text-xs sm:text-sm">
                  {leaders[1]?.xp} XP
                </div>
              </div>

              {/* Rank 1 (Vàng - Cao nhất) */}
              <div className="p-5 sm:p-6 rounded-3xl bg-white border-2 border-amber-400 text-center space-y-3 order-2 shadow-card-hover -translate-y-4">
                <Crown className="w-8 h-8 text-amber-500 mx-auto animate-bounce" />
                <div className="relative inline-block">
                  <img
                    src={leaders[0]?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${leaders[0]?.full_name}`}
                    alt={leaders[0]?.full_name}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto border-4 border-amber-400 object-cover shadow-sm"
                  />
                  <span className="absolute -bottom-2 inset-x-0 mx-auto w-7 h-7 rounded-full bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center shadow-xs">
                    1
                  </span>
                </div>
                <div className="pt-1">
                  <h4 className="font-extrabold text-amber-800 text-sm sm:text-base truncate">{leaders[0]?.full_name}</h4>
                  <p className="text-[11px] text-slate-500 truncate">{leaders[0]?.school || 'THPT'}</p>
                </div>
                <div className="text-amber-600 font-black text-sm sm:text-base">
                  {leaders[0]?.xp} XP
                </div>
              </div>

              {/* Rank 3 (Đồng) */}
              <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 text-center space-y-2 order-3 shadow-soft">
                <div className="relative inline-block">
                  <img
                    src={leaders[2]?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${leaders[2]?.full_name}`}
                    alt={leaders[2]?.full_name}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full mx-auto border-2 border-amber-700/50 object-cover"
                  />
                  <span className="absolute -bottom-2 inset-x-0 mx-auto w-6 h-6 rounded-full bg-amber-800 text-white font-black text-xs flex items-center justify-center shadow-xs">
                    3
                  </span>
                </div>
                <div className="pt-2">
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate">{leaders[2]?.full_name}</h4>
                  <p className="text-[10px] text-slate-500 truncate">{leaders[2]?.school || 'THPT'}</p>
                </div>
                <div className="text-sky-700 font-black text-xs sm:text-sm">
                  {leaders[2]?.xp} XP
                </div>
              </div>

            </div>
          )}

          {/* Full List Table */}
          <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-soft">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-bold text-[11px]">
                <tr>
                  <th className="px-5 py-3.5 text-center w-16">Hạng</th>
                  <th className="px-5 py-3.5">Học Sinh</th>
                  <th className="px-5 py-3.5 hidden sm:table-cell">Trường THPT</th>
                  <th className="px-5 py-3.5 text-center">Chuỗi Ngày</th>
                  <th className="px-5 py-3.5 text-right">Tổng XP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {leaders.map((u, index) => (
                  <tr key={u.id || index} className="hover:bg-slate-50/70 transition">
                    <td className="px-5 py-3.5 text-center font-black">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                    </td>
                    <td className="px-5 py-3.5 flex items-center gap-3">
                      <img
                        src={u.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${u.full_name}`}
                        alt={u.full_name}
                        className="w-8 h-8 rounded-full border border-sky-200"
                      />
                      <span className="font-bold text-slate-900 text-sm">{u.full_name}</span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 hidden sm:table-cell">
                      {u.school || 'THPT Kết Nối Tri Thức'}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className="inline-flex items-center gap-1 text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 text-[11px]">
                        <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        {u.streak || 1} ngày
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <span className="inline-flex items-center gap-1 text-sky-700 font-black text-sm">
                        <Zap className="w-3.5 h-3.5 fill-sky-600 text-sky-600" />
                        {u.xp || 0} XP
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}
    </div>
  );
};

