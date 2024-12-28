import { useRef, useState } from "react";

import VideoPlayer from "./player";

function App() {
  const [videoLink, setVideoLink] = useState(
    "http://localhost:8000/uploads/videos/47557ed3-9cf9-4c69-abcd-9facf93b7142/index.m3u8"
  );
  const playerRef = useRef(null);

  const videoPlayerOptions = {
    controls: true,
    responsive: true,
    fluid: true,
    sources: [
      {
        src: videoLink,
        type: "application/x-mpegURL",
      },
    ],
  };

  const handlePlayerReady = (player) => {
    playerRef.current = player;

    // You can handle player events here, for example:
    player.on("waiting", () => {
      videojs.log("player is waiting");
    });

    player.on("dispose", () => {
      videojs.log("player will dispose");
    });
  };

  return (
    <div>
      <h1>Video Player</h1>
      <VideoPlayer options={videoPlayerOptions} onReady={handlePlayerReady} />
    </div>
  );
}

export default App;
