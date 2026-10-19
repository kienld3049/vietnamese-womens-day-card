interface MusicDiscProps {
  isPlaying: boolean;
  onToggle: () => void;
  visible: boolean;
}

export function MusicDisc({ isPlaying, onToggle, visible }: MusicDiscProps) {
  if (!visible) return null;

  return (
    <button
      className={`disc ${isPlaying ? 'playing' : ''}`}
      onClick={onToggle}
      aria-label={isPlaying ? 'Tạm dừng nhạc' : 'Phát nhạc'}
      title={isPlaying ? 'Tạm dừng nhạc' : 'Phát nhạc nền'}
    >
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M9 18V5l12-2v13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
      </svg>
    </button>
  );
}
