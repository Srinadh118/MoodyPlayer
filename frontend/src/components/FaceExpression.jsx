import React, { useRef, useEffect } from "react";
import * as faceapi from "face-api.js";
import "./FaceExpression.css";

const FaceExpression = () => {
  const videoRef = useRef(null);
  const [mood, setMood] = React.useState("Detecting...");

  const loadModels = async () => {
    const MODEL_URL = "/models";
    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
    await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
  };
  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((err) => {
        console.log("Please enable camera access", err);
      });
  };
  const handleVideoPlay = async () => {
    try {
      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
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
    } catch {
      setMood("No Face");
      return;
    }
  };

  useEffect(() => {
    loadModels().then(startVideo);
    videoRef.current &&
      videoRef.current.addEventListener("play", handleVideoPlay);
  }, []);

  return (
    <div className="face-expression section">
      <div className="face-video-container">
        <video ref={videoRef} autoPlay muted loop>
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="details-container rubik-normal">
        <div className="details">
          <h2>Live Mood Detection</h2>
          <p>
            Your current mood is being analysed in real-time. Enjoy the music
            tailored to your feelings.
          </p>
        </div>
        <div className="detect-button-container">
          <button className="btn detect-btn" onClick={handleVideoPlay}>
            Detect Mood
          </button>
          <span>Mood: {mood}</span>
        </div>
      </div>
    </div>
  );
};

export default FaceExpression;
