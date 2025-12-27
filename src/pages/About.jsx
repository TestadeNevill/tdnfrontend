import { Link } from "react-router-dom";

const About = () => {
  return (
    <section className="min-h-screen bg-white max-w-5xl mx-auto px-4 sm:px-6 md:px-10 pt-6 pb-20 text-gray-800 text-lg leading-relaxed space-y-16">
      {/* Heading */}
      <header className="text-center">
        <h2 className="text-4xl font-bold text-emerald-800">About Me</h2>
        <p className="text-gray-500 mt-1">Urban Systems • Technology • Human Scale</p>
      </header>

      {/* Section 1: Image Right on desktop, centered on mobile */}
      <div className="relative">
        <img
          src="/assets/Astronaut.jpg"
          alt="Future vision"
          className="
            block mx-auto w-full max-w-xs mb-6 rounded-lg shadow-md
            md:float-right md:ml-6 md:mx-0
          "
        />

        <p>
          My name is Datesta Nickle, but you can call me “Testa”. I grew up playing
          SimCity 2000, and since then I’ve always looked at cities from a bird’s-eye
          view—panning maps, imagining where future systems should go, how they would
          look, and how they would function. Over time, I shaped my career around
          building those systems through zoning, real estate, and renewable development.
        </p>

        <p className="mt-4">
          I have a knack for finding maps and imagining where infrastructure should be
          built—tracing transit routes and envisioning walkable spaces that allow
          neighborhoods to thrive. As I began working professionally, I developed a
          more complete view of what communities need to be developed “well,” not just
          physically, but institutionally.
        </p>

        <p className="mt-4">
          I realized that many of our infrastructure processes are inefficient,
          outdated, and slow. Large-scale projects are often non-inclusive to the
          communities they impact, and designing for the human scale is limited or
          nonexistent.
        </p>

        <p className="mt-4">
          To create sustainable, well-designed communities, there is a long list of{" "}
          <Link to="/ideas" className="link">
            ideas
          </Link>{" "}
          —technologies that must be created or improved, and processes that need to be
          redesigned.
        </p>

        <p className="mt-4">
          These are the technologies and systems I plan to study, advocate for, and work
          on during the latter half of my career. For now, the best way forward is to
          write about them—examining the latest software, inventions, practices, and
          methodologies that shape better development. Development that prioritizes
          everyday people, efficient movement of passengers and goods, and spaces that
          balance privacy with vibrant interaction.
        </p>

        <div className="clear-both" />
      </div>

      {/* Section 2: Image Left on desktop, centered on mobile */}
      <div className="relative">
        <img
          src="/assets/Testa.jpg"
          alt="On site"
          className="
            block mx-auto w-full max-w-xs mb-6 rounded-lg shadow-md
            md:float-left md:mr-6 md:mx-0
          "
        />

        <p>
          People must be at the center of the spaces we create—not cars, not parking
          ratios, and not projected investor returns. A cohesive environment should
          allow every inhabitant to move freely, access vital and recreational spaces,
          live in comfortable and functional homes, and consume clean food, air, and
          water.
        </p>

        <p className="mt-4">
          Ultimately, I’m committed to reshaping the infrastructure of the future—where
          visionary design meets practical execution. By pairing emerging technologies
          with creative problem-solving, we can build systems that are efficient and
          forward-thinking, yet grounded in community needs, climate resilience, and
          long-term value.
        </p>

        <div className="clear-both" />
      </div>
    </section>
  );
};

export default About;
