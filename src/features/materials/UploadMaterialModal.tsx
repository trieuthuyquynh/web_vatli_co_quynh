import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { materialsService } from '../../services/materialsService';
import { curriculumService } from '../../services/curriculumService';
import { Lesson, MaterialType } from '../../types';
import { Modal } from '../../components/common/Modal';
import { Upload, FileText, Video, Presentation, Link as LinkIcon, AlertCircle } from 'lucide-react';

interface UploadMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const UploadMaterialModal: React.FC<UploadMaterialModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { user } = useAuth();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [title, setTitle] = useState('');
  const [lessonId, setLessonId] = useState('');
  const [type, setType] = useState<MaterialType>('pdf');
  const [fileUrl, setFileUrl] = useState('');
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      curriculumService.getLessonsByChapter().then(setLessons);
      setError(null);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !fileUrl.trim()) {
      setError('Vui lòng điền đầy đủ Tiêu đề và Đường dẫn tài liệu / file.');
      return;
    }

    setIsUploading(true);
    setError(null);
    try {
      await materialsService.createMaterial({
        title: title.trim(),
        lesson_id: lessonId || undefined,
        teacher_id: user?.id || 'teacher-quynh',
        type,
        file_url: fileUrl.trim(),
        description: description.trim(),
        is_public: true,
      });

      setTitle('');
      setFileUrl('');
      setDescription('');
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Lỗi khi tải lên học liệu.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tải Lên Học Liệu Vật Lí Mới">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Title */}
        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-700 uppercase">
            Tiêu đề học liệu *
          </label>
          <input
            type="text"
            required
            placeholder="VD: Sơ đồ tư duy Định luật bảo toàn năng lượng & Định luật 1"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
          />
        </div>

        {/* Lesson & Type selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 uppercase">
              Bài học liên quan
            </label>
            <select
              value={lessonId}
              onChange={(e) => setLessonId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            >
              <option value="">-- Dành cho toàn bộ môn học --</option>
              {lessons.map((ls) => (
                <option key={ls.id} value={ls.id}>
                  Bài {ls.number}: {ls.title}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 uppercase">
              Định dạng học liệu
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as MaterialType)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            >
              <option value="pdf">Tài liệu PDF / Tóm tắt</option>
              <option value="slide">Slide Bài Giảng Trình Chiếu</option>
              <option value="video">Video Thí Nghiệm / Mô Phỏng PhET</option>
              <option value="doc">Tài Liệu Ôn Tập Word/Doc</option>
            </select>
          </div>
        </div>

        {/* File URL or PhET simulation link */}
        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-700 uppercase flex items-center justify-between">
            <span>Đường dẫn File / Link Mô phỏng Thí nghiệm *</span>
            <span className="text-[11px] text-sky-700 font-medium">Hỗ trợ link PhET, Drive, PDF online</span>
          </label>
          <div className="relative">
            <input
              type="url"
              required
              placeholder="https://..."
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-mono"
            />
            <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-700 uppercase">
            Mô tả ngắn gọn & Hướng dẫn học sinh
          </label>
          <textarea
            rows={3}
            placeholder="VD: Học sinh xem video mô phỏng trước khi tham gia trò chơi nối từ định luật Boyle..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 resize-none"
          />
        </div>

        {/* Submit */}
        <div className="pt-2 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            disabled={isUploading}
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white shadow-sm transition flex items-center gap-2 active:scale-95"
          >
            <Upload className="w-4 h-4" />
            <span>{isUploading ? 'Đang lưu...' : 'Lưu Học Liệu'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

