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
  HelpCircle,
  Sparkles
} from 'lucide-react';

export const GameLobbyPage: React.FC = () => {
  const { role } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preSelectedType = searchParams.get('type') as QuestionType | null;
  const preSelectedLesson = searchParams.get('lesson');
  const preSelectedChapter = searchParams.get('chapter');

  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [quizzes, setQuizzes] = useState<GameQuiz[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<string>(preSelectedChapter || 'all');
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

  if (loading && chapters.length === 0) {
    return <LoadingSpinner text="Đang tải dữ liệu Đấu trường Game Vật Lí..." />;
  }

  return (
    <div className="space-y-10 pb-16">
      
      {/* Top Banner - Light Academic */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-10 shadow-soft">
        <div className="max-w-xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200">
            <Gamepad2 className="w-3.5 h-3.5 text-sky-600" />
            <span>ĐẤU TRƯỜNG TRÒ CHƠI VẬT LÍ 12</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Ôn Luyện & Thi Đấu Trò Chơi Học Tập
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Chọn chế độ luyện tập theo trình tự <strong className="text-sky-700">CHƯƠNG → BÀI</strong> SGK Kết Nối Tri Thức hoặc nhập Mã PIN thi đấu trực tiếp cùng các bạn trong lớp.
          </p>
        </div>

        {/* PIN Code Box on the Right */}
        <div className="mt-6 lg:mt-0 lg:absolute lg:right-8 lg:top-1/2 lg:-translate-y-1/2 w-full lg:w-80">
          <form onSubmit={handleJoinPin} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <Key className="w-4 h-4 text-sky-600" />
              <span>Vào phòng game bằng Mã PIN:</span>
            </div>
            <input
              type="text"
              placeholder="Nhập mã PIN 6 số (VD: 889922)"
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-sky-700 font-mono font-bold tracking-widest text-center text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            />
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white transition flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Tham Gia Trận Đấu</span>
            </button>
          </form>
        </div>
      </div>

      {/* 3 Game Modes Selector */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            <span>1. Chọn Dạng Trò Chơi Muốn Luyện Tập</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <button
            onClick={() => setSelectedType('all')}
            className={`p-5 rounded-2xl border text-left flex flex-col justify-between transition-all duration-200 ${
              selectedType === 'all'
                ? 'bg-sky-50/90 border-sky-400 shadow-md ring-2 ring-sky-400/20'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 shadow-xs'
            }`}
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center font-bold">
                <Gamepad2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Tổng Hợp 3 Dạng</h3>
              <p className="text-[11px] text-slate-500">Trải nghiệm toàn diện cả trắc nghiệm, đúng sai và ghép nối.</p>
            </div>
            <span className="text-[10px] font-bold text-sky-700 mt-4 block">Đề xuất ôn thi THPT</span>
          </button>

          <button
            onClick={() => setSelectedType('multiple_choice')}
            className={`p-5 rounded-2xl border text-left flex flex-col justify-between transition-all duration-200 ${
              selectedType === 'multiple_choice'
                ? 'bg-sky-50/90 border-sky-400 shadow-md ring-2 ring-sky-400/20'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 shadow-xs'
            }`}
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center font-bold">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Trắc Nghiệm 4 Đáp Án</h3>
              <p className="text-[11px] text-slate-500">Rèn luyện tốc độ tính toán và phản xạ công thức.</p>
            </div>
            <span className="text-[10px] font-bold text-sky-700 mt-4 block">Dạng 1: Tốc độ</span>
          </button>

          <button
            onClick={() => setSelectedType('true_false')}
            className={`p-5 rounded-2xl border text-left flex flex-col justify-between transition-all duration-200 ${
              selectedType === 'true_false'
                ? 'bg-amber-50/90 border-amber-400 shadow-md ring-2 ring-amber-400/20'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 shadow-xs'
            }`}
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Đúng / Sai 4 Ý</h3>
              <p className="text-[11px] text-slate-500">Bám sát cấu trúc đề thi tốt nghiệp THPT Quốc gia 2025.</p>
            </div>
            <span className="text-[10px] font-bold text-amber-700 mt-4 block">Dạng 2 chuẩn Bộ GD</span>
          </button>

          <button
            onClick={() => setSelectedType('matching')}
            className={`p-5 rounded-2xl border text-left flex flex-col justify-between transition-all duration-200 ${
              selectedType === 'matching'
                ? 'bg-indigo-50/90 border-indigo-400 shadow-md ring-2 ring-indigo-400/20'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 shadow-xs'
            }`}
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Ghép Nối Công Thức</h3>
              <p className="text-[11px] text-slate-500">Nối hiện tượng vật lí với công thức và bản chất tương ứng.</p>
            </div>
            <span className="text-[10px] font-bold text-indigo-700 mt-4 block">Dạng 3 tương tác</span>
          </button>

        </div>
      </section>

      {/* Scope Selector: CHƯƠNG & BÀI */}
      <section className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-soft space-y-5">
        <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-sky-600" />
          <span>2. Chọn Phạm Vi Kiến Thức Theo Trình Tự: CHƯƠNG → BÀI</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 uppercase">Chương SGK (Cấp 1)</label>
            <select
              value={selectedChapter}
              onChange={(e) => {
                setSelectedChapter(e.target.value);
                setSelectedLesson('all');
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
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
            <label className="text-xs font-bold text-slate-600 uppercase">Bài Học Cụ Thể (Cấp 2)</label>
            <select
              value={selectedLesson}
              onChange={(e) => setSelectedLesson(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            >
              <option value="all">-- Toàn Bộ Các Bài Học Trong Chương --</option>
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

        <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            💡 Mỗi lượt làm bài hoàn thành sẽ cộng từ <strong className="text-sky-700 font-bold">100 - 300 XP</strong> vào bảng xếp hạng!
          </p>

          <button
            onClick={handleStartPractice}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-extrabold text-sm bg-sky-600 hover:bg-sky-500 text-white shadow-md shadow-sky-600/20 transition active:scale-95 flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Bắt Đầu Chơi Ngay</span>
          </button>
        </div>
      </section>

      {/* Teacher / Admin Game Studio Link */}
      {canCreateGame && (
        <section className="p-6 rounded-3xl bg-emerald-50/70 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-extrabold text-emerald-900 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-emerald-600" />
              <span>Studio Soạn Câu Hỏi & Tạo Phòng Game</span>
            </h3>
            <p className="text-xs text-emerald-700">
              Dành cho Thầy/Cô: Soạn thêm câu hỏi 3 dạng mới với KaTeX Live Preview và sinh mã PIN thi đấu cho học sinh.
            </p>
          </div>

          <Link
            to="/studio"
            className="px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition shrink-0 flex items-center gap-1.5"
          >
            <span>Mở Studio Soạn Đề</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </section>
      )}

    </div>
  );
};

