import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { classesService } from '../../services/classesService';
import { Modal } from '../../components/common/Modal';
import { Users, Plus, AlertCircle } from 'lucide-react';

interface CreateClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateClassModal: React.FC<CreateClassModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('12');
  const [schoolYear, setSchoolYear] = useState('2025-2026');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Vui lòng nhập tên lớp học.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await classesService.createClass({
        name: name.trim(),
        grade,
        school_year: schoolYear,
        teacher_id: user?.id || 'teacher-quynh',
        description: description.trim(),
      });

      setName('');
      setDescription('');
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Lỗi khi tạo lớp học.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tạo Lớp Học Vật Lí 12 Mới">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-300 uppercase">
            Tên lớp học *
          </label>
          <input
            type="text"
            required
            placeholder="VD: 12A1 - Chuyên Đề Ôn Thi Tốt Nghiệp THPT"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-300 uppercase">
              Khối lớp
            </label>
            <input
              type="text"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-300 uppercase">
              Năm học
            </label>
            <input
              type="text"
              value={schoolYear}
              onChange={(e) => setSchoolYear(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-300 uppercase">
            Mô tả / Thông báo cho học sinh
          </label>
          <textarea
            rows={3}
            placeholder="VD: Lớp dành cho các bạn ôn luyện kiến thức Vật Lí 12 KNTT và thi đấu game hàng tuần..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-none"
          />
        </div>

        <p className="text-[11px] text-cyan-400">
          💡 Hệ thống sẽ tự động tạo một Mã Lớp (Class Code) ngẫu nhiên 6 ký tự để thầy cô gửi cho học sinh tham gia.
        </p>

        <div className="pt-2 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-800 transition"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20 transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>{isSubmitting ? 'Đang tạo...' : 'Tạo Lớp'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
