import React, { useState, useEffect } from 'react';
import { customGamesService } from '../../../services/customGamesService';
import { Modal } from '../../../components/common/Modal';
import { Trophy, Medal, Timer, Award, User, Sparkles } from 'lucide-react';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';

interface PerGameLeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameId: string;
  gameTitle: string;
}

export const PerGameLeaderboardModal: React.FC<PerGameLeaderboardModalProps> = ({
  isOpen,
  onClose,
  gameId,
  gameTitle
}) => {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (isOpen && gameId) {
      setLoading(true);
      customGamesService.getGameLeaderboard(gameId)
        .then(data => setLeaderboard(data))
        .finally(() => setLoading(false));
    }
  }, [isOpen, gameId]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Bảng Xếp Hạng Vinh Danh"
      maxWidth="max-w-xl"
    >
      <div className="space-y-5">
        {/* Game Title Header */}
        <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 text-sky-900 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-sky-700">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>ĐẤU TRƯỜNG TRÒ CHƠI</span>
          </div>
          <h3 className="text-sm sm:text-base font-extrabold truncate">{gameTitle}</h3>
          <p className="text-[11px] text-sky-700">
            Xếp hạng theo: <strong className="text-slate-900">Điểm cao nhất</strong> ➔ <strong className="text-slate-900">Thời gian ngắn nhất</strong>
          </p>
        </div>

        {loading ? (
          <LoadingSpinner text="Đang tải bảng xếp hạng..." />
        ) : leaderboard.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <Award className="w-10 h-10 text-slate-400 mx-auto" />
            <p className="text-xs font-bold text-slate-600">Chưa có lượt chơi tính điểm nào</p>
            <p className="text-[11px] text-slate-400">Hãy là người đầu tiên ghi tên mình lên bảng vàng!</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {leaderboard.map((item, idx) => {
              const rank = idx + 1;
              const isTop1 = rank === 1;
              const isTop2 = rank === 2;
              const isTop3 = rank === 3;

              return (
                <div
                  key={item.student_id || idx}
                  className={`flex items-center justify-between p-3 rounded-2xl border transition ${
                    isTop1
                      ? 'bg-amber-50/80 border-amber-300 ring-1 ring-amber-400/50'
                      : isTop2
                      ? 'bg-slate-100 border-slate-300'
                      : isTop3
                      ? 'bg-orange-50 border-orange-200'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Rank Badge */}
                    <div className="w-8 flex items-center justify-center">
                      {isTop1 ? (
                        <span className="w-7 h-7 rounded-full bg-amber-400 text-amber-950 font-black text-xs flex items-center justify-center shadow-sm">
                          🥇
                        </span>
                      ) : isTop2 ? (
                        <span className="w-7 h-7 rounded-full bg-slate-300 text-slate-900 font-black text-xs flex items-center justify-center shadow-sm">
                          🥈
                        </span>
                      ) : isTop3 ? (
                        <span className="w-7 h-7 rounded-full bg-amber-600 text-white font-black text-xs flex items-center justify-center shadow-sm">
                          🥉
                        </span>
                      ) : (
                        <span className="font-mono font-black text-xs text-slate-400">
                          #{rank}
                        </span>
                      )}
                    </div>

                    {/* Avatar & Name */}
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs">
                        {item.full_name?.charAt(0) || 'H'}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 leading-none">
                          {item.full_name}
                        </p>
                        {item.school && (
                          <span className="text-[10px] text-slate-400">{item.school}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Score & Time */}
                  <div className="flex items-center gap-4 text-right">
                    <div className="flex items-center gap-1 text-xs text-slate-500 font-mono">
                      <Timer className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.time_spent}s</span>
                    </div>

                    <div className="px-3 py-1 rounded-xl bg-sky-50 text-sky-800 border border-sky-200 font-mono font-black text-xs">
                      {item.score}/10
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="pt-2 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
          >
            Đóng bảng xếp hạng
          </button>
        </div>
      </div>
    </Modal>
  );
};
