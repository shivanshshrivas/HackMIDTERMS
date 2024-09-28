"use client";

import { CSSProperties, useRef, useState } from "react";
import {ZoomVideo, VideoClient,  VideoPlayer, VideoQuality} from "@zoom/videosdk";
import { CameraButton, MicButton } from "./MuteButtons";
import { PhoneOff } from "lucide-react";
import { Button } from "./ui/button";

const Videocall = (props) => {
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
  }
}