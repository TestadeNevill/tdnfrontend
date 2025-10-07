import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Projects from './pages/Projects.jsx'
import Blog from './pages/Blog.jsx'
import Contact from './pages/Contact.jsx'
import Transshipment from './pages/blog/Transshipment.jsx'
import TransitHubs from './pages/blog/TransitHubs.jsx'
import EVTOL from './pages/blog/EVTOL.jsx'
import Thanks from './pages/Thanks.jsx'
import SolarStorage from './pages/blog/SolarStorage.jsx'
import IntelligentUrbanism from './pages/blog/IntelligentUrbanism.jsx'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
       <main className="flex-1 flex flex-col">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/transshipment" element={<Transshipment />} />
        <Route path="/blog/transit-hubs" element={<TransitHubs />} />
        <Route path="/blog/evtol-urban-air-mobility" element={<EVTOL />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/thanks" element={<Thanks />} />
        <Route path="/blog/solar-storage-at-scale" element={<SolarStorage />} />
        <Route path="/blog/intelligent-urbanism-10-principles" element={<IntelligentUrbanism />} />
      </Routes>
      </main>
      <Footer />
    </div>
  );
}
