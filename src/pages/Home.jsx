// src/pages/Home.jsx
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const videoRef = useRef(null);
  const [needsTap, setNeedsTap] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    // Required for iOS inline autoplay
    v.muted = true;
    v.playsInline = true;

    const tryPlay = async () => {
      try {
        await v.play();
        setNeedsTap(false);
      } catch {
        // Autoplay blocked (mobile/data saver/etc.)
        setNeedsTap(true);
      }
    };

    // If the video hasn't loaded yet, wait for some data first
    if (v.readyState < 2) {
      const onLoaded = () => {
        tryPlay();
        v.removeEventListener("loadeddata", onLoaded);
      };
      v.addEventListener("loadeddata", onLoaded);
    } else {
      tryPlay();
    }

    // If the video format/path fails, show image fallback
    const onErr = () => setVideoFailed(true);
    v.addEventListener("error", onErr);

    return () => {
      v && v.removeEventListener("error", onErr);
    };
  }, []);

  const onTapPlay = async () => {
    const v = videoRef.current;
    if (!v) return;
    try {
      v.muted = true; // keep muted for iOS inline
      await v.play();
      setNeedsTap(false);
    } catch {
      setNeedsTap(true);
    }
  };

  return (
    <section className="relative h-[60svh] md:h-[80svh] overflow-hidden flex items-center">
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
            className="w-full h-full object-contain md:object-cover bg-black"
            aria-hidden="true"
          >
            <source src="/assets/hero-video.mp4" type="video/mp4" />
            {/* Add a WEBM <source> if you have one */}
          </video>
        ) : (
          <img
            src="/assets/hero-poster.jpg"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover"
          />
        )}

        {/* Gradient: darker on mobile, light on desktop */}
        <div
          className="absolute inset-0
                     bg-gradient-to-t from-black/60 via-black/30 to-transparent
                     md:from-white md:via-white/70 md:to-white/10"
        />

        {/* Tap-to-play overlay when autoplay is blocked */}
        {needsTap && !videoFailed && (
          <button
            type="button"
            onClick={onTapPlay}
            className="absolute inset-0 flex items-center justify-center bg-black/30 text-white text-sm font-semibold"
            aria-label="Play background video"
          >
            Tap to play
          </button>
        )}
      </div>

      {/* Hero copy — centered vertically */}
      <div className="relative max-w-5xl mx-auto px-4 md:px-10">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white md:text-gray-900 drop-shadow">
          Designing sustainable, intelligent cities.
        </h1>
        <p className="text-white/90 md:text-gray-600 max-w-3xl mt-3 drop-shadow-sm">
          Portfolio, ideas, and experiments at the intersection of urban planning, renewable energy,
          and smart infrastructure.
        </p>
      </div>
    </section>
  );
}
