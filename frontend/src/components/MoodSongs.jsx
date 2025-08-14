import { useEffect, useRef, useState } from "react";
import SongCard from "./SongCard";
import "./MoodSongs.css";

const MoodSongs = ({ songsData, isPlaying, setIsPlaying }) => {
  const audioRef = useRef(new Audio());
  const [currentSong, setCurrentSong] = useState(null);
  const [isSongComplete, setIsSongComplete] = useState(false);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");

  const isSeekingRef = useRef(false);
  const formatDuration = (seconds) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return `${mins}:${secs}`;
  };

  useEffect(() => {
    const audio = audioRef.current;
    const handleTimeUpdate = () => {
      if (isSeekingRef.current) return;
      if (audio.duration) {
        setProgressPercentage((audio.currentTime / audio.duration) * 100);
        setCurrentTime(formatDuration(audio.currentTime));
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setIsSongComplete(true);
      setProgressPercentage(0);
      setCurrentTime("0:00");
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const handlePlay = (song) => {
    const audio = audioRef.current;
    setIsSongComplete(false);
    if (currentSong !== song._id) {
      audio.src = song.audioUrl;
      audio.currentTime = 0;
      setProgressPercentage(0);
      setCurrentTime("0:00");
      setCurrentSong(song._id);
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
    if (currentSong === song._id) {
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
    <div className="mood-songs rubik-normal">
      <h2>{!songsData.length ? "No Songs Yet." : "Recommended Songs"}</h2>
      <div className="songs-container">
        {songsData.map((song) => (
          <SongCard
            key={song._id}
            song={song}
            audioRef={audioRef}
            currentSong={currentSong}
            isPlaying={isPlaying}
            isSongComplete={isSongComplete}
            progressPercentage={progressPercentage}
            setProgressPercentage={setProgressPercentage}
            currentTime={currentTime}
            setCurrentTime={setCurrentTime}
            formatDuration={formatDuration}
            togglePlayPause={togglePlayPause}
            setIsSeeking={(v) => (isSeekingRef.current = v)}
          />
        ))}
      </div>
    </div>
  );
};

export default MoodSongs;
