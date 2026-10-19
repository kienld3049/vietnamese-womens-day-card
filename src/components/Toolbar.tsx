import { useState, useRef, useEffect, useCallback } from 'react';

interface ToolbarProps {
  visible: boolean;
  isAutoScroll: boolean;
  onToggleAutoScroll: () => void;
  onShootHearts: (buttonElement: HTMLElement) => void;
  onOpenPersonalize: () => void;
  onShare: () => void;
  isRecipientMode: boolean;
}

export function Toolbar({
  visible,
  isAutoScroll,
  onToggleAutoScroll,
  onShootHearts,
  onOpenPersonalize,
  onShare,
  isRecipientMode
}: ToolbarProps) {
  const [isPopping, setIsPopping] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const heartBtnRef = useRef<HTMLButtonElement>(null);
  const isHoldingRef = useRef(false);
  const holdIntervalRef = useRef<number | null>(null);

  const fire = useCallback(() => {
    setIsPopping(true);
    setTimeout(() => setIsPopping(false), 200);
    if (heartBtnRef.current) {
      onShootHearts(heartBtnRef.current);
    }
  }, [onShootHearts]);

  const stopHold = useCallback(() => {
    if (!isHoldingRef.current) return;
    isHoldingRef.current = false;
    setIsHolding(false);
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
  }, []);

  const startHold = useCallback(
    (e: React.SyntheticEvent) => {
      if (isHoldingRef.current) return;
      isHoldingRef.current = true;
      setIsHolding(true);

      // Fire 1st round immediately
      fire();

      // Clear any prior interval
      if (holdIntervalRef.current) {
        clearInterval(holdIntervalRef.current);
      }

      // Continuous rapid fire every 220ms while holding
      holdIntervalRef.current = window.setInterval(() => {
        if (isHoldingRef.current) {
          fire();
        } else {
          stopHold();
        }
      }, 220);
    },
    [fire, stopHold]
  );

  // Global safety listeners: if mouse or finger releases anywhere, stop holding
  useEffect(() => {
    const handleGlobalRelease = () => {
      if (isHoldingRef.current) {
        stopHold();
      }
    };

    window.addEventListener('mouseup', handleGlobalRelease);
    window.addEventListener('touchend', handleGlobalRelease);
    window.addEventListener('touchcancel', handleGlobalRelease);
    window.addEventListener('blur', handleGlobalRelease);

    return () => {
      window.removeEventListener('mouseup', handleGlobalRelease);
      window.removeEventListener('touchend', handleGlobalRelease);
      window.removeEventListener('touchcancel', handleGlobalRelease);
      window.removeEventListener('blur', handleGlobalRelease);
      if (holdIntervalRef.current) {
        clearInterval(holdIntervalRef.current);
      }
    };
  }, [stopHold]);

  if (!visible) return null;

  return (
    <nav className="toolbar" aria-label="Công cụ tương tác">
      {/* Auto Scroll Toggle */}
      <button
        className={`tool-btn ${isAutoScroll ? 'active' : ''}`}
        onClick={onToggleAutoScroll}
        aria-pressed={isAutoScroll}
        title={isAutoScroll ? 'Tắt tự cuộn' : 'Bật tự cuộn trang'}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 4v16M6 14l6 6 6-6" />
        </svg>
        <span className="lbl">Tự cuộn</span>
      </button>

      {/* Heart Blaster with Press & Hold Auto-Fire */}
      <button
        ref={heartBtnRef}
        className={`tool-btn ${isHolding ? 'holding' : isPopping ? 'pop' : ''}`}
        onMouseDown={startHold}
        onMouseUp={stopHold}
        onMouseLeave={stopHold}
        onTouchStart={(e) => {
          startHold(e);
        }}
        onTouchEnd={stopHold}
        onTouchCancel={stopHold}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            if (!e.repeat) {
              startHold(e);
            }
          }
        }}
        onKeyUp={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            stopHold();
          }
        }}
        title="Bắn tim (Nhấn hoặc Giữ để bắn liên tục!)"
        style={{ touchAction: 'manipulation' }}
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.7 4.5c2.1 0 3.6 1.2 4.3 2.4.7-1.2 2.2-2.4 4.3-2.4 3.7 0 5.8 3.9 4.3 7.3C19.5 16.4 12 21 12 21z" />
        </svg>
        <span className="lbl">{isHolding ? 'Đang bắn...' : 'Bắn tim'}</span>
      </button>

      {/* SENDER / CREATOR MODE ONLY: Edit Recipient and Share Link */}
      {!isRecipientMode && (
        <>
          <button
            className="tool-btn"
            onClick={onOpenPersonalize}
            title="Tùy chỉnh tên người nhận & người gửi"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span className="lbl">Sửa tên</span>
          </button>

          <button
            className="tool-btn active !bg-[#c2375b] !text-white"
            onClick={onShare}
            title="Lấy link đã cài đặt tên để gửi tặng"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            <span className="lbl">Lấy link</span>
          </button>
        </>
      )}
    </nav>
  );
}
