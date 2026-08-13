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
import { ArrowLeft, Gamepad2, AlertCircle } from 'lucide-react';

export const GamePlayPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, updateUserXp } = useAuth();

  const queryType = searchParams.get('type') as QuestionType | null;
  const queryLesson = searchParams.get('lesson');
  const queryPin = searchParams.get('pin');

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [answersLog, setAnswersLog] = useState<AnswerDetail[]>([]);
  const [totalTimeSpent, setTotalTimeSpent] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [finalScore, setFinalScore] = useState<number>(0);
  const [xpEarned, setXpEarned] = useState<number>(0);

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const allQ = await gamesService.getQuestions({
        lessonId: queryLesson || undefined,
        type: queryType || undefined
      });
      // Shuffle slightly for gaming variety
      const shuffled = [...allQ].sort(() => Math.random() - 0.5);
      setQuestions(shuffled);
      setCurrentIndex(0);
      setAnswersLog([]);
      setTotalTimeSpent(0);
      setIsGameOver(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, [queryType, queryLesson, queryPin]);

  const handleQuestionAnswer = (
    userAnswer: any,
    isCorrect: boolean,
    timeSpent: number,
    customScore?: number
  ) => {
    const currentQ = questions[currentIndex];
    const scoreForThisQ = customScore !== undefined ? customScore : (isCorrect ? 100 : 0);

    const logEntry: AnswerDetail = {
      question_id: currentQ.id,
      type: currentQ.type,
      user_answer: userAnswer,
      is_correct: isCorrect,
      score_obtained: scoreForThisQ
    };

    const nextLog = [...answersLog, logEntry];
    setAnswersLog(nextLog);
    setTotalTimeSpent(prev => prev + timeSpent);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Game Over
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
    
    // Tính XP: 100 XP cơ bản + 20 XP cho mỗi câu đúng + điểm thưởng
    const earnedXp = Math.round(50 + (computedScore * 20));

    setFinalScore(computedScore);
    setXpEarned(earnedXp);
    setIsGameOver(true);

    // Cập nhật XP người dùng
    updateUserXp(earnedXp);

    // Lưu lượt chơi vào Database Supabase
    try {
      await gamesService.saveAttempt({
        student_id: user?.id || 'student-an',
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

  if (loading) {
    return <LoadingSpinner text="Đang chuẩn bị đấu trường câu hỏi Vật Lí 12..." />;
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 text-center rounded-3xl bg-white border border-slate-200/90 shadow-soft space-y-4">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
        <h3 className="text-lg font-bold text-slate-900">Chưa có câu hỏi cho mục này</h3>
        <p className="text-xs text-slate-500">
          Hãy chọn bài học khác trong Đấu trường hoặc vào Studio soạn thêm câu hỏi mới.
        </p>
        <Link
          to="/games"
          className="inline-block px-5 py-2.5 rounded-xl font-bold text-xs bg-sky-600 hover:bg-sky-500 text-white shadow-sm transition"
        >
          Quay lại sảnh game
        </Link>
      </div>
    );
  }

  if (isGameOver) {
    return (
      <div className="py-8">
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
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      {/* Top Exit button */}
      <div className="flex items-center justify-between">
        <Link
          to="/games"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-sky-700 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Thoát khỏi trận đấu
        </Link>
        <span className="text-xs font-black text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
          VẬT LÍ 12 • SGK KẾT NỐI TRI THỨC
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

