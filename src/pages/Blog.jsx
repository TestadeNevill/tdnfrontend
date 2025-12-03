import { Link } from 'react-router-dom'
import { blogPosts } from '../data/blogPosts.js'
import Donations from '../components/Donations.jsx'
// import {Donations} from '../components/Donations.jsx'

export default function Blog() {
  return (

    <section className="container-page space-y-8">
      <h2 className="text-3xl font-bold text-gray-900">Blog</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {blogPosts.map(post => (
          <article key={post.slug} className="card overflow-hidden">
            <Link to={post.link}>
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover"
                onError={(e) => { e.currentTarget.src = `https://via.placeholder.com/1200x630?text=${encodeURIComponent(post.title)}` }}
              />
            </Link>
            <div className="p-5">
              <p className="text-xs text-gray-500">{post.date}</p>
              <h3 className="text-lg font-semibold text-gray-900 mt-1">{post.title}</h3>
              <p className="text-sm text-gray-700 mt-2">{post.excerpt}</p>
              <Link to={post.link} className="link text-sm mt-3 inline-block">Read →</Link>
            </div>
              
          </article>
        
        ))}
      </div>
  
          <Donations></Donations>
    </section>


    
  )
}
