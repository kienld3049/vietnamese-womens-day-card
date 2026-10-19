import { useEffect, useRef } from 'react';

interface EnvelopeLetterProps {
  isOpen: boolean;
  onOpen: () => void;
  recipientName: string;
  senderName: string;
  onBurst?: (x: number, y: number) => void;
}

export function EnvelopeLetter({
  isOpen,
  onOpen,
  recipientName,
  senderName,
  onBurst
}: EnvelopeLetterProps) {
  const envelopeRef = useRef<HTMLDivElement>(null);
  const letterRef = useRef<HTMLDivElement>(null);

  const displayTo = recipientName.trim() || 'Người tôi thương';
  const displayFrom = senderName.trim() || 'Người gửi';

  const handleEnvelopeClick = () => {
    if (isOpen) return;
    if (envelopeRef.current && onBurst) {
      const rect = envelopeRef.current.getBoundingClientRect();
      onBurst(rect.left + rect.width / 2, rect.top + rect.height / 3);
    }
    onOpen();
  };

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        letterRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <section className="letter-sec" id="letter">
      <div className="wrap center">
        <div className="eyebrow">Gửi trọn tâm tình</div>
        <h2>Những lời từ đáy lòng gửi đến {displayTo}</h2>
        <p className="lead">
          Có những điều ngày thường tôi ít khi cất thành lời. Nhân ngày 20/10 dịu dàng này,
          mọi thương yêu và trân quý đều được gói ghém trong lá thư nhỏ này, mời bạn mở ra nhé.
        </p>

        {/* 3D Envelope */}
        <div
          ref={envelopeRef}
          className={`envelope ${isOpen ? 'open' : ''}`}
          role="button"
          tabIndex={0}
          aria-label="Mở lá thư cá nhân"
          onClick={handleEnvelopeClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleEnvelopeClick();
            }
          }}
        >
          <div className="env-back" />
          <div className="env-card">
            Thương gửi
            <br />
            <b className="text-xl sm:text-2xl text-[#8e1f3f]">{displayTo}</b>
          </div>
          <div className="env-front" />
          <div className="env-flap" />
          <div className="seal">20·10</div>
        </div>

        <p className="env-tip">
          {isOpen ? 'Thư đã mở, mời bạn đọc bên dưới 💖' : 'Chạm vào phong bì để mở thư ✨'}
        </p>
      </div>

      {/* Unfolded Letter */}
      <div ref={letterRef} className={`letter ${isOpen ? 'show' : ''}`}>
        <div className="paper">
          <p className="greet">Gửi {displayTo} thân thương,</p>
          <p>
            Nhân ngày Phụ nữ Việt Nam 20/10, {displayFrom} muốn gửi tới {displayTo} những lời chúc
            tốt đẹp, dịu dàng và chân thành nhất từ tận đáy lòng.
          </p>
          <p>
            Cảm ơn {displayTo} vì đã luôn hiện diện trong cuộc sống của {displayFrom}, mang đến nụ
            cười rạng rỡ, sự ấm áp và những khoảnh khắc bình yên quý giá. Có {displayTo}, mỗi ngày
            trôi qua đều trở nên tươi đẹp và ngập tràn ý nghĩa hơn rất nhiều.
          </p>

          <div className="poem">
            <span className="l6">Tháng mười gió nhẹ đón thu sang,</span>
            <span className="l8">Chúc người luôn rạng rỡ, bình an.</span>
            <span className="l6">Nụ cười tươi thắm trên môi nở,</span>
            <span className="l8">Hạnh phúc ngọt ngào, vạn an khang.</span>
          </div>

          <p>
            Chúc {displayTo} luôn xinh đẹp, an yên, khoẻ mạnh và tự tin toả sáng như đoá hoa ngát hương.
            Dù cuộc sống ngoài kia có bộn bề ra sao, hãy luôn nhớ rằng {displayTo} xứng đáng được yêu
            thương, nâng niu và trân trọng mỗi ngày!
          </p>

          <div className="sign">
            <div className="s1">{displayFrom}</div>
            <div className="s2">20/10/2026 · Gửi trọn yêu thương</div>
          </div>
        </div>
      </div>
    </section>
  );
}
