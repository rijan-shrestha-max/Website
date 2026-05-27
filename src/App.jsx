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
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      {/* Navigation */}
      <nav className="fixed w-full z-50" style={{ backgroundColor: 'var(--bg)', borderBottomColor: 'var(--border)', borderBottomWidth: '1px' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>
              Rijan
            </div>
            
            <div className="hidden md:flex gap-8">
              <a href="#home" className="transition" style={{ color: 'var(--muted)' }} onMouseEnter={(e) => e.target.style.color = 'var(--text)'} onMouseLeave={(e) => e.target.style.color = 'var(--muted)'}>Home</a>
              <a href="#portfolio" className="transition" style={{ color: 'var(--muted)' }} onMouseEnter={(e) => e.target.style.color = 'var(--text)'} onMouseLeave={(e) => e.target.style.color = 'var(--muted)'}>Portfolio</a>
              <a href="#services" className="transition" style={{ color: 'var(--muted)' }} onMouseEnter={(e) => e.target.style.color = 'var(--text)'} onMouseLeave={(e) => e.target.style.color = 'var(--muted)'}>Services</a>
              <a href="#about" className="transition" style={{ color: 'var(--muted)' }} onMouseEnter={(e) => e.target.style.color = 'var(--text)'} onMouseLeave={(e) => e.target.style.color = 'var(--muted)'}>About</a>
              <a href="#contact" className="transition" style={{ color: 'var(--muted)' }} onMouseEnter={(e) => e.target.style.color = 'var(--text)'} onMouseLeave={(e) => e.target.style.color = 'var(--muted)'}>Contact</a>
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
              <a href="#home" className="block py-2 transition" style={{ color: 'var(--muted)' }} onMouseEnter={(e) => e.target.style.color = 'var(--text)'} onMouseLeave={(e) => e.target.style.color = 'var(--muted)'}>Home</a>
              <a href="#portfolio" className="block py-2 transition" style={{ color: 'var(--muted)' }} onMouseEnter={(e) => e.target.style.color = 'var(--text)'} onMouseLeave={(e) => e.target.style.color = 'var(--muted)'}>Portfolio</a>
              <a href="#services" className="block py-2 transition" style={{ color: 'var(--muted)' }} onMouseEnter={(e) => e.target.style.color = 'var(--text)'} onMouseLeave={(e) => e.target.style.color = 'var(--muted)'}>Services</a>
              <a href="#about" className="block py-2 transition" style={{ color: 'var(--muted)' }} onMouseEnter={(e) => e.target.style.color = 'var(--text)'} onMouseLeave={(e) => e.target.style.color = 'var(--muted)'}>About</a>
              <a href="#contact" className="block py-2 transition" style={{ color: 'var(--muted)' }} onMouseEnter={(e) => e.target.style.color = 'var(--text)'} onMouseLeave={(e) => e.target.style.color = 'var(--muted)'}>Contact</a>
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
              backgroundColor: 'var(--accent)',
              transform: mousePos.x !== 0 ? `translate(${(mousePos.x - (bubble.x / 100 * window.innerWidth)) * -0.1}px, ${(mousePos.y - (bubble.y / 100 * window.innerHeight)) * -0.1}px)` : 'translate(0, 0)',
            }}
          />
        ))}
        
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight" style={{ color: 'var(--text)' }}>
                Creative Designer & Brand Strategist
              </h1>
              <p className="text-xl mb-8 leading-relaxed" style={{ color: 'var(--muted)' }}>
                I create beautiful, functional designs that help brands stand out and connect with their audience. Let's bring your vision to life.
              </p>
              <div className="flex gap-4">
                <button className="px-8 py-3 rounded-lg transition flex items-center gap-2" style={{ backgroundColor: 'var(--accent)', color: 'var(--text)' }} onMouseEnter={(e) => e.target.style.opacity = '0.9'} onMouseLeave={(e) => e.target.style.opacity = '1'}>
                  View My Work <ArrowRight size={20} />
                </button>
                <button className="px-8 py-3 rounded-lg transition" style={{ borderColor: 'var(--accent)', borderWidth: '2px', color: 'var(--text)', backgroundColor: 'transparent' }} onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--surface)'} onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>
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
      <section id="portfolio" className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'var(--surface)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--text)' }}>Featured Work</h2>
            <p className="text-xl" style={{ color: 'var(--muted)' }}>Explore my recent projects and creative solutions</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolioItems.map((item) => (
              <div
                key={item.id}
                className="group cursor-pointer rounded-xl overflow-hidden shadow-lg transition duration-300 border" style={{ borderColor: 'var(--border)' }} onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 0 30px rgba(109, 0, 26, 0.5)'} onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}>
                <div className="relative overflow-hidden h-64">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition duration-300 flex items-center justify-center">
                    <div className="text-center opacity-0 group-hover:opacity-100 transition" style={{ color: 'var(--text)' }}>
                      <p className="text-sm font-semibold mb-2">{item.category}</p>
                      <h3 className="text-xl font-bold">{item.title}</h3>
                    </div>
                  </div>
                </div>
                <div className="p-4" style={{ backgroundColor: 'var(--bg)', borderTopColor: 'var(--border)', borderTopWidth: '1px' }}>
                  <h3 className="font-semibold" style={{ color: 'var(--text)' }}>{item.title}</h3>
                  <p className="text-sm" style={{ color: 'var(--muted)' }}>{item.category}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="inline-flex items-center gap-2 px-8 py-3 rounded-lg transition" style={{ backgroundColor: 'var(--accent)', color: 'var(--text)' }} onMouseEnter={(e) => e.target.style.opacity = '0.9'} onMouseLeave={(e) => e.target.style.opacity = '1'}>
              View All Projects <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--text)' }}>My Services</h2>
            <p className="text-xl" style={{ color: 'var(--muted)' }}>What I can help you with</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="p-8 rounded-xl transition" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', borderWidth: '1px' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent)'} onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}>
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text)' }}>{service.title}</h3>
                <p style={{ color: 'var(--muted)' }}>{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'var(--surface)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=600&fit=crop"
              alt="About Rijan"
              className="rounded-xl shadow-2xl"
            />
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: 'var(--text)' }}>About Rijan Shrestha</h2>
              <p className="text-lg mb-4 leading-relaxed" style={{ color: 'var(--muted)' }}>
                I'm a passionate designer with 5+ years of experience creating beautiful, functional designs that solve real problems. My approach combines strategic thinking with creative excellence.
              </p>
              <p className="text-lg mb-8 leading-relaxed" style={{ color: 'var(--muted)' }}>
                I specialize in brand identity, UI/UX design, and digital strategy. I love working with startups and established brands to create designs that make an impact.
              </p>
              <div className="flex gap-6">
                <span className="text-center">
                  <div className="text-3xl font-bold" style={{ color: 'var(--accent)' }}>50+</div>
                  <div style={{ color: 'var(--muted)' }}>Projects Completed</div>
                </span>
                <span className="text-center">
                  <div className="text-3xl font-bold" style={{ color: 'var(--accent)' }}>30+</div>
                  <div style={{ color: 'var(--muted)' }}>Happy Clients</div>
                </span>
                <span className="text-center">
                  <div className="text-3xl font-bold" style={{ color: 'var(--accent)' }}>5+</div>
                  <div style={{ color: 'var(--muted)' }}>Years Experience</div>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: 'var(--text)' }}>Let's Work Together</h2>
          <p className="text-xl mb-8" style={{ color: 'var(--muted)' }}>
            Have a project in mind? I'd love to hear about it. Let's create something amazing together.
          </p>
          <button className="px-10 py-4 rounded-lg text-lg font-semibold transition" style={{ backgroundColor: 'var(--accent)', color: 'var(--text)' }} onMouseEnter={(e) => e.target.style.opacity = '0.9'} onMouseLeave={(e) => e.target.style.opacity = '1'}>
            Start a Project
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'var(--surface)', borderTopColor: 'var(--border)', borderTopWidth: '1px' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            <div>
              <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--accent)' }}>Rijan Shrestha</h3>
              <p style={{ color: 'var(--muted)' }}>Creative Designer & Brand Strategist</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4" style={{ color: 'var(--text)' }}>Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#portfolio" className="transition" style={{ color: 'var(--muted)' }} onMouseEnter={(e) => e.target.style.color = 'var(--text)'} onMouseLeave={(e) => e.target.style.color = 'var(--muted)'}>Portfolio</a></li>
                <li><a href="#services" className="transition" style={{ color: 'var(--muted)' }} onMouseEnter={(e) => e.target.style.color = 'var(--text)'} onMouseLeave={(e) => e.target.style.color = 'var(--muted)'}>Services</a></li>
                <li><a href="#about" className="transition" style={{ color: 'var(--muted)' }} onMouseEnter={(e) => e.target.style.color = 'var(--text)'} onMouseLeave={(e) => e.target.style.color = 'var(--muted)'}>About</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4" style={{ color: 'var(--text)' }}>Follow</h4>
              <div className="flex gap-4">
                <a href="#" className="transition" style={{ color: 'var(--muted)' }} onMouseEnter={(e) => e.target.style.color = 'var(--accent)'} onMouseLeave={(e) => e.target.style.color = 'var(--muted)'}>
                  <Github size={20} />
                </a>
                <a href="#" className="transition" style={{ color: 'var(--muted)' }} onMouseEnter={(e) => e.target.style.color = 'var(--accent)'} onMouseLeave={(e) => e.target.style.color = 'var(--muted)'}>
                  <Linkedin size={20} />
                </a>
                <a href="#" className="transition" style={{ color: 'var(--muted)' }} onMouseEnter={(e) => e.target.style.color = 'var(--accent)'} onMouseLeave={(e) => e.target.style.color = 'var(--muted)'}>
                  <Twitter size={20} />
                </a>
                <a href="#" className="transition" style={{ color: 'var(--muted)' }} onMouseEnter={(e) => e.target.style.color = 'var(--accent)'} onMouseLeave={(e) => e.target.style.color = 'var(--muted)'}>
                  <Mail size={20} />
                </a>
              </div>
            </div>
          </div>
          <div className="text-center" style={{ color: 'var(--muted)', borderTopColor: 'var(--border)', borderTopWidth: '1px', paddingTop: '2rem' }}>
            <p>&copy; 2026 Rijan Shrestha. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showScrollToTop && (
        <button
          onClick={scrollToTop}
          className=\"fixed bottom-8 right-8 p-3 rounded-full transition shadow-lg z-40\"
          style={{ backgroundColor: 'var(--accent)', color: 'var(--text)' }}
          onMouseEnter={(e) => e.target.style.opacity = '0.9'}
          onMouseLeave={(e) => e.target.style.opacity = '1'}
          aria-label="Scroll to top"
        >
          <ArrowUp size={24} />
        </button>
      )}
    </div>
  )
}

export default App
