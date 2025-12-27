// src/pages/Home.jsx
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const videoRef = useRef(null);
  const [needsTap, setNeedsTap] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    v.muted = true;
    v.playsInline = true;

    const tryPlay = async () => {
      try {
        await v.play();
        setNeedsTap(false);
      } catch {
        setNeedsTap(true);
      }
    };

    if (v.readyState < 2) {
      const onLoaded = () => {
        tryPlay();
        v.removeEventListener("loadeddata", onLoaded);
      };
      v.addEventListener("loadeddata", onLoaded);
    } else {
      tryPlay();
    }

    const onErr = () => setVideoFailed(true);
    v.addEventListener("error", onErr);

    return () => v.removeEventListener("error", onErr);
  }, []);

  const onTapPlay = async () => {
    const v = videoRef.current;
    if (!v) return;
    try {
      await v.play();
      setNeedsTap(false);
    } catch {
      setNeedsTap(true);
    }
  };

  return (
    <section className="relative h-screen md:h-[80vh] overflow-hidden flex items-center">
      {/* Background media */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {!videoFailed ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/assets/hero-poster.jpg"
            className="w-full h-full object-cover"
            aria-hidden="true"
          >
            <source src="/assets/hero-video.mp4" type="video/mp4" />
          </video>
        ) : (
          <img
            src="/assets/hero-poster.jpg"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover"
          />
        )}

        {/* Gradient overlay — light on all screens */}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/70 to-white/10" />

        {/* Tap-to-play overlay */}
        {needsTap && !videoFailed && (
          <button
            onClick={onTapPlay}
            className="absolute inset-0 flex items-center justify-center bg-black/30 text-white text-sm font-semibold"
            aria-label="Play background video"
          >
            Tap to play
          </button>
        )}
      </div>

      {/* Hero text — vertically centered */}
      <div className="relative max-w-5xl mx-auto px-4 md:px-10 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 drop-shadow">
          Designing sustainable, intelligent cities.
        </h1>
        <p className="text-gray-600 max-w-3xl mt-3 drop-shadow-sm">
          Portfolio, ideas, and experiments at the intersection of urban planning,
          renewable energy, and smart infrastructure.
        </p>
      </div>
    </section>
  );
}
