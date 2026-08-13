import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { Trophy, Zap, Clock, CheckCircle2, RotateCcw, Home, Award } from 'lucide-react';

interface GameResultScreenProps {
  score: number;
  totalQuestions: number;
  correctCount: number;
  totalTimeSpent: number;
  xpEarned: number;
  onRestart: () => void;
}

export const GameResultScreen: React.FC<GameResultScreenProps> = ({
  score,
  totalQuestions,
  correctCount,
  totalTimeSpent,
  xpEarned,
  onRestart,
}) => {
  const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const isGreat = percentage >= 75;

  useEffect(() => {
    if (isGreat) {
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#06B6D4', '#3B82F6', '#F59E0B', '#10B981', '#F43F5E']
        });
      } catch {}
    }
  }, [isGreat]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins > 0 ? `${mins}m ` : ''}${secs}s`;
  };

  return (
    <div className="max-w-xl mx-auto p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/90 shadow-soft text-center space-y-6 animate-in zoom-in-95 duration-300">
      {/* Trophy Icon */}
      <div className="relative inline-block">
        <div className={`w-24 h-24 mx-auto rounded-3xl flex items-center justify-center shadow-lg ${
          isGreat
            ? 'bg-gradient-to-tr from-amber-400 to-yellow-500 shadow-amber-500/20'
            : 'bg-gradient-to-tr from-sky-500 to-blue-600 shadow-sky-500/20'
        }`}>
          <Trophy className="w-12 h-12 text-white animate-bounce" />
        </div>
        <div className="absolute -bottom-2 inset-x-0 flex justify-center">
          <span className="px-3.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-white border border-slate-200 text-sky-800 shadow-xs">
            {isGreat ? 'Xuất Sắc!' : 'Hoàn Thành!'}
          </span>
        </div>
      </div>

      {/* Main Score Headline */}
      <div className="space-y-1 pt-2">
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {score.toFixed(1)} / 10 Điểm
        </h2>
        <p className="text-xs sm:text-sm text-slate-600">
          Chính xác {correctCount} trên tổng số {totalQuestions} câu hỏi ({percentage}%)
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-1 text-sky-700 text-xs font-bold">
            <Zap className="w-3.5 h-3.5 fill-sky-600" />
            <span>Kinh nghiệm</span>
          </div>
          <div className="text-xl font-black text-slate-900 tracking-tight">+{xpEarned} XP</div>
        </div>

        <div className="space-y-1 border-x border-slate-200">
          <div className="flex items-center justify-center gap-1 text-emerald-700 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Đúng</span>
          </div>
          <div className="text-xl font-black text-slate-900 tracking-tight">{correctCount}/{totalQuestions}</div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-center gap-1 text-amber-700 text-xs font-bold">
            <Clock className="w-3.5 h-3.5" />
            <span>Thời gian</span>
          </div>
          <div className="text-xl font-black text-slate-900 tracking-tight">{formatTime(totalTimeSpent)}</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          onClick={onRestart}
          className="w-full sm:w-auto px-6 py-3 rounded-2xl font-bold text-xs bg-sky-600 hover:bg-sky-500 text-white shadow-md shadow-sky-600/20 transition flex items-center justify-center gap-2 active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Luyện Lại Bài Này</span>
        </button>

        <Link
          to="/games"
          className="w-full sm:w-auto px-6 py-3 rounded-2xl font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition flex items-center justify-center gap-2"
        >
          <Home className="w-4 h-4" />
          <span>Về Đấu Trường Game</span>
        </Link>
      </div>

      <div className="pt-2">
        <Link
          to="/leaderboard"
          className="inline-flex items-center gap-1.5 text-xs text-amber-600 hover:text-amber-500 transition underline underline-offset-4"
        >
          <Award className="w-3.5 h-3.5" /> Xem bảng xếp hạng toàn quốc
        </Link>
      </div>
    </div>
  );
};
