import { getData } from "@/data/getData";
import dynamic from "next/dynamic";
import Script from "next/script";
import VideocallWrapper from "@/components/VideoCallWrapper";

export default async function Page({ params }) {
  const {slug} = params;
  const jwt = await getData(slug);
  return (
    <main>
      <VideocallWrapper slug={params.slug} JWT={jwt} />
      <Script src="/coi-serviceworker.js" strategy="beforeInteractive" />
    </main>
  );
}