interface CreatorStudioProps {
  recipientName: string;
  senderName: string;
  onOpenEdit: () => void;
  onShare: () => void;
  isPreviewAsRecipient: boolean;
  onTogglePreview: () => void;
}

export function CreatorStudio({
  recipientName,
  senderName,
  onOpenEdit,
  onShare,
  isPreviewAsRecipient,
  onTogglePreview
}: CreatorStudioProps) {
  return (
    <div className="fixed top-3 left-1/2 -translate-x-1/2 z-30 w-[95%] max-w-xl">
      <div className="bg-[#fffdf9]/95 backdrop-blur-md border border-[rgba(142,31,63,0.22)] shadow-[0_10px_30px_-10px_rgba(142,31,63,0.3)] rounded-2xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 transition-all">
        {/* Info label */}
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse flex-none" />
          <div className="text-xs text-[#3b1b24] truncate">
            <span className="font-semibold text-[#8e1f3f]">Studio tạo thiệp:</span>{' '}
            Gửi <b>{recipientName || 'Người nhận'}</b> từ <b>{senderName || 'Bạn'}</b>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5 flex-none ml-auto">
          <button
            type="button"
            onClick={onOpenEdit}
            className="text-xs px-2.5 py-1 rounded-full border border-[rgba(142,31,63,0.2)] bg-white text-[#8e1f3f] hover:bg-[#fdeceb] transition-colors font-medium flex items-center gap-1"
            title="Đổi tên người nhận & người gửi"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Sửa tên
          </button>

          <button
            type="button"
            onClick={onShare}
            className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-[#c2375b] to-[#8e1f3f] text-white hover:opacity-95 shadow-sm transition-all font-semibold flex items-center gap-1"
            title="Lấy link đã đóng gói để gửi cho người ấy"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            Lấy link gửi tặng
          </button>

          <button
            type="button"
            onClick={onTogglePreview}
            className={`text-xs px-2.5 py-1 rounded-full transition-colors font-medium flex items-center gap-1 ${
              isPreviewAsRecipient
                ? 'bg-[#8e1f3f] text-white'
                : 'text-[#7a4a56] hover:bg-[rgba(142,31,63,0.08)]'
            }`}
            title="Xem giao diện người nhận sẽ thấy"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            {isPreviewAsRecipient ? 'Đang xem thử' : 'Xem thử'}
          </button>
        </div>
      </div>
    </div>
  );
}
