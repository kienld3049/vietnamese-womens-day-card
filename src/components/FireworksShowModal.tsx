import { useEffect, useRef, useState, useCallback } from 'react';
import { initFireworks, type ParticleFxEngine } from '../lib/particleEffects.ts';
import { fireworkAudio, musicBox } from '../lib/audioSynth.ts';

interface FireworksShowModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientName: string;
  senderName: string;
  onToast: (msg: string) => void;
}

export function FireworksShowModal({
  isOpen,
  onClose,
  recipientName,
  senderName,
  onToast
}: FireworksShowModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fxRef = useRef<ParticleFxEngine | null>(null);

  const [phaseText, setPhaseText] = useState('Chuẩn bị khai màn…');
  const [countdown, setCountdown] = useState<number | null>(3);
  const [isMuted, setIsMuted] = useState(false);
  const [showFinaleMessage, setShowFinaleMessage] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  const isCancelledRef = useRef(false);
  const timelineTimersRef = useRef<number[]>([]);

  const displayTo = recipientName.trim() || 'Người tôi thương';
  const displayFrom = senderName.trim() || 'Người gửi';

  const clearAllTimers = useCallback(() => {
    timelineTimersRef.current.forEach((id) => clearTimeout(id));
    timelineTimersRef.current = [];
  }, []);

  const addTimer = useCallback((fn: () => void, delayMs: number) => {
    const id = window.setTimeout(() => {
      if (!isCancelledRef.current) {
        fn();
      }
    }, delayMs);
    timelineTimersRef.current.push(id);
    return id;
  }, []);

  // Choreographed Fireworks Script
  const startShow = useCallback(() => {
    clearAllTimers();
    isCancelledRef.current = false;
    setShowFinaleMessage(false);
    setCountdown(3);
    setPhaseText('Đếm ngược khai màn…');

    // Turn OFF background music box so explosive firework sounds dominate
    musicBox.stop();

    // 1. Countdown 3 -> 2 -> 1 -> 0
    addTimer(() => {
      setCountdown(2);
      fireworkAudio.playPop();
    }, 1000);

    addTimer(() => {
      setCountdown(1);
      fireworkAudio.playPop();
    }, 2000);

    addTimer(() => {
      setCountdown(null);
      setPhaseText('Khai Màn: Rực Rỡ Sắc Hoa 🌸');
      fireworkAudio.playFinaleBurst();
      const fx = fxRef.current;
      if (!fx) return;
      const [W, H] = fx.getSize();
      fx.chrysanthemum(W * 0.3, H * 0.35, fx.palettes[0], 1.3);
      fx.chrysanthemum(W * 0.7, H * 0.3, fx.palettes[1], 1.3);
    }, 3000);

    // 2. Opening Salvo (4s - 12s)
    addTimer(() => {
      const fx = fxRef.current;
      if (!fx) return;
      const [W, H] = fx.getSize();
      fx.rocket(W * 0.2, H, W * 0.25, H * 0.28, fx.palettes[0], 1.2);
      fx.rocket(W * 0.8, H, W * 0.75, H * 0.24, fx.palettes[2], 1.2);
    }, 4500);

    addTimer(() => {
      const fx = fxRef.current;
      if (!fx) return;
      const [W, H] = fx.getSize();
      fx.crossette(W * 0.5, H * 0.3, fx.palettes[1], 1.2);
      fx.rocket(W * 0.4, H, W * 0.45, H * 0.22, fx.palettes[0], 1.1);
      fx.rocket(W * 0.6, H, W * 0.55, H * 0.25, fx.palettes[2], 1.1);
    }, 6500);

    addTimer(() => {
      const fx = fxRef.current;
      if (!fx) return;
      const [W, H] = fx.getSize();
      fx.chrysanthemum(W * 0.2, H * 0.32, fx.palettes[0], 1.2);
      fx.chrysanthemum(W * 0.8, H * 0.32, fx.palettes[1], 1.2);
      fx.crossette(W * 0.5, H * 0.22, fx.palettes[2], 1.2);
    }, 9000);

    // 3. Romantic Melody: Golden Willow & Double Hearts (12s - 24s)
    addTimer(() => {
      setPhaseText('Giai Điệu Lãng Mạn: Liễu Rủ Hoàng Kim & Trái Tim Đôi 💖');
      const fx = fxRef.current;
      if (!fx) return;
      const [W, H] = fx.getSize();
      fx.doubleHeart(W * 0.5, H * 0.32, 1.4);
      fx.balloons(8);
    }, 12000);

    addTimer(() => {
      const fx = fxRef.current;
      if (!fx) return;
      const [W, H] = fx.getSize();
      fx.willow(W * 0.28, H * 0.28, 1.3);
      fx.willow(W * 0.72, H * 0.26, 1.3);
    }, 15000);

    addTimer(() => {
      const fx = fxRef.current;
      if (!fx) return;
      const [W, H] = fx.getSize();
      fx.doubleHeart(W * 0.35, H * 0.35, 1.2);
      fx.doubleHeart(W * 0.65, H * 0.33, 1.2);
      fx.willow(W * 0.5, H * 0.22, 1.4);
    }, 18500);

    // 4. Sky Text Projections (22s - 34s)
    addTimer(() => {
      setPhaseText(`Thông Điệp Tri Ân Gửi Đến ${displayTo} ✨`);
      const fx = fxRef.current;
      if (!fx) return;
      const [W, H] = fx.getSize();
      fx.textFirework(W * 0.5, H * 0.3, '20 / 10', 1.2);
      fx.willow(W * 0.15, H * 0.35, 1.0);
      fx.willow(W * 0.85, H * 0.35, 1.0);
    }, 22500);

    addTimer(() => {
      const fx = fxRef.current;
      if (!fx) return;
      const [W, H] = fx.getSize();
      fx.textFirework(W * 0.5, H * 0.38, displayTo.toUpperCase(), 1.1);
      fx.crossette(W * 0.25, H * 0.25, fx.palettes[0], 1.1);
      fx.crossette(W * 0.75, H * 0.25, fx.palettes[2], 1.1);
    }, 26500);

    // 5. Build Up to Grand Finale (30s - 42s)
    addTimer(() => {
      setPhaseText('Cao Trào: Đêm Hội Ánh Sáng Bùng Nổ 🎆');
      const fx = fxRef.current;
      if (!fx) return;
      const [W, H] = fx.getSize();
      for (let i = 0; i < 8; i++) {
        setTimeout(() => {
          if (isCancelledRef.current || !fxRef.current) return;
          const rx = W * (0.12 + Math.random() * 0.76);
          const ry = H * (0.15 + Math.random() * 0.28);
          fxRef.current.rocket(rx, H, rx, ry, fxRef.current.palettes[i % 3], 1.3);
        }, i * 280);
      }
    }, 30000);

    addTimer(() => {
      const fx = fxRef.current;
      if (!fx) return;
      const [W, H] = fx.getSize();
      fx.chrysanthemum(W * 0.25, H * 0.26, fx.palettes[0], 1.5);
      fx.doubleHeart(W * 0.5, H * 0.28, 1.6);
      fx.chrysanthemum(W * 0.75, H * 0.26, fx.palettes[1], 1.5);
      fx.balloons(18);
    }, 33500);

    // 6. Grand Finale: Massive cascading barrage
    addTimer(() => {
      setPhaseText('Đại Tiệc Grand Finale: Bão Pháo Hoa Vàng Kim 🌟');
      const fx = fxRef.current;
      if (!fx) return;
      const [W, H] = fx.getSize();

      fx.willow(W * 0.2, H * 0.22, 1.5);
      fx.willow(W * 0.5, H * 0.18, 1.6);
      fx.willow(W * 0.8, H * 0.22, 1.5);
      fireworkAudio.playFinaleBurst();

      for (let k = 0; k < 14; k++) {
        setTimeout(() => {
          if (isCancelledRef.current || !fxRef.current) return;
          const kx = W * (0.08 + Math.random() * 0.84);
          const ky = H * (0.1 + Math.random() * 0.32);
          if (k % 3 === 0) {
            fxRef.current.willow(kx, ky, 1.3);
          } else {
            fxRef.current.chrysanthemum(kx, ky, fxRef.current.palettes[k % 3], 1.3);
          }
          fxRef.current.spray(kx, ky, 10);
        }, k * 220);
      }
    }, 37000);

    // 7. Show Conclusion Message (44s)
    addTimer(() => {
      setPhaseText(`Chúc ${displayTo} ngày 20/10 ngập tràn rạng rỡ và hạnh phúc! 💖`);
      setShowFinaleMessage(true);
      const fx = fxRef.current;
      if (fx) {
        fx.balloons(16);
      }
    }, 43000);
  }, [clearAllTimers, addTimer, displayTo]);

  // Handle initialization and tear down
  useEffect(() => {
    if (!isOpen) {
      isCancelledRef.current = true;
      clearAllTimers();
      fxRef.current?.destroy();
      fxRef.current = null;
      return;
    }

    // Initialize fireworks canvas
    if (canvasRef.current) {
      fxRef.current = initFireworks(canvasRef.current);
    }

    startShow();

    return () => {
      isCancelledRef.current = true;
      clearAllTimers();
      fxRef.current?.destroy();
      fxRef.current = null;
      // Resume gentle background music when returning to card
      musicBox.start();
    };
  }, [isOpen, clearAllTimers, startShow]);

  // Toggle Mute
  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    fireworkAudio.setMuted(next);
    onToast(next ? 'Đã tắt âm thanh pháo hoa 🔇' : 'Đã bật âm thanh pháo hoa 🔊');
  };

  // Toggle Pause/Play
  const handleTogglePlay = () => {
    if (isPlaying) {
      clearAllTimers();
      setIsPlaying(false);
      onToast('Đã tạm dừng trình diễn ⏸');
    } else {
      setIsPlaying(true);
      startShow();
      onToast('Tiếp tục trình diễn pháo hoa ▶');
    }
  };

  // Click on dark sky to trigger interactive shells
  const handleSkyClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button, .finale-card')) return;
    const fx = fxRef.current;
    if (!fx) return;

    const x = e.clientX;
    const y = e.clientY;
    const types = ['chrysanthemum', 'willow', 'doubleHeart', 'crossette'] as const;
    const pickedType = types[Math.floor(Math.random() * types.length)];

    if (pickedType === 'chrysanthemum') {
      fx.chrysanthemum(x, y);
    } else if (pickedType === 'willow') {
      fx.willow(x, y);
    } else if (pickedType === 'doubleHeart') {
      fx.doubleHeart(x, y);
    } else {
      fx.crossette(x, y);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#0d0408] text-white flex flex-col select-none overflow-hidden"
      onClick={handleSkyClick}
    >
      {/* Background Starry Sky Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-auto"
        style={{ background: 'radial-gradient(circle at 50% 30%, #1f0714 0%, #0c0207 100%)' }}
      />

      {/* Top Floating Control Bar */}
      <header className="relative z-20 flex items-center justify-between px-4 py-3 sm:px-6 bg-gradient-to-b from-black/80 to-transparent pointer-events-auto">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
          <div className="text-xs sm:text-sm font-medium tracking-wide text-rose-200">
            Đêm Hội Pháo Hoa 20/10 <span className="hidden sm:inline">· Gửi tặng {displayTo}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Pause / Replay Button */}
          <button
            type="button"
            onClick={handleTogglePlay}
            className="p-2 sm:px-3 sm:py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs text-rose-100 backdrop-blur-md transition-colors flex items-center gap-1.5"
            title={isPlaying ? 'Tạm dừng' : 'Xem lại từ đầu'}
          >
            {isPlaying ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
                <span className="hidden sm:inline">Tạm dừng</span>
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                <span className="hidden sm:inline">Xem lại</span>
              </>
            )}
          </button>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={handleToggleMute}
            className="p-2 sm:px-3 sm:py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs text-rose-100 backdrop-blur-md transition-colors flex items-center gap-1.5"
            title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
          >
            {isMuted ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6" />
                </svg>
                <span className="hidden sm:inline">Bật âm</span>
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
                <span className="hidden sm:inline">Âm thanh</span>
              </>
            )}
          </button>

          {/* Close / Exit Button */}
          <button
            type="button"
            onClick={onClose}
            className="p-2 sm:px-3 sm:py-1.5 rounded-full bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-semibold backdrop-blur-md transition-colors flex items-center gap-1"
            title="Đóng màn hình pháo hoa và quay lại thiệp"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            <span className="hidden sm:inline">Trở về thiệp</span>
          </button>
        </div>
      </header>

      {/* Countdown Overlay (3... 2... 1...) */}
      {countdown !== null && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none">
          <div className="text-8xl sm:text-9xl font-serif font-bold text-rose-300 drop-shadow-[0_0_30px_rgba(244,114,182,0.9)] animate-pulse">
            {countdown}
          </div>
          <div className="mt-4 text-sm sm:text-base text-rose-100/90 font-medium tracking-widest uppercase">
            Chuẩn bị khai màn pháo hoa…
          </div>
        </div>
      )}

      {/* Bottom Subtitle / Stage Direction */}
      <footer className="relative z-20 mt-auto px-4 py-6 text-center pointer-events-none bg-gradient-to-t from-black/85 via-black/40 to-transparent">
        <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs sm:text-sm font-medium text-rose-200 tracking-wide drop-shadow-md">
          {phaseText}
        </div>
        <p className="mt-2 text-[11px] text-white/50">
          Chạm vào bất kỳ vị trí nào trên bầu trời để tự tay kích hoạt pháo hoa ✨
        </p>
      </footer>

      {/* Finale Message Card */}
      {showFinaleMessage && (
        <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="finale-card max-w-md w-full p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#2a0e1c] to-[#14050d] border border-rose-400/30 shadow-[0_20px_60px_-15px_rgba(244,63,94,0.5)] text-center">
            <div className="text-3xl mb-2">🎆 💖 🌸</div>
            <h3 className="text-xl sm:text-2xl font-bold text-rose-200 mb-2 font-serif">
              Chúc {displayTo} 20/10 Rực Rỡ!
            </h3>
            <p className="text-xs sm:text-sm text-rose-100/80 leading-relaxed mb-6">
              Nguyện chúc nụ cười của bạn luôn rạng ngời như muôn đoá pháo hoa giữa trời đêm.
              Mọi khoảnh khắc trong cuộc sống đều dịu dàng, bình an và ngọt ngào nhất!
            </p>
            <div className="text-xs text-rose-300/70 italic mb-6">
              ~ Trao trọn yêu thương từ {displayFrom} ~
            </div>

            <div className="flex gap-2 justify-center">
              <button
                type="button"
                onClick={startShow}
                className="px-4 py-2.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg transition-transform active:scale-95 flex items-center gap-1.5"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                </svg>
                Xem lại pháo hoa
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-rose-100 text-xs font-semibold transition-colors"
              >
                Quay lại đọc thiệp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
