import React, { useState, useEffect } from 'react';
import { Question } from '../../../types';
import { MathRenderer } from '../../../components/common/MathRenderer';
import { Clock, CheckCircle2, XCircle, Zap, ArrowRight, Lightbulb } from 'lucide-react';

interface MultipleChoiceGameProps {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  onAnswer: (userAnswer: string, isCorrect: boolean, timeSpent: number) => void;
  timeLimit?: number;
}

export const MultipleChoiceGame: React.FC<MultipleChoiceGameProps> = ({
  question,
  questionIndex,
  totalQuestions,
  onAnswer,
  timeLimit = 30
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(timeLimit);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  const letters = ['A', 'B', 'C', 'D'];
  const options = Array.isArray(question.options) ? (question.options as string[]) : [];
  const correctAnswer = String(question.correct_answer).toUpperCase().trim();

  // Đếm ngược thời gian
  useEffect(() => {
    setTimeLeft(timeLimit);
    setIsAnswered(false);
    setSelectedOption(null);
    setShowExplanation(false);
  }, [question, timeLimit]);

  useEffect(() => {
    if (isAnswered) return;

    if (timeLeft <= 0) {
      handleSelectOption('TIMEOUT');
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isAnswered]);

  const handleSelectOption = (letter: string) => {
    if (isAnswered) return;

    setIsAnswered(true);
    setSelectedOption(letter);
    const isCorrect = letter === correctAnswer;

    // Phát âm thanh nhẹ nhàng bằng Web Audio API
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = isCorrect ? 'sine' : 'sawtooth';
      osc.frequency.setValueAtTime(isCorrect ? 587.33 : 220, audioCtx.currentTime); // D5 hoặc A3
      if (isCorrect) {
        osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1); // A5
      }
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch {}
  };

  const handleNext = () => {
    const isCorrect = selectedOption === correctAnswer;
    const timeSpent = timeLimit - timeLeft;
    onAnswer(selectedOption || '', isCorrect, timeSpent);
  };

  const timerPercentage = (timeLeft / timeLimit) * 100;

  return (
    <div className="space-y-6">
      {/* Top Header: Progress & Timer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
            Câu {questionIndex + 1} / {totalQuestions}
          </span>
          <span className="text-xs uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-semibold">
            {question.difficulty === 'easy' ? 'Dễ' : question.difficulty === 'medium' ? 'Vận dụng' : 'Vận dụng cao'}
          </span>
        </div>

        {/* Timer Bar */}
        <div className="flex items-center gap-3">
          <div className="w-32 sm:w-48 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${
                timerPercentage > 40 ? 'bg-cyan-400' : timerPercentage > 20 ? 'bg-amber-400' : 'bg-rose-500'
              }`}
              style={{ width: `${timerPercentage}%` }}
            />
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-slate-300">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>{timeLeft}s</span>
          </div>
        </div>
      </div>

      {/* Question Content Box */}
      <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-800/80 to-slate-900/90 border border-slate-700/80 shadow-xl">
        <div className="text-base sm:text-lg font-medium text-slate-100 leading-relaxed">
          <MathRenderer content={question.content} />
        </div>
      </div>

      {/* 4 Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((optText, index) => {
          const letter = letters[index];
          const isSelected = selectedOption === letter;
          const isThisCorrect = letter === correctAnswer;

          let btnStyle = 'bg-slate-900/80 border-slate-700 hover:border-cyan-500/50 hover:bg-slate-800/80 text-slate-200';

          if (isAnswered) {
            if (isThisCorrect) {
              btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/30';
            } else if (isSelected && !isThisCorrect) {
              btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-300 ring-2 ring-rose-500/30';
            } else {
              btnStyle = 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-60';
            }
          }

          return (
            <button
              key={letter}
              onClick={() => handleSelectOption(letter)}
              disabled={isAnswered}
              className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all duration-200 ${btnStyle} ${
                !isAnswered ? 'cursor-pointer active:scale-[0.99]' : 'cursor-default'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 ${
                isAnswered && isThisCorrect
                  ? 'bg-emerald-500 text-white'
                  : isAnswered && isSelected && !isThisCorrect
                  ? 'bg-rose-500 text-white'
                  : 'bg-slate-800 text-cyan-400 border border-slate-700'
              }`}>
                {letter}
              </div>
              <div className="flex-1 pt-1 text-sm font-medium">
                <MathRenderer content={optText} />
              </div>
              {isAnswered && isThisCorrect && (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 self-center" />
              )}
              {isAnswered && isSelected && !isThisCorrect && (
                <XCircle className="w-5 h-5 text-rose-400 shrink-0 self-center" />
              )}
            </button>
          );
        })}
      </div>

      {/* Answer Feedback & Explanation */}
      {isAnswered && (
        <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <div className={`p-4 rounded-xl border flex items-center justify-between ${
            selectedOption === correctAnswer
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}>
            <div className="flex items-center gap-2 font-bold text-sm">
              {selectedOption === correctAnswer ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>Chính xác! Bạn nhận được +100 XP</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-rose-400" />
                  <span>Chưa đúng! Đáp án đúng là {correctAnswer}</span>
                </>
              )}
            </div>

            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              {showExplanation ? 'Ẩn lời giải' : 'Xem lời giải chi tiết'}
            </button>
          </div>

          {showExplanation && question.explanation && (
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700 text-xs text-slate-300 space-y-1">
              <div className="font-bold text-amber-400 flex items-center gap-1.5 mb-1">
                <Lightbulb className="w-4 h-4" /> Hướng dẫn giải & Phân tích hiện tượng:
              </div>
              <MathRenderer content={question.explanation} block />
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 transition active:scale-95"
            >
              <span>{questionIndex + 1 === totalQuestions ? 'Xem Kết Quả' : 'Câu Tiếp Theo'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
