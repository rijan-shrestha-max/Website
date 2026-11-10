import { Github, Linkedin, Twitter, Mail } from 'lucide-react'

const currentYear = new Date().getFullYear()

const footerLinks = {
  'Quick Links': [
    { label: 'Work', href: '#work' },
    { label: 'Philosophy', href: '#philosophy' },
    { label: 'Process', href: '#process' },
  ],
  'Resources': [
    { label: 'Case Studies', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Design System', href: '#' },
  ]
}

const socialLinks = [
  { icon: Mail, href: 'mailto:rijan@example.com', label: 'Email' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Github, href: '#', label: 'GitHub' }
]

export function Footer() {
  return (
    <footer className="bg-bg-primary border-t border-bg-elevated/30 py-12 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-xl font-display font-bold text-text-primary">Rijan Shrestha</h3>
            <p className="text-text-muted text-sm leading-relaxed">
              Motion Designer & Visual Storyteller crafting award-worthy digital experiences.
            </p>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="space-y-4">
              <h4 className="text-sm font-semibold text-text-primary uppercase tracking-widest">{title}</h4>
              <ul className="space-y-2">
                {links.map((link, i) => (
                  <li key={i}>
                    <a href={link.href} className="text-text-muted text-sm hover:text-accent transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Social Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-text-primary uppercase tracking-widest">Connect</h4>
            <div className="flex gap-4">
              {socialLinks.map((social, i) => {
                const Icon = social.icon
                return (
                  <a
                    key={i}
                    href={social.href}
                    className="w-10 h-10 rounded-full bg-bg-elevated hover:bg-accent/20 flex items-center justify-center transition-colors duration-200"
                    title={social.label}
                  >
                    <Icon className="w-4 h-4 text-text-secondary hover:text-accent" />
                  </a>
                )
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-bg-elevated/30 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-text-muted">
          <p>&copy; {currentYear} Rijan Shrestha. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-accent transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-accent transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
