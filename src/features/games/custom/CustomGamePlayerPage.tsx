import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { customGamesService } from '../../../services/customGamesService';
import { CustomGame, CustomGameAttempt } from '../../../types';
import { GameIFrameSandbox } from './GameIFrameSandbox';
import { MemoryCardGame } from '../templates/MemoryCardGame';
import { CrosswordScrambleGame } from '../templates/CrosswordScrambleGame';
import { LuckyWheelGame } from '../templates/LuckyWheelGame';
import { PerGameLeaderboardModal } from './PerGameLeaderboardModal';
import { GameRatingFeedbackModal } from './GameRatingFeedbackModal';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import confetti from 'canvas-confetti';
import { 
  ArrowLeft, 
  Gamepad2, 
  Trophy, 
  Star, 
  Heart, 
  RotateCcw, 
  Timer, 
  Award, 
  AlertCircle, 
  CheckCircle2, 
  Flame,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

export const CustomGamePlayerPage: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const { user, updateUserXp } = useAuth();

  const [game, setGame] = useState<CustomGame | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [pastAttempts, setPastAttempts] = useState<CustomGameAttempt[]>([]);
  const [isPractice, setIsPractice] = useState<boolean>(false);
  
  // Game Play State
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [finalScore, setFinalScore] = useState<number>(0);
  const [timeSpent, setTimeSpent] = useState<number>(0);
  const [xpEarned, setXpEarned] = useState<number>(0);

  // Modals
  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState<boolean>(false);

  const loadGameData = async () => {
    if (!gameId) return;
    setLoading(true);
    try {
      const g = await customGamesService.getCustomGameById(gameId);
      setGame(g);

      if (user?.id) {
        const atts = await customGamesService.getStudentGameAttempts(gameId, user.id);
        setPastAttempts(atts);

        // GAME-06: Kiểm tra nếu đã hết lượt chơi tính điểm
        const officialAttemptsCount = atts.filter(a => !a.is_practice).length;
        if (g && g.max_attempts > 0 && officialAttemptsCount >= g.max_attempts) {
          setIsPractice(true); // Tự động chuyển sang chế độ Luyện tập (GAME-08)
        }
      }

      setStartTime(Date.now());
      setIsGameOver(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGameData();
  }, [gameId, user?.id]);

  // Xử lý khi hoàn thành trò chơi (GAME-04, GAME-05)
  const handleFinishGame = async (score: number, maxScore: number, durationSeconds: number) => {
    setFinalScore(score);
    setTimeSpent(durationSeconds);
    setIsGameOver(true);

    // Tính điểm thưởng XP
    const earnedXp = Math.round(isPractice ? (score * 10) : (50 + score * 20));
    setXpEarned(earnedXp);

    if (user?.id) {
      updateUserXp(earnedXp);
    }

    if (score >= 8) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }

    // GAME-04 & GAME-05: Lưu vào Database
    try {
      await customGamesService.saveAttempt({
        game_id: gameId || '',
        student_id: user?.id || 'student-guest',
        score,
        max_score: maxScore,
        time_spent: durationSeconds,
        is_practice: isPractice,
        started_at: new Date(startTime).toISOString(),
        completed_at: new Date().toISOString()
      });
    } catch (err) {
      console.warn('Lỗi lưu kết quả custom game:', err);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Đang tải dữ liệu trò chơi Vật Lí 12..." />;
  }

  if (!game) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 text-center rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h3 className="text-lg font-bold text-slate-900">Không tìm thấy trò chơi</h3>
        <p className="text-xs text-slate-500">Trò chơi có thể đã bị xóa hoặc đường dẫn không hợp lệ.</p>
        <Link
          to="/games"
          className="inline-block px-5 py-2.5 rounded-xl font-bold text-xs bg-sky-600 hover:bg-sky-500 text-white transition"
        >
          Quay lại sảnh game
        </Link>
      </div>
    );
  }

  const officialAttemptsCount = pastAttempts.filter(a => !a.is_practice).length;
  const isOutOfOfficialAttempts = game.max_attempts > 0 && officialAttemptsCount >= game.max_attempts;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          to="/games"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-sky-700 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại Sảnh Trò Chơi
        </Link>

        {/* Mode Switcher (GAME-06 & GAME-08) */}
        <div className="flex items-center gap-2">
          {game.max_attempts > 0 && (
            <div className="flex items-center gap-1 px-3 py-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700">
              <span>Đã chơi tính điểm:</span>
              <span className="font-mono font-black text-sky-700">
                {officialAttemptsCount}/{game.max_attempts}
              </span>
            </div>
          )}

          {/* Toggle Practice Mode */}
          <button
            onClick={() => {
              if (isOutOfOfficialAttempts) return;
              setIsPractice(!isPractice);
            }}
            disabled={isOutOfOfficialAttempts}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              isPractice
                ? 'bg-purple-100 text-purple-800 border border-purple-300'
                : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isPractice ? 'Chế độ: Luyện Tập (Không trừ lượt)' : 'Chế độ: Thi Đấu Tính Điểm'}</span>
          </button>

          {/* Leaderboard Button */}
          <button
            onClick={() => setShowLeaderboard(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-xs font-bold transition"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-600" />
            <span>Bảng Vàng</span>
          </button>
        </div>
      </div>

      {/* Out of attempts alert */}
      {isOutOfOfficialAttempts && !isGameOver && (
        <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            Bạn đã sử dụng hết {game.max_attempts} lượt chơi tính điểm. Hệ thống tự động chuyển sang chế độ <strong>Luyện tập tự do</strong> để bạn ôn tập bài học!
          </span>
        </div>
      )}

      {/* Main Game Screen */}
      {!isGameOver ? (
        <div className="space-y-4">
          {/* Game Info Header */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-soft flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-sky-50 text-sky-700 border border-sky-200">
                <Gamepad2 className="w-3 h-3" />
                <span>
                  {game.game_type === 'iframe' && 'Game Nhúng Ngoại Bằng'}
                  {game.game_type === 'html5_zip' && 'Game HTML5 Tải Lên'}
                  {game.game_type === 'memory_card' && 'Lật Thẻ Trí Nhớ'}
                  {game.game_type === 'crossword' && 'Ô Chữ Vật Lí'}
                  {game.game_type === 'lucky_wheel' && 'Vòng Quay May Mắn'}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">{game.title}</h2>
              {game.description && (
                <p className="text-xs text-slate-500 max-w-2xl">{game.description}</p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFeedbackModal(true)}
                className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-rose-600 p-2 rounded-xl bg-slate-50 hover:bg-rose-50 border border-slate-200 transition"
              >
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                <span>{game.likes_count}</span>
              </button>
              <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1.5 rounded-xl border border-amber-200">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{game.avg_rating.toFixed(1)}/5 ({game.rating_count})</span>
              </div>
            </div>
          </div>

          {/* Dynamic Game Engines */}
          {game.game_type === 'iframe' && (
            <GameIFrameSandbox
              embedUrl={game.embed_url || ''}
              title={game.title}
              timeLimit={game.time_limit}
              isPractice={isPractice}
              onAutoScore={(score, max) => handleFinishGame(score, max, Math.round((Date.now() - startTime) / 1000))}
              onManualSubmit={(score) => handleFinishGame(score, 10, Math.round((Date.now() - startTime) / 1000))}
            />
          )}

          {game.game_type === 'html5_zip' && (
            <GameIFrameSandbox
              embedUrl={game.zip_blob_url || game.embed_url || ''}
              title={game.title}
              timeLimit={game.time_limit}
              isPractice={isPractice}
              onAutoScore={(score, max) => handleFinishGame(score, max, Math.round((Date.now() - startTime) / 1000))}
              onManualSubmit={(score) => handleFinishGame(score, 10, Math.round((Date.now() - startTime) / 1000))}
            />
          )}

          {game.game_type === 'memory_card' && (
            <MemoryCardGame
              pairs={game.game_config?.pairs || []}
              timeLimit={game.time_limit || 120}
              isPractice={isPractice}
              onFinish={handleFinishGame}
            />
          )}

          {game.game_type === 'crossword' && (
            <CrosswordScrambleGame
              words={game.game_config?.words || []}
              timeLimit={game.time_limit || 180}
              isPractice={isPractice}
              onFinish={handleFinishGame}
            />
          )}

          {game.game_type === 'lucky_wheel' && (
            <LuckyWheelGame
              items={game.game_config?.wheelItems || []}
              isPractice={isPractice}
              onFinish={handleFinishGame}
            />
          )}
        </div>
      ) : (
        /* Game Over Result Screen */
        <div className="max-w-lg mx-auto p-8 rounded-3xl bg-white border border-slate-200/90 shadow-soft text-center space-y-6 animate-scale-up">
          <div className="w-16 h-16 rounded-full bg-emerald-50 border-4 border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              {finalScore >= 8 ? 'Xuất Sắc Hoàn Thành!' : 'Hoàn Thành Bài Chơi!'}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              {isPractice ? 'Kết quả lượt chơi Luyện tập tự do' : 'Kết quả đã được ghi nhận vào Bảng Xếp Hạng'}
            </p>
          </div>

          {/* Score & Time Metrics */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Điểm Số</span>
              <p className="text-lg sm:text-xl font-mono font-black text-sky-700">{finalScore}/10</p>
            </div>

            <div className="space-y-0.5 border-x border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Thời Gian</span>
              <p className="text-lg sm:text-xl font-mono font-black text-slate-700">{timeSpent}s</p>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Thưởng XP</span>
              <p className="text-lg sm:text-xl font-mono font-black text-amber-600">+{xpEarned}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={loadGameData}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow transition flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Chơi Lại (Luyện Tập)</span>
            </button>

            <button
              onClick={() => setShowFeedbackModal(true)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span>Đánh Giá Game</span>
            </button>

            <button
              onClick={() => setShowLeaderboard(true)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>Xem BXH</span>
            </button>
          </div>
        </div>
      )}

      {/* Leaderboard Modal (GAME-07) */}
      <PerGameLeaderboardModal
        isOpen={showLeaderboard}
        onClose={() => setShowLeaderboard(false)}
        gameId={game.id}
        gameTitle={game.title}
      />

      {/* Rating & Feedback Modal (GAME-10) */}
      <GameRatingFeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        gameId={game.id}
        gameTitle={game.title}
        studentId={user?.id || 'student-guest'}
        studentName={user?.full_name || 'Học sinh Vật Lí'}
        onFeedbackSubmitted={() => loadGameData()}
      />
    </div>
  );
};
