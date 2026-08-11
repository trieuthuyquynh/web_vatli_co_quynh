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
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-300 uppercase">
            Nhập Mã Tham Gia Lớp (Class Code) *
          </label>
          <div className="relative">
            <input
              type="text"
              required
              placeholder="VD: VATLI12A1 hoặc VL12-XXXXX"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-slate-900 border border-slate-700 text-base text-cyan-300 font-mono tracking-widest placeholder-slate-500 focus:outline-none focus:border-cyan-500 uppercase"
            />
            <Key className="w-5 h-5 text-slate-500 absolute left-3 top-3.5" />
          </div>
          <p className="text-[11px] text-slate-400">
            Xin mã lớp từ Cô Quỳnh hoặc giáo viên bộ môn Vật Lí của bạn.
          </p>
        </div>

        <div className="pt-2 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-800 transition"
          >
            Đóng
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20 transition flex items-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>{isSubmitting ? 'Đang kiểm tra...' : 'Tham Gia Lớp'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
