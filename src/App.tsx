import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowRight,
  ArrowUpRight,
  EnvelopeSimple,
} from '@phosphor-icons/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import './App.css'

gsap.registerPlugin(ScrollTrigger)

const CDN = 'https://lukebaffait.fr/assets/images'

type Project = {
  title: string
  meta: string
  image: string
  label: string
}

type SkillGroup = {
  title: string
  items: string[]
}

const projects: Project[] = [
  {
    title: 'Intellivo',
    meta: 'Company Project',
    label: 'Local AI OCR and Document Intelligence',
    image: `${CDN}/projects/Covers/cyberDiag_web.avif`,
  },
  {
    title: 'SDLC Reverse Engineering',
    meta: 'Enterprise AI',
    label: 'Legacy Codebase Modernization',
    image: `${CDN}/projects/Covers/Anima.avif`,
  },
  {
    title: '8-K Filing RAG',
    meta: 'Internal AI',
    label: 'SEC EDGAR and GraphRAG Platform',
    image: `${CDN}/projects/Covers/CyberDiag.avif`,
  },
  {
    title: 'Clarium Edge',
    meta: 'Product',
    label: 'Angular and React Component Platform',
    image: `${CDN}/projects/Covers/Zenith.avif`,
  },
  {
    title: 'Benefitmall',
    meta: 'Company Project',
    label: 'Insurance Platform Modernization',
    image: `${CDN}/projects/Covers/SkymcDB.avif`,
  },
  {
    title: 'SOW Tracker',
    meta: 'Internal Product',
    label: 'Business Operations Analytics',
    image: `${CDN}/projects/Covers/ChromaBlock.avif`,
  },
]

const skillGroups: SkillGroup[] = [
  {
    title: 'Backend',
    items: [
      'Python',
      'FastAPI',
      'REST APIs',
      'PostgreSQL',
      'SQLAlchemy',
      'Pydantic',
      'JWT/Auth',
      'Microservices',
      'Redis',
      'MongoDB',
    ],
  },
  {
    title: 'Frontend',
    items: [
      'React.js',
      'TypeScript',
      'JavaScript',
      'Angular',
      'HTML',
      'CSS/SCSS',
      'Tailwind CSS',
      'Material UI',
      'Storybook',
    ],
  },
  {
    title: 'AI / LLM',
    items: [
      'LangChain',
      'LangGraph',
      'RAG',
      'GraphRAG',
      'vLLM',
      'Qwen',
      'Pixtral',
      'Gemini API',
      'Document AI',
      'OCR',
    ],
  },
  {
    title: 'Data / Processing',
    items: [
      'Pandas',
      'NumPy',
      'PySpark',
      'CSV Processing',
      'Data Pipelines',
      'Parallel Processing',
      'Structured JSON Extraction',
    ],
  },
  {
    title: 'DevOps & Tools',
    items: [
      'Docker',
      'Docker Compose',
      'Kubernetes',
      'Kafka',
      'Git',
      'GitHub',
      'GitLab',
      'Linux',
      'Nginx',
      'Postman',
    ],
  },
  {
    title: 'Engineering Workflow',
    items: [
      'Swagger/OpenAPI',
      'Jira',
      'Confluence',
      'Azure DevOps',
      'Bitbucket',
      'npm',
      'Prometheus',
      'Grafana',
    ],
  },
]

const timelineSections = [
  'Hero',
  'About',
  'Projects',
  'Gallery',
  'Skills',
  'Awards',
  'Contact',
]

function MaskedText({
  text,
  className,
}: {
  text: string
  className: string
}) {
  return (
    <span className={className}>
      {Array.from(text).map((char, index) => {
        if (char === ' ') {
          return (
            <span className="char-mask space" aria-hidden="true" key={index}>
              <span className="char-reveal" />
            </span>
          )
        }

        return (
          <span className="char-mask" key={index}>
            <span className="char-reveal">{char}</span>
          </span>
        )
      })}
    </span>
  )
}

function App() {
  const rootRef = useRef<HTMLDivElement>(null)
  const percentRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const [activeProject, setActiveProject] = useState(0)
  const [openSkill, setOpenSkill] = useState(0)

  const galleryImages = useMemo(() => projects.slice(0, 7), [])
  const currentProject = projects[activeProject]

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    let lenis: Lenis | undefined
    let raf: ((time: number) => void) | undefined

    if (!reduceMotion) {
      lenis = new Lenis({
        lerp: 0.075,
        wheelMultiplier: 0.82,
        touchMultiplier: 1.4,
        smoothWheel: true,
      })
      raf = (time: number) => {
        lenis?.raf(time * 1000)
      }
      gsap.ticker.add(raf)
      gsap.ticker.lagSmoothing(0)
      lenis.on('scroll', ScrollTrigger.update)
    }

    const context = gsap.context(() => {
      const setTimeline = (label: string) => {
        if (labelRef.current) {
          labelRef.current.textContent = label
        }
      }

      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => {
          if (percentRef.current) {
            percentRef.current.textContent = `(${Math.round(
              self.progress * 100,
            )})`
          }
          if (barRef.current) {
            barRef.current.style.transform = `scaleY(${Math.max(
              0.04,
              self.progress,
            )})`
          }
        },
      })

      document.querySelectorAll<HTMLElement>('[data-timeline]').forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 55%',
          end: 'bottom 55%',
          onToggle: (self) => {
            if (self.isActive) {
              setTimeline(el.dataset.timeline ?? '')
            }
          },
        })
      })

      if (reduceMotion) {
        gsap.set(
          ['.intro-bg', '.transition-panel', '.name-layer'],
          { display: 'none' },
        )
        gsap.set(['.hero-tagline', '.hero-nav', '.hero-line', '.hero-word'], {
          autoAlpha: 1,
          clearProps: 'clipPath,filter,scaleX,transform',
        })
        gsap.set(
          [
            '.hero-word',
            '.reveal-card',
            '.about-copy',
            '.about-photo-card',
            '.project-item',
            '.gallery-card',
            '.skills-panel',
            '.award-row',
            '.contact-card',
          ],
          { clearProps: 'all' },
        )
        return
      }

      window.scrollTo(0, 0)

      const preloaderContent =
        document.querySelector<HTMLElement>('.preloader-content')
      const heroWords = document.querySelector<HTMLElement>('.hero-words')
      const nameLayer = document.querySelector<HTMLElement>('.name-layer')
      const introBg = document.querySelector<HTMLElement>('.intro-bg')
      const transitionPanel =
        document.querySelector<HTMLElement>('.transition-panel')
      const tPanelRed = document.querySelector<HTMLElement>('.t-panel-red')
      const tPanelDark = document.querySelector<HTMLElement>('.t-panel-dark')
      const chars = gsap.utils.toArray<HTMLElement>('.char-reveal')

      const getNameSettle = () => {
        if (!preloaderContent || !heroWords) {
          return { x: 0, y: 0, scale: 1 }
        }

        gsap.set(preloaderContent, { clearProps: 'transform' })
        const source = preloaderContent.getBoundingClientRect()
        const target = heroWords.getBoundingClientRect()
        const targetWidth = Math.min(target.width * 0.985, window.innerWidth - 48)
        const scale = Math.min(targetWidth / source.width, 2.65)
        const sourceCenterX = source.left + source.width / 2
        const sourceCenterY = source.top + source.height / 2
        const targetCenterX = target.left + target.width / 2
        const targetCenterY = target.top + target.height / 2

        return {
          x: targetCenterX - sourceCenterX,
          y: targetCenterY - sourceCenterY,
          scale,
        }
      }

      const nameSettle = getNameSettle()
      gsap.set(preloaderContent, {
        scale: window.innerWidth <= 600 ? 0.72 : 0.44,
        transformOrigin: '50% 50%',
      })
      gsap.set(chars, { yPercent: 118 })
      gsap.set('.preloader-dot .char-reveal', { autoAlpha: 0 })
      gsap.set([tPanelDark, tPanelRed], { yPercent: 100 })
      gsap.set('.hero-tagline, .hero-nav', {
        autoAlpha: 0,
        clipPath: 'inset(0 0 100% 0)',
      })
      gsap.set('.hero-line', { autoAlpha: 0, scaleX: 0 })
      gsap.set('.hero-word', {
        autoAlpha: 0,
        yPercent: 18,
        filter: 'blur(10px)',
      })

      const intro = gsap.timeline({
        defaults: { ease: 'power3.out' },
      })
      intro
        .to(chars, {
          yPercent: 0,
          duration: 0.44,
          ease: 'power3.out',
          stagger: { each: 0.025, from: 'center' },
        })
        .to(
          '.preloader-dot .char-reveal',
          { autoAlpha: 1, duration: 0.22, ease: 'power2.out' },
          '-=0.1',
        )
        .to({}, { duration: 0.22 })
        .to(preloaderContent, {
          ...nameSettle,
          duration: 0.78,
          ease: 'power3.inOut',
        })
        .to(
          tPanelDark,
          {
            yPercent: 0,
            duration: 0.45,
            ease: 'power3.inOut',
          },
          '<+=0.05',
        )
        .to(
          tPanelRed,
          {
            yPercent: 0,
            duration: 0.45,
            ease: 'power3.inOut',
          },
          '-=0.3',
        )
        .set(introBg, { display: 'none' })
        .to(tPanelRed, {
          yPercent: -100,
          duration: 0.56,
          ease: 'power3.inOut',
        })
        .to(
          tPanelDark,
          {
            yPercent: -100,
            duration: 0.56,
            ease: 'power3.inOut',
          },
          '-=0.42',
        )
        .to(
          '.hero-word',
          {
            autoAlpha: 1,
            yPercent: 0,
            filter: 'blur(0px)',
            duration: 0.9,
            ease: 'power3.out',
            stagger: 0.07,
          },
          '-=0.36',
        )
        .to(
          '.hero-tagline',
          {
            autoAlpha: 1,
            clipPath: 'inset(0 0 0% 0)',
            duration: 1.08,
            ease: 'power3.inOut',
          },
          '-=0.72',
        )
        .to(
          '.hero-nav',
          {
            autoAlpha: 1,
            clipPath: 'inset(0 0 0% 0)',
            duration: 1,
            ease: 'power3.inOut',
          },
          '-=0.86',
        )
        .fromTo(
          '.hero-line',
          { autoAlpha: 1, scaleX: 0 },
          { scaleX: 1, duration: 1, ease: 'power3.inOut' },
          '<',
        )
        .to(
          nameLayer,
          { autoAlpha: 0, duration: 0.24, ease: 'power2.out' },
          '-=0.72',
        )
        .set([nameLayer, transitionPanel], { display: 'none' })

      gsap.to('.hero-bg', {
        scale: 1.18,
        yPercent: 16,
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })

      gsap.to('.word-luke', {
        xPercent: -32,
        autoAlpha: 0.54,
        scrollTrigger: {
          trigger: '.hero',
          start: '20% top',
          end: 'bottom top',
          scrub: true,
        },
      })

      gsap.to('.word-last', {
        xPercent: 28,
        autoAlpha: 0.54,
        scrollTrigger: {
          trigger: '.hero',
          start: '20% top',
          end: 'bottom top',
          scrub: true,
        },
      })

      gsap.fromTo(
        '.reveal-card',
        {
          clipPath: 'inset(42% 32% 42% 32%)',
          scale: 0.82,
          filter: 'grayscale(1) contrast(1.3) brightness(0.6)',
        },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          scale: 1,
          filter: 'grayscale(1) contrast(1.06) brightness(1)',
          ease: 'none',
          scrollTrigger: {
            trigger: '.reveal-section',
            start: 'top 78%',
            end: 'center center',
            scrub: true,
          },
        },
      )

      gsap.from('.about-copy .split-line', {
        yPercent: 110,
        rotate: 2,
        autoAlpha: 0,
        duration: 0.9,
        stagger: 0.08,
        scrollTrigger: {
          trigger: '.about',
          start: 'top 55%',
        },
      })

      gsap.fromTo(
        '.about-photo-card',
        { yPercent: 18, filter: 'blur(22px) brightness(0.6)' },
        {
          yPercent: -8,
          filter: 'blur(7px) brightness(0.74)',
          ease: 'none',
          scrollTrigger: {
            trigger: '.about',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      )

      const fluidLine = document.querySelector<SVGPathElement>('.fluid-line')
      if (fluidLine) {
        const length = fluidLine.getTotalLength()
        gsap.set(fluidLine, {
          strokeDasharray: length,
          strokeDashoffset: length,
        })
        gsap.to(fluidLine, {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: '.projects',
            start: 'top 72%',
            end: 'bottom top',
            scrub: true,
          },
        })
      }

      const gallery = gsap.timeline({
        scrollTrigger: {
          trigger: '.gallery',
          start: 'top top',
          end: '+=1400',
          scrub: true,
          pin: '.gallery-pin',
        },
      })
      gallery
        .fromTo(
          '.gallery-card',
          {
            autoAlpha: 0.38,
            yPercent: 60,
            rotateY: -34,
            rotateZ: -4,
          },
          {
            autoAlpha: 1,
            yPercent: 0,
            rotateY: 0,
            rotateZ: 0,
            stagger: 0.08,
          },
        )
        .to(
          '.gallery-card:nth-child(odd)',
          { xPercent: -78, yPercent: -18, rotateZ: -8 },
          0.36,
        )
        .to(
          '.gallery-card:nth-child(even)',
          { xPercent: 92, yPercent: 22, rotateZ: 9 },
          0.36,
        )
        .fromTo(
          '.gallery-phrase',
          { autoAlpha: 0, scale: 0.96, filter: 'blur(8px)' },
          { autoAlpha: 1, scale: 1, filter: 'blur(0px)' },
          0.5,
        )

      gsap.from('.skills-panel', {
        y: 72,
        autoAlpha: 0,
        duration: 0.86,
        stagger: 0.08,
        scrollTrigger: {
          trigger: '.skills',
          start: 'top 65%',
        },
      })

      gsap.to('.skills-arrow', {
        x: 46,
        scrollTrigger: {
          trigger: '.skills',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })

      gsap.from('.award-row', {
        yPercent: 80,
        autoAlpha: 0,
        duration: 0.72,
        stagger: 0.1,
        scrollTrigger: {
          trigger: '.awards',
          start: 'top 70%',
        },
      })

      gsap.fromTo(
        '.contact-sheet',
        { yPercent: 18, borderTopLeftRadius: 44, borderTopRightRadius: 44 },
        {
          yPercent: 0,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: '.contact',
            start: 'top bottom',
            end: 'top top',
            scrub: true,
          },
        },
      )

      gsap.from('.contact-card', {
        y: 42,
        autoAlpha: 0,
        duration: 0.72,
        stagger: 0.1,
        scrollTrigger: {
          trigger: '.contact',
          start: 'top 78%',
        },
      })

      gsap.fromTo(
        '.footer-name span',
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 0.9,
          stagger: 0.08,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: '.site-footer',
            start: 'top 72%',
          },
        },
      )
    }, rootRef)

    return () => {
      context.revert()
      if (raf) {
        gsap.ticker.remove(raf)
      }
      lenis?.destroy()
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  return (
    <div className="site" ref={rootRef}>
      <div className="intro-bg" aria-hidden="true" />
      <div className="transition-panel" aria-hidden="true">
        <div className="t-panel-dark" />
        <div className="t-panel-red" />
      </div>
      <div className="name-layer" aria-hidden="true">
        <div className="preloader-content">
          <MaskedText
            text="Benedict"
            className="preloader-segment preloader-first"
          />
          <MaskedText
            text="Thomas M"
            className="preloader-segment preloader-last"
          />
          <MaskedText text="." className="preloader-segment preloader-dot" />
        </div>
      </div>

      <div className="scroll-pct" ref={percentRef}>
        (0)
      </div>
      <div className="scroll-timeline" aria-hidden="true">
        <span ref={labelRef}>Hero</span>
        <div className="scroll-track">
          <div className="scroll-bar" ref={barRef} />
        </div>
      </div>

      <main>
        <section className="hero" data-timeline="Hero">
          <div className="hero-bg" aria-hidden="true" />
          <p className="hero-tagline">
            Full Stack Python Developer with AI/LLM experience,
            <br />
            building scalable platforms from Chennai, India.
          </p>
          <div className="hero-words" aria-label="Benedict Thomas M">
            <span className="hero-word word-luke">Benedict</span>
            <span className="hero-word word-last">Thomas M.</span>
          </div>
          <div className="hero-line" aria-hidden="true" />
          <div className="hero-nav">
            <span className="version">
              <ArrowRight weight="fill" />
              3 Years
            </span>
            <nav aria-label="Social links">
              <a href="https://github.com/Benny1704">GitHub</a>
              <a href="https://www.linkedin.com/in/benedict-thomas-m-20395b224/">
                LinkedIn
              </a>
              <a href="mailto:benedictt06@gmail.com">Email</a>
            </nav>
            <nav aria-label="Page sections">
              {timelineSections.slice(2, 7).map((section) => (
                <a key={section} href={`#${section.toLowerCase()}`}>
                  {section}
                </a>
              ))}
            </nav>
          </div>
        </section>

        <section className="reveal-section" aria-label="Showreel image">
          <div className="reveal-card">
            <img
              src={`${CDN}/art/Untitled2.png`}
              alt="Blue marble form against red light"
            />
            <span className="corner top-left" />
            <span className="corner top-right" />
            <span className="corner bottom-left" />
            <span className="corner bottom-right" />
          </div>
          <p>Full-stack platforms, RAG systems and document AI workflows.</p>
        </section>

        <section className="about" id="about" data-timeline="About">
          <div className="about-copy">
            <p className="split-line">
              As a <em>Full Stack Python Developer</em>, I build scalable
            </p>
            <p className="split-line">
              web platforms, local AI systems,
            </p>
            <p className="split-line">
              <em>RAG pipelines.</em>
            </p>
          </div>
          <div className="about-body">
            <p>
              I work across backend, frontend, databases, event-driven systems,
              local LLM inference, OCR pipelines and production UI workflows.
              My core stack includes Python, FastAPI, React, TypeScript,
              PostgreSQL, Docker, Kafka, LangChain, LangGraph and vLLM.
            </p>
            <a className="text-link" href="#skills">
              Info
              <ArrowUpRight weight="bold" />
            </a>
          </div>
          <figure className="about-photo-card">
            <img
              src={`${CDN}/art/Untitled2.png`}
              alt="Abstract red and blue AI systems visual"
            />
          </figure>
        </section>

        <section className="projects" id="projects" data-timeline="Projects">
          <svg
            className="fluid-line-svg"
            viewBox="0 0 1400 1400"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              className="fluid-line"
              d="M -90 10 C 320 -20 605 148 546 408 C 492 648 8 660 306 1054 C 605 1388 662 1242 862 1196 C 1055 1152 1360 1248 1544 1304"
            />
          </svg>
          <div className="section-kicker">(31)</div>
          <div className="projects-layout">
            <div className="project-list">
              {projects.map((project, index) => (
                <button
                  className={`project-item ${
                    activeProject === index ? 'active' : ''
                  }`}
                  key={project.title}
                  onFocus={() => setActiveProject(index)}
                  onMouseEnter={() => setActiveProject(index)}
                  type="button"
                >
                  <span>{project.title}</span>
                  <small>{project.meta}</small>
                </button>
              ))}
            </div>
            <aside className="project-preview" aria-live="polite">
              <div className="preview-meta">
                <span>{currentProject.meta}</span>
                <span>{currentProject.label}</span>
              </div>
              <img src={currentProject.image} alt="" />
              <a href="#contact">
                See project
                <ArrowUpRight weight="bold" />
              </a>
            </aside>
          </div>
        </section>

        <section className="gallery" id="gallery" data-timeline="Gallery">
          <div className="gallery-pin">
            {galleryImages.map((project, index) => (
              <figure
                className={`gallery-card gallery-card-${index + 1}`}
                key={project.title}
              >
                <img src={project.image} alt={project.label} />
              </figure>
            ))}
            <p className="gallery-phrase">
              Built across AI document intelligence, RAG, modernization,
              analytics and reusable UI systems.
            </p>
          </div>
        </section>

        <section className="skills" id="skills" data-timeline="Skills">
          <div className="skills-panel skills-left">
            <span className="skills-subtitle">Skills</span>
            <h2>
              Full Stack Python Developer building AI-powered platforms,
              document intelligence systems and enterprise modernization tools.
            </h2>
            <a className="text-link skills-contact" href="#contact">
              Contact me
              <ArrowUpRight weight="bold" />
            </a>
            <div className="skills-arrow" aria-hidden="true">
              <ArrowRight weight="fill" />
            </div>
          </div>

          <div className="skills-panel skills-list">
            {skillGroups.map((group, index) => {
              const isOpen = openSkill === index
              return (
                <div className={`skill-group ${isOpen ? 'open' : ''}`} key={group.title}>
                  <button type="button" onClick={() => setOpenSkill(index)}>
                    <span>{group.title}</span>
                    <span className="skill-toggle">{isOpen ? '-' : '+'}</span>
                  </button>
                  <div className="skill-body">
                    <ul>
                      {group.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        <section className="awards" id="awards" data-timeline="Awards">
          <div className="awards-inner">
            <h2>Awards</h2>
            <div className="award-row">
              <span>Clarium Tech</span>
              <span>Rising Star Award</span>
              <span>Performance and delivery</span>
              <span>2024</span>
            </div>
            <div className="award-row">
              <span>Clarium Tech</span>
              <span>Rising Star Award</span>
              <span>Production impact</span>
              <span>2026</span>
            </div>
            <div className="award-row">
              <span>Intellivo</span>
              <span>Client Appreciation</span>
              <span>Workflow and platform quality</span>
              <span>AI OCR</span>
            </div>
          </div>
        </section>

        <section className="contact" id="contact" data-timeline="Contact">
          <div className="contact-sheet">
            <h2>Contact</h2>
            <div className="contact-grid">
              <div className="contact-card contact-note">
                <p>
                  Let us build AI-powered full-stack systems that are fast,
                  secure, scalable and genuinely useful.
                </p>
              </div>
              <figure className="contact-card image-a">
                <img src={`${CDN}/art/Untitled2.png`} alt="" />
              </figure>
              <div className="contact-card contact-note">
                <p>
                  Open to Full Stack Python, React + Python, AI/LLM application,
                  RAG, document AI and enterprise platform roles.
                </p>
              </div>
              <figure className="contact-card image-b">
                <img src={`${CDN}/art/Untitled1.png`} alt="" />
              </figure>
            </div>
            <div className="contact-bottom">
              <nav aria-label="Contact links">
                <a href="https://github.com/Benny1704">GitHub</a>
                <a href="https://www.linkedin.com/in/benedict-thomas-m-20395b224/">
                  LinkedIn
                </a>
                <a href="tel:+919962150304">Phone</a>
              </nav>
              <a className="mail-link" href="mailto:benedictt06@gmail.com">
                <EnvelopeSimple weight="bold" />
                benedictt06@gmail.com
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-meta">
          <a href="mailto:benedictt06@gmail.com">benedictt06@gmail.com</a>
          <span>2026</span>
        </div>
        <div className="footer-name" aria-label="Benedict Thomas M">
          <span>Benedict</span>
          <span>Thomas M.</span>
        </div>
      </footer>
    </div>
  )
}

export default App
