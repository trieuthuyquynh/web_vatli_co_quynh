import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { gamesService } from '../../services/gamesService';
import { customGamesService } from '../../services/customGamesService';
import { curriculumService } from '../../services/curriculumService';
import { Question, Lesson, QuestionType, DifficultyLevel, CustomGame } from '../../types';
import { MathRenderer } from '../../components/common/MathRenderer';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { CreateEmbedGameModal } from './studio/CreateEmbedGameModal';
import { CreateHtml5ZipGameModal } from './studio/CreateHtml5ZipGameModal';
import { CreateMiniGameModal } from './studio/CreateMiniGameModal';
import { 
  PlusCircle, 
  Sparkles, 
  Zap, 
  CheckCircle2, 
  Layers, 
  HelpCircle, 
  Eye, 
  Save, 
  Key,
  BookOpen,
  Globe,
  FileArchive,
  RotateCw,
  Gamepad2
} from 'lucide-react';

export const GameStudioPage: React.FC = () => {
  const { user } = useAuth();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [customGames, setCustomGames] = useState<CustomGame[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals for Custom Games
  const [showEmbedModal, setShowEmbedModal] = useState(false);
  const [showZipModal, setShowZipModal] = useState(false);
  const [showMiniGameModal, setShowMiniGameModal] = useState(false);

  // Form State for Question
  const [lessonId, setLessonId] = useState('');
  const [type, setType] = useState<QuestionType>('multiple_choice');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');
  const [content, setContent] = useState('');
  const [explanation, setExplanation] = useState('');

  // Multiple choice state
  const [mcOptions, setMcOptions] = useState<string[]>(['', '', '', '']);
  const [mcCorrect, setMcCorrect] = useState<string>('A');

  // True/False state
  const [tfStatements, setTfStatements] = useState<string[]>(['', '', '', '']);
  const [tfCorrect, setTfCorrect] = useState<boolean[]>([true, true, false, false]);

  // Matching state
  const [matchLeft, setMatchLeft] = useState<string[]>(['', '', '', '']);
  const [matchRight, setMatchRight] = useState<string[]>(['', '', '', '']);

  // Success message
  const [msg, setMsg] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [lss, qs, cgs] = await Promise.all([
        curriculumService.getLessonsByChapter(),
        gamesService.getQuestions(),
        customGamesService.getCustomGames()
      ]);
      setLessons(lss);
      setQuestions(qs);
      setCustomGames(cgs);
      if (lss.length > 0 && !lessonId) setLessonId(lss[0].id);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      alert('Vui lòng nhập nội dung đề bài câu hỏi!');
      return;
    }

    let formattedOptions: any;
    let formattedCorrect: any;

    if (type === 'multiple_choice') {
      formattedOptions = mcOptions.map(o => o.trim() || 'Đáp án');
      formattedCorrect = mcCorrect;
    } else if (type === 'true_false') {
      formattedOptions = tfStatements.map((text, idx) => ({
        id: String.fromCharCode(97 + idx),
        text: text.trim() || `Nhận định ${String.fromCharCode(97 + idx)}`
      }));
      formattedCorrect = tfCorrect;
    } else if (type === 'matching') {
      formattedOptions = {
        left: matchLeft.map((text, idx) => ({ id: `L${idx + 1}`, text: text.trim() || `Vế trái ${idx + 1}` })),
        right: matchRight.map((text, idx) => ({ id: `R${idx + 1}`, text: text.trim() || `Vế phải ${idx + 1}` }))
      };
      formattedCorrect = { L1: 'R1', L2: 'R2', L3: 'R3', L4: 'R4' };
    }

    try {
      await gamesService.createQuestion({
        lesson_id: lessonId || undefined,
        teacher_id: user?.id || 'teacher-quynh',
        type,
        difficulty,
        content: content.trim(),
        options: formattedOptions,
        correct_answer: formattedCorrect,
        explanation: explanation.trim()
      });

      setMsg('Đã thêm câu hỏi mới vào Ngân hàng đề thành công!');
      setContent('');
      setExplanation('');
      loadData();
    } catch (err: any) {
      alert(err.message || 'Lỗi khi lưu câu hỏi.');
    }
  };

  if (loading && lessons.length === 0) {
    return <LoadingSpinner text="Đang tải Game Studio..." />;
  }

  return (
    <div className="space-y-8 pb-16">
      
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-soft flex flex-wrap items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200">
            <Gamepad2 className="w-3.5 h-3.5 text-sky-600" />
            <span>GAME CREATOR STUDIO</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Xưởng Sáng Tạo & Biên Soạn Trò Chơi
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Dành cho Giáo viên: Soạn câu hỏi trắc nghiệm 3 dạng, nhúng game tương tác Wordwall/PhET, upload game HTML5 ZIP hoặc tạo mini game Lật thẻ, Ô chữ, Vòng quay.
          </p>
        </div>

        {/* 3 Action Buttons for GAME-01, GAME-02, GAME-09 */}
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => setShowEmbedModal(true)}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 transition flex items-center gap-1.5 active:scale-95"
          >
            <Globe className="w-4 h-4 text-sky-600" />
            <span>+ Nhúng Game Ngoại Bang</span>
          </button>

          <button
            onClick={() => setShowZipModal(true)}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition flex items-center gap-1.5 active:scale-95"
          >
            <FileArchive className="w-4 h-4 text-emerald-600" />
            <span>+ Upload Game HTML5 (.ZIP)</span>
          </button>

          <button
            onClick={() => setShowMiniGameModal(true)}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 transition flex items-center gap-1.5 active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>+ Tạo Mini Game (3 Mẫu)</span>
          </button>
        </div>
      </div>

      {msg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{msg}</span>
          </div>
          <button onClick={() => setMsg(null)} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>
      )}

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Question Creator Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleCreateQuestion} className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-soft space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-sky-600" />
                <span>Soạn Câu Hỏi Trắc Nghiệm Vật Lí:</span>
              </h2>
            </div>

            {/* Select Lesson & Type */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Gắn Bài Học SGK</label>
                <select
                  value={lessonId}
                  onChange={(e) => setLessonId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-800 focus:outline-none focus:border-sky-500"
                >
                  {lessons.map(l => (
                    <option key={l.id} value={l.id}>
                      Bài {l.number}: {l.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Dạng Câu Hỏi</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as QuestionType)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-800 focus:outline-none focus:border-sky-500"
                >
                  <option value="multiple_choice">1. Trắc nghiệm 4 đáp án</option>
                  <option value="true_false">2. Câu hỏi Đúng / Sai</option>
                  <option value="matching">3. Nối cặp đôi công thức</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Độ Khó</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-800 focus:outline-none focus:border-sky-500"
                >
                  <option value="easy">Nhận biết / Dễ</option>
                  <option value="medium">Thông hiểu / Vừa</option>
                  <option value="hard">Vận dụng / Khó</option>
                </select>
              </div>
            </div>

            {/* Question Content */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nội Dung Đề Bài (Hỗ trợ công thức LaTeX trong dấu $...$)
              </label>
              <textarea
                rows={3}
                placeholder="VD: Một lượng khí lí tưởng biến đổi theo phương trình $pV = nRT$... Hãy tính..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                required
              />
            </div>

            {/* Dynamic Options Editor */}
            {type === 'multiple_choice' && (
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold text-slate-700">4 Phương án A, B, C, D:</span>
                {['A', 'B', 'C', 'D'].map((opt, idx) => (
                  <div key={opt} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="mc_correct"
                      checked={mcCorrect === opt}
                      onChange={() => setMcCorrect(opt)}
                      className="w-4 h-4 text-sky-600 focus:ring-sky-500"
                    />
                    <span className="w-6 font-bold text-xs text-slate-700">{opt}.</span>
                    <input
                      type="text"
                      placeholder={`Nội dung phương án ${opt}...`}
                      value={mcOptions[idx] || ''}
                      onChange={(e) => {
                        const updated = [...mcOptions];
                        updated[idx] = e.target.value;
                        setMcOptions(updated);
                      }}
                      className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 text-xs"
                      required
                    />
                  </div>
                ))}
              </div>
            )}

            {type === 'true_false' && (
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold text-slate-700">4 Nhận định a, b, c, d:</span>
                {['a', 'b', 'c', 'd'].map((letter, idx) => (
                  <div key={letter} className="flex items-center gap-2">
                    <span className="w-5 font-bold text-xs text-slate-700">{letter})</span>
                    <input
                      type="text"
                      placeholder={`Nhận định ${letter}...`}
                      value={tfStatements[idx] || ''}
                      onChange={(e) => {
                        const updated = [...tfStatements];
                        updated[idx] = e.target.value;
                        setTfStatements(updated);
                      }}
                      className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 text-xs"
                      required
                    />
                    <select
                      value={tfCorrect[idx] ? 'true' : 'false'}
                      onChange={(e) => {
                        const updated = [...tfCorrect];
                        updated[idx] = e.target.value === 'true';
                        setTfCorrect(updated);
                      }}
                      className="px-2 py-1 rounded-lg border text-xs font-bold"
                    >
                      <option value="true">ĐÚNG</option>
                      <option value="false">SAI</option>
                    </select>
                  </div>
                ))}
              </div>
            )}

            {type === 'matching' && (
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold text-slate-700">Ghép Cột A với Cột B:</span>
                {[0, 1, 2, 3].map(idx => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400">L{idx + 1}:</span>
                    <input
                      type="text"
                      placeholder={`Vế trái L${idx + 1}...`}
                      value={matchLeft[idx] || ''}
                      onChange={(e) => {
                        const updated = [...matchLeft];
                        updated[idx] = e.target.value;
                        setMatchLeft(updated);
                      }}
                      className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 text-xs"
                    />
                    <span className="text-xs font-bold text-slate-400">➔ R{idx + 1}:</span>
                    <input
                      type="text"
                      placeholder={`Vế phải R${idx + 1}...`}
                      value={matchRight[idx] || ''}
                      onChange={(e) => {
                        const updated = [...matchRight];
                        updated[idx] = e.target.value;
                        setMatchRight(updated);
                      }}
                      className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Explanation */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Lời Giải Chi Tiết / Hướng Dẫn Tư Duy
              </label>
              <textarea
                rows={2}
                placeholder="Giải thích từng bước, nhắc lại công thức SGK..."
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-800 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5 active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>Lưu Vào Ngân Hàng Đề</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right: Quick List & Overview */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-soft space-y-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-600" />
              <span>Trò Chơi Đã Tạo ({customGames.length})</span>
            </h3>

            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
              {customGames.map(g => (
                <div key={g.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-sky-100 text-sky-700">
                      {g.game_type}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {g.play_count} lượt chơi
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 truncate">{g.title}</h4>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Modals for 10 Game Features */}
      <CreateEmbedGameModal
        isOpen={showEmbedModal}
        onClose={() => setShowEmbedModal(false)}
        lessons={lessons}
        teacherId={user?.id || 'teacher-quynh'}
        onCreated={() => loadData()}
      />

      <CreateHtml5ZipGameModal
        isOpen={showZipModal}
        onClose={() => setShowZipModal(false)}
        lessons={lessons}
        teacherId={user?.id || 'teacher-quynh'}
        onCreated={() => loadData()}
      />

      <CreateMiniGameModal
        isOpen={showMiniGameModal}
        onClose={() => setShowMiniGameModal(false)}
        lessons={lessons}
        teacherId={user?.id || 'teacher-quynh'}
        onCreated={() => loadData()}
      />

    </div>
  );
};
