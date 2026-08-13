import React, { useState, useEffect } from 'react';
import { Question, MatchingOptions, MatchingItem } from '../../../types';
import { MathRenderer } from '../../../components/common/MathRenderer';
import { Clock, ArrowRight, Lightbulb, Link2, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';

interface MatchingGameProps {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  onAnswer: (userMatches: Record<string, string>, isCorrect: boolean, timeSpent: number, scoreObtained: number) => void;
  timeLimit?: number;
}

export const MatchingGame: React.FC<MatchingGameProps> = ({
  question,
  questionIndex,
  totalQuestions,
  onAnswer,
  timeLimit = 60
}) => {
  const options = question.options as MatchingOptions;
  const leftItems: MatchingItem[] = options?.left || [];
  const rightItems: MatchingItem[] = options?.right || [];
  const correctMatches: Record<string, string> = (question.correct_answer as Record<string, string>) || {};

  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(timeLimit);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  // Shuffle right items on start for gameplay variety
  const [shuffledRight, setShuffledRight] = useState<MatchingItem[]>([]);

  useEffect(() => {
    setTimeLeft(timeLimit);
    setIsSubmitted(false);
    setSelectedLeft(null);
    setMatches({});
    setShowExplanation(false);
    // Shuffle right items
    const shuffled = [...rightItems].sort(() => Math.random() - 0.5);
    setShuffledRight(shuffled);
  }, [question, timeLimit]);

  useEffect(() => {
    if (isSubmitted) return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isSubmitted]);

  const handleLeftClick = (leftId: string) => {
    if (isSubmitted) return;
    if (selectedLeft === leftId) {
      setSelectedLeft(null);
    } else {
      setSelectedLeft(leftId);
    }
  };

  const handleRightClick = (rightId: string) => {
    if (isSubmitted) return;

    if (selectedLeft) {
      // Connect selectedLeft -> rightId
      setMatches(prev => {
        const next = { ...prev };
        // Remove any other left connected to this rightId
        Object.keys(next).forEach(lId => {
          if (next[lId] === rightId) delete next[lId];
        });
        next[selectedLeft] = rightId;
        return next;
      });
      setSelectedLeft(null);
    } else {
      // If no left selected, check if this right is matched and clicking removes it
      const matchedLeftId = Object.keys(matches).find(lId => matches[lId] === rightId);
      if (matchedLeftId) {
        setMatches(prev => {
          const next = { ...prev };
          delete next[matchedLeftId];
          return next;
        });
      }
    }
  };

  const resetAllMatches = () => {
    if (isSubmitted) return;
    setMatches({});
    setSelectedLeft(null);
  };

  const calculateResult = () => {
    let correctCount = 0;
    leftItems.forEach(item => {
      if (matches[item.id] === correctMatches[item.id]) {
        correctCount++;
      }
    });

    const isAllCorrect = correctCount === leftItems.length && leftItems.length > 0;
    const score = leftItems.length > 0 ? (correctCount / leftItems.length) : 0;
    return { correctCount, isAllCorrect, score };
  };

  const handleSubmit = () => {
    if (isSubmitted) return;
    setIsSubmitted(true);
    const { isAllCorrect } = calculateResult();

    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.frequency.setValueAtTime(isAllCorrect ? 523.25 : 330, audioCtx.currentTime);
      if (isAllCorrect) {
        osc.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.1);
      }
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } catch {}
  };

  const handleNext = () => {
    const { isAllCorrect, score } = calculateResult();
    const timeSpent = timeLimit - timeLeft;
    onAnswer(matches, isAllCorrect, timeSpent, score * 100);
  };

  const allConnected = leftItems.length > 0 && Object.keys(matches).length === leftItems.length;
  const timerPercentage = (timeLeft / timeLimit) * 100;
  const { correctCount } = calculateResult();

  // Color mapping for matching pairs on white background
  const colorPalette = [
    'border-sky-500 bg-sky-50 text-sky-900',
    'border-emerald-500 bg-emerald-50 text-emerald-900',
    'border-amber-500 bg-amber-50 text-amber-900',
    'border-indigo-500 bg-indigo-50 text-indigo-900',
    'border-rose-500 bg-rose-50 text-rose-900',
  ];

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-black bg-indigo-50 text-indigo-800 border border-indigo-200">
            Dạng Ghép Cặp: Câu {questionIndex + 1} / {totalQuestions}
          </span>
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">
            (Bấm chọn thẻ cột A sau đó bấm thẻ tương ứng ở cột B)
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-32 sm:w-48 h-2.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${
                timerPercentage > 40 ? 'bg-indigo-500' : 'bg-rose-500'
              }`}
              style={{ width: `${timerPercentage}%` }}
            />
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-slate-700">
            <Clock className="w-3.5 h-3.5 text-indigo-600" />
            <span>{timeLeft}s</span>
          </div>
        </div>
      </div>

      {/* Question Lead */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-soft">
        <div className="text-base sm:text-lg font-semibold text-slate-900 leading-relaxed">
          <MathRenderer content={question.content} />
        </div>
      </div>

      {/* 2 Matching Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* CỘT A (TRÁI) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-slate-200">
            <h4 className="text-xs font-black uppercase tracking-wider text-sky-700">Cột A: Khái Niệm / Hiện Tượng</h4>
            {!isSubmitted && Object.keys(matches).length > 0 && (
              <button
                onClick={resetAllMatches}
                className="text-[11px] font-bold text-slate-500 hover:text-rose-600 flex items-center gap-1 transition"
              >
                <RefreshCw className="w-3 h-3" /> Nối lại từ đầu
              </button>
            )}
          </div>

          <div className="space-y-3">
            {leftItems.map((item, idx) => {
              const isSelected = selectedLeft === item.id;
              const matchedRightId = matches[item.id];
              const isMatched = Boolean(matchedRightId);
              const colorClass = isMatched ? colorPalette[idx % colorPalette.length] : '';

              const isRightCorrect = isSubmitted && matchedRightId === correctMatches[item.id];

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleLeftClick(item.id)}
                  disabled={isSubmitted}
                  className={`w-full p-4 rounded-2xl border text-left flex items-start gap-3 transition-all duration-200 ${
                    isSubmitted
                      ? isRightCorrect
                        ? 'bg-emerald-50/90 border-emerald-400 text-emerald-950'
                        : 'bg-rose-50/90 border-rose-400 text-rose-950'
                      : isSelected
                      ? 'border-sky-500 bg-sky-50 text-sky-900 ring-2 ring-sky-400/30 scale-[1.01]'
                      : isMatched
                      ? `${colorClass} shadow-xs`
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800 shadow-xs'
                  }`}
                >
                  <span className="w-6 h-6 rounded-lg bg-slate-100 text-sky-700 border border-slate-200 flex items-center justify-center font-bold text-xs shrink-0">
                    {idx + 1}
                  </span>
                  <div className="flex-1 text-sm font-medium pt-0.5">
                    <MathRenderer content={item.text} />
                  </div>
                  {isMatched && !isSubmitted && (
                    <Link2 className="w-4 h-4 text-sky-600 shrink-0 self-center" />
                  )}
                  {isSubmitted && (
                    isRightCorrect
                      ? <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 self-center" />
                      : <XCircle className="w-5 h-5 text-rose-600 shrink-0 self-center" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* CỘT B (PHẢI) */}
        <div className="space-y-3">
          <div className="pb-1 border-b border-slate-200">
            <h4 className="text-xs font-black uppercase tracking-wider text-indigo-700">Cột B: Bản Chất / Công Thức</h4>
          </div>

          <div className="space-y-3">
            {shuffledRight.map((item) => {
              // Tìm xem item phải này đang được nối với left nào
              const matchedLeftId = Object.keys(matches).find(lId => matches[lId] === item.id);
              const leftIndex = leftItems.findIndex(l => l.id === matchedLeftId);
              const isMatched = matchedLeftId !== undefined;
              const colorClass = isMatched ? colorPalette[leftIndex % colorPalette.length] : '';

              const isMatchCorrect = isSubmitted && isMatched && matchedLeftId !== undefined && correctMatches[matchedLeftId] === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleRightClick(item.id)}
                  disabled={isSubmitted}
                  className={`w-full p-4 rounded-2xl border text-left flex items-start gap-3 transition-all duration-200 ${
                    isSubmitted
                      ? isMatched
                        ? isMatchCorrect
                          ? 'bg-emerald-50/90 border-emerald-400 text-emerald-950'
                          : 'bg-rose-50/90 border-rose-400 text-rose-950'
                        : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                      : isMatched
                      ? `${colorClass} shadow-xs`
                      : selectedLeft
                      ? 'bg-indigo-50/70 border-indigo-400 text-indigo-950 animate-pulse'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800 shadow-xs'
                  }`}
                >
                  <div className="flex-1 text-sm font-medium pt-0.5">
                    <MathRenderer content={item.text} />
                  </div>
                  {isMatched && (
                    <span className="text-xs font-black px-2.5 py-0.5 rounded-lg bg-white border border-slate-200 text-slate-800 shrink-0 self-center shadow-xs">
                      Nối #{leftIndex + 1}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Footer Submission */}
      {!isSubmitted ? (
        <div className="flex justify-end pt-2">
          <button
            onClick={handleSubmit}
            disabled={!allConnected}
            className={`px-6 py-3 rounded-2xl font-extrabold text-sm flex items-center gap-2 transition ${
              allConnected
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 cursor-pointer active:scale-95'
                : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
            }`}
          >
            <span>{allConnected ? 'Xác nhận Nối Cặp' : `Đã nối ${Object.keys(matches).length}/${leftItems.length} cặp`}</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-soft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
                {correctCount === leftItems.length ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-indigo-600" />
                )}
                <span>
                  Bạn đã nối chính xác {correctCount}/{leftItems.length} cặp!
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Nhận được +{Math.round((correctCount / leftItems.length) * 100)} XP kinh nghiệm
              </p>
            </div>

            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              {showExplanation ? 'Ẩn lời giải' : 'Xem đáp án chuẩn'}
            </button>
          </div>

          {showExplanation && question.explanation && (
            <div className="p-5 rounded-2xl bg-white border border-amber-200 shadow-soft text-xs text-slate-700 space-y-1.5">
              <div className="font-extrabold text-amber-800 flex items-center gap-1.5 mb-1">
                <Lightbulb className="w-4 h-4 text-amber-600" /> Bảng ghép cặp chuẩn SGK Vật Lí 12:
              </div>
              <div className="font-medium leading-relaxed">
                <MathRenderer content={question.explanation} block />
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl font-extrabold text-sm bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition active:scale-95"
            >
              <span>{questionIndex + 1 === totalQuestions ? 'Xem Tổng Kết' : 'Câu Tiếp Theo'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

