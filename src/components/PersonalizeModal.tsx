import { useState } from 'react';

interface PersonalizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRecipient: string;
  currentSender: string;
  onSave: (recipient: string, sender: string) => void;
  onToast: (msg: string) => void;
}

const PRESET_PAIRS = [
  { label: 'Người yêu / Bạn gái', to: 'Em yêu', from: 'Anh' },
  { label: 'Vợ yêu', to: 'Vợ yêu', from: 'Chồng' },
  { label: 'Mẹ kính yêu', to: 'Mẹ yêu thương', from: 'Con' },
  { label: 'Bạn gái thân', to: 'Cô bạn thân mến', from: 'Tôi' },
  { label: 'Chị gái', to: 'Chị gái kính mến', from: 'Em' },
  { label: 'Em gái nhỏ', to: 'Em gái nhỏ', from: 'Anh' },
  { label: 'Người thầm thương (Crush)', to: 'Cô gái đáng yêu', from: 'Người thầm thương' },
];

export function PersonalizeModal({
  isOpen,
  onClose,
  currentRecipient,
  currentSender,
  onSave,
  onToast
}: PersonalizeModalProps) {
  const [recipient, setRecipient] = useState(currentRecipient);
  const [sender, setSender] = useState(currentSender);

  if (!isOpen) return null;

  const handleApply = (toVal = recipient, fromVal = sender) => {
    const finalTo = toVal.trim() || 'Người tôi thương';
    const finalFrom = fromVal.trim() || 'Người gửi';
    onSave(finalTo, finalFrom);
    onClose();
    onToast(`Đã đổi thiệp: Gửi tới ${finalTo} từ ${finalFrom} 💌`);
  };

  const handleSelectPreset = (toVal: string, fromVal: string) => {
    setRecipient(toVal);
    setSender(fromVal);
    handleApply(toVal, fromVal);
  };

  const handleCopyLink = async () => {
    const finalTo = recipient.trim() || 'Người tôi thương';
    const finalFrom = sender.trim() || 'Người gửi';
    
    // Import and build clean URL without __aistudio_auth_token or internal params
    const cleanUrl = new URL(window.location.pathname, window.location.origin);
    cleanUrl.searchParams.set('to', finalTo);
    cleanUrl.searchParams.set('from', finalFrom);
    const finalUrl = cleanUrl.toString();

    try {
      await navigator.clipboard.writeText(finalUrl);
      onToast(`Đã sao chép link sạch gửi tặng ${finalTo}! 🔗`);
    } catch {
      onToast('Không thể sao chép liên kết');
    }
  };

  return (
    <div className="recipient-modal-backdrop" onClick={onClose}>
      <div
        className="recipient-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex justify-between items-center mb-3">
          <h3 id="modal-title" className="text-xl font-bold text-[#8e1f3f]">
            Cá nhân hoá thiệp gửi tặng
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
          Điền tên người bạn muốn gửi và tên của bạn. Tấm thiệp, lá thư và các lời chúc sẽ được chuyển
          thành cuộc trò chuyện 1-1 riêng tư, ngọt ngào.
        </p>

        {/* Inputs */}
        <div className="space-y-3 mb-4">
          <div>
            <label className="block text-xs font-semibold text-[#8e1f3f] uppercase tracking-wider mb-1">
              Gửi tới (Người nhận):
            </label>
            <input
              type="text"
              className="w-full px-3.5 py-2 rounded-xl border border-[rgba(142,31,63,0.25)] bg-[#fffdf9] text-[#3b1b24] focus:outline-none focus:ring-2 focus:ring-[#c2375b] text-sm"
              placeholder="VD: Em yêu, Lan Anh, Mẹ yêu..."
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              maxLength={40}
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#8e1f3f] uppercase tracking-wider mb-1">
              Từ (Tên của bạn):
            </label>
            <input
              type="text"
              className="w-full px-3.5 py-2 rounded-xl border border-[rgba(142,31,63,0.25)] bg-[#fffdf9] text-[#3b1b24] focus:outline-none focus:ring-2 focus:ring-[#c2375b] text-sm"
              placeholder="VD: Anh, Con trai, Đức Huy..."
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              maxLength={40}
            />
          </div>
        </div>

        {/* Quick Presets */}
        <div className="mb-4">
          <div className="text-xs font-semibold text-[#7a4a56] mb-2">Chọn nhanh mối quan hệ:</div>
          <div className="flex flex-wrap gap-1.5">
            {PRESET_PAIRS.map((pair) => (
              <button
                key={pair.label}
                type="button"
                className="text-xs px-2.5 py-1 rounded-full border border-[rgba(142,31,63,0.2)] bg-white text-[#8e1f3f] hover:bg-[#c2375b] hover:text-white transition-colors"
                onClick={() => handleSelectPreset(pair.to, pair.from)}
              >
                {pair.label}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-[rgba(142,31,63,0.12)]">
          <button
            type="button"
            className="btn-primary flex-1 justify-center py-2 text-sm"
            onClick={() => handleApply()}
          >
            Lưu thay đổi
          </button>
          <button
            type="button"
            className="btn-primary ghost flex-1 justify-center py-2 text-sm"
            onClick={handleCopyLink}
          >
            Sao chép Link tặng
          </button>
        </div>
      </div>
    </div>
  );
}
