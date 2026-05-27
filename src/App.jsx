import { useState, useEffect } from 'react'
import { Menu, X, ArrowRight, Github, Linkedin, Twitter, Mail, ArrowUp } from 'lucide-react'

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showScrollToTop, setShowScrollToTop] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [bubbles] = useState([
    { id: 1, x: 10, y: 20, size: 60 },
    { id: 2, x: 80, y: 60, size: 40 },
    { id: 3, x: 15, y: 70, size: 50 },
    { id: 4, x: 85, y: 15, size: 35 },
    { id: 5, x: 70, y: 80, size: 45 },
  ])

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const portfolioItems = [
    {
      id: 1,
      title: 'Brand Identity Design',
      category: 'Branding',
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=500&fit=crop',
    },
    {
      id: 2,
      title: 'Web Design System',
      category: 'UI Design',
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=500&fit=crop',
    },
    {
      id: 3,
      title: 'Mobile App Interface',
      category: 'UX/UI',
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=500&fit=crop',
    },
    {
      id: 4,
      title: 'Marketing Campaign',
      category: 'Graphic Design',
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=500&fit=crop',
    },
    {
      id: 5,
      title: 'E-commerce Platform',
      category: 'Web Design',
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=500&fit=crop',
    },
    {
      id: 6,
      title: 'Product Photography',
      category: 'Photography',
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=500&fit=crop',
    },
  ]

  const services = [
    { icon: '🎨', title: 'Brand Strategy', description: 'Create compelling brand identities that resonate with your audience' },
    { icon: '✨', title: 'UI/UX Design', description: 'Design intuitive interfaces that users love' },
    { icon: '📱', title: 'Web Design', description: 'Modern, responsive websites built for conversion' },
    { icon: '🎯', title: 'Graphic Design', description: 'Eye-catching visuals for all your marketing needs' },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/95 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Rijan
            </div>
            
            <div className="hidden md:flex gap-8">
              <a href="#home" className="text-gray-600 hover:text-gray-900 transition">Home</a>
              <a href="#portfolio" className="text-gray-600 hover:text-gray-900 transition">Portfolio</a>
              <a href="#services" className="text-gray-600 hover:text-gray-900 transition">Services</a>
              <a href="#about" className="text-gray-600 hover:text-gray-900 transition">About</a>
              <a href="#contact" className="text-gray-600 hover:text-gray-900 transition">Contact</a>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 space-y-2">
              <a href="#home" className="block text-gray-600 hover:text-gray-900 py-2">Home</a>
              <a href="#portfolio" className="block text-gray-600 hover:text-gray-900 py-2">Portfolio</a>
              <a href="#services" className="block text-gray-600 hover:text-gray-900 py-2">Services</a>
              <a href="#about" className="block text-gray-600 hover:text-gray-900 py-2">About</a>
              <a href="#contact" className="block text-gray-600 hover:text-gray-900 py-2">Contact</a>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Animated Bubbles */}
        {bubbles.map(bubble => (
          <div
            key={bubble.id}
            className={`absolute rounded-full opacity-20 pointer-events-none bubble-${bubble.id} transition-all duration-300`}
            style={{
              left: `${bubble.x}%`,
              top: `${bubble.y}%`,
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              backgroundColor: '#d97706',
              transform: mousePos.x !== 0 ? `translate(${(mousePos.x - (bubble.x / 100 * window.innerWidth)) * -0.1}px, ${(mousePos.y - (bubble.y / 100 * window.innerHeight)) * -0.1}px)` : 'translate(0, 0)',
            }}
          />
        ))}
        
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Creative Designer & Brand Strategist
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                I create beautiful, functional designs that help brands stand out and connect with their audience. Let's bring your vision to life.
              </p>
              <div className="flex gap-4">
                <button className="bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition flex items-center gap-2">
                  View My Work <ArrowRight size={20} />
                </button>
                <button className="border-2 border-gray-900 text-gray-900 px-8 py-3 rounded-lg hover:bg-gray-50 transition">
                  Get in Touch
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl opacity-20 blur-3xl"></div>
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop"
                alt="Designer"
                className="relative w-full rounded-2xl object-cover shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Featured Work</h2>
            <p className="text-xl text-gray-600">Explore my recent projects and creative solutions</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolioItems.map((item) => (
              <div
                key={item.id}
                className="group cursor-pointer rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300"
              >
                <div className="relative overflow-hidden h-64">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition duration-300 flex items-center justify-center">
                    <div className="text-center text-white opacity-0 group-hover:opacity-100 transition">
                      <p className="text-sm font-semibold mb-2">{item.category}</p>
                      <h3 className="text-xl font-bold">{item.title}</h3>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-4">
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.category}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition">
              View All Projects <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">My Services</h2>
            <p className="text-xl text-gray-600">What I can help you with</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="p-8 rounded-xl border border-gray-200 hover:border-gray-900 hover:shadow-lg transition"
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=600&fit=crop"
              alt="About Rijan"
              className="rounded-xl shadow-2xl"
            />
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">About Rijan Shrestha</h2>
              <p className="text-lg text-gray-300 mb-4 leading-relaxed">
                I'm a passionate designer with 5+ years of experience creating beautiful, functional designs that solve real problems. My approach combines strategic thinking with creative excellence.
              </p>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                I specialize in brand identity, UI/UX design, and digital strategy. I love working with startups and established brands to create designs that make an impact.
              </p>
              <div className="flex gap-6">
                <span className="text-center">
                  <div className="text-3xl font-bold">50+</div>
                  <div className="text-gray-400">Projects Completed</div>
                </span>
                <span className="text-center">
                  <div className="text-3xl font-bold">30+</div>
                  <div className="text-gray-400">Happy Clients</div>
                </span>
                <span className="text-center">
                  <div className="text-3xl font-bold">5+</div>
                  <div className="text-gray-400">Years Experience</div>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Let's Work Together</h2>
          <p className="text-xl text-gray-600 mb-8">
            Have a project in mind? I'd love to hear about it. Let's create something amazing together.
          </p>
          <button className="bg-gray-900 text-white px-10 py-4 rounded-lg text-lg font-semibold hover:bg-gray-800 transition">
            Start a Project
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            <div>
              <h3 className="text-2xl font-bold mb-4">Rijan Shrestha</h3>
              <p className="text-gray-400">Creative Designer & Brand Strategist</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#portfolio" className="hover:text-white transition">Portfolio</a></li>
                <li><a href="#services" className="hover:text-white transition">Services</a></li>
                <li><a href="#about" className="hover:text-white transition">About</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Follow</h4>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <Github size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <Linkedin size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <Twitter size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <Mail size={20} />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2026 Rijan Shrestha. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showScrollToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-gray-900 text-white p-3 rounded-full hover:bg-gray-800 transition shadow-lg z-40"
          aria-label="Scroll to top"
        >
          <ArrowUp size={24} />
        </button>
      )}
    </div>
  )
}

export default App
