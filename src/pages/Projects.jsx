import projects from '../data/projects.json'

function ProjectCard({ p }) {
  return (
    <article className="card p-5">
      <h3 className="font-semibold text-lg text-gray-900">{p.title}</h3>
      <p className="text-sm text-gray-600 mt-2">{p.summary}</p>
      {p.link && <a className="link text-sm mt-3 inline-block" href={p.link} target="_blank" rel="noreferrer">Learn more →</a>}
    </article>
  )
}

export default function Projects() {
  return (
    <section className="container-page">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Projects</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map(p => <ProjectCard key={p.id} p={p} />)}
      </div>
    </section>
  )
}
