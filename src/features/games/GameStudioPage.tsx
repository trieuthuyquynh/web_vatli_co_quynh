import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { gamesService } from '../../services/gamesService';
import { curriculumService } from '../../services/curriculumService';
import { Question, Lesson, QuestionType, DifficultyLevel } from '../../types';
import { MathRenderer } from '../../components/common/MathRenderer';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
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
  BookOpen
} from 'lucide-react';

export const GameStudioPage: React.FC = () => {
  const { user } = useAuth();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
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
      const [lss, qs] = await Promise.all([
        curriculumService.getLessonsByChapter(),
        gamesService.getQuestions()
      ]);
      setLessons(lss);
      setQuestions(qs);
      if (lss.length > 0) setLessonId(lss[0].id);
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
        explanation: explanation.trim() || undefined
      });

      setMsg('Đã lưu câu hỏi thành công vào ngân hàng đề!');
      setTimeout(() => setMsg(null), 3000);
      setContent('');
      setExplanation('');
      loadData();
    } catch (err: any) {
      alert(err.message || 'Lỗi khi lưu câu hỏi.');
    }
  };

  return (
    <div className="space-y-10 pb-16 max-w-5xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
          <Sparkles className="w-3.5 h-3.5" /> Physics Game Studio • Soạn Đề Tương Tác
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
          Studio Quản Lý Câu Hỏi & Tạo Trò Chơi
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Dành cho Thầy/Cô biên soạn ngân hàng câu hỏi chuẩn SGK Vật Lí 12 KNTT với 3 dạng: Trắc nghiệm 4 đáp án, Đúng/Sai 4 ý và Ghép cặp nối từ. Hỗ trợ hiển thị công thức LaTeX trực quan.
        </p>
      </div>

      {msg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          <span>{msg}</span>
        </div>
      )}

      {/* Creation Form */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-700 shadow-2xl space-y-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <PlusCircle className="w-5 h-5 text-cyan-400" />
          <span>Biên Soạn Câu Hỏi Mới</span>
        </h2>

        <form onSubmit={handleCreateQuestion} className="space-y-5">
          
          {/* Metadata selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Bài Học SGK</label>
              <select
                value={lessonId}
                onChange={(e) => setLessonId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              >
                {lessons.map(ls => (
                  <option key={ls.id} value={ls.id}>
                    Bài {ls.number}: {ls.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Dạng Câu Hỏi</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as QuestionType)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              >
                <option value="multiple_choice">1. Trắc nghiệm 4 đáp án</option>
                <option value="true_false">2. Câu hỏi Đúng / Sai 4 ý THPT</option>
                <option value="matching">3. Đấu ghép nối công thức</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Mức Độ Nhận Thức</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              >
                <option value="easy">Nhận biết / Thông hiểu (Dễ)</option>
                <option value="medium">Vận dụng (Trung bình)</option>
                <option value="hard">Vận dụng cao (Khó)</option>
              </select>
            </div>
          </div>

          {/* Question Content */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase flex items-center justify-between">
              <span>Đề bài câu hỏi (Hỗ trợ LaTeX công thức trong dấu $...$) *</span>
              <span className="text-[11px] text-cyan-400 font-mono">VD: Cho khối khí $pV=nRT$</span>
            </label>
            <textarea
              required
              rows={3}
              placeholder="Nhập nội dung đề bài tại đây..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Live Preview Box */}
          {content && (
            <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-xs text-slate-200 space-y-1">
              <div className="flex items-center gap-1.5 text-cyan-400 font-bold text-[11px] uppercase">
                <Eye className="w-3.5 h-3.5" /> Xem trước hiển thị công thức:
              </div>
              <div className="text-sm font-medium">
                <MathRenderer content={content} />
              </div>
            </div>
          )}

          {/* Dynamic Option Inputs based on Type */}
          {type === 'multiple_choice' && (
            <div className="space-y-3 pt-2">
              <div className="text-xs font-bold text-slate-300 uppercase">
                Nhập 4 phương án lựa chọn và tích chọn đáp án đúng:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {['A', 'B', 'C', 'D'].map((letter, idx) => (
                  <div key={letter} className="flex items-center gap-2 p-2 rounded-xl bg-slate-800 border border-slate-700">
                    <input
                      type="radio"
                      name="mc_correct"
                      checked={mcCorrect === letter}
                      onChange={() => setMcCorrect(letter)}
                      className="w-4 h-4 text-cyan-500"
                    />
                    <span className="font-bold text-xs text-cyan-400 w-4">{letter}.</span>
                    <input
                      type="text"
                      placeholder={`Nội dung đáp án ${letter}...`}
                      value={mcOptions[idx]}
                      onChange={(e) => {
                        const copy = [...mcOptions];
                        copy[idx] = e.target.value;
                        setMcOptions(copy);
                      }}
                      className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {type === 'true_false' && (
            <div className="space-y-3 pt-2">
              <div className="text-xs font-bold text-slate-300 uppercase">
                Nhập 4 nhận định (a, b, c, d) và chọn tính Đúng/Sai:
              </div>
              <div className="space-y-2">
                {['a', 'b', 'c', 'd'].map((letter, idx) => (
                  <div key={letter} className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-800 border border-slate-700">
                    <span className="font-bold text-xs text-amber-400 w-5">{letter})</span>
                    <input
                      type="text"
                      placeholder={`Nội dung nhận định ${letter}...`}
                      value={tfStatements[idx]}
                      onChange={(e) => {
                        const copy = [...tfStatements];
                        copy[idx] = e.target.value;
                        setTfStatements(copy);
                      }}
                      className="flex-1 bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
                    />
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          const copy = [...tfCorrect];
                          copy[idx] = true;
                          setTfCorrect(copy);
                        }}
                        className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                          tfCorrect[idx] === true ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-slate-400'
                        }`}
                      >
                        ĐÚNG
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const copy = [...tfCorrect];
                          copy[idx] = false;
                          setTfCorrect(copy);
                        }}
                        className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                          tfCorrect[idx] === false ? 'bg-rose-500 text-white' : 'bg-slate-900 text-slate-400'
                        }`}
                      >
                        SAI
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {type === 'matching' && (
            <div className="space-y-3 pt-2">
              <div className="text-xs font-bold text-slate-300 uppercase">
                Nhập 4 cặp ghép tương ứng (Vế Trái sẽ khớp với Vế Phải cùng dòng):
              </div>
              <div className="space-y-2">
                {[1, 2, 3, 4].map((num, idx) => (
                  <div key={num} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-800 border border-slate-700">
                      <span className="font-bold text-xs text-cyan-400">L{num}:</span>
                      <input
                        type="text"
                        placeholder={`Vế trái ${num} (Khái niệm)...`}
                        value={matchLeft[idx]}
                        onChange={(e) => {
                          const copy = [...matchLeft];
                          copy[idx] = e.target.value;
                          setMatchLeft(copy);
                        }}
                        className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-800 border border-slate-700">
                      <span className="font-bold text-xs text-indigo-400">R{num}:</span>
                      <input
                        type="text"
                        placeholder={`Vế phải ${num} (Công thức tương ứng)...`}
                        value={matchRight[idx]}
                        onChange={(e) => {
                          const copy = [...matchRight];
                          copy[idx] = e.target.value;
                          setMatchRight(copy);
                        }}
                        className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Explanation */}
          <div className="space-y-1 pt-1">
            <label className="text-xs font-bold text-slate-400 uppercase">
              Lời giải thích chi tiết & Phương pháp giải
            </label>
            <textarea
              rows={2}
              placeholder="VD: Áp dụng định luật I nhiệt động lực học: $\Delta U = A + Q$..."
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 transition flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Lưu Câu Hỏi Vào Ngân Hàng Đề</span>
            </button>
          </div>

        </form>
      </div>

      {/* Existing Questions List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-cyan-400" />
          <span>Ngân Hàng Câu Hỏi Hiện Có ({questions.length} câu)</span>
        </h2>

        <div className="space-y-3">
          {questions.map((q, idx) => (
            <div
              key={q.id}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2"
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-400">#{idx + 1}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase">
                    {q.type}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400">
                    {q.difficulty}
                  </span>
                </div>
              </div>

              <div className="text-sm font-medium text-slate-100">
                <MathRenderer content={q.content} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
