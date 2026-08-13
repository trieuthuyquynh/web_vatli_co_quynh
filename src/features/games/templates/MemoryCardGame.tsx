import React, { useState, useEffect } from 'react';
import { MemoryCardPair } from '../../../types';
import confetti from 'canvas-confetti';
import { Sparkles, Timer, RotateCcw, CheckCircle2, Award, Zap } from 'lucide-react';
import katex from 'katex';

interface MemoryCardGameProps {
  pairs: MemoryCardPair[];
  timeLimit?: number; // Giây
  isPractice?: boolean;
  onFinish: (score: number, maxScore: number, timeSpent: number) => void;
}

interface CardItem {
  uid: string;
  pairId: string;
  type: 'term' | 'formula';
  content: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export const MemoryCardGame: React.FC<MemoryCardGameProps> = ({
  pairs,
  timeLimit = 120,
  isPractice = false,
  onFinish
}) => {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [matchedCount, setMatchedCount] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(timeLimit);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [streak, setStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);

  // Khởi tạo và xáo trộn bộ bài
  const initGame = () => {
    const cardList: CardItem[] = [];
    pairs.forEach(p => {
      cardList.push({
        uid: `${p.id}-term`,
        pairId: p.id,
        type: 'term',
        content: p.term,
        isFlipped: false,
        isMatched: false
      });
      cardList.push({
        uid: `${p.id}-formula`,
        pairId: p.id,
        type: 'formula',
        content: p.formulaOrDef,
        isFlipped: false,
        isMatched: false
      });
    });

    // Shuffle
    const shuffled = cardList.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setSelectedCards([]);
    setMoves(0);
    setMatchedCount(0);
    setTimeLeft(timeLimit);
    setIsCompleted(false);
    setStreak(0);
    setMaxStreak(0);
  };

  useEffect(() => {
    initGame();
  }, [pairs, timeLimit]);

  // Đồng hồ đếm ngược
  useEffect(() => {
    if (isCompleted || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleGameOver(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isCompleted, timeLeft]);

  const handleCardClick = (index: number) => {
    if (
      cards[index].isFlipped || 
      cards[index].isMatched || 
      selectedCards.length >= 2 || 
      isCompleted
    ) {
      return;
    }

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newSelected = [...selectedCards, index];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      setMoves(prev => prev + 1);
      const [firstIdx, secondIdx] = newSelected;
      const firstCard = newCards[firstIdx];
      const secondCard = newCards[secondIdx];

      if (firstCard.pairId === secondCard.pairId && firstCard.type !== secondCard.type) {
        // MATCHED!
        setTimeout(() => {
          setCards(prev => {
            const updated = [...prev];
            updated[firstIdx].isMatched = true;
            updated[secondIdx].isMatched = true;
            return updated;
          });
          const nextMatched = matchedCount + 1;
          setMatchedCount(nextMatched);
          setStreak(s => {
            const nextS = s + 1;
            if (nextS > maxStreak) setMaxStreak(nextS);
            return nextS;
          });
          setSelectedCards([]);

          if (nextMatched === pairs.length) {
            handleGameOver(true);
          }
        }, 500);
      } else {
        // MISMATCH
        setStreak(0);
        setTimeout(() => {
          setCards(prev => {
            const updated = [...prev];
            updated[firstIdx].isFlipped = false;
            updated[secondIdx].isFlipped = false;
            return updated;
          });
          setSelectedCards([]);
        }, 900);
      }
    }
  };

  const handleGameOver = (win: boolean) => {
    setIsCompleted(true);
    const timeSpent = timeLimit - timeLeft;

    // Tính điểm thang 10: Tỷ lệ đúng + Thưởng tốc độ & Chuỗi streak
    let score = 0;
    if (win) {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      const baseScore = 8.0;
      const speedBonus = Math.min(1.5, ((timeLimit - timeSpent) / timeLimit) * 1.5);
      const streakBonus = Math.min(0.5, (maxStreak / pairs.length) * 0.5);
      score = Math.min(10, parseFloat((baseScore + speedBonus + streakBonus).toFixed(1)));
    } else {
      score = parseFloat(((matchedCount / pairs.length) * 7.0).toFixed(1));
    }

    onFinish(score, 10, timeSpent);
  };

  // Helper render công thức KaTeX
  const renderFormula = (text: string) => {
    try {
      return (
        <span 
          dangerouslySetInnerHTML={{ 
            __html: katex.renderToString(text, { throwOnError: false, displayMode: true, output: 'html' }) 
          }} 
        />
      );
    } catch {
      return <span>{text}</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Timer className={`w-5 h-5 ${timeLeft <= 20 ? 'text-rose-500 animate-pulse' : 'text-sky-600'}`} />
            <span className="font-mono font-extrabold text-lg text-slate-800">
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
            <span>Số lần lật:</span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 font-mono text-sky-700 font-black">{moves}</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
            <span>Ghép đúng:</span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono font-black">
              {matchedCount}/{pairs.length}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {streak > 1 && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-black animate-bounce">
              <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>Combo x{streak}!</span>
            </div>
          )}

          {isPractice && (
            <span className="px-2.5 py-1 rounded-full text-xs font-black bg-purple-50 text-purple-700 border border-purple-200">
              Chế độ Luyện tập
            </span>
          )}

          <button
            onClick={initGame}
            className="p-2 rounded-xl text-slate-500 hover:text-sky-700 hover:bg-sky-50 transition"
            title="Chơi lại từ đầu"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Game Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
        {cards.map((card, idx) => (
          <div
            key={card.uid}
            onClick={() => handleCardClick(idx)}
            className={`relative h-32 sm:h-36 rounded-2xl cursor-pointer transition-all duration-300 transform select-none ${
              card.isMatched
                ? 'opacity-60 pointer-events-none scale-95 border-2 border-emerald-400 bg-emerald-50/50'
                : card.isFlipped
                ? 'bg-white border-2 border-sky-500 shadow-md scale-100'
                : 'bg-gradient-to-br from-sky-600 to-cyan-600 border border-sky-400 hover:shadow-lg hover:-translate-y-1'
            } flex items-center justify-center p-3 text-center`}
          >
            {card.isFlipped || card.isMatched ? (
              <div className="w-full flex flex-col items-center justify-center overflow-hidden">
                {card.type === 'term' ? (
                  <span className="text-xs sm:text-sm font-bold text-slate-800 leading-snug">
                    {card.content}
                  </span>
                ) : (
                  <div className="text-xs sm:text-sm font-bold text-sky-700 overflow-x-auto max-w-full">
                    {renderFormula(card.content)}
                  </div>
                )}
                {card.isMatched && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1" />
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1 text-white">
                <Sparkles className="w-6 h-6 opacity-80 animate-pulse" />
                <span className="text-[10px] font-black tracking-widest uppercase opacity-90">VẬT LÍ 12</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
