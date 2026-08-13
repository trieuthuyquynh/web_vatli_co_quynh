import React, { useState } from 'react';
import { customGamesService } from '../../../services/customGamesService';
import { Lesson, CustomGame } from '../../../types';
import { Modal } from '../../../components/common/Modal';
import { Html5ZipUploader } from '../custom/Html5ZipUploader';
import { FileArchive, PlusCircle, CheckCircle2, AlertCircle } from 'lucide-react';

interface CreateHtml5ZipGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  lessons: Lesson[];
  teacherId: string;
  onCreated: (newGame: CustomGame) => void;
}

export const CreateHtml5ZipGameModal: React.FC<CreateHtml5ZipGameModalProps> = ({
  isOpen,
  onClose,
  lessons,
  teacherId,
  onCreated
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [lessonId, setLessonId] = useState(lessons[0]?.id || '');
  const [maxAttempts, setMaxAttempts] = useState<number>(-1);
  const [blobUrl, setBlobUrl] = useState<string>('');
  const [zipFileName, setZipFileName] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUnpacked = (url: string, fName: string) => {
    setBlobUrl(url);
    setZipFileName(fName);
    if (!title) {
      setTitle(fName.replace(/\.zip$/i, '').replace(/[-_]/g, ' '));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !blobUrl) {
      setError('Vui lòng tải lên file ZIP và đặt tên trò chơi!');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const created = await customGamesService.createCustomGame({
        title: title.trim(),
        description: description.trim() || `Trò chơi HTML5 được trích xuất từ file ${zipFileName}`,
        game_type: 'html5_zip',
        zip_blob_url: blobUrl,
        zip_file_name: zipFileName,
        teacher_id: teacherId,
        lesson_id: lessonId || undefined,
        max_attempts: maxAttempts,
        time_limit: 180,
        thumbnail_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
        game_config: {
          allowFullScreen: true,
          provider: 'html5'
        },
        is_active: true
      });

      onCreated(created);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Lỗi khi lưu trò chơi HTML5.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tải Lên Trò Chơi HTML5 (.ZIP)"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* JSZip Unpacker */}
        <Html5ZipUploader onUnpacked={handleUnpacked} />

        {blobUrl && (
          <div className="space-y-4 animate-fade-in pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tên Trò Chơi <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="VD: Game Bắn Thiên Thạch: Thuyết Động Học Khí 12"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Gắn với Bài Học SGK
                </label>
                <select
                  value={lessonId}
                  onChange={(e) => setLessonId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-800 focus:outline-none focus:border-sky-500"
                >
                  {lessons.map(l => (
                    <option key={l.id} value={l.id}>
                      Bài {l.number}: {l.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Giới Hạn Lượt Chơi Tính Điểm (GAME-06)
                </label>
                <select
                  value={maxAttempts}
                  onChange={(e) => setMaxAttempts(parseInt(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-800 focus:outline-none focus:border-sky-500"
                >
                  <option value={-1}>Không giới hạn (Tự do)</option>
                  <option value={1}>Tối đa 1 lần</option>
                  <option value={2}>Tối đa 2 lần</option>
                  <option value={3}>Tối đa 3 lần</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mô Tả Trò Chơi
              </label>
              <input
                type="text"
                placeholder="Hướng dẫn học sinh cách điều khiển, phím bấm..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-800 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>
        )}

        <div className="pt-2 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
          >
            Hủy Bỏ
          </button>

          <button
            type="submit"
            disabled={loading || !blobUrl}
            className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-sm transition flex items-center gap-1.5 disabled:opacity-50"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{loading ? 'Đang lưu...' : 'Xuất Bản Game HTML5'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
