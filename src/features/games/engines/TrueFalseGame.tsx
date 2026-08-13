import React, { useState, useEffect } from 'react';
import { Question, TrueFalseStatement } from '../../../types';
import { MathRenderer } from '../../../components/common/MathRenderer';
import { Check, X, Clock, ArrowRight, Lightbulb, CheckCircle2, XCircle } from 'lucide-react';

interface TrueFalseGameProps {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  onAnswer: (userAnswer: boolean[], isCorrect: boolean, timeSpent: number, scoreObtained: number) => void;
  timeLimit?: number;
}

export const TrueFalseGame: React.FC<TrueFalseGameProps> = ({
  question,
  questionIndex,
  totalQuestions,
  onAnswer,
  timeLimit = 60
}) => {
  // Statements a, b, c, d
  const statements: TrueFalseStatement[] = Array.isArray(question.options)
    ? (question.options as TrueFalseStatement[])
    : [];

  const correctAnswers: boolean[] = Array.isArray(question.correct_answer)
    ? (question.correct_answer as boolean[])
    : [true, false, true, false];

  const [userChoices, setUserChoices] = useState<Record<number, boolean | null>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(timeLimit);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  useEffect(() => {
    setTimeLeft(timeLimit);
    setIsSubmitted(false);
    setUserChoices({});
    setShowExplanation(false);
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

  const handleSelect = (index: number, choice: boolean) => {
    if (isSubmitted) return;
    setUserChoices(prev => ({
      ...prev,
      [index]: choice
    }));
  };

  const calculateScore = () => {
    let correctCount = 0;
    statements.forEach((_, idx) => {
      if (userChoices[idx] === correctAnswers[idx]) {
        correctCount++;
      }
    });

    // Thang điểm chuẩn cấu trúc đề thi TN THPT mới của Bộ GD&ĐT
    let score = 0;
    if (correctCount === 1) score = 0.1;
    else if (correctCount === 2) score = 0.25;
    else if (correctCount === 3) score = 0.5;
    else if (correctCount === 4) score = 1.0;

    return { correctCount, score };
  };

  const handleSubmit = () => {
    if (isSubmitted) return;
    setIsSubmitted(true);

    const { score, correctCount } = calculateScore();
    const isAllCorrect = correctCount === statements.length;

    // Âm thanh phản hồi
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.frequency.setValueAtTime(isAllCorrect ? 659.25 : 392, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } catch {}
  };

  const handleNext = () => {
    const { score, correctCount } = calculateScore();
    const isAllCorrect = correctCount === statements.length;
    const answerArray = statements.map((_, idx) => Boolean(userChoices[idx]));
    const timeSpent = timeLimit - timeLeft;
    onAnswer(answerArray, isAllCorrect, timeSpent, score * 100);
  };

  const allSelected = statements.length > 0 && statements.every((_, idx) => userChoices[idx] !== undefined && userChoices[idx] !== null);
  const timerPercentage = (timeLeft / timeLimit) * 100;
  const { correctCount, score } = calculateScore();

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-50 text-amber-800 border border-amber-200">
            Dạng Đúng/Sai: Câu {questionIndex + 1} / {totalQuestions}
          </span>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200">
            Chuẩn Cấu Trúc Thi Tốt Nghiệp THPT
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-32 sm:w-48 h-2.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${
                timerPercentage > 40 ? 'bg-amber-500' : 'bg-rose-500'
              }`}
              style={{ width: `${timerPercentage}%` }}
            />
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-slate-700">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>{timeLeft}s</span>
          </div>
        </div>
      </div>

      {/* Context / Question Lead */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-soft">
        <div className="text-base sm:text-lg font-semibold text-slate-900 leading-relaxed">
          <MathRenderer content={question.content} />
        </div>
      </div>

      {/* 4 Statements Table */}
      <div className="space-y-3">
        {statements.map((st, index) => {
          const letter = String.fromCharCode(97 + index); // a, b, c, d
          const currentChoice = userChoices[index];
          const actualCorrect = correctAnswers[index];
          const isUserRight = isSubmitted && currentChoice === actualCorrect;

          return (
            <div
              key={st.id || index}
              className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isSubmitted
                  ? isUserRight
                    ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                    : 'bg-rose-50/80 border-rose-300 text-rose-950'
                  : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800 shadow-xs'
              }`}
            >
              <div className="flex items-start gap-3 flex-1">
                <span className="w-7 h-7 rounded-xl bg-slate-100 text-sky-700 border border-slate-200 flex items-center justify-center font-bold text-sm shrink-0">
                  {letter})
                </span>
                <div className="text-sm font-medium pt-0.5 leading-relaxed">
                  <MathRenderer content={st.text} />
                </div>
              </div>

              {/* True / False Buttons */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => handleSelect(index, true)}
                  disabled={isSubmitted}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs transition active:scale-95 ${
                    currentChoice === true
                      ? isSubmitted
                        ? actualCorrect === true
                          ? 'bg-emerald-600 text-white'
                          : 'bg-rose-600 text-white'
                        : 'bg-sky-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>ĐÚNG</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelect(index, false)}
                  disabled={isSubmitted}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs transition active:scale-95 ${
                    currentChoice === false
                      ? isSubmitted
                        ? actualCorrect === false
                          ? 'bg-emerald-600 text-white'
                          : 'bg-rose-600 text-white'
                        : 'bg-rose-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  <X className="w-3.5 h-3.5" />
                  <span>SAI</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Footer */}
      {!isSubmitted ? (
        <div className="flex justify-end pt-2">
          <button
            onClick={handleSubmit}
            disabled={!allSelected}
            className={`px-6 py-3 rounded-2xl font-extrabold text-sm flex items-center gap-2 transition ${
              allSelected
                ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-600/20 cursor-pointer active:scale-95'
                : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
            }`}
          >
            <span>{allSelected ? 'Xác nhận Nộp Bài' : 'Vui lòng chọn Đúng/Sai cho cả 4 ý'}</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-soft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
                {correctCount === statements.length ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-amber-600" />
                )}
                <span>
                  Bạn trả lời đúng {correctCount}/4 ý (Đạt {score}/1.0 điểm chuẩn THPT)
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Nhận được +{Math.round(score * 100)} XP kinh nghiệm
              </p>
            </div>

            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              {showExplanation ? 'Ẩn lời giải' : 'Xem phân tích chi tiết'}
            </button>
          </div>

          {showExplanation && question.explanation && (
            <div className="p-5 rounded-2xl bg-white border border-amber-200 shadow-soft text-xs text-slate-700 space-y-1.5">
              <div className="font-extrabold text-amber-800 flex items-center gap-1.5 mb-1">
                <Lightbulb className="w-4 h-4 text-amber-600" /> Phân tích từng nhận định theo SGK:
              </div>
              <div className="font-medium leading-relaxed">
                <MathRenderer content={question.explanation} block />
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl font-extrabold text-sm bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-600/20 transition active:scale-95"
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

