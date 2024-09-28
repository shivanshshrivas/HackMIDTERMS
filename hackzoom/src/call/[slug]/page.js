import { getData } from "@/data/getToken";
import dynamic from "next/dynamic";
import Script from "next/script";

const Videocall = dynamic<{ slug, JWT }>(
  () => import("../../../components/Videocall"),
  { ssr: false });

export default async function Page({ params }) {
  const jwt = await getData(params.slug);
  return (
    <main>
      <Videocall slug={params.slug} JWT={jwt} />
      <Script src="/coi-serviceworker.js" strategy="beforeInteractive" />
    </main>
  );
}