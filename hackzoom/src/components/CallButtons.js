import { useRef } from "react";

export const MicButton = (props) => {
  const { client, isAudioMuted, setIsAudioMuted } = props;
  const onMicrophoneClick = async () => {
    const mediaStream = client.current.getMediaStream();
    if (isAudioMuted) {
      await mediaStream?.unmuteAudio();
    } else {
      await mediaStream?.muteAudio();
    }
    setIsAudioMuted(client.current.getCurrentUserInfo().muted ?? true);
  };
  return (
    <button onClick={onMicrophoneClick} title="microphone">
      {isAudioMuted ? "Mic off" : "Mic on"}
    </button>
  );
};

export const CameraButton = (props) => {
  const { client, isVideoMuted, setIsVideoMuted, renderVideo } = props;

  const onCameraClick = async () => {
    const mediaStream = client.current.getMediaStream();
    if (isVideoMuted) {
      await mediaStream.startVideo();
      setIsVideoMuted(false);
      await renderVideo({ action: "Start", userId: client.current.getCurrentUserInfo().userId });
    } else {
      await mediaStream.stopVideo();
      setIsVideoMuted(true);
      await renderVideo({ action: "Stop", userId: client.current.getCurrentUserInfo().userId });
    }
  };

  return (
    <button onClick={onCameraClick} title="camera">
      {isVideoMuted ? "Video off" : "Video on"}
    </button>
  );
};
