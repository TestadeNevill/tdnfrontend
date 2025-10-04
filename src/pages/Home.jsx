export default function Home() {
  const useVideo = true;

  return (
    <section className="relative flex-1 flex items-center overflow-hidden">
      {/* Background media */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {useVideo && (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/assets/hero-poster.jpg"
            className="hidden md:block w-full h-full object-cover motion-reduce:hidden"
            aria-hidden="true"
          >
            <source src="/assets/hero-video.mp4" type="video/mp4" />
          </video>
        )}
        <img
          src="/assets/hero-poster.jpg"
          alt=""
          aria-hidden="true"
          className={`${useVideo ? "block md:hidden" : "block"} w-full h-full object-cover`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/70 to-white/10" />
      </div>

      {/* Hero copy */}
      <div className="relative max-w-5xl mx-auto px-4 md:px-10 py-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
          Designing sustainable, intelligent cities.
        </h1>
        <p className="text-gray-600 max-w-3xl mt-3">
          Portfolio, ideas, and experiments at the intersection of urban planning, renewable energy, and smart infrastructure.
        </p>
        <div className="mt-6 flex gap-3">
          {/* buttons */}
        </div>
      </div>
    </section>
  );
}
