import { Link } from "react-router-dom";


const About = () => {
  return (
    <section className="min-h-screen bg-white px-4 md:px-10 pt-4 pb-20 max-w-5xl mx-auto text-gray-800 text-lg leading-relaxed space-y-12">
      {/* Heading */}
      <h2 className="text-4xl font-bold text-emerald-800 mb-2 text-center">About Me</h2>
      <p className="text-center text-gray-500 -mt-2">Urban Systems • Technology • Human Scale</p>

      {/* Section 1: Image Right with Wrapped Text */}
      <div className="relative">
        <img
          src="/assets/Astronaut.jpg"
          alt="Future vision"
          className="md:float-right w-64 h-auto md:ml-6 mb-4 rounded-lg shadow-md md:py-4"
        />

        <p>
          My name is Datesta Nickle but you can call me "Testa". I grew up playing SimCity2000 as a kid and since then I’ve always looked at cities from a bird’s-eye view. Panning maps, imagining where future systems
          should go, how they would look, and how they would function. Over the years I’ve shaped my career
          around building those systems through zoning, real estate and renewable development.
        </p>

        <p className="mt-3">
          I have a knack for finding maps and imagining where infrastructure should be built, tracing lines for transit routes and envisioning the walkable spaces that allow neighborhoods to thrive. 
          Once I began working, I established a panoptic view of what is needed for communities to be "ideally" developed, not just physically but institutionally. 
          I discovered our processes and solutions to develop infrastructure are inefficient, archaic and extremely slow, large scale projects are non inclusive to the communities they directly impact and designing for the human scale is limited or nonexistent. 
    
        </p>

                <p className="mt-3">In order to create sustainable, well designed communities there is a long list of <Link to={"/ideas"} className="link mt-3 inline-block">ideas</Link> of technologies that must be created or improved and processes that ought to be redesigned.</p>


        <p className="mt-3">
          These are techonologies and processes I plan on keeping an eye on, advocating for, and working on in this later half of my career. The best approach now is to write about it. 
          I want to discuss, the lastest software, inventions, practicies and methologies that create the "ideal" kinds of development. Developments that focus on the needs of every day people, produce
          the most effiecent routes for passengers and cargo, and create spaces that faciliate both privacy and vibrate interactions. Designing spaces is an art that takes many eyes to deem it beautuful. 
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
          People need to be at the center of the spaces we desire to create. Not
          the car and parking spaces, not projected earnings for investors. A cohesive enivornment that enables every inhabitiant to move freely, maintain access to vital, leisure, and recreational establishments, live in commodious and functional spaces, and consume quality food, air and water.
        </p>

        <p className="mt-3">
          Ultimately, I’m committed to reshaping the infrastructure of the future—where visionary design meets practical
          execution. By pairing these techonologies, as well as many others, with creative problem solving, we can build systems that are efficient
          and forward thinking, yet grounded in community needs and climate resilience with durable value at their core.
        </p>

        <div className="clear-both" />
      </div>
    </section>
  );
};

export default About;
