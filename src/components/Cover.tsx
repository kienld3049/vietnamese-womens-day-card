interface CoverProps {
  isOpen: boolean;
  onOpen: () => void;
  recipientName: string;
  senderName: string;
}

export function Cover({ isOpen, onOpen, recipientName, senderName }: CoverProps) {
  const displayTo = recipientName.trim() || 'Người phụ nữ tuyệt vời';
  const displayFrom = senderName.trim() || 'Người gửi';

  return (
    <div
      className={`cover ${isOpen ? 'gone' : ''}`}
      role="button"
      tabIndex={0}
      aria-label="Mở thiệp chúc mừng cá nhân"
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen();
        }
      }}
    >
      <div>
        <div className="cover-rose" aria-hidden="true">
          <svg viewBox="0 0 200 260">
            <use href="#rose" />
          </svg>
        </div>

        <div className="eyebrow">Dành riêng cho bạn · Ngày 20/10</div>
        <p className="c-title">Thiệp 20/10</p>

        <p className="c-to text-base sm:text-lg">
          Thương gửi <b>{displayTo}</b>
          <span className="block text-xs sm:text-sm text-[#7a4a56] mt-1 font-normal">
            từ <b>{displayFrom}</b> với tất cả sự yêu thương
          </span>
        </p>

        <div className="tap">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
          Chạm để mở thiệp
        </div>

        <p className="hint">Bật âm thanh để lắng nghe giai điệu ngọt ngào nhé</p>
      </div>
    </div>
  );
}
