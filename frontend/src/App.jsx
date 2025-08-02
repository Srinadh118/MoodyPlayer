import FaceExpression from "./components/FaceExpression";
import "./App.css";
import MoodSongs from "./components/MoodSongs";

const App = () => {
  return (
    <div className="app container">
      <h1 className="app-title rubik-80s-fade section">Moody Player</h1>
      <FaceExpression />
      <MoodSongs />
    </div>
  );
};

export default App;
