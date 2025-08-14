import { useRef, useEffect, useState } from "react";
import axios from "axios";
import * as faceapi from "face-api.js";
import "./FaceExpression.css";
import { ChevronsRight } from "lucide-react";

const FaceExpression = ({ setSongsData, setIsPlaying }) => {
  const videoRef = useRef(null);
  const [mood, setMood] = useState("");
  const [camAccess, setCamAccess] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [btnContent, setBtnContent] = useState("Detect Mood");

  const loadModels = async () => {
    const modelBase = import.meta.env.BASE_URL;
    const MODEL_URL = `${modelBase}models/`;
    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
    await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
    setModelsLoaded(true);
  };
  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        setCamAccess(true);
        videoRef.current.srcObject = stream;
      })
      .catch((err) => {
        setMood("No Camera");
        console.log("Please enable camera access in site-settings", err);
      });
  };
  const handleVideoPlay = async () => {
    setDetecting(true);
    setBtnContent("Detecting...");
    setTimeout(async () => {
      try {
        const detections = await faceapi
          .detectAllFaces(
            videoRef.current,
            new faceapi.TinyFaceDetectorOptions()
          )
          .withFaceExpressions();
        let mostProbableExpression = 0;
        let expression = "";
        for (const detection of Object.keys(detections[0].expressions)) {
          if (detections[0].expressions[detection] > mostProbableExpression) {
            mostProbableExpression = detections[0].expressions[detection];
            expression = detection;
          }
        }
        setMood(expression);

        try {
          const isProd =
            import.meta.env.VITE_NODE_ENV === "production" ? true : false;
          const response = await axios.get(
            `${
              isProd
                ? import.meta.env.VITE_BACKEND_URL
                : "http://localhost:3000"
            }/songs?mood=${expression}`
          );
          setSongsData(response.data.songs);
        } catch (error) {
          setSongsData([]);
          setIsPlaying(false);
        }
      } catch {
        setMood("No Face");
        return;
      } finally {
        setDetecting(false);
        setBtnContent("Detect Mood");
      }
    }, 0);
  };

  useEffect(() => {
    loadModels().then(startVideo);
  }, []);

  return (
    <div className="face-expression section rubik-normal">
      <div className="face-video-container">
        <video ref={videoRef} autoPlay muted loop>
          Your browser does not support the video tag.
        </video>
        {!camAccess && (
          <div className="overlay">
            <span>CAMERA ACCESS REQUIRED</span>
            <button className="btn grant-access-btn" onClick={startVideo}>
              Grant Access
            </button>
          </div>
        )}
      </div>
      <div className="details-container">
        <div className="details">
          <h2>Live Mood Detection</h2>
          <p>
            Your current mood is being analysed in real-time. Enjoy the music
            tailored to your feelings.
          </p>
        </div>
        <div className="detect-button-container">
          <button
            className="btn detect-btn"
            onClick={handleVideoPlay}
            disabled={!modelsLoaded || detecting}
          >
            {btnContent}
          </button>
          <span>
            Mood:{" "}
            {mood === "" ? (
              <>
                Click <ChevronsRight className="click-arrow" />
                <ChevronsRight className="click-arrow-shadow" />
              </>
            ) : (
              mood
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FaceExpression;
