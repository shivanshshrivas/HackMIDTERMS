"use client"
import Image from "next/image";
import VideoCall from "@/components/Videocall"
import { useRouter } from "next/navigation";
import Login from "./login/page";
export default function Home() {
  const router = useRouter();

  const generateSlug = () => {
    return Math.random().toString(36).substring(2, 10);  // Generate a random slug
  };

  const handleStartCall = () => {
    const slug = generateSlug();  // Generate slug
    router.push(`/call/${slug}`); // Navigate to the call/[slug] route
  };

  return (
    // <main>
    //   <h1>Start a Video Call</h1>
    //   <button onClick={handleStartCall}>Start Call</button>
    // </main>
    <Login />
  );
}
