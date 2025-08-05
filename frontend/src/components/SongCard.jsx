import { useRef } from "react";

const SongCard = (props) => {
  const {
    song,
    audioRef,
    currentSong,
    isPlaying,
    isSongComplete,
    progressPercentage,
    setProgressPercentage,
    currentTime,
    setCurrentTime,
    formatDuration,
    togglePlayPause,
    setIsSeeking,
  } = props;
  const progressBarRef = useRef(null);
  const pendingSeekPctRef = useRef(0);
  const playingThis = currentSong === song._id && isPlaying;
  const pausedThis = currentSong === song._id && !isPlaying && !isSongComplete;

  // helper to clamp 0..100
  const clamp = (n, min = 0, max = 100) => Math.min(Math.max(n, min), max);

  // handling progress bar seek

  const handlePointerMove = (e) => {
    if (currentSong == null) return;
    setTimelinePosition(e);
    setProgressPercentage(pendingSeekPctRef.current * 100);
    setCurrentTime(
      formatDuration(pendingSeekPctRef.current * audioRef.current.duration)
    );
  };
  const handlePointerUp = () => {
    if (currentSong == null) return;
    const audio = audioRef.current;
    const clampedPct = pendingSeekPctRef.current;

    if (audio.duration) {
      audio.currentTime = clampedPct * audio.duration;
    }

    // end dragging
    setIsSeeking?.(false);

    window.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("pointerup", handlePointerUp);
  };
  const handleProgressSeek = (e, song) => {
    if (currentSong !== song._id) return;
    e.preventDefault();

    // begin dragging
    setIsSeeking?.(true);

    setTimelinePosition(e);
    setProgressPercentage(pendingSeekPctRef.current * 100);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  const setTimelinePosition = (e) => {
    if (!progressBarRef.current) return;
    const progressBar = progressBarRef.current;
    const rect = progressBar.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    const clampedPct = clamp(pct, 0, 1);
    pendingSeekPctRef.current = clampedPct;
  };

  // preview timeline position
  const handleMouseMove = (e) => {
    if (!progressBarRef.current) return;
    const progressBar = progressBarRef.current;
    const rect = progressBar.getBoundingClientRect();
    const relativeX = e.clientX - rect.left;
    const pct = clamp(relativeX / rect.width, 0, 1);

    progressBarRef.current.style.setProperty(
      "--timeline-preview",
      `${pct * 100}%`
    );
  };

  const handleMouseLeave = () => {
    if (!progressBarRef.current) return;
    progressBarRef.current.style.setProperty("--timeline-preview", `0%`);
  };

  return (
    <div
      key={song._id}
      className={`song-card ${playingThis ? "is-playing" : ""} ${
        pausedThis ? "is-paused" : ""
      }`}
    >
      <div className="song-details">
        <h3>{song.title}</h3>
        <p>{song.artist}</p>
      </div>
      <div className="song-controls">
        <div className="duration">
          <span className="total-time">
            {playingThis || pausedThis ? `${currentTime} / ` : ""}
            {song.duration}
          </span>
        </div>
        <button
          className="btn play-btn"
          onClick={() => {
            togglePlayPause(song);
          }}
          aria-label={playingThis ? "Pause" : "Play"}
        >
          {playingThis ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <rect x="14" y="3" width="5" height="18" rx="1" />
              <rect x="5" y="3" width="5" height="18" rx="1" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z" />
            </svg>
          )}
        </button>
      </div>
      <div
        ref={progressBarRef}
        className="progress-bar"
        onPointerDown={(e) => handleProgressSeek(e, song)}
        onMouseMove={(e) => handleMouseMove(e)}
        onMouseLeave={handleMouseLeave}
        role="progressbar"
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <div
          className="progress"
          style={{
            width: playingThis || pausedThis ? `${progressPercentage}%` : "0%",
          }}
        ></div>
        <div
          className="progress-dot"
          role="presentation"
          aria-hidden="true"
          style={{
            left: playingThis || pausedThis ? `${progressPercentage}%` : "0%",
          }}
        ></div>
      </div>
    </div>
  );
};

export default SongCard;
