import FaceExpression from "./components/FaceExpression";
import "./App.css";
import MoodSongs from "./components/MoodSongs";
import { useState } from "react";

const App = () => {
  const [songsData, setSongsData] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="app container">
      <h1 className="app-title rubik-80s-fade section">Moody Player</h1>
      <FaceExpression setSongsData={setSongsData} setIsPlaying={setIsPlaying} />
      <MoodSongs
        songsData={songsData}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
      />
      <footer className="section">
        <p className="rubik-normal">
          Made with ❤️ by
          <a href="https://github.com/Srinadh118" target="blank">
            {" "}
            Srinadh
          </a>
        </p>
      </footer>
    </div>
  );
};

export default App;
