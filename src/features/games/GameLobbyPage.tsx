import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { gamesService } from '../../services/gamesService';
import { customGamesService } from '../../services/customGamesService';
import { curriculumService } from '../../services/curriculumService';
import { Chapter, Lesson, GameQuiz, CustomGame, QuestionType, CustomGameType } from '../../types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { PerGameLeaderboardModal } from './custom/PerGameLeaderboardModal';
import { GameRatingFeedbackModal } from './custom/GameRatingFeedbackModal';
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
  Sparkles,
  Star,
  Heart,
  Globe,
  FileArchive,
  Grid,
  RotateCw,
  ExternalLink
} from 'lucide-react';

export const GameLobbyPage: React.FC = () => {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preSelectedType = searchParams.get('type') as QuestionType | null;
  const preSelectedLesson = searchParams.get('lesson');
  const preSelectedChapter = searchParams.get('chapter');

  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [quizzes, setQuizzes] = useState<GameQuiz[]>([]);
  const [customGames, setCustomGames] = useState<CustomGame[]>([]);
  
  // Filter States
  const [activeTab, setActiveTab] = useState<'all' | 'templates' | 'embed' | 'quizzes'>('all');
  const [selectedChapter, setSelectedChapter] = useState<string>(preSelectedChapter || 'all');
  const [selectedLesson, setSelectedLesson] = useState<string>(preSelectedLesson || 'all');
  const [selectedType, setSelectedType] = useState<QuestionType | 'all'>(preSelectedType || 'all');
  const [pinCode, setPinCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  // Modals for leaderboard and feedback
  const [selectedGameForLeaderboard, setSelectedGameForLeaderboard] = useState<CustomGame | null>(null);
  const [selectedGameForFeedback, setSelectedGameForFeedback] = useState<CustomGame | null>(null);

  const canCreateGame = role === 'teacher' || role === 'admin';

  const loadLobby = async () => {
    setLoading(true);
    try {
      const [chs, lss, qzs, cGames] = await Promise.all([
        curriculumService.getChapters(),
        curriculumService.getLessonsByChapter(),
        gamesService.getQuizzes(),
        customGamesService.getCustomGames()
      ]);
      setChapters(chs);
      setLessons(lss);
      setQuizzes(qzs);
      setCustomGames(cGames);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

  // Lọc game mở rộng theo tab và bài học
  const filteredCustomGames = customGames.filter(g => {
    if (selectedLesson !== 'all' && g.lesson_id !== selectedLesson) return false;
    if (activeTab === 'templates') {
      return g.game_type === 'memory_card' || g.game_type === 'crossword' || g.game_type === 'lucky_wheel';
    }
    if (activeTab === 'embed') {
      return g.game_type === 'iframe' || g.game_type === 'html5_zip';
    }
    return true;
  });

  if (loading && chapters.length === 0) {
    return <LoadingSpinner text="Đang tải dữ liệu Đấu trường Game Vật Lí..." />;
  }

  return (
    <div className="space-y-10 pb-16">
      
      {/* Top Banner */}
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
            Kho trò chơi phong phú: <strong className="text-sky-700">Trắc nghiệm 3 dạng</strong>, <strong className="text-sky-700">Lật thẻ trí nhớ</strong>, <strong className="text-sky-700">Ô chữ</strong>, <strong className="text-sky-700">Vòng quay may mắn</strong> và nhúng game tương tác từ <strong className="text-sky-700">Wordwall / PhET</strong>.
          </p>

          {canCreateGame && (
            <div className="pt-2">
              <Link
                to="/studio"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white shadow-sm transition active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Mở Game Studio (Soạn game mới)</span>
              </Link>
            </div>
          )}
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

      {/* Tabs Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'all'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Tất Cả Trò Chơi ({filteredCustomGames.length + quizzes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('templates')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'templates'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Mini Game Tích Hợp (Lật thẻ, Ô chữ, Vòng quay)</span>
          </button>

          <button
            onClick={() => setActiveTab('embed')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'embed'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Game Nhúng Ngoại Bang (Wordwall / PhET / ZIP)</span>
          </button>

          <button
            onClick={() => setActiveTab('quizzes')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'quizzes'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Đấu Trường 3 Dạng Trắc Nghiệm</span>
          </button>
        </div>

        {/* Filter by Lesson */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Lọc theo bài:</span>
          <select
            value={selectedLesson}
            onChange={(e) => setSelectedLesson(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 focus:outline-none focus:border-sky-500"
          >
            <option value="all">Toàn bộ 4 Chương KNTT</option>
            {lessons.map(l => (
              <option key={l.id} value={l.id}>
                Bài {l.number}: {l.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of Custom Games (GAME-01 -> GAME-10) */}
      {(activeTab === 'all' || activeTab === 'templates' || activeTab === 'embed') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-600" />
              <span>Kho Trò Chơi Tương Tác & Mô Phỏng Vật Lí:</span>
            </h2>
            <span className="text-xs text-slate-400 font-bold">{filteredCustomGames.length} Trò chơi</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCustomGames.map(game => (
              <div
                key={game.id}
                className="group rounded-3xl bg-white border border-slate-200/90 shadow-soft hover:shadow-hover hover:border-sky-300 transition-all flex flex-col overflow-hidden"
              >
                {/* Thumbnail Preview */}
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  {game.thumbnail_url ? (
                    <img
                      src={game.thumbnail_url}
                      alt={game.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-sky-500 to-cyan-600 text-white">
                      <Gamepad2 className="w-12 h-12 opacity-80" />
                    </div>
                  )}

                  {/* Badges on Thumbnail */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-slate-900/80 text-white backdrop-blur-sm">
                      {game.game_type === 'iframe' && 'Nhúng iFrame'}
                      {game.game_type === 'html5_zip' && 'HTML5 ZIP'}
                      {game.game_type === 'memory_card' && 'Lật Thẻ Trí Nhớ'}
                      {game.game_type === 'crossword' && 'Ô Chữ'}
                      {game.game_type === 'lucky_wheel' && 'Vòng Quay'}
                    </span>
                  </div>

                  <div className="absolute bottom-3 right-3 flex items-center gap-2 bg-slate-900/80 backdrop-blur-sm px-2.5 py-1 rounded-full text-white text-[11px] font-bold">
                    <div className="flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                      <span>{game.likes_count}</span>
                    </div>
                    <span className="text-slate-400">•</span>
                    <div className="flex items-center gap-1 text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{game.avg_rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug line-clamp-2 group-hover:text-sky-600 transition">
                      {game.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {game.description || 'Trò chơi tương tác thực hành Vật Lí 12 KNTT.'}
                    </p>
                  </div>

                  {/* Actions & Buttons */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1">
                      {/* Xem BXH (GAME-07) */}
                      <button
                        onClick={() => setSelectedGameForLeaderboard(game)}
                        className="p-2 rounded-xl text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition"
                        title="Xem Bảng Xếp Hạng"
                      >
                        <Trophy className="w-4 h-4 text-amber-500" />
                      </button>

                      {/* Đánh giá (GAME-10) */}
                      <button
                        onClick={() => setSelectedGameForFeedback(game)}
                        className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
                        title="Đánh giá & Bình luận"
                      >
                        <Star className="w-4 h-4 text-amber-400" />
                      </button>
                    </div>

                    {/* Nút Vào Chơi Ngay */}
                    <Link
                      to={`/games/custom/${game.id}`}
                      className="px-4 py-2 rounded-xl text-xs font-extrabold bg-sky-600 hover:bg-sky-500 text-white shadow-sm transition flex items-center gap-1.5 active:scale-95"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Chơi Ngay</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3 Formats Quiz Section */}
      {(activeTab === 'all' || activeTab === 'quizzes') && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-sky-600" />
              <span>Đấu Trường Trắc Nghiệm Chuẩn Cấu Trúc THPT 2025:</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Format 1: Trắc nghiệm 4 đáp án */}
            <div 
              onClick={() => navigate('/play?type=multiple_choice')}
              className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-soft hover:shadow-hover hover:border-sky-300 transition cursor-pointer space-y-3 group"
            >
              <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-black">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-sky-600 transition">
                  1. Trắc Nghiệm 4 Đáp Án
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Chọn 1 phương án đúng duy nhất trong 4 phương án A, B, C, D.
                </p>
              </div>
            </div>

            {/* Format 2: Đúng / Sai */}
            <div 
              onClick={() => navigate('/play?type=true_false')}
              className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-soft hover:shadow-hover hover:border-sky-300 transition cursor-pointer space-y-3 group"
            >
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-emerald-600 transition">
                  2. Câu Hỏi Đúng / Sai
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Mỗi câu gồm 4 ý a, b, c, d - Phán đoán Đúng hoặc Sai theo thang điểm mới.
                </p>
              </div>
            </div>

            {/* Format 3: Ghép đôi công thức */}
            <div 
              onClick={() => navigate('/play?type=matching')}
              className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-soft hover:shadow-hover hover:border-sky-300 transition cursor-pointer space-y-3 group"
            >
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-indigo-600 transition">
                  3. Ghép Nối Khái Niệm
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Kéo thả nối các vế Cột A với Cột B để hoàn thành định luật Vật Lí.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Modal (GAME-07) */}
      {selectedGameForLeaderboard && (
        <PerGameLeaderboardModal
          isOpen={Boolean(selectedGameForLeaderboard)}
          onClose={() => setSelectedGameForLeaderboard(null)}
          gameId={selectedGameForLeaderboard.id}
          gameTitle={selectedGameForLeaderboard.title}
        />
      )}

      {/* Rating & Feedback Modal (GAME-10) */}
      {selectedGameForFeedback && (
        <GameRatingFeedbackModal
          isOpen={Boolean(selectedGameForFeedback)}
          onClose={() => setSelectedGameForFeedback(null)}
          gameId={selectedGameForFeedback.id}
          gameTitle={selectedGameForFeedback.title}
          studentId={user?.id || 'student-guest'}
          studentName={user?.full_name || 'Học sinh Vật Lí'}
          onFeedbackSubmitted={() => loadLobby()}
        />
      )}

    </div>
  );
};
