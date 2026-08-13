import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { classesService } from '../../services/classesService';
import { Modal } from '../../components/common/Modal';
import { LogIn, Key, AlertCircle, CheckCircle2 } from 'lucide-react';

interface JoinClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const JoinClassModal: React.FC<JoinClassModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { user } = useAuth();
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setError('Vui lòng nhập mã lớp học.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const joinedClass = await classesService.joinClassByCode(
        code.trim(),
        user?.id || 'student-an'
      );
      setSuccessMsg(`Bạn đã tham gia thành công lớp: ${joinedClass.name}`);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Mã lớp không hợp lệ hoặc đã tham gia trước đó.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tham Gia Lớp Học Vật Lí 12">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-700 uppercase">
            Nhập Mã Tham Gia Lớp (Class Code) *
          </label>
          <div className="relative">
            <input
              type="text"
              required
              placeholder="VD: VATLI12A1 hoặc VL12-XXXXX"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-slate-50 border border-slate-200 text-base text-sky-700 font-mono tracking-widest placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 uppercase font-black"
            />
            <Key className="w-5 h-5 text-slate-400 absolute left-3 top-3.5" />
          </div>
          <p className="text-[11px] text-slate-500">
            Xin mã lớp từ Cô Quỳnh hoặc giáo viên bộ môn Vật Lí của bạn.
          </p>
        </div>

        <div className="pt-2 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition"
          >
            Đóng
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white shadow-sm transition flex items-center gap-2 active:scale-95"
          >
            <LogIn className="w-4 h-4" />
            <span>{isSubmitting ? 'Đang kiểm tra...' : 'Tham Gia Lớp'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

