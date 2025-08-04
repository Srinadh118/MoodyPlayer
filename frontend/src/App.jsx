import FaceExpression from "./components/FaceExpression";
import "./App.css";
import MoodSongs from "./components/MoodSongs";

const App = () => {
  return (
    <div className="app container">
      <h1 className="app-title rubik-80s-fade section">Moody Player</h1>
      <FaceExpression />
      <MoodSongs />
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
