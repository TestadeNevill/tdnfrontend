import { Link } from "react-router-dom"

const Ideas = () => {
    return(

      

 <section className="min-h-screen bg-white px-4 md:px-10 pt-4 pb-20 max-w-5xl mx-auto text-gray-800 text-lg leading-relaxed space-y-12">

      <h2 className="text-4xl font-bold text-emerald-800 mb-2 text-center">Ideas</h2>
      <p className="text-center text-gray-500 -mt-2">Electromagnetic Energy • Transhhipment • Automation</p>

<img
  src="/assets/Cityscape Italian Futurism.jpg"
  alt="Cityscape Italian Futurism by Tulio Crali (1939)"
  className="w-full h-auto object-contain rounded-lg shadow-md block"
/>
<p className="italic text-xs mt-0">Cityscape Italian Futurism by Tulio Crali (1939)</p>

<h1 className="font-semibold text-emerald-800">Necessary Processes:</h1>
<ul className="list-disc list-inside marker:text-emerald-600 text-gray-700">
    <li>
  <strong className="text-emerald-800">Streamline Permitting</strong> — A process that makes getting any and all infrastructure development approvals simpler and faster. The future of cities depend on governments and agencies ability to review applications and proposals, provide guidelines and submissions through online portals and digital platforms. Improved apporval times means can attract investment by making the development process more attractive, reduce costs by cutting delays and legal fees, faster project completetion and improved transparency. 
</li>
  <li>
  <strong className="text-emerald-800">Digital Community Engagement</strong> — An online platform that allows community and government a central location to engage, receive important updates and build trust through transparency. This wil be a vital tool that acts as an additional to in person participation and events for new development projects, land use plans and ordinances changes, as well as important advisories. This platform can also be used to submit services requests and applications, provide an overview of government spending and voting.
</li>
</ul>

          <p className="font-semibold text-emerald-800">Necessary Equipment:</p>
          <ul className="list-disc list-inside marker:text-emerald-600 text-gray-700">
  <li>
  <strong className="text-emerald-800">Energy Generation</strong> — Energy generation is fundamentally the most vital resource as we advance from the third to fourth industrial revolution. The neccessity of producing power from renewable and or efficient sources embedded into city infrastructure. It involves the advancement in efficiencies of all forms of energy generation paired with storage, reliability, and distributed grid flexibility. Its impact is cleaner and more resilient energy systems that support next-generation cities. The need for energy now is fueled mainly now by the demands of AI which dictate the progression of the Internet of Things (IOT), big data analytics, advanced robotics, and more, all of which contribute to smarter cities. 
</li>

<li>
  <strong className="text-emerald-800">GIS Device</strong> — A geographic information system device refers to any tool used to capture and analyze geographic and spatial data. Future cities rely on highly accurate 3D models and real-time mapping. Its improvement and impact is faster, smarter site selection, better infrastructure layouts, and more efficient long-term development.
</li>

<li>
  <strong className="text-emerald-800">Multiple Hoist Cranes</strong> — Multiple hoist cranes allow simultaneous vertical construction across different parts of a site. They provide automation, increased lift capacity, and safety to speed up dense urban construction. The results are faster high-rise development and reduced labor bottlenecks.
</li>

<li>
  <strong className="text-emerald-800">Robotic Construction</strong> — Robotic construction refers to the use of autonomous or semi-autonomous machines to perform building tasks traditionally done by human labor. It needs advancement in mobility, perception, and outdoor reliability so robots can navigate unpredictable environments and adapt to different materials and site conditions. Its impact is faster, safer, and more precise construction processes that help future cities scale infrastructure rapidly while reducing costs and human risk.
</li>


<li>
  <strong className="text-emerald-800">Prefab Construction</strong> — Prefab construction manufactures building components off-site and assembles them on-site. It requires better materials, tighter tolerances, and more scalable modular systems. Its impact is faster housing delivery, reduced waste, and predictable development costs.
</li>

<li>
  <strong className="text-emerald-800">Electromagnetic Elevators</strong> — Electromagnetic elevators use electromagnetic levitation to move cabins vertically and horizontally without cables. They must be improved for safety, energy use, and cross-building integration. Their impact is enabling supertall structures and multi-directional movement that transforms how buildings are designed.
</li>

<li>
  <strong className="text-emerald-800">Electromagnetic Rail</strong> — Electromagnetic rail uses magnetic propulsion to move vehicles at extremely high speeds with minimal friction. It needs improvements in power efficiency, cooling, and affordability for widespread adoption. Its impact is ultra-fast regional mobility that reduces dependence on cars and reshapes commuting patterns.
</li>



<li>
  <strong className="text-emerald-800">Rail to Aircraft Transshipment</strong> — Rail-to-aircraft transshipment connects passengers or cargo rolling stock directly with aircraft in terminals. It would improve scheduling, infrastructure alignment, and operational coordination. Its impact is reduced travel time, lower airport congestion, and a fully integrated multimodal transportation ecosystem.
</li>

          </ul>

<Link to={"/about"} className="link text-sm mt-3 inline-block">Back to About page →</Link>
        




 
    </section>

)}

export default Ideas