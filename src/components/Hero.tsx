interface HeroProps {
  recipientName: string;
  senderName: string;
  onOpenLetter: () => void;
}

export function Hero({ recipientName, senderName, onOpenLetter }: HeroProps) {
  const displayTo = recipientName.trim() || 'Người phụ nữ tôi thương';
  const displayFrom = senderName.trim() || 'Người gửi';

  return (
    <header className="hero" id="top">
      {/* Decorative floral accents */}
      <div className="flower f1" aria-hidden="true">
        <svg viewBox="0 0 200 260">
          <use href="#rose" />
        </svg>
      </div>
      <div className="flower f2" aria-hidden="true">
        <svg viewBox="0 0 200 260">
          <use href="#rose" />
        </svg>
      </div>
      <div className="flower f3" aria-hidden="true">
        <svg viewBox="0 0 200 260">
          <use href="#rose" />
        </svg>
      </div>

      <div>
        <div className="badge">
          <i></i>Trao gửi yêu thương · 20/10/2026
        </div>

        <div className="big-date">
          20<span>/</span>10
        </div>

        <h1>Chúc mừng ngày Phụ nữ Việt Nam</h1>

        <p className="to">
          Thương gửi <b>{displayTo}</b>
        </p>
        <p className="from text-sm text-[#7a4a56] mt-1 font-medium">
          Món quà từ trái tim của <b>{displayFrom}</b> gửi tặng bạn
        </p>

        <a
          className="btn-primary"
          href="#letter"
          onClick={(e) => {
            e.preventDefault();
            const el = document.getElementById('letter');
            el?.scrollIntoView({ behavior: 'smooth' });
            onOpenLetter();
          }}
        >
          Mở lá thư gửi bạn
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </a>
      </div>

      <div className="scroll-hint">Cuộn xuống</div>
    </header>
  );
}
