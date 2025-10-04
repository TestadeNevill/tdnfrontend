const About = () => {
  return (
    <section className="min-h-screen bg-white px-4 md:px-10 pt-4 pb-20 max-w-5xl mx-auto text-gray-800 text-lg leading-relaxed space-y-12">
      {/* Heading */}
      <h2 className="text-4xl font-bold text-emerald-800 mb-2 text-center">About Me</h2>
      <p className="text-center text-gray-500 -mt-2">Urban systems • Energy storage • Software</p>

      {/* Section 1: Image Right with Wrapped Text */}
      <div className="relative">
        <img
          src="/assets/Astronaut.jpg"
          alt="Future vision"
          className="md:float-right w-64 h-auto md:ml-6 mb-4 rounded-lg shadow-md md:py-4"
        />

        <p>
          I’ve always looked at cities from a bird’s-eye view—panning maps, imagining where future systems
          should go, how they would look, and how they would function. Over the years I’ve shaped my career
          around building those systems through zoning, real estate, site acquisition, and most recently energy storage.
        </p>

        <p className="mt-3">
          I’m passionate about designing regenerative, intelligent cities that work logistically, socially, and
          ecologically. From working with zoning and local communities to deploying clean-energy assets, I’ve
          seen how technology and planning must integrate to build long-term resilience. Whether it’s battery
          storage in urban cores or transforming transportation nodes with transit-oriented development, I work
          at the intersection of vision and implementation.
        </p>

        <div className="mt-4">
          <p className="font-semibold text-gray-900">Selected experience:</p>
          <ul className="list-disc list-inside marker:text-emerald-600 text-gray-700">
            <li>
              <strong className="text-gray-900">New Haven City Planning Department</strong> — contributed to zoning code design and reviewed planning applications.
            </li>
            <li>
              <strong className="text-gray-900">NineDot Energy</strong> — supported development of distributed battery storage projects across New York City.
            </li>
            <li>
              <strong className="text-gray-900">Smartlink LLC</strong> — led site acquisition for NYC DEP rooftop antenna installs enabling remote water-meter readings.
            </li>
            <li>
              <strong className="text-gray-900">Solomon Energy</strong> — guided clients in reducing energy costs through strategic clean-infrastructure investments.
            </li>
          </ul>
        </div>

        <p className="mt-3">
          I combine real estate, software development, AI/automation, and city planning to create holistic systems
          that respond to local needs and global futures. Every project is rooted in clarity, impact, and scale.
        </p>

        <div className="clear-both" />
      </div>

      {/* Section 2: Image Left with Wrapped Text */}
      <div className="relative">
        <img
          src="/assets/Testa.jpg"
          alt="On site"
          className="md:float-left w-64 h-auto md:mr-6 mb-4 rounded-lg shadow-md md:py-4"
        />

        <p>
          My next chapter focuses on resilient urban systems centered on <strong>transshipment</strong>—using data,
          automation, and sustainable design to move people and goods efficiently. I’m exploring AI-assisted infrastructure,
          autonomous rail hubs, modular housing, and regenerative TOD to unlock cleaner, faster, more equitable cities.
        </p>

        <p className="mt-3">
          Ultimately, I’m committed to shaping the infrastructure of the future—where visionary design meets practical
          execution. By pairing data-driven insight with creative problem-solving, I build systems that are efficient
          and forward-thinking, yet grounded in community needs and climate resilience—with durable value at their core.
        </p>

        <div className="clear-both" />
      </div>
    </section>
  );
};

export default About;
