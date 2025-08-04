import { useEffect, useRef, useState } from "react";
import SongCard from "./SongCard";
import "./MoodSongs.css";
import { songsData } from "../data/songsData";
const MoodSongs = () => {
  const audioRef = useRef(new Audio());
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSongComplete, setIsSongComplete] = useState(false);
  const [progressPercentage, setProgressPercentage] = useState(0);

  const isSeekingRef = useRef(false);

  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      if (isSeekingRef.current) return;
      if (audio.duration) {
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
  }, []);

  const handlePlay = (song) => {
    const audio = audioRef.current;
    setIsSongComplete(false);
    if (currentSong !== song.id) {
      audio.src = song.src;
      audio.currentTime = 0;
      setProgressPercentage(0);
      setCurrentSong(song.id);
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
            audioRef={audioRef}
            currentSong={currentSong}
            isPlaying={isPlaying}
            isSongComplete={isSongComplete}
            progressPercentage={progressPercentage}
            setProgressPercentage={setProgressPercentage}
            togglePlayPause={togglePlayPause}
            setIsSeeking={(v) => (isSeekingRef.current = v)}
          />
        ))}
      </div>
    </div>
  );
};

export default MoodSongs;
