import { useRef, useState } from "react";
import "../assets/styles/videoPlayer.scss";

function VideoPlayer() {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [playing, setPlaying] = useState<boolean>(false);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [videoTime, setVideoTime] = useState<number>(0);
    const [progress, setProgress] = useState<number>(0);

    const videoHandler = (control: string) => {
        if (control === "play") {
            videoRef.current?.play();
            setPlaying(true);
            var vid = document.getElementById("video1") as HTMLVideoElement;
            setVideoTime(vid.duration);
        } else if (control === "pause") {
            videoRef.current?.pause();
            setPlaying(false);
        }
    };

    const fastForward = () => {
        if (videoRef.current) {
            videoRef.current.currentTime += 5;
        }
    };

    const revert = () => {
        if (videoRef.current) {
            videoRef.current.currentTime -= 5;
        }
    };

    window.setInterval(function () {
        setCurrentTime(videoRef.current?.currentTime || 0);
        setProgress(((videoRef.current?.currentTime || 0) / videoTime) * 100);
    }, 1000);

    return (
        <div className="videoplayer">
            <video
                id="video1"
                ref={videoRef}
                className="video"
                src="http://127.0.0.1:5000/video"
            ></video>

            <div className="controlsContainer">
                <div className="controls">
                    <img
                        onClick={revert}
                        className="controlsIcon"
                        alt=""
                        src="/backward-5.svg"
                    />
                    {playing ? (
                        <img
                            onClick={() => videoHandler("pause")}
                            className="controlsIcon--small"
                            alt=""
                            src="/pause.svg"
                        />
                    ) : (
                        <img
                            onClick={() => videoHandler("play")}
                            className="controlsIcon--small"
                            alt=""
                            src="/play.svg"
                        />
                    )}
                    <img
                        className="controlsIcon"
                        onClick={fastForward}
                        alt=""
                        src="/forward-5.svg"
                    />
                </div>
            </div>

            <div className="timecontrols">
                <p className="controlsTime">
                    {Math.floor(currentTime / 60) +
                        ":" +
                        ("0" + Math.floor(currentTime % 60)).slice(-2)}
                </p>
                <div className="time_progressbarContainer">
                    <div
                        style={{ width: `${progress}%` }}
                        className="time_progressBar"
                    ></div>
                </div>
                <p className="controlsTime">
                    {Math.floor(videoTime / 60) +
                        ":" +
                        ("0" + Math.floor(videoTime % 60)).slice(-2)}
                </p>
            </div>
        </div>
    );
}

export default VideoPlayer;
