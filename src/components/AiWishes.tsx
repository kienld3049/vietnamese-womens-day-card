import { useState, useEffect, useRef, useCallback } from 'react';
import { PERSONAL_WISHES, TOPIC_LABELS, formatPersonalWish } from '../data/wishes.ts';

interface AiWishesProps {
  recipientName: string;
  senderName: string;
  initialTopic?: 'all' | 'romantic' | 'family' | 'friend' | 'sweet';
  initialNote?: string;
  isRecipientMode: boolean;
  onToast: (msg: string) => void;
  onTopicChangeNotification?: (topic: string, note: string) => void;
}

export function AiWishes({
  recipientName,
  senderName,
  initialTopic = 'romantic',
  initialNote = '',
  isRecipientMode,
  onToast,
  onTopicChangeNotification
}: AiWishesProps) {
  const [topic, setTopic] = useState<'all' | 'romantic' | 'family' | 'friend' | 'sweet'>(
    initialTopic || 'romantic'
  );
  const [customNote, setCustomNote] = useState(initialNote || '');
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [statusText, setStatusText] = useState('Đang mở lời chúc…');
  const [displayedText, setDisplayedText] = useState('');

  const lastWishRef = useRef('');
  const typingSessionId = useRef(0);

  const displayTo = recipientName.trim() || 'Người tôi thương';
  const displayFrom = senderName.trim() || 'Người gửi';

  // 100% Client-side wish generator - works everywhere
  const pickWish = useCallback(
    (currentTopic: 'all' | 'romantic' | 'family' | 'friend' | 'sweet') => {
      const pool =
        currentTopic === 'all'
          ? [
              ...PERSONAL_WISHES.romantic,
              ...PERSONAL_WISHES.family,
              ...PERSONAL_WISHES.friend,
              ...PERSONAL_WISHES.sweet
            ]
          : PERSONAL_WISHES[currentTopic] || PERSONAL_WISHES.romantic;

      let picked = pool[Math.floor(Math.random() * pool.length)];
      if (pool.length > 1 && picked === lastWishRef.current) {
        const remaining = pool.filter((w) => w !== lastWishRef.current);
        picked = remaining[Math.floor(Math.random() * remaining.length)];
      }
      lastWishRef.current = picked;
      return formatPersonalWish(picked, displayTo, displayFrom, customNote);
    },
    [displayTo, displayFrom, customNote]
  );

  const startGenerating = useCallback(
    async (selectedTopic = topic) => {
      const sessionId = ++typingSessionId.current;
      setDisplayedText('');
      setIsTyping(true);

      const steps = isRecipientMode
        ? ['Đang mở những lời chúc ngọt ngào nhất…', 'Dành riêng cho bạn…']
        : [
            'Đang chọn những lời chúc ấm áp nhất…',
            'Đang gói ghém yêu thương và dịu dàng…',
            'Đang hoàn thiện thông điệp…'
          ];

      for (const step of steps) {
        if (sessionId !== typingSessionId.current) return;
        setStatusText(step);
        await new Promise((r) => setTimeout(r, 340));
      }

      if (sessionId !== typingSessionId.current) return;

      const targetWish = pickWish(selectedTopic);

      setIsTyping(false);

      // Gentle typewriter animation with natural punctuation pauses
      for (let i = 0; i <= targetWish.length; i++) {
        if (sessionId !== typingSessionId.current) return;
        setDisplayedText(targetWish.slice(0, i));
        const ch = targetWish[i - 1];
        const delay = ch === ',' || ch === '.' || ch === ':' || ch === '!' ? 120 : 20;
        await new Promise((r) => setTimeout(r, delay));
      }
    },
    [topic, pickWish, isRecipientMode]
  );

  useEffect(() => {
    startGenerating(topic);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipientName, senderName]);

  const handleTopicChange = (newTopic: 'all' | 'romantic' | 'family' | 'friend' | 'sweet') => {
    setTopic(newTopic);
    startGenerating(newTopic);
    if (onTopicChangeNotification) {
      onTopicChangeNotification(newTopic, customNote);
    }
  };

  const handleCopy = async () => {
    if (!displayedText) return;
    const author = `Thương gửi từ ${displayFrom} · 20/10/2026`;
    const fullText = `${displayedText}\n(${author})`;

    try {
      await navigator.clipboard.writeText(fullText);
      onToast('Đã sao chép lời chúc yêu thương 💖');
    } catch {
      const ta = document.createElement('textarea');
      ta.value = fullText;
      document.body.appendChild(ta);
      ta.select();
      const success = document.execCommand('copy');
      ta.remove();
      onToast(success ? 'Đã sao chép lời chúc 💖' : 'Không sao chép được');
    }
  };

  return (
    <section className="ai-sec" id="ai">
      <div className="wrap ai-grid">
        {/* Left Column */}
        <div>
          <div className="eyebrow">
            {isRecipientMode ? 'Món quà từ trái tim' : 'Trao gửi tâm tình'}
          </div>
          <h2>
            {isRecipientMode
              ? `Lời chúc dành riêng cho ${displayTo}`
              : `Chọn lời chúc gửi đến ${displayTo}`}
          </h2>
          <p className="lead">
            {isRecipientMode ? (
              <>
                “Mỗi người phụ nữ là một đoá hoa rạng ngời và quý giá nhất của cuộc đời. Mong rằng
                những điều dịu dàng, bình an và hạnh phúc nhất sẽ luôn ở bên bạn, hôm nay và mãi mãi về
                sau.”
              </>
            ) : (
              <>
                Mỗi người phụ nữ là một đoá hoa rạng rỡ nhất. Hãy chọn phong cách bạn muốn gửi gắm,
                tấm thiệp sẽ tự khắc họa lời chúc tinh tế và ý nghĩa nhất từ <b>{displayFrom}</b> gửi
                đến <b>{displayTo}</b>.
              </>
            )}
          </p>

          {/* SENDER ONLY: Topic Selector Chips */}
          {!isRecipientMode && (
            <>
              <div className="chips" role="group" aria-label="Chủ đề lời chúc">
                {(['romantic', 'family', 'friend', 'sweet', 'all'] as const).map((t) => (
                  <button
                    key={t}
                    className={`chip ${topic === t ? 'active' : ''}`}
                    onClick={() => handleTopicChange(t)}
                    aria-pressed={topic === t}
                  >
                    {t === 'all' ? '✨ Ngẫu nhiên' : TOPIC_LABELS[t]}
                  </button>
                ))}
              </div>

              {/* Custom Detail Input */}
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => setShowNoteInput(!showNoteInput)}
                  className="text-xs text-[#8e1f3f] font-semibold flex items-center gap-1.5 hover:underline"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  {showNoteInput
                    ? 'Ẩn ghi chú riêng'
                    : '+ Thêm sở thích / kỷ niệm riêng (VD: thích trà sữa, hay cười...)'}
                </button>

                {showNoteInput && (
                  <div className="mt-2.5 flex gap-2">
                    <input
                      type="text"
                      value={customNote}
                      onChange={(e) => setCustomNote(e.target.value)}
                      placeholder="VD: thích ăn kem, hay thức khuya, thích hoa sen..."
                      className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-[rgba(142,31,63,0.25)] bg-white text-[#3b1b24] focus:outline-none focus:ring-1 focus:ring-[#c2375b]"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          startGenerating(topic);
                          if (onTopicChangeNotification) {
                            onTopicChangeNotification(topic, customNote);
                          }
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        startGenerating(topic);
                        if (onTopicChangeNotification) {
                          onTopicChangeNotification(topic, customNote);
                        }
                      }}
                      className="px-4 py-2 text-xs rounded-xl bg-[#c2375b] text-white font-medium hover:bg-[#8e1f3f] transition-colors"
                    >
                      Áp dụng
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Right Column: Romantic Wish Paper Card */}
        <div className="wish-paper-card" aria-live="polite">
          {/* Card Header */}
          <div className="wish-card-header">
            <div className="wish-card-badge">
              <span className="heart-dot">♥</span>
              <span>{isRecipientMode ? 'Thông Điệp Yêu Thương · 20/10' : 'Hộp Thư Yêu Thương · 20/10'}</span>
            </div>
            {!isRecipientMode && (
              <span className="wish-card-topic-tag">{TOPIC_LABELS[topic]}</span>
            )}
          </div>

          {/* Card Body */}
          <div className="wish-card-body">
            <div className="wish-quote-icon" aria-hidden="true">
              “
            </div>

            {isTyping && (
              <div className="status">
                <span className="dots">
                  <span />
                  <span />
                  <span />
                </span>
                <span>{statusText}</span>
              </div>
            )}

            <div className="wish-out">
              {displayedText}
              <span className="caret" />
            </div>

            <div className="wish-card-signature">
              ~ {displayFrom} gửi tặng {displayTo} ~
            </div>

            {/* Actions */}
            <div className="console-actions">
              {/* SENDER ONLY: Refresh button */}
              {!isRecipientMode && (
                <button
                  className="btn-action"
                  onClick={() => startGenerating(topic)}
                  disabled={isTyping}
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                  >
                    <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                  </svg>
                  Chọn lời chúc khác
                </button>
              )}

              <button className={`btn-action ${isRecipientMode ? '' : 'ghost'}`} onClick={handleCopy}>
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                {isRecipientMode ? 'Lưu lại lời chúc này' : 'Sao chép'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
