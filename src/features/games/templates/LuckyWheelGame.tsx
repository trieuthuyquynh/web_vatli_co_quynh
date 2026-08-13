import React, { useState, useRef, useEffect } from 'react';
import { LuckyWheelItem } from '../../../types';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, RotateCw, CheckCircle2, Zap, HelpCircle } from 'lucide-react';

interface LuckyWheelGameProps {
  items: LuckyWheelItem[];
  isPractice?: boolean;
  onFinish: (score: number, maxScore: number, timeSpent: number) => void;
}

export const LuckyWheelGame: React.FC<LuckyWheelGameProps> = ({
  items,
  isPractice = false,
  onFinish
}) => {
  const [spinning, setSpinning] = useState<boolean>(false);
  const [rotation, setRotation] = useState<number>(0);
  const [selectedItem, setSelectedItem] = useState<LuckyWheelItem | null>(null);
  const [totalXpEarned, setTotalXpEarned] = useState<number>(0);
  const [spinsLeft, setSpinsLeft] = useState<number>(3);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [startTime] = useState<number>(Date.now());

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const colors = items.map(it => it.color || '#0284c7');

  // Vẽ Canvas Vòng Quay
  const drawWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 10;
    const sliceAngle = (2 * Math.PI) / items.length;

    ctx.clearRect(0, 0, width, height);

    items.forEach((item, idx) => {
      const angle = idx * sliceAngle;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, angle, angle + sliceAngle);
      ctx.fillStyle = item.color;
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Vẽ chữ
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px Inter, sans-serif';
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 4;
      ctx.fillText(item.label, radius - 20, 5);
      ctx.restore();
    });

    // Vẽ tâm vòng quay
    ctx.beginPath();
    ctx.arc(centerX, centerY, 22, 0, 2 * Math.PI);
    ctx.fillStyle = '#0f172a';
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 4;
    ctx.stroke();
  };

  useEffect(() => {
    drawWheel();
  }, [items]);

  const spin = () => {
    if (spinning || spinsLeft <= 0 || isCompleted) return;

    setSpinning(true);
    setSelectedItem(null);

    // Random góc quay (tối thiểu 5 vòng = 1800 độ + góc ngẫu nhiên)
    const extraRounds = 5 + Math.floor(Math.random() * 4);
    const randomDeg = Math.floor(Math.random() * 360);
    const totalDeg = rotation + (extraRounds * 360) + randomDeg;

    setRotation(totalDeg);

    setTimeout(() => {
      setSpinning(false);
      const sliceSize = 360 / items.length;
      // Kim nằm ở vị trí 270 độ (trên đỉnh)
      const actualDeg = (totalDeg % 360);
      const winningIdx = Math.floor(((360 - actualDeg + 270) % 360) / sliceSize);
      const winningItem = items[winningIdx] || items[0];

      setSelectedItem(winningItem);
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });

      if (winningItem.type === 'xp' && typeof winningItem.value === 'number') {
        setTotalXpEarned(prev => prev + (winningItem.value as number));
      } else if (winningItem.type === 'bonus') {
        setTotalXpEarned(prev => (prev > 0 ? prev * 2 : 100));
      } else {
        setTotalXpEarned(prev => prev + 80);
      }

      const nextSpins = spinsLeft - 1;
      setSpinsLeft(nextSpins);

      if (nextSpins === 0) {
        setIsCompleted(true);
      }
    }, 4500);
  };

  const finishGame = () => {
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    // Điểm quy đổi thang 10 dựa trên XP kiếm được
    const score = Math.min(10, Math.max(7, parseFloat((totalXpEarned / 30).toFixed(1))));
    onFinish(score, 10, timeSpent);
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto text-center">
      {/* Top Header */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <span>Lượt quay còn lại:</span>
          <span className="px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 font-mono font-black">
            {spinsLeft} Lượt
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600">
          <Trophy className="w-4 h-4" />
          <span>XP Tích Lũy:</span>
          <span className="font-mono font-black text-sm text-slate-900">+{totalXpEarned} XP</span>
        </div>
      </div>

      {/* Wheel Container */}
      <div className="relative flex items-center justify-center py-6">
        {/* Kim chỉ định vị trí */}
        <div className="absolute top-2 z-20 w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[28px] border-t-rose-500 drop-shadow-md" />

        {/* Canvas Wheel */}
        <div 
          className="relative transition-transform duration-[4500ms] cubic-bezier(0.15, 0.9, 0.2, 1)"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <canvas
            ref={canvasRef}
            width={320}
            height={320}
            className="rounded-full shadow-xl border-4 border-white bg-slate-900"
          />
        </div>
      </div>

      {/* Result Pop Card */}
      {selectedItem && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 animate-fade-in space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-sm font-black">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Chúc Mừng! Bạn Đã Quay Vào:</span>
          </div>
          <p className="text-base font-extrabold text-slate-900">{selectedItem.label}</p>
        </div>
      )}

      {/* Spin Button */}
      {!isCompleted ? (
        <button
          onClick={spin}
          disabled={spinning || spinsLeft <= 0}
          className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white font-extrabold text-sm shadow-md transition transform active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 mx-auto"
        >
          <RotateCw className={`w-4 h-4 ${spinning ? 'animate-spin' : ''}`} />
          <span>{spinning ? 'Đang Quay Bánh Xe...' : 'QUAY NGAY VÒNG QUAY'}</span>
        </button>
      ) : (
        <button
          onClick={finishGame}
          className="px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-md transition transform active:scale-95 flex items-center justify-center gap-2 mx-auto"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Nhận Thưởng & Hoàn Thành (+{totalXpEarned} XP)</span>
        </button>
      )}
    </div>
  );
};
