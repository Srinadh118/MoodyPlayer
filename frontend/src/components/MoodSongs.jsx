import { useEffect, useRef, useState } from "react";
import "./MoodSongs.css";

const songsData = [
  {
    id: 1,
    title: "Next To Me",
    artist: "Kingfishr",
    src: "NextToMe.mp3", // replace with real file
    duration: "3:50",
  },
  {
    id: 2,
    title: "Another Song",
    artist: "Artist 2",
    src: "another-song.mp3",
    duration: "4:12",
  },
];

const SongCard = ({
  song,
  currentSong,
  isPlaying,
  isSongComplete,
  progressPercentage,
  onPlayPauseToggle,
  setProgressPercentage,
  setIsPlaying,
  setIsSongComplete,
  setCurrentSong,
  audioRef,
}) => {
  const progressBarRef = useRef(null);

  // Sync pause if audio is paused externally
  useEffect(() => {
    const audio = audioRef.current;
    const handlePauseEvent = () => setIsPlaying(false);
    audio.addEventListener("pause", handlePauseEvent);
    return () => {
      audio.removeEventListener("pause", handlePauseEvent);
    };
  }, [audioRef, setIsPlaying]);

  const playingThis = currentSong === song.id && isPlaying;
  const pausedThis = currentSong === song.id && !isPlaying && !isSongComplete;

  const setTimelinePosition = (e) => {
    if (!progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    const clampedPct = Math.min(Math.max(pct, 0), 1);
    const audio = audioRef.current;
    if (audio.duration && currentSong === song.id) {
      audio.currentTime = clampedPct * audio.duration;
      setProgressPercentage(clampedPct * 100);
    }
  };

  const handlePointerMove = (e) => {
    setTimelinePosition(e);
  };

  const handlePointerUp = () => {
    window.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("pointerup", handlePointerUp);
  };

  const handleProgressSeek = (e) => {
    if (currentSong !== song.id) return;
    e.preventDefault();
    setTimelinePosition(e);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  return (
    <div
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
          <span className="total-time">{song.duration}</span>
        </div>
        <button
          className="btn play-btn"
          onClick={() => onPlayPauseToggle(song)}
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
        onPointerDown={handleProgressSeek}
        role="progressbar"
        aria-valuenow={progressPercentage}
        aria-valuemin={0}
        aria-valuemax={100}
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
            transform: "translateX(-50%)",
          }}
        ></div>
      </div>
    </div>
  );
};

const MoodSongs = () => {
  const audioRef = useRef(new Audio());
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSongComplete, setIsSongComplete] = useState(false);
  const [progressPercentage, setProgressPercentage] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      if (audio.duration && currentSong !== null) {
        setProgressPercentage((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setIsSongComplete(true);
      setProgressPercentage(0);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentSong]);

  const handlePlay = (song) => {
    const audio = audioRef.current;
    setIsSongComplete(false);
    setCurrentSong(song.id); // set early to keep in sync
    if (currentSong !== song.id) {
      audio.src = song.src;
      audio.currentTime = 0;
      setProgressPercentage(0);
    }
    audio
      .play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch((error) => {
        console.error("Error playing audio:", error);
      });
  };

  const handlePause = () => {
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const togglePlayPause = (song) => {
    if (currentSong === song.id) {
      if (isPlaying) {
        handlePause();
      } else {
        handlePlay(song);
      }
    } else {
      handlePlay(song);
    }
  };

  return (
    <div className="mood-songs section rubik-normal">
      <h2>Recommended Songs</h2>
      <div className="songs-container">
        {songsData.map((song) => (
          <SongCard
            key={song.id}
            song={song}
            currentSong={currentSong}
            isPlaying={isPlaying}
            isSongComplete={isSongComplete}
            progressPercentage={progressPercentage}
            onPlayPauseToggle={togglePlayPause}
            setProgressPercentage={setProgressPercentage}
            setIsPlaying={setIsPlaying}
            setIsSongComplete={setIsSongComplete}
            setCurrentSong={setCurrentSong}
            audioRef={audioRef}
          />
        ))}
      </div>
    </div>
  );
};

export default MoodSongs;
