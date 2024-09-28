"use client";
import { CSSProperties, useRef, useState } from "react";
import ZoomVideo from "@zoom/videosdk";
const { VideoClient, VideoPlayer, VideoQuality } = ZoomVideo;
import { CameraButton, MicButton } from "./CallButtons";

export const Videocall = (props) => {
  const session = props.slug;
  const jwt = props.JWT;
  const [inSession, setinSession] = useState(false);
  const client = useRef<typeof VideoClient>(ZoomVideo.createClient());
  const [isVideoMuted, setIsVideoMuted] = useState(!client.current.getCurrentUserInfo()?.bVideoOn);
  const [isAudioMuted, setIsAudioMuted] = useState(client.current.getCurrentUserInfo()?.muted ?? true);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  const joinSession = async () => {
    await client.current.init("en-US", "Global", { patchJsMedia: true });
    client.current.on("peer-video-state-change", (payload) => void renderVideo(payload));
    const userName = `User-${new Date().getTime().toString().slice(8)}`;
    await client.current.join(session, jwt, userName)
    setinSession(true);

    const mediaStream = client.current.getMediaStream();
    await mediaStream.startAudio();
    await mediaStream.startVideo();
    setIsAudioMuted(client.current.getCurrentUserInfo().muted ?? true);
    setIsVideoMuted(!client.current.getCurrentUserInfo().bVideoOn);
    await renderVideo({ action: "Start", userId: client.current.getCurrentUserInfo().userId });
  }

  const renderVideo = async (event) => {
    const mediaStream = client.current.getMediaStream();
    if (event.action === "Stop") {
      const element = await mediaStream.detachVideo(event.userId);
      Array.isArray(element)
        ? element.forEach((el) => el.remove())
        : element.remove();
    } else {
      const userVideo = await mediaStream.attachVideo(event.userId, VideoQuality.Video_360P);
      videoContainerRef.current.appendChild(userVideo);
    }
  }

  const leaveSession = async () => {
    client.current.off(
      "peer-video-state-change",
      (payload) =>//action, userId
        void renderVideo(payload)
    );
    await client.current.leave();
    window.location.href = "/";
  };

  return(
    <div>
      <h1>
        Session: {session}
      </h1>
      <div style={inSession ? {} : { display: "none" }}>
        <video-player-container ref={videoContainerRef} style={videoPlayerStyle} />
      </div>
      {!inSession ? (
        <div>
          <button onClick={startCall}>
            Join
          </button>
        </div>
        ) : (
        <div>
          <div>
            <CameraButton
              client={client}
              isVideoMuted={isVideoMuted}
              setIsVideoMuted={setIsVideoMuted}
              renderVideo={renderVideo}
            />
            <MicButton
              isAudioMuted={isAudioMuted}
              client={client}
              setIsAudioMuted={setIsAudioMuted}
            />
            <button onClick={leaveSession}>
              "Leave"
            </button>
          </div>
        </div>
      )}
    </div>
  );
  
}