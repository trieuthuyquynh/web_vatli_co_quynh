import React, { useState, useEffect } from 'react';
import { Question } from '../../../types';
import { MathRenderer } from '../../../components/common/MathRenderer';
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Zap, 
  ArrowRight, 
  Lightbulb, 
  Flame,
  Triangle,
  Diamond,
  Circle,
  Square,
  Sparkles,
  Volume2
} from 'lucide-react';

interface MultipleChoiceGameProps {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  onAnswer: (userAnswer: string, isCorrect: boolean, timeSpent: number) => void;
  timeLimit?: number;
  streak?: number;
}

export const MultipleChoiceGame: React.FC<MultipleChoiceGameProps> = ({
  question,
  questionIndex,
  totalQuestions,
  onAnswer,
  timeLimit = 30,
  streak = 0
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(timeLimit);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  const letters = ['A', 'B', 'C', 'D'];
  const options = Array.isArray(question.options) ? (question.options as string[]) : [];
  const correctAnswer = String(question.correct_answer).toUpperCase().trim();

  // Reset khi sang câu mới
  useEffect(() => {
    setTimeLeft(timeLimit);
    setIsAnswered(false);
    setSelectedOption(null);
    setShowExplanation(false);
  }, [question, timeLimit]);

  // Đếm ngược thời gian
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

  const playSoundEffect = (type: 'correct' | 'wrong' | 'timeout') => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const now = audioCtx.currentTime;

      if (type === 'correct') {
        // Âm thanh vui tươi Ting-Ting-Ding!
        const osc1 = audioCtx.createOscillator();
        const osc2 = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc1.type = 'triangle';
        osc2.type = 'sine';

        osc1.frequency.setValueAtTime(523.25, now); // C5
        osc1.frequency.setValueAtTime(659.25, now + 0.1); // E5
        osc1.frequency.setValueAtTime(783.99, now + 0.2); // G5
        osc1.frequency.setValueAtTime(1046.50, now + 0.3); // C6

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

        osc1.connect(gain);
        gain.connect(audioCtx.destination);
        osc1.start(now);
        osc1.stop(now + 0.5);
      } else {
        // Âm thanh Buzz báo sai
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.linearRampToValueAtTime(110, now + 0.3);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.35);
      }
    } catch {}
  };

  const handleSelectOption = (letter: string) => {
    if (isAnswered) return;

    setIsAnswered(true);
    setSelectedOption(letter);
    const isCorrect = letter === correctAnswer;

    playSoundEffect(isCorrect ? 'correct' : 'wrong');
  };

  const handleNext = () => {
    const isCorrect = selectedOption === correctAnswer;
    const timeSpent = timeLimit - timeLeft;
    onAnswer(selectedOption || '', isCorrect, timeSpent);
  };

  const timerPercentage = (timeLeft / timeLimit) * 100;
  const isTimeCritical = timeLeft <= 5 && !isAnswered;

  // Kahoot Shape & Color configurations
  const shapeConfigs = [
    {
      letter: 'A',
      icon: Triangle,
      baseColor: 'bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white border-rose-700 shadow-rose-900/30',
      iconBg: 'bg-rose-800 text-white',
      shapeName: 'Tam Giác'
    },
    {
      letter: 'B',
      icon: Diamond,
      baseColor: 'bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white border-blue-700 shadow-blue-900/30',
      iconBg: 'bg-blue-800 text-white',
      shapeName: 'Kim Cương'
    },
    {
      letter: 'C',
      icon: Circle,
      baseColor: 'bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-white border-amber-600 shadow-amber-900/30',
      iconBg: 'bg-amber-700 text-white',
      shapeName: 'Hình Tròn'
    },
    {
      letter: 'D',
      icon: Square,
      baseColor: 'bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white border-emerald-700 shadow-emerald-900/30',
      iconBg: 'bg-emerald-800 text-white',
      shapeName: 'Hình Vuông'
    }
  ];

  const getDifficultyBadge = (diff: string) => {
    if (diff === 'easy') {
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
          🟢 Nhận biết
        </span>
      );
    }
    if (diff === 'medium') {
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-black bg-amber-50 text-amber-700 border border-amber-200">
          🟡 Thông hiểu
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-full text-xs font-black bg-rose-50 text-rose-700 border border-rose-200">
        🔴 Vận dụng
      </span>
    );
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* 1. TOP ARENA STATUS BAR */}
      <div className="flex items-center justify-between gap-4 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-sm">
        
        {/* Question Counter & Level Badge */}
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-xl text-xs font-black bg-sky-600 text-white shadow-xs">
            CÂU {questionIndex + 1} / {totalQuestions}
          </span>
          {getDifficultyBadge(question.difficulty)}
        </div>

        {/* Dynamic Timer with Heartbeat Animation when low */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block w-36 h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200 p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                timerPercentage > 40 ? 'bg-sky-500' : timerPercentage > 20 ? 'bg-amber-500' : 'bg-rose-500'
              }`}
              style={{ width: `${timerPercentage}%` }}
            />
          </div>

          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl font-black text-sm border ${
            isTimeCritical 
              ? 'bg-rose-500 text-white border-rose-600 animate-bounce'
              : 'bg-slate-100 text-slate-800 border-slate-200'
          }`}>
            <Clock className="w-4 h-4" />
            <span>{timeLeft}s</span>
          </div>
        </div>

      </div>

      {/* 2. QUESTION CARD (Quizizz Pro Screen) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-slate-200/90 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-sky-50 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 text-lg sm:text-xl font-extrabold text-slate-900 leading-relaxed text-center py-2">
          <MathRenderer content={question.content} />
        </div>
      </div>

      {/* 3. 4 KAHOOT / QUIZIZZ COLORFUL BUTTONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((optText, index) => {
          const config = shapeConfigs[index];
          const ShapeIcon = config.icon;
          const letter = config.letter;
          const isSelected = selectedOption === letter;
          const isThisCorrect = letter === correctAnswer;

          let cardStyle = config.baseColor;

          if (isAnswered) {
            if (isThisCorrect) {
              cardStyle = 'bg-emerald-600 text-white ring-4 ring-emerald-300 shadow-xl scale-[1.01] border-emerald-700';
            } else if (isSelected && !isThisCorrect) {
              cardStyle = 'bg-rose-700 text-white ring-4 ring-rose-300 opacity-90 border-rose-800 animate-shake';
            } else {
              cardStyle = 'bg-slate-200 text-slate-400 border-slate-300 opacity-40 grayscale';
            }
          }

          return (
            <button
              key={letter}
              onClick={() => handleSelectOption(letter)}
              disabled={isAnswered}
              className={`p-5 rounded-2xl border-b-4 text-left flex items-start gap-4 transition-all duration-200 shadow-md ${cardStyle} ${
                !isAnswered ? 'cursor-pointer active:translate-y-1 active:border-b-0 hover:shadow-lg' : 'cursor-default'
              }`}
            >
              {/* Shape Icon */}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 shadow-inner ${
                isAnswered && isThisCorrect 
                  ? 'bg-white text-emerald-700' 
                  : isAnswered && isSelected && !isThisCorrect
                  ? 'bg-white text-rose-700'
                  : config.iconBg
              }`}>
                <ShapeIcon className="w-5 h-5 fill-current" />
              </div>

              {/* Option Text */}
              <div className="flex-1 pt-1 text-base font-bold leading-snug">
                <span className="mr-2 font-black opacity-90">{letter}.</span>
                <MathRenderer content={optText} />
              </div>

              {/* Status Icons */}
              {isAnswered && isThisCorrect && (
                <CheckCircle2 className="w-6 h-6 text-white shrink-0 self-center" />
              )}
              {isAnswered && isSelected && !isThisCorrect && (
                <XCircle className="w-6 h-6 text-white shrink-0 self-center" />
              )}
            </button>
          );
        })}
      </div>

      {/* 4. INSTANT FEEDBACK & DETAILED KATEX EXPLANATION */}
      {isAnswered && (
        <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-bottom-4 duration-300">
          
          <div className={`p-5 rounded-2xl border-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md ${
            selectedOption === correctAnswer
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-rose-50 border-rose-300 text-rose-900'
          }`}>
            <div className="flex items-center gap-3">
              {selectedOption === correctAnswer ? (
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <XCircle className="w-6 h-6" />
                </div>
              )}
              <div>
                <div className="font-black text-base">
                  {selectedOption === correctAnswer ? 'CHÍNH XÁC TUYỆT VỜI! 🎉' : 'RẤT TIẾC, CHƯA CHÍNH XÁC! 💡'}
                </div>
                <div className="text-xs font-semibold opacity-90">
                  {selectedOption === correctAnswer 
                    ? 'Bạn nhận được trọn vẹn điểm số câu hỏi!' 
                    : `Đáp án đúng là: ${correctAnswer}. Hãy đọc giải thích bên dưới để nắm vững kiến thức!`}
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="flex items-center gap-1.5 text-xs font-black px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 shadow-sm transition self-stretch sm:self-auto justify-center"
            >
              <Lightbulb className="w-4 h-4 text-amber-500" />
              {showExplanation ? 'Ẩn Hướng Dẫn Giải' : 'Xem Lời Giải Chi Tiết'}
            </button>
          </div>

          {/* Detailed Explanation Box */}
          {showExplanation && question.explanation && (
            <div className="p-6 rounded-3xl bg-amber-50/70 border-2 border-amber-200 shadow-md space-y-2">
              <div className="font-black text-amber-900 text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                HƯỚNG DẪN GIẢI CHI TIẾT & BẢN CHẤT VẬT LÍ:
              </div>
              <div className="text-sm font-medium text-slate-800 leading-relaxed pt-1">
                <MathRenderer content={question.explanation} block />
              </div>
            </div>
          )}

          {/* Next Button */}
          <div className="flex justify-end pt-2">
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-8 py-3.5 rounded-2xl font-black text-sm bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white shadow-lg shadow-sky-600/30 transition transform active:scale-95"
            >
              <span>{questionIndex + 1 === totalQuestions ? 'Xem Bảng Điểm Tổng Kết' : 'Chuyển Sang Câu Kế Tiếp'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
