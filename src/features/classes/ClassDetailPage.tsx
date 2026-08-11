import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { classesService } from '../../services/classesService';
import { ClassMember } from '../../types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { 
  Users, 
  ArrowLeft, 
  Trophy, 
  Flame, 
  Zap, 
  Gamepad2, 
  UserCheck, 
  Award,
  Search
} from 'lucide-react';

export const ClassDetailPage: React.FC = () => {
  const { classId } = useParams<{ classId: string }>();
  const [members, setMembers] = useState<ClassMember[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function loadMembers() {
      if (!classId) return;
      setLoading(true);
      try {
        const list = await classesService.getClassMembers(classId);
        setMembers(list);
      } finally {
        setLoading(false);
      }
    }
    loadMembers();
  }, [classId]);

  const filteredMembers = members.filter(m => 
    m.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Back button */}
      <div>
        <Link
          to="/classes"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại danh sách lớp
        </Link>
      </div>

      {/* Header */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              Chi Tiết Lớp Học
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Danh Sách & Bảng Điểm Học Sinh
          </h1>
          <p className="text-xs text-slate-400">
            Tổng cộng {members.length} học sinh đang tham gia lớp học
          </p>
        </div>

        <Link
          to="/games"
          className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20 transition shrink-0"
        >
          <Gamepad2 className="w-4 h-4" />
          <span>Giao Đề Game Cho Lớp</span>
        </Link>
      </div>

      {/* Search & List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <input
              type="text"
              placeholder="Tìm kiếm học sinh theo tên hoặc email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          </div>
        </div>

        {loading ? (
          <LoadingSpinner text="Đang tải danh sách học sinh..." />
        ) : filteredMembers.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-900/50 border border-slate-800 text-xs text-slate-400">
            Chưa có học sinh nào trong lớp hoặc không tìm thấy kết quả phù hợp.
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase font-bold text-[11px]">
                <tr>
                  <th className="px-5 py-3.5">Học Sinh</th>
                  <th className="px-5 py-3.5">Email</th>
                  <th className="px-5 py-3.5 text-center">Chuỗi Học</th>
                  <th className="px-5 py-3.5 text-right">Điểm XP</th>
                  <th className="px-5 py-3.5 text-center">Trạng Thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-200">
                {filteredMembers.map((m, idx) => (
                  <tr key={m.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-5 py-3.5 flex items-center gap-3">
                      <span className="font-bold text-slate-500 w-4">{idx + 1}</span>
                      <img
                        src={m.profiles?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${m.profiles?.full_name}`}
                        alt={m.profiles?.full_name}
                        className="w-8 h-8 rounded-full border border-cyan-500/30"
                      />
                      <span className="font-bold text-white text-sm">
                        {m.profiles?.full_name || 'Học sinh'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-400 font-mono">
                      {m.profiles?.email || 'Chưa cập nhật'}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        <Flame className="w-3.5 h-3.5 fill-amber-400" />
                        {m.profiles?.streak || 1} ngày
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <span className="inline-flex items-center gap-1 text-cyan-400 font-black text-sm">
                        <Zap className="w-3.5 h-3.5 fill-cyan-400" />
                        {m.profiles?.xp || 0} XP
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <UserCheck className="w-3 h-3" /> Đang học
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
