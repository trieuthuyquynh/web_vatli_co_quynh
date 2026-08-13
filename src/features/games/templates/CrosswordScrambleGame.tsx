import React, { useState, useEffect } from 'react';
import { CrosswordWord } from '../../../types';
import confetti from 'canvas-confetti';
import { Timer, CheckCircle2, HelpCircle, RotateCcw, Sparkles, KeyRound } from 'lucide-react';

interface CrosswordScrambleGameProps {
  words: CrosswordWord[];
  timeLimit?: number;
  isPractice?: boolean;
  onFinish: (score: number, maxScore: number, timeSpent: number) => void;
}

export const CrosswordScrambleGame: React.FC<CrosswordScrambleGameProps> = ({
  words,
  timeLimit = 180,
  isPractice = false,
  onFinish
}) => {
  const [activeWordIdx, setActiveWordIdx] = useState<number>(0);
  const [userInputs, setUserInputs] = useState<string[]>(words.map(w => ''));
  const [solvedStatus, setSolvedStatus] = useState<boolean[]>(words.map(() => false));
  const [timeLeft, setTimeLeft] = useState<number>(timeLimit);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [hintCount, setHintCount] = useState<number>(0);

  // Chuẩn hóa chuỗi so sánh (bỏ dấu cách, in hoa)
  const normalize = (str: string) => str.replace(/\s+/g, '').toUpperCase();

  // Đếm ngược thời gian
  useEffect(() => {
    if (isCompleted || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          finishGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isCompleted, timeLeft]);

  const handleInputChange = (idx: number, val: string) => {
    const nextInputs = [...userInputs];
    nextInputs[idx] = val.toUpperCase();
    setUserInputs(nextInputs);

    // Tự động kiểm tra nếu đủ độ dài
    const target = normalize(words[idx].answer);
    if (normalize(val) === target) {
      const nextSolved = [...solvedStatus];
      nextSolved[idx] = true;
      setSolvedStatus(nextSolved);

      // Nếu giải hết tất cả các ô
      if (nextSolved.every(s => s === true)) {
        setTimeout(() => {
          finishGame();
        }, 600);
      }
    }
  };

  const useHint = () => {
    const currentWord = words[activeWordIdx];
    const target = normalize(currentWord.answer);
    const currentInput = userInputs[activeWordIdx] || '';
    
    // Gợi ý thêm 1 chữ cái tiếp theo
    if (currentInput.length < target.length) {
      const nextLetter = target[currentInput.length];
      const updated = currentInput + nextLetter;
      handleInputChange(activeWordIdx, updated);
      setHintCount(prev => prev + 1);
    }
  };

  const finishGame = () => {
    setIsCompleted(true);
    const timeSpent = timeLimit - timeLeft;
    const solvedCount = solvedStatus.filter(Boolean).length;
    
    let score = (solvedCount / words.length) * 10;
    // Trừ nhẹ điểm gợi ý
    score = Math.max(0, score - (hintCount * 0.5));
    score = parseFloat(score.toFixed(1));

    if (solvedCount === words.length) {
      confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
    }

    onFinish(score, 10, timeSpent);
  };

  const activeWord = words[activeWordIdx];

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Timer className={`w-5 h-5 ${timeLeft <= 30 ? 'text-rose-500 animate-pulse' : 'text-sky-600'}`} />
            <span className="font-mono font-extrabold text-lg text-slate-800">
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
            <span>Tiến độ:</span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono font-black">
              {solvedStatus.filter(Boolean).length}/{words.length} Ô Chữ
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isPractice && (
            <span className="px-2.5 py-1 rounded-full text-xs font-black bg-purple-50 text-purple-700 border border-purple-200">
              Chế độ Luyện tập
            </span>
          )}

          <button
            onClick={useHint}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 transition"
            title="Mở thêm 1 chữ cái gợi ý"
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-600" />
            <span>Gợi ý ({hintCount})</span>
          </button>
        </div>
      </div>

      {/* Crossword Rows List */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-sky-600" />
          <span>Danh Sách Ô Chữ Hàng Ngang:</span>
        </h3>

        <div className="space-y-3">
          {words.map((w, idx) => {
            const isSolved = solvedStatus[idx];
            const isActive = activeWordIdx === idx;
            const targetLen = normalize(w.answer).length;

            return (
              <div
                key={w.id}
                onClick={() => setActiveWordIdx(idx)}
                className={`p-4 rounded-2xl border transition cursor-pointer ${
                  isActive
                    ? 'border-sky-500 bg-sky-50/40 ring-2 ring-sky-500/20'
                    : isSolved
                    ? 'border-emerald-200 bg-emerald-50/30'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-800 text-white text-xs font-black flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-700">
                      ({targetLen} chữ cái)
                    </span>
                  </div>
                  {isSolved && (
                    <span className="flex items-center gap-1 text-xs font-black text-emerald-600">
                      <CheckCircle2 className="w-4 h-4" /> Chính xác: {w.displayTerm}
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium mb-3">
                  {w.clue}
                </p>

                {/* Interactive Letter Boxes */}
                <div className="flex flex-wrap gap-1.5 items-center">
                  {Array.from({ length: targetLen }).map((_, charIdx) => {
                    const char = (userInputs[idx] || '')[charIdx] || '';
                    return (
                      <div
                        key={charIdx}
                        className={`w-9 h-10 rounded-lg border-2 flex items-center justify-center font-mono font-black text-sm uppercase ${
                          isSolved
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                            : char
                            ? 'border-sky-500 bg-white text-sky-700 shadow-sm'
                            : 'border-slate-300 bg-white text-slate-400'
                        }`}
                      >
                        {char}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Input box for currently active word */}
        {!solvedStatus[activeWordIdx] && (
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-3">
            <span className="text-xs font-bold text-slate-700 whitespace-nowrap">
              Nhập đáp án ô {activeWordIdx + 1}:
            </span>
            <input
              type="text"
              placeholder={`Nhập từ khóa không dấu (${normalize(activeWord.answer).length} chữ cái)...`}
              value={userInputs[activeWordIdx] || ''}
              onChange={(e) => handleInputChange(activeWordIdx, e.target.value)}
              maxLength={normalize(activeWord.answer).length}
              className="flex-1 w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white font-mono font-bold uppercase text-sky-700 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              autoFocus
            />
          </div>
        )}
      </div>
    </div>
  );
};
