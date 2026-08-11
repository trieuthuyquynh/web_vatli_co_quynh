import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { gamesService } from '../../services/gamesService';
import { curriculumService } from '../../services/curriculumService';
import { Chapter, Lesson, GameQuiz, QuestionType } from '../../types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { 
  Gamepad2, 
  Zap, 
  CheckCircle2, 
  Layers, 
  Key, 
  Flame, 
  BookOpen, 
  PlusCircle, 
  ArrowRight, 
  Play, 
  Trophy,
  HelpCircle
} from 'lucide-react';

export const GameLobbyPage: React.FC = () => {
  const { role } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preSelectedType = searchParams.get('type') as QuestionType | null;
  const preSelectedLesson = searchParams.get('lesson');

  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [quizzes, setQuizzes] = useState<GameQuiz[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<string>('all');
  const [selectedLesson, setSelectedLesson] = useState<string>(preSelectedLesson || 'all');
  const [selectedType, setSelectedType] = useState<QuestionType | 'all'>(preSelectedType || 'all');
  const [pinCode, setPinCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const canCreateGame = role === 'teacher' || role === 'admin';

  useEffect(() => {
    async function loadLobby() {
      setLoading(true);
      try {
        const [chs, lss, qzs] = await Promise.all([
          curriculumService.getChapters(),
          curriculumService.getLessonsByChapter(),
          gamesService.getQuizzes()
        ]);
        setChapters(chs);
        setLessons(lss);
        setQuizzes(qzs);
      } finally {
        setLoading(false);
      }
    }
    loadLobby();
  }, []);

  const handleJoinPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinCode.trim()) return;
    navigate(`/play?pin=${pinCode.trim()}`);
  };

  const handleStartPractice = () => {
    let url = '/play?';
    if (selectedChapter !== 'all') url += `chapter=${selectedChapter}&`;
    if (selectedLesson !== 'all') url += `lesson=${selectedLesson}&`;
    if (selectedType !== 'all') url += `type=${selectedType}&`;
    navigate(url);
  };

  return (
    <div className="space-y-10 pb-12">
      
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/60 border border-slate-800 p-8 sm:p-10 shadow-2xl">
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
            <Gamepad2 className="w-3.5 h-3.5" /> Đấu Trường Trò Chơi Vật Lí 12
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
            Ôn Luyện & Thi Đấu Trò Chơi Học Tập
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Chọn chế độ luyện tập cá nhân theo từng chương bài SGK Kết Nối Tri Thức hoặc nhập Mã PIN thi đấu trực tiếp cùng các bạn trong lớp.
          </p>
        </div>

        {/* PIN Code Box on the Right */}
        <div className="mt-6 sm:mt-0 sm:absolute sm:right-8 sm:top-1/2 sm:-translate-y-1/2 w-full sm:w-80">
          <form onSubmit={handleJoinPin} className="p-4 rounded-2xl bg-slate-950/90 border border-slate-700 shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
              <Key className="w-4 h-4 text-cyan-400" />
              <span>Vào phòng game bằng Mã PIN:</span>
            </div>
            <input
              type="text"
              placeholder="Nhập mã PIN 6 số (VD: 889922)"
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-cyan-400 font-mono font-bold tracking-widest text-center text-sm focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white transition flex items-center justify-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Tham Gia Trận Đấu</span>
            </button>
          </form>
        </div>
      </div>

      {/* 3 Game Modes Selector */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <span>1. Chọn Dạng Trò Chơi Muốn Luyện</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          <button
            onClick={() => setSelectedType('all')}
            className={`p-5 rounded-2xl border text-left flex flex-col justify-between transition-all duration-200 ${
              selectedType === 'all'
                ? 'bg-cyan-500/20 border-cyan-500 ring-2 ring-cyan-500/30'
                : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold">
                <Gamepad2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Tổng Hợp 3 Dạng</h3>
              <p className="text-[11px] text-slate-400">Trải nghiệm toàn diện cả trắc nghiệm, đúng sai và nối từ.</p>
            </div>
            <span className="text-[10px] font-bold text-cyan-400 mt-4 block">Đề xuất ôn thi THPT</span>
          </button>

          <button
            onClick={() => setSelectedType('multiple_choice')}
            className={`p-5 rounded-2xl border text-left flex flex-col justify-between transition-all duration-200 ${
              selectedType === 'multiple_choice'
                ? 'bg-blue-500/20 border-blue-500 ring-2 ring-blue-500/30'
                : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center font-bold">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Trắc Nghiệm 4 Đáp Án</h3>
              <p className="text-[11px] text-slate-400">Rèn luyện tốc độ tính toán và phản xạ công thức.</p>
            </div>
            <span className="text-[10px] font-bold text-blue-400 mt-4 block">Dạng 1</span>
          </button>

          <button
            onClick={() => setSelectedType('true_false')}
            className={`p-5 rounded-2xl border text-left flex flex-col justify-between transition-all duration-200 ${
              selectedType === 'true_false'
                ? 'bg-amber-500/20 border-amber-500 ring-2 ring-amber-500/30'
                : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Đúng / Sai 4 Ý</h3>
              <p className="text-[11px] text-slate-400">Bám sát cấu trúc đề thi tốt nghiệp THPT Quốc gia 2025.</p>
            </div>
            <span className="text-[10px] font-bold text-amber-400 mt-4 block">Dạng 2 chuẩn Bộ GD</span>
          </button>

          <button
            onClick={() => setSelectedType('matching')}
            className={`p-5 rounded-2xl border text-left flex flex-col justify-between transition-all duration-200 ${
              selectedType === 'matching'
                ? 'bg-indigo-500/20 border-indigo-500 ring-2 ring-indigo-500/30'
                : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Ghép Nối Công Thức</h3>
              <p className="text-[11px] text-slate-400">Nối hiện tượng vật lí với công thức và bản chất tương ứng.</p>
            </div>
            <span className="text-[10px] font-bold text-indigo-400 mt-4 block">Dạng 3 tương tác</span>
          </button>

        </div>
      </section>

      {/* Scope Selector: Chapter & Lesson */}
      <section className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <span>2. Chọn Phạm Vi Kiến Thức SGK Vật Lí 12 (KNTT)</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase">Chương SGK</label>
            <select
              value={selectedChapter}
              onChange={(e) => {
                setSelectedChapter(e.target.value);
                setSelectedLesson('all');
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">-- Toàn Bộ 4 Chương Vật Lí 12 --</option>
              {chapters.map(c => (
                <option key={c.id} value={c.id}>
                  Chương {c.number}: {c.title.replace(`Chương ${c.number}: `, '')}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase">Bài Học Cụ Thể</label>
            <select
              value={selectedLesson}
              onChange={(e) => setSelectedLesson(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">-- Toàn Bộ Các Bài Học --</option>
              {lessons
                .filter(l => selectedChapter === 'all' || l.chapter_id === selectedChapter)
                .map(l => (
                  <option key={l.id} value={l.id}>
                    Bài {l.number}: {l.title}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800">
          <p className="text-xs text-slate-400">
            💡 Mỗi lượt làm bài hoàn thành sẽ cộng từ <strong className="text-cyan-400">100 - 300 XP</strong> vào bảng xếp hạng!
          </p>

          <button
            onClick={handleStartPractice}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-extrabold text-sm bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-xl shadow-cyan-500/25 transition active:scale-95 flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Bắt Đầu Chơi Ngay</span>
          </button>
        </div>
      </section>

      {/* Teacher / Admin Game Studio Link */}
      {canCreateGame && (
        <section className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/30 via-slate-900 to-teal-950/30 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-emerald-400" />
              <span>Studio Soạn Câu Hỏi & Tạo Phòng Game</span>
            </h3>
            <p className="text-xs text-slate-300">
              Dành cho Thầy/Cô: Soạn thêm câu hỏi 3 dạng mới với KaTeX Live Preview và sinh mã PIN thi đấu cho học sinh.
            </p>
          </div>

          <Link
            to="/studio"
            className="px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 transition shrink-0 flex items-center gap-1.5"
          >
            <span>Mở Studio Soạn Đề</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </section>
      )}

    </div>
  );
};
