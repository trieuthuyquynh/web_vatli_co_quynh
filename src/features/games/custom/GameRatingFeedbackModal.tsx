import React, { useState, useEffect } from 'react';
import { customGamesService } from '../../../services/customGamesService';
import { GameFeedback } from '../../../types';
import { Modal } from '../../../components/common/Modal';
import { Star, Heart, MessageSquare, Send, CheckCircle2, User } from 'lucide-react';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';

interface GameRatingFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameId: string;
  gameTitle: string;
  studentId: string;
  studentName: string;
  onFeedbackSubmitted?: () => void;
}

export const GameRatingFeedbackModal: React.FC<GameRatingFeedbackModalProps> = ({
  isOpen,
  onClose,
  gameId,
  gameTitle,
  studentId,
  studentName,
  onFeedbackSubmitted
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [isLiked, setIsLiked] = useState<boolean>(true);
  const [feedbacks, setFeedbacks] = useState<GameFeedback[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const loadFeedbacks = async () => {
    setLoading(true);
    try {
      const list = await customGamesService.getGameFeedbacks(gameId);
      setFeedbacks(list);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && gameId) {
      loadFeedbacks();
      setSuccess(false);
      setComment('');
    }
  }, [isOpen, gameId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmitting(true);
    try {
      await customGamesService.submitFeedback({
        game_id: gameId,
        student_id: studentId,
        student_name: studentName,
        rating,
        comment: comment.trim(),
        is_liked: isLiked
      });
      setSuccess(true);
      await loadFeedbacks();
      if (onFeedbackSubmitted) onFeedbackSubmitted();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Đánh Giá & Nhận Xét Trò Chơi"
      maxWidth="max-w-xl"
    >
      <div className="space-y-6">
        {/* Game Title */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <p className="text-xs text-slate-500 font-bold">Trò chơi:</p>
          <h3 className="text-sm sm:text-base font-extrabold text-slate-900 truncate">{gameTitle}</h3>
        </div>

        {/* Feedback Form */}
        <form onSubmit={handleSubmit} className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Interactive Star Rating */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-700 mr-1">Chấm điểm:</span>
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 text-amber-400 hover:scale-110 transition"
                >
                  <Star
                    className={`w-6 h-6 ${
                      (hoverRating || rating) >= star
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Like / Heart Toggle */}
            <button
              type="button"
              onClick={() => setIsLiked(!isLiked)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                isLiked
                  ? 'bg-rose-50 text-rose-600 border border-rose-200'
                  : 'bg-slate-100 text-slate-500 border border-slate-200'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{isLiked ? 'Đã Thả Tim' : 'Thả Tim Game'}</span>
            </button>
          </div>

          <div>
            <textarea
              rows={3}
              placeholder="Bạn cảm thấy trò chơi này thế nào? Độ khó ra sao? Chia sẻ cảm nghĩ nhé..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            {success && (
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 animate-fade-in">
                <CheckCircle2 className="w-4 h-4" /> Cảm ơn đánh giá của bạn!
              </span>
            )}
            <div className="ml-auto">
              <button
                type="submit"
                disabled={submitting || !comment.trim()}
                className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-sm transition flex items-center gap-1.5 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? 'Đang gửi...' : 'Gửi Nhận Xét'}</span>
              </button>
            </div>
          </div>
        </form>

        {/* Existing Feedbacks List */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-sky-600" />
            <span>Nhận Xét Từ Các Bạn Học Sinh ({feedbacks.length}):</span>
          </h4>

          {loading ? (
            <LoadingSpinner text="Đang tải nhận xét..." />
          ) : feedbacks.length === 0 ? (
            <p className="text-xs text-slate-400 italic text-center py-4">Chưa có nhận xét nào. Hãy là người đầu tiên!</p>
          ) : (
            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {feedbacks.map(fb => (
                <div key={fb.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-[10px]">
                        {fb.student_name?.charAt(0) || 'H'}
                      </div>
                      <span className="font-bold text-slate-800">{fb.student_name}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: fb.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>

                  <p className="text-slate-600 leading-relaxed font-medium pl-8">
                    {fb.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
