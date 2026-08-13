import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { gamesService } from '../../services/gamesService';
import { Question, QuestionType, AnswerDetail } from '../../types';
import { MultipleChoiceGame } from './engines/MultipleChoiceGame';
import { TrueFalseGame } from './engines/TrueFalseGame';
import { MatchingGame } from './engines/MatchingGame';
import { GameResultScreen } from './engines/GameResultScreen';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { 
  ArrowLeft, 
  Gamepad2, 
  AlertCircle, 
  Heart, 
  Flame, 
  Trophy, 
  RotateCcw,
  Sparkles,
  Zap,
  ShieldAlert
} from 'lucide-react';

export const GamePlayPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, updateUserXp } = useAuth();

  const queryType = searchParams.get('type') as QuestionType | null;
  const queryLesson = searchParams.get('lesson');
  const queryChapter = searchParams.get('chapter');
  const queryPin = searchParams.get('pin');

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [answersLog, setAnswersLog] = useState<AnswerDetail[]>([]);
  const [totalTimeSpent, setTotalTimeSpent] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [finalScore, setFinalScore] = useState<number>(0);
  const [xpEarned, setXpEarned] = useState<number>(0);

  // Gamification States: Lives & Combo
  const [lives, setLives] = useState<number>(3);
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [runningScore, setRunningScore] = useState<number>(0);
  const [isOutOfLives, setIsOutOfLives] = useState<boolean>(false);

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const allQ = await gamesService.getQuestions({
        lessonId: queryLesson || undefined,
        type: queryType || undefined
      });
      // Shuffle nhẹ nhàng
      const shuffled = [...allQ].sort(() => Math.random() - 0.5);
      setQuestions(shuffled);
      setCurrentIndex(0);
      setAnswersLog([]);
      setTotalTimeSpent(0);
      setIsGameOver(false);
      setLives(3);
      setCurrentStreak(0);
      setRunningScore(0);
      setIsOutOfLives(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, [queryType, queryLesson, queryChapter, queryPin]);

  const handleQuestionAnswer = (
    userAnswer: any,
    isCorrect: boolean,
    timeSpent: number,
    customScore?: number
  ) => {
    const currentQ = questions[currentIndex];
    const baseScore = customScore !== undefined ? customScore : (isCorrect ? 100 : 0);

    // Tính điểm thưởng Combo nếu đúng liên tiếp
    let comboMultiplier = 1;
    let newStreak = currentStreak;
    let newLives = lives;

    if (isCorrect) {
      newStreak = currentStreak + 1;
      if (newStreak >= 3) comboMultiplier = 2.0;
      else if (newStreak >= 2) comboMultiplier = 1.5;
    } else {
      newStreak = 0;
      newLives = Math.max(0, lives - 1);
    }

    const earnedScoreForThis = Math.round(baseScore * comboMultiplier);
    const updatedRunningScore = runningScore + earnedScoreForThis;

    setLives(newLives);
    setCurrentStreak(newStreak);
    setRunningScore(updatedRunningScore);

    const logEntry: AnswerDetail = {
      question_id: currentQ.id,
      type: currentQ.type,
      user_answer: userAnswer,
      is_correct: isCorrect,
      score_obtained: baseScore
    };

    const nextLog = [...answersLog, logEntry];
    setAnswersLog(nextLog);
    setTotalTimeSpent(prev => prev + timeSpent);

    // Kiểm tra hết máu (Lives = 0)
    if (newLives === 0 && !isCorrect) {
      // Hết tim -> kích hoạt modal hết tim nhưng vẫn tính điểm
      setTimeout(() => {
        setIsOutOfLives(true);
      }, 800);
      return;
    }

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Hoàn thành toàn bộ câu hỏi
      finishGame(nextLog, totalTimeSpent + timeSpent);
    }
  };

  const finishGame = async (log: AnswerDetail[], totalTime: number) => {
    const totalQ = log.length;
    const correctCount = log.filter(l => l.is_correct).length;
    
    // Tính điểm thang 10
    const totalPointsObtained = log.reduce((sum, item) => sum + item.score_obtained, 0);
    const maxPoints = totalQ * 100;
    const computedScore = maxPoints > 0 ? (totalPointsObtained / maxPoints) * 10 : 0;
    
    // Tính XP: 50 XP cơ bản + 25 XP mỗi câu đúng + điểm thưởng thang 10
    const earnedXp = Math.round(50 + (correctCount * 25) + (computedScore * 10));

    setFinalScore(computedScore);
    setXpEarned(earnedXp);
    setIsGameOver(true);
    setIsOutOfLives(false);

    // Cập nhật XP người dùng
    updateUserXp(earnedXp);

    // Lưu lượt chơi vào Database Supabase
    try {
      await gamesService.saveAttempt({
        student_id: user?.id || 'student-guest',
        score: parseFloat(computedScore.toFixed(2)),
        total_questions: totalQ,
        correct_count: correctCount,
        time_spent: totalTime,
        answers_detail: log,
        xp_earned: earnedXp,
        lesson_id: queryLesson || undefined
      });
    } catch (err) {
      console.warn('Lỗi lưu kết quả game vào Supabase:', err);
    }
  };

  // Hồi sinh để tiếp tục bài học
  const handleReviveAndContinue = () => {
    setLives(2); // Cung cấp thêm 2 tim
    setIsOutOfLives(false);
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      finishGame(answersLog, totalTimeSpent);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Đang nạp bộ câu hỏi Vật Lí 12 Gamification..." />;
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 text-center rounded-3xl bg-white border border-slate-200 shadow-lg space-y-4">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
        <h3 className="text-lg font-black text-slate-900">Chưa có câu hỏi cho chủ đề này</h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          Hãy chọn chủ đề hoặc bài học khác trong Đấu trường để tiếp tục tranh tài nhé!
        </p>
        <Link
          to="/games"
          className="inline-block px-6 py-2.5 rounded-xl font-bold text-xs bg-sky-600 hover:bg-sky-500 text-white shadow-md transition"
        >
          Quay lại Sảnh Game
        </Link>
      </div>
    );
  }

  // Màn hình Hết Tim (Out of Lives)
  if (isOutOfLives) {
    return (
      <div className="max-w-lg mx-auto my-8 p-8 rounded-3xl bg-white border-2 border-rose-200 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-300">
        <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900">BẠN ĐÃ DÙNG HẾT 3 TIM! 💔</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
            Đừng nản lòng! Hãy hồi sinh để tiếp tục chinh phục các câu hỏi còn lại và tích lũy trọn vẹn điểm XP nhé.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={handleReviveAndContinue}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-black text-sm bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/30 transition transform active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>Hồi Sinh (+2 Tim ❤️) & Học Tiếp</span>
          </button>

          <button
            onClick={() => finishGame(answersLog, totalTimeSpent)}
            className="w-full sm:w-auto px-5 py-3.5 rounded-2xl font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition"
          >
            Tổng Kết Điểm Ngay
          </button>
        </div>
      </div>
    );
  }

  if (isGameOver) {
    return (
      <div className="py-6">
        <GameResultScreen
          score={finalScore}
          totalQuestions={questions.length}
          correctCount={answersLog.filter(l => l.is_correct).length}
          totalTimeSpent={totalTimeSpent}
          xpEarned={xpEarned}
          onRestart={loadQuestions}
        />
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-16">
      
      {/* GAMIFICATION ARENA TOP BAR (Lives, Streak & Score) */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        
        {/* Back Button */}
        <Link
          to="/games"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-sky-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Thoát</span>
        </Link>

        {/* Center Live Counters: Lives ❤️, Streak 🔥, Score 🏆 */}
        <div className="flex items-center gap-4 sm:gap-6">
          
          {/* Lives Counter */}
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((heartIndex) => (
              <Heart
                key={heartIndex}
                className={`w-5 h-5 transition-all duration-300 ${
                  heartIndex <= lives
                    ? 'text-rose-500 fill-rose-500 animate-pulse'
                    : 'text-slate-300 opacity-40'
                }`}
              />
            ))}
          </div>

          {/* Streak Combo */}
          {currentStreak >= 2 ? (
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-black shadow-md animate-bounce">
              <Flame className="w-4 h-4 fill-white" />
              <span>COMBO x{currentStreak >= 3 ? '2.0' : '1.5'} 🔥</span>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-1 text-xs font-bold text-slate-400">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Streak: {currentStreak}</span>
            </div>
          )}

          {/* Running Points Counter */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 font-black text-xs">
            <Trophy className="w-3.5 h-3.5 text-sky-600" />
            <span>{runningScore} Điểm</span>
          </div>

        </div>

        {/* SGK Label */}
        <span className="text-[11px] font-black text-slate-400 uppercase tracking-wide hidden md:inline-block">
          SGK Vật Lí 12 KNTT
        </span>
      </div>

      {/* Render Dynamic Engine based on question type */}
      {currentQ.type === 'multiple_choice' && (
        <MultipleChoiceGame
          key={currentQ.id}
          question={currentQ}
          questionIndex={currentIndex}
          totalQuestions={questions.length}
          onAnswer={(ans, correct, time) => handleQuestionAnswer(ans, correct, time)}
          streak={currentStreak}
        />
      )}

      {currentQ.type === 'true_false' && (
        <TrueFalseGame
          key={currentQ.id}
          question={currentQ}
          questionIndex={currentIndex}
          totalQuestions={questions.length}
          onAnswer={(ans, correct, time, score) => handleQuestionAnswer(ans, correct, time, score)}
        />
      )}

      {currentQ.type === 'matching' && (
        <MatchingGame
          key={currentQ.id}
          question={currentQ}
          questionIndex={currentIndex}
          totalQuestions={questions.length}
          onAnswer={(ans, correct, time, score) => handleQuestionAnswer(ans, correct, time, score)}
        />
      )}

    </div>
  );
};
