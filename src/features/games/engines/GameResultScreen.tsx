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
    <div className="max-w-xl mx-auto p-8 rounded-3xl bg-gradient-to-b from-slate-800/90 to-slate-900/95 border border-slate-700 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-300">
      {/* Trophy Icon */}
      <div className="relative inline-block">
        <div className={`w-24 h-24 mx-auto rounded-3xl flex items-center justify-center shadow-xl ${
          isGreat
            ? 'bg-gradient-to-tr from-amber-400 to-yellow-500 shadow-amber-500/30'
            : 'bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-cyan-500/30'
        }`}>
          <Trophy className="w-12 h-12 text-slate-950 animate-bounce" />
        </div>
        <div className="absolute -bottom-2 inset-x-0 flex justify-center">
          <span className="px-3 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-slate-900 border border-slate-700 text-cyan-300">
            {isGreat ? 'Xuất Sắc!' : 'Hoàn Thành!'}
          </span>
        </div>
      </div>

      {/* Main Score Headline */}
      <div className="space-y-1 pt-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          {score.toFixed(1)} / 10 Điểm
        </h2>
        <p className="text-sm text-slate-400">
          Chính xác {correctCount} trên tổng số {totalQuestions} câu hỏi ({percentage}%)
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-1 text-cyan-400 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5 fill-cyan-400" />
            <span>Kinh nghiệm</span>
          </div>
          <div className="text-xl font-black text-white tracking-tight">+{xpEarned} XP</div>
        </div>

        <div className="space-y-1 border-x border-slate-800">
          <div className="flex items-center justify-center gap-1 text-emerald-400 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Đúng</span>
          </div>
          <div className="text-xl font-black text-white tracking-tight">{correctCount}/{totalQuestions}</div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-center gap-1 text-amber-400 text-xs font-semibold">
            <Clock className="w-3.5 h-3.5" />
            <span>Thời gian</span>
          </div>
          <div className="text-xl font-black text-white tracking-tight">{formatTime(totalTimeSpent)}</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <button
          onClick={onRestart}
          className="w-full sm:flex-1 py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Chơi Lại Bài Này</span>
        </button>

        <Link
          to="/games"
          className="w-full sm:flex-1 py-3 px-4 rounded-xl font-bold text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center gap-2 transition"
        >
          <Home className="w-4 h-4 text-cyan-400" />
          <span>Đấu Trường Game</span>
        </Link>
      </div>

      <div className="pt-2">
        <Link
          to="/leaderboard"
          className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 transition underline underline-offset-4"
        >
          <Award className="w-3.5 h-3.5" /> Xem bảng xếp hạng toàn quốc
        </Link>
      </div>
    </div>
  );
};
