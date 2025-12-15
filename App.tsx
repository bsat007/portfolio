import React, { useState, useEffect } from 'react';
import { ShaderBackground } from './components/ShaderBackground';
import { RESUME_DATA } from './constants';
import { Section } from './components/ui/Section';
import { Card } from './components/ui/Card';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { 
  Github, 
  Linkedin, 
  Mail, 
  MapPin, 
  ExternalLink, 
  Terminal, 
  Cpu, 
  Database, 
  Network,
  Menu,
  X
} from 'lucide-react';

const navItems = [
  { label: 'Overview', href: '#overview' },
  { label: 'Experience', href: '#experience' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Education', href: '#education' },
];

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // Detect active section
      const sections = navItems.map(item => item.href.replace('#', ''));
      for (const section of sections.reverse()) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.getElementById(href.replace('#', ''));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled 
            ? 'bg-black/80 backdrop-blur-md border-b border-neutral-800/50' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-5xl mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="font-mono text-sm text-neutral-400 hover:text-white transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-green-500">●</span> BS
            </motion.a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="relative px-4 py-2 text-sm font-mono text-neutral-500 hover:text-white transition-colors"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {activeSection === item.href.replace('#', '') && (
                    <motion.span
                      layoutId="activeNav"
                      className="absolute inset-0 bg-neutral-800/50 rounded-full border border-neutral-700/50"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </motion.a>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className="md:hidden p-2 text-neutral-400 hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileTap={{ scale: 0.9 }}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-30 md:hidden bg-black/95 backdrop-blur-lg border-b border-neutral-800"
          >
            <div className="px-6 py-4 space-y-1">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`block px-4 py-3 rounded-lg font-mono text-sm transition-colors ${
                    activeSection === item.href.replace('#', '')
                      ? 'bg-neutral-800 text-white'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {item.label}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const App: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="min-h-screen bg-[#050505] text-neutral-300 selection:bg-white selection:text-black">
      {/* Background Shader */}
      <ShaderBackground />
      
      {/* Navbar */}
      <Navbar />
      
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-white origin-left z-50 mix-blend-difference"
        style={{ scaleX }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12">
        
        {/* Header / Hero */}
        <header className="min-h-screen flex flex-col justify-center relative">
          <motion.div 
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 1 }}
          >
            <div className="flex items-center gap-2 mb-6 text-neutral-500 font-mono text-xs md:text-sm tracking-[0.2em] uppercase">
               <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
               System Online
            </div>

            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white mb-6 leading-none mix-blend-difference">
              {RESUME_DATA.name.split(' ')[0]}<br />
              <span className="text-neutral-600">{RESUME_DATA.name.split(' ')[1]}</span>
            </h1>

            <p className="text-xl md:text-2xl max-w-2xl text-neutral-400 font-light leading-relaxed mb-12">
              {RESUME_DATA.title.replace(/ · /g, " / ")}
            </p>

            <div className="flex flex-wrap gap-4 font-mono text-sm text-neutral-500">
               <div className="flex items-center gap-2 border border-neutral-900 px-4 py-2 rounded-full">
                  <MapPin size={14} /> {RESUME_DATA.contact.location}
               </div>
               <a href={`mailto:${RESUME_DATA.contact.email}`} className="flex items-center gap-2 border border-neutral-900 px-4 py-2 rounded-full hover:bg-white hover:text-black transition-colors cursor-pointer">
                  <Mail size={14} /> Contact
               </a>
               {RESUME_DATA.socials.map((social) => (
                 <a 
                   key={social.platform} 
                   href={social.url} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="flex items-center gap-2 border border-neutral-900 px-4 py-2 rounded-full hover:bg-white hover:text-black transition-colors"
                 >
                   <ExternalLink size={14} /> {social.platform}
                 </a>
               ))}
            </div>
          </motion.div>

          <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 1.5, duration: 1 }}
             className="absolute bottom-12 left-0 font-mono text-xs text-neutral-700 animate-bounce"
          >
            SCROLL_TO_INIT_DATA_STREAM ↓
          </motion.div>
        </header>

        {/* Summary */}
        <Section title="Overview" id="overview" className="max-w-3xl">
          <div className="space-y-6 text-lg md:text-xl font-light text-neutral-300 leading-relaxed">
            {RESUME_DATA.summary.map((paragraph, idx) => (
              <p key={idx} className={idx === 0 ? "text-white" : "text-neutral-500"}>{paragraph}</p>
            ))}
          </div>
        </Section>

        {/* Experience */}
        <Section title="Experience Log" id="experience">
          <div className="space-y-12 border-l border-neutral-900 pl-8 md:pl-12 relative">
            {RESUME_DATA.experience.map((job, idx) => (
              <div key={idx} className="relative group">
                <span className="absolute -left-[41px] md:-left-[57px] top-2 w-4 h-4 bg-black border border-neutral-700 rounded-full group-hover:bg-white group-hover:border-white transition-colors duration-300"></span>
                <div className="mb-2 flex flex-col md:flex-row md:items-baseline md:justify-between gap-2">
                  <h3 className="text-2xl font-semibold text-white group-hover:text-neutral-400 transition-colors">{job.role}</h3>
                  <span className="font-mono text-xs text-neutral-600">{job.period}</span>
                </div>
                <div className="mb-4 text-neutral-400 font-mono text-sm">{job.company} — {job.location}</div>
                <p className="text-neutral-500 mb-6 italic">{job.description}</p>
                <ul className="space-y-3 mb-6">
                  {job.achievements.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm md:text-base text-neutral-300">
                      <span className="mt-1.5 w-1 h-1 bg-neutral-600 flex-shrink-0"></span>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map(skill => (
                    <span key={skill} className="text-[10px] font-mono border border-neutral-800 px-2 py-1 text-neutral-500 uppercase tracking-wider hover:border-neutral-600 transition-colors">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Stack / Skills */}
        <Section title="Tech Matrix" id="skills">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {RESUME_DATA.skills.map((category, idx) => (
              <Card key={idx} className="h-full flex flex-col">
                <div className="flex items-center gap-3 mb-6 text-neutral-100">
                   {idx === 0 && <Cpu size={20} />}
                   {idx === 1 && <Terminal size={20} />}
                   {idx === 2 && <Database size={20} />}
                   <h3 className="font-bold text-lg">{category.category}</h3>
                </div>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {category.items.map((skill, i) => (
                    <span 
                      key={i} 
                      className="px-2 py-1 bg-neutral-900/50 text-neutral-400 text-xs font-mono rounded-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </Section>

        {/* Projects */}
        <Section title="Project Modules" id="projects">
          <div className="grid grid-cols-1 gap-8">
            {RESUME_DATA.projects.map((project, idx) => (
              <Card key={idx} className="group hover:border-neutral-700 transition-colors">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="md:w-1/3">
                     <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors duration-300">
                       {project.title}
                     </h3>
                     <p className="text-xs font-mono text-neutral-500 mb-4">{project.client}</p>
                     <div className="flex flex-wrap gap-2">
                        {project.tech.map(t => (
                          <span key={t} className="text-[10px] font-mono border border-neutral-800 px-2 py-1 text-neutral-600 uppercase">
                            {t}
                          </span>
                        ))}
                     </div>
                  </div>
                  <div className="md:w-2/3 border-l border-neutral-900 md:pl-8 pt-4 md:pt-0">
                    <p className="text-neutral-300 leading-relaxed text-sm md:text-base">
                      {project.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Section>

        {/* Education */}
        <Section title="Education" id="education">
          <div className="border-t border-neutral-900 pt-8">
             {RESUME_DATA.education.map((edu, idx) => (
               <div key={idx} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">{edu.institution}</h3>
                    <p className="text-neutral-500">{edu.degree}</p>
                  </div>
                  <div className="text-right text-sm font-mono text-neutral-600">
                    <div>{edu.location}</div>
                    <div>{edu.period}</div>
                  </div>
               </div>
             ))}
          </div>
        </Section>

        <footer className="py-20 text-center text-xs font-mono text-neutral-800 uppercase tracking-widest">
           <p>End of Transmission</p>
           <p className="mt-2">Badal Satyarthi © {new Date().getFullYear()}</p>
        </footer>

      </div>
    </div>
  );
};

export default App;