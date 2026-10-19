import { useState, useEffect, useRef, useCallback } from 'react';
import { RoseDefs } from './components/RoseDefs.tsx';
import { Cover } from './components/Cover.tsx';
import { Hero } from './components/Hero.tsx';
import { EnvelopeLetter } from './components/EnvelopeLetter.tsx';
import { AiWishes } from './components/AiWishes.tsx';
import { MusicDisc } from './components/MusicDisc.tsx';
import { Toolbar } from './components/Toolbar.tsx';
import { Footer } from './components/Footer.tsx';
import { PersonalizeModal } from './components/PersonalizeModal.tsx';
import { CreatorStudio } from './components/CreatorStudio.tsx';
import { ShareModal } from './components/ShareModal.tsx';
import { musicBox } from './lib/audioSynth.ts';
import { initPetals, initFireworks, type ParticleFxEngine } from './lib/particleEffects.ts';
import { getCleanGiftUrl, checkIsCreatorMode } from './lib/urlHelper.ts';

export default function App() {
  // Read URL parameters on startup
  const initialParams = useRef(new URLSearchParams(window.location.search)).current;
  const initialTo = (initialParams.get('to') || '').trim().slice(0, 40);
  const initialFrom = (initialParams.get('from') || '').trim().slice(0, 40);
  const initialTopic = (initialParams.get('topic') || 'romantic').trim() as
    | 'all'
    | 'romantic'
    | 'family'
    | 'friend'
    | 'sweet';
  const initialNote = (initialParams.get('note') || '').trim().slice(0, 80);

  // Recipient & Sender states
  const [recipientName, setRecipientName] = useState(() => initialTo || 'Em yêu');
  const [senderName, setSenderName] = useState(() => initialFrom || 'Anh');
  const [selectedTopic, setSelectedTopic] = useState<'all' | 'romantic' | 'family' | 'friend' | 'sweet'>(
    initialTopic
  );
  const [customNote, setCustomNote] = useState(initialNote);

  // Dedicated Creator Mode vs Pure Recipient Gift Mode
  // Activated via /dev, /create, ?dev, ?create, or when no ?to= exists on root domain
  const [isCreatorMode, setIsCreatorMode] = useState(() => checkIsCreatorMode());
  const [isPreviewAsRecipient, setIsPreviewAsRecipient] = useState(false);

  // If NOT in creator mode (or previewing), it is strictly Recipient Mode (read-only, no config)
  const isRecipientMode = !isCreatorMode || isPreviewAsRecipient;

  const [isCoverOpen, setIsCoverOpen] = useState(false);
  const [isLetterOpen, setIsLetterOpen] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [isAutoScroll, setIsAutoScroll] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isPersonalizeOpen, setIsPersonalizeOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Canvas refs
  const petalsCanvasRef = useRef<HTMLCanvasElement>(null);
  const fxCanvasRef = useRef<HTMLCanvasElement>(null);
  const fxRef = useRef<ParticleFxEngine | null>(null);

  // Auto-scroll control refs
  const autoScrollRef = useRef({
    on: false,
    raf: 0,
    last: 0,
    pos: 0,
    held: false,
    pausedUntil: 0,
    SPEED: 38 // px per second
  });

  // Combo for heart firing
  const comboRef = useRef(0);
  const comboTimerRef = useRef<number | null>(null);

  // Toast handler
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 2800);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  // Sync with browser navigation (popstate)
  useEffect(() => {
    const handleLocationChange = () => {
      setIsCreatorMode(checkIsCreatorMode());
    };
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // Update document title when recipient changes
  useEffect(() => {
    if (recipientName.trim()) {
      document.title = `Gửi ${recipientName} · Chúc mừng 20/10 💖`;
    } else {
      document.title = 'Chúc mừng 20/10 · Gửi người tôi thương';
    }
  }, [recipientName]);

  // Initialize petals & fireworks particle engines
  useEffect(() => {
    let cleanupPetals = () => {};
    if (petalsCanvasRef.current) {
      cleanupPetals = initPetals(petalsCanvasRef.current);
    }

    if (fxCanvasRef.current) {
      fxRef.current = initFireworks(fxCanvasRef.current);
    }

    return () => {
      cleanupPetals();
      fxRef.current?.destroy();
      musicBox.stop();
    };
  }, []);

  // Sync toolbar presence in document.body
  useEffect(() => {
    if (isCoverOpen) {
      document.body.classList.add('has-toolbar');
    } else {
      document.body.classList.remove('has-toolbar');
    }
  }, [isCoverOpen]);

  // Handle Cover Open
  const handleOpenCover = useCallback(() => {
    if (isCoverOpen) return;
    setIsCoverOpen(true);

    // Play music box
    musicBox.start();
    setIsPlayingMusic(true);

    // Initial festive fireworks burst
    if (fxRef.current) {
      const [W, H] = fxRef.current.getSize();
      fxRef.current.explode(W / 2, H * 0.4, fxRef.current.palettes[0], 1.3);
      setTimeout(() => fxRef.current?.rocket(W * 0.2, H, W * 0.25, H * 0.25), 250);
      setTimeout(() => fxRef.current?.rocket(W * 0.8, H, W * 0.75, H * 0.22), 450);
      fxRef.current.balloons(12);
    }

    // Start auto-scroll after a short delay
    setTimeout(() => {
      setIsAutoScroll(true);
      autoScrollRef.current.on = true;
    }, 2200);
  }, [isCoverOpen]);

  // Envelope burst
  const handleEnvelopeBurst = useCallback((x: number, y: number) => {
    if (fxRef.current) {
      fxRef.current.explode(x, y, fxRef.current.palettes[2], 0.9);
      fxRef.current.spray(x, y, 14);
    }
  }, []);

  // Music toggle
  const handleToggleMusic = useCallback(() => {
    const playing = musicBox.toggle();
    setIsPlayingMusic(playing);
    showToast(playing ? 'Đang phát nhạc nền 🎵' : 'Đã tạm dừng nhạc 🔇');
  }, [showToast]);

  // Auto-scroll loop
  useEffect(() => {
    const auto = autoScrollRef.current;
    auto.on = isAutoScroll;

    if (!isAutoScroll) {
      cancelAnimationFrame(auto.raf);
      return;
    }

    auto.pos = window.scrollY;
    auto.last = 0;

    const autoStep = (t: number) => {
      if (!auto.on) return;
      const dt = auto.last ? Math.min((t - auto.last) / 1000, 0.1) : 0;
      auto.last = t;

      if (Math.abs(window.scrollY - auto.pos) > 1.5) {
        auto.pos = window.scrollY;
        auto.pausedUntil = performance.now() + 150;
      }

      if (!auto.held && performance.now() >= auto.pausedUntil) {
        auto.pos += auto.SPEED * dt;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        if (auto.pos >= max) {
          window.scrollTo({ top: max, behavior: 'instant' as ScrollBehavior });
          setIsAutoScroll(false);
          auto.on = false;
          return;
        }
        window.scrollTo({ top: auto.pos, behavior: 'instant' as ScrollBehavior });

        // Auto open envelope when reaching envelope section
        const envEl = document.getElementById('letter');
        if (envEl && !isLetterOpen) {
          const rect = envEl.getBoundingClientRect();
          if (rect.top + rect.height / 3 < window.innerHeight * 0.6) {
            setIsLetterOpen(true);
          }
        }
      } else {
        auto.pos = window.scrollY;
      }

      auto.raf = requestAnimationFrame(autoStep);
    };

    auto.raf = requestAnimationFrame(autoStep);

    return () => {
      cancelAnimationFrame(auto.raf);
    };
  }, [isAutoScroll, isLetterOpen]);

  // Pause auto-scroll on interaction
  useEffect(() => {
    const auto = autoScrollRef.current;
    const press = () => {
      auto.held = true;
      auto.pos = window.scrollY;
    };
    const release = () => {
      auto.held = false;
      auto.pos = window.scrollY;
    };
    const nudge = () => {
      auto.pausedUntil = performance.now() + 200;
      auto.pos = window.scrollY;
    };

    window.addEventListener('mousedown', press, { passive: true });
    window.addEventListener('touchstart', press, { passive: true });
    window.addEventListener('mouseup', release, { passive: true });
    window.addEventListener('touchend', release, { passive: true });
    window.addEventListener('touchcancel', release, { passive: true });
    window.addEventListener('blur', release, { passive: true });
    window.addEventListener('wheel', nudge, { passive: true });
    window.addEventListener('keydown', nudge, { passive: true });

    return () => {
      window.removeEventListener('mousedown', press);
      window.removeEventListener('touchstart', press);
      window.removeEventListener('mouseup', release);
      window.removeEventListener('touchend', release);
      window.removeEventListener('touchcancel', release);
      window.removeEventListener('blur', release);
      window.removeEventListener('wheel', nudge);
      window.removeEventListener('keydown', nudge);
    };
  }, []);

  const handleToggleAutoScroll = () => {
    const next = !isAutoScroll;
    setIsAutoScroll(next);
    autoScrollRef.current.pausedUntil = 0;
    showToast(next ? 'Đang tự cuộn trang' : 'Đã tắt tự cuộn');
  };

  // Heart firing with combo & press-and-hold support
  const handleShootHearts = (btn: HTMLElement) => {
    if (!fxRef.current) return;

    comboRef.current++;
    if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
    comboTimerRef.current = window.setTimeout(() => {
      comboRef.current = 0;
    }, 1500);

    if (navigator.vibrate) navigator.vibrate(18);

    const rect = btn.getBoundingClientRect();
    const x0 = rect.left + rect.width / 2;
    const y0 = rect.top;
    const [W, H] = fxRef.current.getSize();
    const combo = comboRef.current;

    const n = combo === 1 ? 3 : Math.min(2 + Math.floor(combo / 3), 5);
    const scale = Math.min(1 + combo * 0.05, 1.6);

    for (let i = 0; i < n; i++) {
      const spread = (i + Math.random() * 0.7) / n;
      const tx = W * (0.1 + 0.8 * spread);
      const ty = H * (0.12 + Math.random() * 0.32);
      setTimeout(() => {
        fxRef.current?.rocket(x0 + (Math.random() - 0.5) * 30, y0, tx, ty, undefined, scale);
      }, i * 65);
    }

    fxRef.current.spray(x0, y0, 5);

    if (combo % 5 === 0) {
      setTimeout(() => {
        fxRef.current?.explode(W / 2, H * 0.3, fxRef.current.palettes[2], 1.7);
        fxRef.current?.balloons(12);
      }, 500);
      showToast(`Combo x${combo}! Đại tiệc pháo hoa trái tim 💖✨`);
    }
  };

  // Click on background sparkle
  const handleGlobalClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button, a, input, textarea, .envelope, .recipient-modal')) return;
    if (fxRef.current) {
      fxRef.current.spray(e.clientX, e.clientY, 8);
    }
  };

  // Open Share Dialog and automatically copy the clean gift link
  const handleShare = async () => {
    const cleanUrl = getCleanGiftUrl(recipientName, senderName, selectedTopic, customNote);

    try {
      await navigator.clipboard.writeText(cleanUrl);
      showToast(`Đã sao chép link tặng ${recipientName}! 🔗`);
    } catch {
      // Handled in modal
    }

    setIsShareModalOpen(true);
  };

  // Transition from Recipient Mode to Creator / Dev Mode
  const handleSwitchToCreate = () => {
    try {
      const newUrl = new URL(window.location.href);
      newUrl.pathname = '/dev';
      newUrl.searchParams.set('mode', 'dev');
      window.history.pushState({}, '', newUrl.toString());
    } catch {}

    setIsCreatorMode(true);
    setIsPreviewAsRecipient(false);
    setIsPersonalizeOpen(true);
    showToast('Đã mở chế độ tạo thiệp mới! Hãy điền tên người bạn muốn gửi tặng 🌸');
  };

  return (
    <div onClick={handleGlobalClick} className="min-h-screen relative select-none">
      {/* Rose SVG Definition Library */}
      <RoseDefs />

      {/* Falling Flower Petals Canvas */}
      <canvas id="petals" ref={petalsCanvasRef} aria-hidden="true" />

      {/* Heart Fireworks and Sparkles Canvas */}
      <canvas id="fx" ref={fxCanvasRef} aria-hidden="true" />

      {/* SENDER STUDIO: ONLY visible when Creator Mode is active (/dev, /create, ?dev, ?create) */}
      {isCreatorMode && isCoverOpen && (
        <CreatorStudio
          recipientName={recipientName}
          senderName={senderName}
          onOpenEdit={() => setIsPersonalizeOpen(true)}
          onShare={handleShare}
          isPreviewAsRecipient={isPreviewAsRecipient}
          onTogglePreview={() => {
            const next = !isPreviewAsRecipient;
            setIsPreviewAsRecipient(next);
            showToast(
              next
                ? 'Đang xem thử như người nhận (khoá mọi công cụ)'
                : 'Đã mở lại chế độ thiết lập'
            );
          }}
        />
      )}

      {/* Welcome Cover (Tap to open) */}
      <Cover
        isOpen={isCoverOpen}
        onOpen={handleOpenCover}
        recipientName={recipientName}
        senderName={senderName}
      />

      {/* Spinning Music Vinyl Disc */}
      <MusicDisc
        isPlaying={isPlayingMusic}
        onToggle={handleToggleMusic}
        visible={isCoverOpen}
      />

      {/* Main Web Page Content */}
      <main>
        <Hero
          recipientName={recipientName}
          senderName={senderName}
          onOpenLetter={() => setIsLetterOpen(true)}
        />

        <EnvelopeLetter
          isOpen={isLetterOpen}
          onOpen={() => setIsLetterOpen(true)}
          recipientName={recipientName}
          senderName={senderName}
          onBurst={handleEnvelopeBurst}
        />

        <AiWishes
          recipientName={recipientName}
          senderName={senderName}
          initialTopic={selectedTopic}
          initialNote={customNote}
          isRecipientMode={isRecipientMode}
          onToast={showToast}
          onTopicChangeNotification={(t, n) => {
            setSelectedTopic(t as any);
            setCustomNote(n);
          }}
        />

        <Footer
          isRecipientMode={isRecipientMode}
          onSwitchToCreate={handleSwitchToCreate}
        />
      </main>

      {/* Bottom Floating Interactive Toolbar */}
      <Toolbar
        visible={isCoverOpen}
        isAutoScroll={isAutoScroll}
        onToggleAutoScroll={handleToggleAutoScroll}
        onShootHearts={handleShootHearts}
        onOpenPersonalize={() => setIsPersonalizeOpen(true)}
        onShare={handleShare}
        isRecipientMode={isRecipientMode}
      />

      {/* Personalize Modal (For Sender to configure recipient & sender) */}
      <PersonalizeModal
        isOpen={isPersonalizeOpen}
        onClose={() => setIsPersonalizeOpen(false)}
        currentRecipient={recipientName}
        currentSender={senderName}
        onSave={(newTo, newFrom) => {
          setRecipientName(newTo);
          setSenderName(newFrom);
        }}
        onToast={showToast}
      />

      {/* Dedicated Share & Link Modal (Shows Clean URL & Optional Message) */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        recipientName={recipientName}
        senderName={senderName}
        selectedTopic={selectedTopic}
        customNote={customNote}
        onToast={showToast}
      />

      {/* Notification Toast */}
      <div className={`toast-msg ${toastMessage ? 'show' : ''}`} role="status">
        {toastMessage}
      </div>
    </div>
  );
}
