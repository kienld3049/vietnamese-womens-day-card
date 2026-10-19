interface FooterProps {
  isRecipientMode?: boolean;
  onSwitchToCreate?: () => void;
}

export function Footer({ isRecipientMode, onSwitchToCreate }: FooterProps) {
  return (
    <footer>
      <div className="logo">
        Gửi Trọn Yêu Thương <em>·</em> 20/10
      </div>
      <p className="mt-2 text-sm text-[#7a4a56]">
        Chúc mừng ngày Phụ nữ Việt Nam 20/10/2026
      </p>
      <p className="mt-1 text-xs text-[#a3707c]">
        Thiệp hoa điện tử trao gửi tình cảm chân thành tới người phụ nữ bạn trân quý nhất 🌸
      </p>

      {/* Subtle invitation at the very bottom so recipient can also make a card for someone else */}
      {isRecipientMode && onSwitchToCreate && (
        <div className="mt-8 pt-5 border-t border-[rgba(142,31,63,0.12)]">
          <p className="text-xs text-[#7a4a56] mb-2.5">
            Bạn cũng muốn gửi một tấm thiệp ấm áp như thế này cho mẹ, bạn bè hay người thương?
          </p>
          <button
            type="button"
            onClick={onSwitchToCreate}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[rgba(142,31,63,0.25)] bg-white/90 text-[#8e1f3f] hover:bg-[#c2375b] hover:text-white transition-all text-xs font-semibold shadow-sm cursor-pointer"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
            Tự tạo thiệp mới gửi tặng người khác 🌸
          </button>
        </div>
      )}
    </footer>
  );
}
