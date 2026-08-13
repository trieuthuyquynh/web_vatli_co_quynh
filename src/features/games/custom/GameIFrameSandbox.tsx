import React, { useState, useEffect, useRef } from 'react';
import { Maximize2, Minimize2, AlertCircle, CheckCircle2, RefreshCw, Send } from 'lucide-react';

interface GameIFrameSandboxProps {
  embedUrl: string;
  title: string;
  timeLimit?: number;
  isPractice?: boolean;
  onAutoScore?: (score: number, maxScore: number) => void;
  onManualSubmit?: (score: number) => void;
}

export const GameIFrameSandbox: React.FC<GameIFrameSandboxProps> = ({
  embedUrl,
  title,
  timeLimit,
  isPractice = false,
  onAutoScore,
  onManualSubmit
}) => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [manualScore, setManualScore] = useState<string>('10');
  const [showManualSubmitBox, setShowManualSubmitBox] = useState<boolean>(false);
  const [receivedAutoScore, setReceivedAutoScore] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement | null>(null);

  // GAME-04: Lắng nghe SDK postMessage từ game HTML5 / iFrame
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        const data = event.data;
        if (data && (data.type === 'PHYSICS_GAME_SCORE' || data.type === 'GAME_OVER' || data.type === 'SCORM_SCORE')) {
          const score = typeof data.score === 'number' ? data.score : 10;
          const maxScore = typeof data.maxScore === 'number' ? data.maxScore : 10;
          setReceivedAutoScore(true);
          if (onAutoScore) {
            onAutoScore(score, maxScore);
          }
        }
      } catch (err) {
        console.warn('Lỗi đọc postMessage từ game iframe:', err);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onAutoScore]);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(manualScore);
    if (!isNaN(val) && val >= 0 && val <= 10 && onManualSubmit) {
      onManualSubmit(val);
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`space-y-4 rounded-3xl bg-slate-900 border border-slate-800 p-4 transition-all ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none p-2 bg-black flex flex-col' : ''
      }`}
    >
      {/* Top Toolbar */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-bold text-slate-300 truncate max-w-xs sm:max-w-md">
            {title}
          </span>
          {isPractice && (
            <span className="px-2 py-0.5 rounded-md bg-purple-950 text-purple-300 border border-purple-800 text-[10px] font-bold">
              Luyện tập
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowManualSubmitBox(!showManualSubmitBox)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
            title="Nộp điểm bài chơi"
          >
            <Send className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Nộp Kết Quả</span>
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            title={isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* GAME-03: Sandbox iFrame an toàn */}
      <div className={`relative w-full overflow-hidden rounded-2xl bg-black border border-slate-800 ${
        isFullscreen ? 'flex-1 h-full' : 'h-[540px] sm:h-[620px]'
      }`}>
        <iframe
          src={embedUrl}
          title={title}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation allow-modals"
          allow="fullscreen; autoplay; gamepad; clipboard-write; encrypted-media"
          className="w-full h-full border-0"
          loading="lazy"
        />
      </div>

      {/* Manual Submit Box for external games (Wordwall/Quizizz/Canva) */}
      {showManualSubmitBox && (
        <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700 text-white space-y-3 animate-fade-in">
          <div className="flex items-center gap-2 text-xs font-bold text-sky-400">
            <AlertCircle className="w-4 h-4" />
            <span>Ghi nhận điểm số trò chơi ngoại bang:</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Nếu trò chơi Wordwall/Kahoot/Canva không tự động trả điểm về hệ thống, hãy nhập điểm số bạn vừa đạt được để lưu vào học bạ & bảng xếp hạng:
          </p>
          <form onSubmit={handleManualSubmit} className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-300">Điểm số (Thang 10):</span>
              <input
                type="number"
                min="0"
                max="10"
                step="0.5"
                value={manualScore}
                onChange={(e) => setManualScore(e.target.value)}
                className="w-20 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono font-bold text-center text-sm focus:outline-none focus:border-sky-500"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow transition flex items-center gap-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Xác Nhận & Lưu Điểm</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
