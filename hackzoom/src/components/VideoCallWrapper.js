'use client';  // Mark this component as client-side

import dynamic from "next/dynamic";

// Dynamically import the Videocall component (client-side only)
const Videocall = dynamic(() => import("@/components/Videocall").then((mod) => mod.Videocall), { ssr: false });

export default function VideocallWrapper({ slug, jwt }) {
  return <Videocall slug={slug} JWT={jwt} />;
}
