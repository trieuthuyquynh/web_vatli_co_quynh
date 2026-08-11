import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { classesService } from '../../services/classesService';
import { Class } from '../../types';
import { CreateClassModal } from './CreateClassModal';
import { JoinClassModal } from './JoinClassModal';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { 
  Users, 
  Plus, 
  Key, 
  Copy, 
  Check, 
  GraduationCap, 
  School, 
  ArrowRight, 
  BookOpen,
  Calendar
} from 'lucide-react';

export const ClassManagerPage: React.FC = () => {
  const { user, role } = useAuth();
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const isTeacher = role === 'teacher' || role === 'admin';

  const loadClasses = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const list = await classesService.getClasses(user.id, role || 'student');
      setClasses(list);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClasses();
  }, [user, role]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
            <Users className="w-3.5 h-3.5" /> Quản Lý Lớp Học & Học Sinh
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
            {isTeacher ? 'Các Lớp Học Giảng Dạy' : 'Các Lớp Bạn Đã Tham Gia'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            {isTeacher
              ? 'Tạo lớp, cung cấp mã mời cho học sinh, theo dõi bảng điểm và giao đề trò chơi ôn tập'
              : 'Theo dõi thông báo lớp học, tài liệu và các phòng thi đấu do giáo viên tổ chức'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          {isTeacher ? (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Tạo Lớp Học Mới</span>
            </button>
          ) : (
            <button
              onClick={() => setIsJoinModalOpen(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white shadow-lg shadow-amber-500/20 transition"
            >
              <Key className="w-4 h-4" />
              <span>Nhập Mã Tham Gia Lớp</span>
            </button>
          )}
        </div>
      </div>

      {/* Classes Grid */}
      {loading ? (
        <LoadingSpinner text="Đang tải danh sách lớp học..." />
      ) : classes.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
          <School className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-slate-300">
            {isTeacher ? 'Bạn chưa tạo lớp học nào' : 'Bạn chưa tham gia lớp học nào'}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {isTeacher
              ? 'Hãy bấm nút "Tạo Lớp Học Mới" để tạo lớp và chia sẻ mã lớp cho học sinh.'
              : 'Hãy bấm "Nhập Mã Tham Gia Lớp" và điền mã lớp từ Cô Quỳnh.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((c) => (
            <div
              key={c.id}
              className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/80 transition-all duration-200 flex flex-col justify-between space-y-5 shadow-lg"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                    Khối {c.grade || '12'} • {c.school_year || '2025-2026'}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-slate-400 font-semibold">
                    <Users className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{c.member_count || 0} học sinh</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white hover:text-cyan-300 transition">
                    {c.name}
                  </h3>
                  {c.description && (
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
                      {c.description}
                    </p>
                  )}
                </div>

                {/* Class Code Box (for teacher to share) */}
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Mã Tham Gia Lớp</span>
                    <span className="text-sm font-mono font-black text-cyan-400 tracking-wider">
                      {c.code}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopyCode(c.code)}
                    title="Sao chép mã lớp"
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1 text-xs"
                  >
                    {copiedCode === c.code ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-[10px] text-emerald-400">Đã chép</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span className="text-[10px]">Chép mã</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <Link
                  to={`/classes/${c.id}`}
                  className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition"
                >
                  <span>Xem Danh Sách & Bảng Điểm</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <CreateClassModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={loadClasses}
      />
      <JoinClassModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        onSuccess={loadClasses}
      />
    </div>
  );
};
