import React, { useState } from 'react';
import { customGamesService } from '../../../services/customGamesService';
import { Lesson, CustomGame } from '../../../types';
import { Modal } from '../../../components/common/Modal';
import { Globe, PlusCircle, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

interface CreateEmbedGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  lessons: Lesson[];
  teacherId: string;
  onCreated: (newGame: CustomGame) => void;
}

export const CreateEmbedGameModal: React.FC<CreateEmbedGameModalProps> = ({
  isOpen,
  onClose,
  lessons,
  teacherId,
  onCreated
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [embedInput, setEmbedInput] = useState('');
  const [lessonId, setLessonId] = useState(lessons[0]?.id || '');
  const [maxAttempts, setMaxAttempts] = useState<number>(-1);
  const [timeLimit, setTimeLimit] = useState<number>(180);
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Trích xuất src nếu giáo viên dán cả thẻ <iframe ...>
  const extractUrl = (input: string) => {
    const trimmed = input.trim();
    if (trimmed.includes('<iframe')) {
      const match = trimmed.match(/src=["']([^"']+)["']/);
      return match ? match[1] : trimmed;
    }
    return trimmed;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !embedInput.trim()) {
      setError('Vui lòng nhập tên trò chơi và link Embed!');
      return;
    }

    const cleanUrl = extractUrl(embedInput);
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      setError('Đường dẫn Embed không hợp lệ (phải bắt đầu bằng https://)!');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const created = await customGamesService.createCustomGame({
        title: title.trim(),
        description: description.trim(),
        game_type: 'iframe',
        embed_url: cleanUrl,
        teacher_id: teacherId,
        lesson_id: lessonId || undefined,
        max_attempts: maxAttempts,
        time_limit: timeLimit,
        thumbnail_url: thumbnailUrl.trim() || 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=80',
        game_config: {
          allowFullScreen: true,
          provider: cleanUrl.includes('wordwall') ? 'wordwall' : cleanUrl.includes('quizizz') ? 'quizizz' : cleanUrl.includes('phet') ? 'phet' : 'custom'
        },
        is_active: true
      });

      onCreated(created);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Lỗi khi tạo trò chơi nhúng.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nhúng Trò Chơi Ngoại Bằng (Wordwall, Quizizz, PhET, Canva...)"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Tên Trò Chơi <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            placeholder="VD: Wordwall: Ghép Nối Khái Niệm Nhiệt Học 12"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Link Embed hoặc Thẻ Mã iframe <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={2}
            placeholder="Dán link Embed hoặc toàn bộ mã <iframe src='...'></iframe> từ Wordwall, Quizizz, Kahoot..."
            value={embedInput}
            onChange={(e) => setEmbedInput(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white font-mono text-xs text-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
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
              <option value={1}>Tối đa 1 lần chơi tính điểm</option>
              <option value={2}>Tối đa 2 lần chơi tính điểm</option>
              <option value={3}>Tối đa 3 lần chơi tính điểm</option>
              <option value={5}>Tối đa 5 lần chơi tính điểm</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Mô Tả Hướng Dẫn Trò Chơi
          </label>
          <input
            type="text"
            placeholder="Hướng dẫn ngắn cho học sinh khi tham gia chơi..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-800 focus:outline-none focus:border-sky-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Link Ảnh Thumbnail Minh Họa (Tùy chọn)
          </label>
          <input
            type="url"
            placeholder="https://images.unsplash.com/..."
            value={thumbnailUrl}
            onChange={(e) => setThumbnailUrl(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs font-mono text-slate-700 focus:outline-none focus:border-sky-500"
          />
        </div>

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
            disabled={loading}
            className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-sm transition flex items-center gap-1.5 disabled:opacity-50"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{loading ? 'Đang xuất bản...' : 'Xuất Bản Game Nhúng'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
