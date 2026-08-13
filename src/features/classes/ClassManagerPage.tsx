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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-sky-50 text-sky-800 border border-sky-200">
            <Users className="w-3.5 h-3.5 text-sky-600" /> Quản Lý Lớp Học & Học Sinh
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {isTeacher ? 'Các Lớp Học Giảng Dạy' : 'Các Lớp Bạn Đã Tham Gia'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
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
              className="flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs bg-sky-600 hover:bg-sky-500 text-white shadow-md shadow-sky-600/20 transition active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Tạo Lớp Học Mới</span>
            </button>
          ) : (
            <button
              onClick={() => setIsJoinModalOpen(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-600/20 transition active:scale-95"
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
        <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 shadow-soft space-y-4">
          <School className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">
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
              className="p-6 rounded-3xl bg-white border border-slate-200/90 hover:border-sky-300 hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between space-y-5 shadow-soft"
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-xl text-xs font-black bg-sky-50 text-sky-800 border border-sky-200">
                    Khối {c.grade || '12'} • {c.school_year || '2025-2026'}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
                    <Users className="w-3.5 h-3.5 text-sky-600" />
                    <span>{c.member_count || 0} học sinh</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 hover:text-sky-700 transition leading-snug">
                    {c.name}
                  </h3>
                  {c.description && (
                    <p className="text-xs text-slate-600 line-clamp-2 mt-1.5 leading-relaxed">
                      {c.description}
                    </p>
                  )}
                </div>

                {/* Class Code Box (for teacher to share) */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-black text-slate-400 block tracking-wider">Mã Tham Gia Lớp</span>
                    <span className="text-sm font-mono font-black text-sky-700 tracking-wider">
                      {c.code}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopyCode(c.code)}
                    title="Sao chép mã lớp"
                    className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 shadow-xs transition flex items-center gap-1 text-xs"
                  >
                    {copiedCode === c.code ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-[10px] font-bold text-emerald-600">Đã chép</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-600" />
                        <span className="text-[10px] font-bold">Chép mã</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <Link
                  to={`/classes/${c.id}`}
                  className="flex items-center gap-1.5 text-xs font-bold text-sky-700 hover:text-sky-800 transition"
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
