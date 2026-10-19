import { useState } from 'react';
import { getCleanGiftUrl, getGiftShareMessage } from '../lib/urlHelper.ts';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientName: string;
  senderName: string;
  selectedTopic?: string;
  customNote?: string;
  onToast: (msg: string) => void;
}

export function ShareModal({
  isOpen,
  onClose,
  recipientName,
  senderName,
  selectedTopic,
  customNote,
  onToast
}: ShareModalProps) {
  const [copiedType, setCopiedType] = useState<'url' | 'message' | null>(null);

  if (!isOpen) return null;

  const cleanUrl = getCleanGiftUrl(recipientName, senderName, selectedTopic, customNote);
  const shareMessage = getGiftShareMessage(recipientName, senderName, cleanUrl);

  const copyOnlyUrl = async () => {
    try {
      await navigator.clipboard.writeText(cleanUrl);
      setCopiedType('url');
      onToast('Đã sao chép link thiệp gửi tặng! 🔗');
      setTimeout(() => setCopiedType(null), 2000);
    } catch {
      onToast('Không thể sao chép liên kết');
    }
  };

  const copyFullMessage = async () => {
    try {
      await navigator.clipboard.writeText(shareMessage);
      setCopiedType('message');
      onToast('Đã sao chép lời nhắn kèm link! 💌');
      setTimeout(() => setCopiedType(null), 2000);
    } catch {
      onToast('Không thể sao chép tin nhắn');
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Thiệp chúc mừng 20/10 gửi ${recipientName}`,
          text: `Món quà nhỏ gửi tặng ${recipientName} nhân ngày 20/10 🌸`,
          url: cleanUrl
        });
        onToast('Đã mở chia sẻ thành công!');
      } catch {
        // User cancelled share
      }
    } else {
      copyOnlyUrl();
    }
  };

  return (
    <div className="recipient-modal-backdrop" onClick={onClose}>
      <div
        className="recipient-modal !max-w-lg"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-modal-title"
      >
        <div className="flex justify-between items-center mb-3">
          <h3 id="share-modal-title" className="text-xl font-bold text-[#8e1f3f] flex items-center gap-2">
            <span>💌</span> Lấy link gửi tặng thiệp 20/10
          </h3>
          <button
            onClick={onClose}
            className="text-[#7a4a56] hover:text-[#8e1f3f] text-2xl font-bold leading-none p-1"
            aria-label="Đóng"
          >
            &times;
          </button>
        </div>

        <p className="text-xs sm:text-sm text-[#7a4a56] mb-4">
          Tấm thiệp đã được đóng gói riêng cho <b>{recipientName || 'Người nhận'}</b> từ <b>{senderName || 'Bạn'}</b>.
          Khi người nhận mở link này, họ chỉ xem thiệp thuần túy và không thể sửa hay đổi phong cách.
        </p>

        {/* Option 1: Clean URL Only */}
        <div className="mb-4 p-3.5 rounded-xl bg-white border border-[rgba(142,31,63,0.18)]">
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-semibold text-[#8e1f3f] uppercase tracking-wide">
              1. Chỉ lấy đường Link thiệp:
            </label>
            <span className="text-[11px] text-emerald-600 font-medium">Link riêng cho người nhận</span>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={cleanUrl}
              className="flex-1 px-3 py-2 text-xs rounded-lg border border-[rgba(142,31,63,0.2)] bg-[#fffdf9] text-[#3b1b24] select-all font-mono"
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
            <button
              type="button"
              onClick={copyOnlyUrl}
              className={`px-3.5 py-2 text-xs rounded-lg font-semibold transition-all flex items-center gap-1.5 flex-none ${
                copiedType === 'url'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#c2375b] text-white hover:bg-[#8e1f3f]'
              }`}
            >
              {copiedType === 'url' ? '✓ Đã chép' : 'Sao chép Link'}
            </button>
          </div>
        </div>

        {/* Option 2: Pre-written Message with Link */}
        <div className="mb-4 p-3.5 rounded-xl bg-white border border-[rgba(142,31,63,0.18)]">
          <label className="block text-xs font-semibold text-[#8e1f3f] uppercase tracking-wide mb-1.5">
            2. Lời nhắn gửi kèm (tiện dán gửi qua Zalo / Messenger):
          </label>
          <textarea
            readOnly
            rows={2}
            value={shareMessage}
            className="w-full px-3 py-2 text-xs rounded-lg border border-[rgba(142,31,63,0.2)] bg-[#fffdf9] text-[#3b1b24] select-all resize-none mb-2"
            onClick={(e) => (e.target as HTMLTextAreaElement).select()}
          />
          <button
            type="button"
            onClick={copyFullMessage}
            className={`w-full py-2 text-xs rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 ${
              copiedType === 'message'
                ? 'bg-emerald-600 text-white'
                : 'border border-[rgba(142,31,63,0.25)] text-[#8e1f3f] bg-[#fdeceb]/60 hover:bg-[#fdeceb]'
            }`}
          >
            {copiedType === 'message' ? '✓ Đã sao chép tin nhắn' : '📋 Sao chép cả tin nhắn mẫu'}
          </button>
        </div>

        {/* Native share (if supported) */}
        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <div className="pt-2 border-t border-[rgba(142,31,63,0.12)] flex justify-end">
            <button
              type="button"
              onClick={handleNativeShare}
              className="w-full btn-primary justify-center py-2.5 text-xs font-semibold flex items-center gap-1.5"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
              Gửi qua Zalo / Messenger / Tin nhắn
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
