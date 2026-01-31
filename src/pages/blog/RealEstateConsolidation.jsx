// src/pages/blog/RealEstateConsolidation.jsx
import { Link } from "react-router-dom";


export default function RealEstateConsolidation() {
  return (
    <section className="min-h-screen bg-white px-4 md:px-10 pt-4 pb-20 max-w-5xl mx-auto text-gray-800 text-lg leading-relaxed space-y-12">
      {/* Header */}
      <header className="space-y-2">
        <h1 className="text-4xl font-bold text-green-800">
          Real Estate Consolidation
        </h1>
        <p className="text-sm text-gray-500">By Testa DeNevill · January 2026</p>
      </header>

      {/* Hero image */}
      <img
        src="/assets/Futuristic urban landscape.jpg"
        alt="Next-generation transit hub concept"
        className="w-full h-auto object-contain rounded-lg shadow-md"
        onError={(e) => {
          e.currentTarget.src =
            "https://via.placeholder.com/1200x630?text=Transit+Hubs";
        }}
      />

      {/* Key takeaways */}
      <aside className="rounded-xl border border-green-100 bg-green-50 p-5 text-base leading-relaxed">
        <p className="font-semibold text-green-900">Key takeaways</p>
        <ul className="mt-2 list-disc list-inside marker:text-green-700 space-y-1 text-green-900/90">
          <li>Introduce "elderhood" in cities to retain local residents while creating community spaces and utilities that match the needs of locals.</li>
          <li>The limitations of standard zoning ordinances and the importance of flexible development regulations and processes and emphasizing the benefits of focusing on pedestrian oriented walkways.</li>
          <li>Transforming an outdated housing stock into sustainable developments that increases private and public ownership.</li> 
          <li>Reengineer mixed use development projects into a repeatable products that produces economies of scale in growth. </li>
        </ul>
      </aside>
<div>
<h1>COMING SOON!</h1>
</div>

      <Link to="/blog" className="text-green-700 hover:underline text-sm block">
        ← Back to Blog
      </Link>
    </section>
  );
}

