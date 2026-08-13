import React, { useState } from 'react';
import { customGamesService } from '../../../services/customGamesService';
import { Lesson, CustomGame, CustomGameType, MemoryCardPair, CrosswordWord } from '../../../types';
import { Modal } from '../../../components/common/Modal';
import { Sparkles, PlusCircle, Trash2, CheckCircle2, AlertCircle, Layers, Grid, RotateCw } from 'lucide-react';

interface CreateMiniGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  lessons: Lesson[];
  teacherId: string;
  onCreated: (newGame: CustomGame) => void;
}

export const CreateMiniGameModal: React.FC<CreateMiniGameModalProps> = ({
  isOpen,
  onClose,
  lessons,
  teacherId,
  onCreated
}) => {
  const [gameType, setGameType] = useState<CustomGameType>('memory_card');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [lessonId, setLessonId] = useState(lessons[0]?.id || '');
  const [maxAttempts, setMaxAttempts] = useState<number>(-1);
  const [timeLimit, setTimeLimit] = useState<number>(120);

  // Form pairs for Memory Card
  const [pairs, setPairs] = useState<MemoryCardPair[]>([
    { id: 'p1', term: 'Định luật Boyle', formulaOrDef: 'p_1 V_1 = p_2 V_2' },
    { id: 'p2', term: 'Định luật Charles', formulaOrDef: '\\frac{V_1}{T_1} = \\frac{V_2}{T_2}' },
    { id: 'p3', term: 'Nhiệt lượng tỏa/thu', formulaOrDef: 'Q = mc\\Delta T' },
    { id: 'p4', term: 'Nhiệt nóng chảy riêng', formulaOrDef: 'Q = \\lambda m' }
  ]);

  // Form words for Crossword
  const [words, setWords] = useState<CrosswordWord[]>([
    { id: 'w1', clue: 'Năng lượng chuyển động nhiệt của các phân tử trong vật', answer: 'NOINANG', displayTerm: 'NỘI NĂNG' },
    { id: 'w2', clue: 'Đơn vị đo nhiệt độ tuyệt đối trong hệ SI', answer: 'KELVIN', displayTerm: 'KELVIN' },
    { id: 'w3', clue: 'Quá trình chuyển từ thể lỏng sang thể khí', answer: 'HOAHOI', displayTerm: 'HÓA HƠI' }
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addPair = () => {
    setPairs([...pairs, { id: `p-${Date.now()}`, term: '', formulaOrDef: '' }]);
  };

  const removePair = (idx: number) => {
    if (pairs.length <= 2) {
      alert('Mini game Lật thẻ cần tối thiểu 2 cặp thẻ!');
      return;
    }
    setPairs(pairs.filter((_, i) => i !== idx));
  };

  const addWord = () => {
    setWords([...words, { id: `w-${Date.now()}`, clue: '', answer: '', displayTerm: '' }]);
  };

  const removeWord = (idx: number) => {
    if (words.length <= 1) {
      alert('Mini game Ô chữ cần tối thiểu 1 hàng chữ!');
      return;
    }
    setWords(words.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Vui lòng nhập tên trò chơi!');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let config: any = {};
      let thumbnail = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80';

      if (gameType === 'memory_card') {
        config = { pairs };
        thumbnail = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80';
      } else if (gameType === 'crossword') {
        config = { words };
        thumbnail = 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=600&auto=format&fit=crop&q=80';
      } else if (gameType === 'lucky_wheel') {
        config = {
          wheelItems: [
            { id: 'wh1', label: '+50 XP', color: '#0284c7', type: 'xp', value: 50 },
            { id: 'wh2', label: 'Câu hỏi 1', color: '#0369a1', type: 'question', value: 'Q1' },
            { id: 'wh3', label: '+100 XP', color: '#0ea5e9', type: 'xp', value: 100 },
            { id: 'wh4', label: 'Nhân Đôi XP', color: '#f59e0b', type: 'bonus', value: 'x2' },
            { id: 'wh5', label: 'Câu hỏi 2', color: '#38bdf8', type: 'question', value: 'Q2' },
            { id: 'wh6', label: '+200 XP', color: '#10b981', type: 'xp', value: 200 },
          ]
        };
        thumbnail = 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&auto=format&fit=crop&q=80';
      }

      const created = await customGamesService.createCustomGame({
        title: title.trim(),
        description: description.trim() || 'Mini Game tương tác trực quan Vật Lí 12',
        game_type: gameType,
        teacher_id: teacherId,
        lesson_id: lessonId || undefined,
        max_attempts: maxAttempts,
        time_limit: timeLimit,
        thumbnail_url: thumbnail,
        game_config: config,
        is_active: true
      });

      onCreated(created);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Lỗi khi tạo mini game.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tạo Mẫu Mini Game Tích Hợp (GAME-09)"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Mini Game Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">
            Chọn Dạng Mini Game Vật Lí:
          </label>
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setGameType('memory_card')}
              className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 ${
                gameType === 'memory_card'
                  ? 'border-sky-500 bg-sky-50 text-sky-800 ring-2 ring-sky-500/20 font-black'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 font-bold'
              }`}
            >
              <Layers className="w-5 h-5 text-sky-600" />
              <span className="text-xs">Lật Thẻ Trí Nhớ</span>
            </button>

            <button
              type="button"
              onClick={() => setGameType('crossword')}
              className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 ${
                gameType === 'crossword'
                  ? 'border-sky-500 bg-sky-50 text-sky-800 ring-2 ring-sky-500/20 font-black'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 font-bold'
              }`}
            >
              <Grid className="w-5 h-5 text-indigo-600" />
              <span className="text-xs">Khung Chữ / Ô Chữ</span>
            </button>

            <button
              type="button"
              onClick={() => setGameType('lucky_wheel')}
              className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 ${
                gameType === 'lucky_wheel'
                  ? 'border-sky-500 bg-sky-50 text-sky-800 ring-2 ring-sky-500/20 font-black'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 font-bold'
              }`}
            >
              <RotateCw className="w-5 h-5 text-amber-600" />
              <span className="text-xs">Vòng Quay May Mắn</span>
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Tên Trò Chơi <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            placeholder="VD: Lật Thẻ Ghi Nhớ: Phương Trình Trạng Thái Khí Lí Tưởng"
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

        {/* Dynamic Editor for Memory Card */}
        {gameType === 'memory_card' && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">
                Danh Sách Các Cặp Thẻ Ghép Đôi ({pairs.length} cặp):
              </span>
              <button
                type="button"
                onClick={addPair}
                className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
              >
                <PlusCircle className="w-3.5 h-3.5" /> Thêm Cặp Thẻ
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {pairs.map((p, idx) => (
                <div key={p.id} className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-400 w-5">{idx + 1}.</span>
                  <input
                    type="text"
                    placeholder="Tên hiện tượng / Khái niệm..."
                    value={p.term}
                    onChange={(e) => {
                      const updated = [...pairs];
                      updated[idx].term = e.target.value;
                      setPairs(updated);
                    }}
                    className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-xs text-slate-800 focus:outline-none focus:border-sky-500"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Công thức (vd: pV = nRT)..."
                    value={p.formulaOrDef}
                    onChange={(e) => {
                      const updated = [...pairs];
                      updated[idx].formulaOrDef = e.target.value;
                      setPairs(updated);
                    }}
                    className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-xs font-mono text-sky-700 focus:outline-none focus:border-sky-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => removePair(idx)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Editor for Crossword */}
        {gameType === 'crossword' && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">
                Danh Sách Ô Chữ Hàng Ngang ({words.length} hàng):
              </span>
              <button
                type="button"
                onClick={addWord}
                className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
              >
                <PlusCircle className="w-3.5 h-3.5" /> Thêm Ô Chữ
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {words.map((w, idx) => (
                <div key={w.id} className="p-2.5 rounded-xl bg-white border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Hàng ngang #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeWord(idx)}
                      className="text-slate-400 hover:text-rose-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Gợi ý câu hỏi..."
                    value={w.clue}
                    onChange={(e) => {
                      const updated = [...words];
                      updated[idx].clue = e.target.value;
                      setWords(updated);
                    }}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                    required
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Từ khóa không dấu (vd: NOINANG)..."
                      value={w.answer}
                      onChange={(e) => {
                        const updated = [...words];
                        updated[idx].answer = e.target.value.toUpperCase();
                        if (!updated[idx].displayTerm) updated[idx].displayTerm = e.target.value.toUpperCase();
                        setWords(updated);
                      }}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 font-mono text-xs uppercase text-sky-700 font-bold"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Hiển thị có dấu (vd: NỘI NĂNG)..."
                      value={w.displayTerm}
                      onChange={(e) => {
                        const updated = [...words];
                        updated[idx].displayTerm = e.target.value;
                        setWords(updated);
                      }}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold"
                    />
                  </div>
                </div>
              ))}
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
            disabled={loading}
            className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-sm transition flex items-center gap-1.5 disabled:opacity-50"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{loading ? 'Đang tạo...' : 'Xuất Bản Mini Game'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
