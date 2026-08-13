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
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-sky-700 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại danh sách lớp
        </Link>
      </div>

      {/* Header */}
      <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-sky-50 text-sky-800 border border-sky-200">
              Chi Tiết Lớp Học
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Danh Sách & Bảng Điểm Học Sinh
          </h1>
          <p className="text-xs text-slate-600">
            Tổng cộng {members.length} học sinh đang tham gia lớp học
          </p>
        </div>

        <Link
          to="/games"
          className="flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs bg-sky-600 hover:bg-sky-500 text-white shadow-md shadow-sky-600/20 transition shrink-0 active:scale-95"
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
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-xs"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>
        </div>

        {loading ? (
          <LoadingSpinner text="Đang tải danh sách học sinh..." />
        ) : filteredMembers.length === 0 ? (
          <div className="p-8 text-center rounded-3xl bg-white border border-slate-200 shadow-soft text-xs text-slate-500">
            Chưa có học sinh nào trong lớp hoặc không tìm thấy kết quả phù hợp.
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-soft">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-bold text-[11px]">
                <tr>
                  <th className="px-5 py-3.5">Học Sinh</th>
                  <th className="px-5 py-3.5">Email</th>
                  <th className="px-5 py-3.5 text-center">Chuỗi Học</th>
                  <th className="px-5 py-3.5 text-right">Điểm XP</th>
                  <th className="px-5 py-3.5 text-center">Trạng Thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredMembers.map((m, idx) => (
                  <tr key={m.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-5 py-3.5 flex items-center gap-3">
                      <span className="font-bold text-slate-400 w-4">{idx + 1}</span>
                      <img
                        src={m.profiles?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${m.profiles?.full_name}`}
                        alt={m.profiles?.full_name}
                        className="w-8 h-8 rounded-full border border-sky-200"
                      />
                      <span className="font-bold text-slate-900 text-sm">
                        {m.profiles?.full_name || 'Học sinh'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 font-mono">
                      {m.profiles?.email || 'Chưa cập nhật'}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        {m.profiles?.streak || 1} ngày
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <span className="inline-flex items-center gap-1 text-sky-700 font-black text-sm">
                        <Zap className="w-3.5 h-3.5 fill-sky-600 text-sky-600" />
                        {m.profiles?.xp || 0} XP
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
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

