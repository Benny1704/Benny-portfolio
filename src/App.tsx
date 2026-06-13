import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowRight,
  ArrowUpRight,
  EnvelopeSimple,
} from '@phosphor-icons/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import FloatingLines from './components/FloatingLines'
import Ribbons from './components/Ribbons'
import './App.css'

gsap.registerPlugin(ScrollTrigger)

const CDN = 'https://lukebaffait.fr/assets/images'
const HERO_FLOATING_WAVES: Array<'top' | 'middle' | 'bottom'> = [
  'top',
  'middle',
  'bottom',
]
const RIBBONS_COLORS = ['var(--accent)']

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

      window.scrollTo(0, 0)

      const ribbonsCursor =
        document.querySelector<HTMLElement>('.ribbons-cursor')
      if (ribbonsCursor) {
        gsap.set(ribbonsCursor, { autoAlpha: 0 })
        ScrollTrigger.create({
          trigger: '.scroll-wrap',
          start: 'top top',
          end: 'bottom top',
          onEnter: () => gsap.set(ribbonsCursor, { autoAlpha: 0 }),
          onEnterBack: () =>
            gsap.to(ribbonsCursor, {
              autoAlpha: 0,
              duration: 0.24,
              ease: 'power2.out',
            }),
          onLeave: () =>
            gsap.to(ribbonsCursor, {
              autoAlpha: 0.82,
              duration: 0.32,
              ease: 'power2.out',
            }),
          onLeaveBack: () => gsap.set(ribbonsCursor, { autoAlpha: 0 }),
        })
      }

      const preloaderContent =
        document.querySelector<HTMLElement>('.preloader-content')
      const nameLayer = document.querySelector<HTMLElement>('.name-layer')
      const introBg = document.querySelector<HTMLElement>('.intro-bg')
      const transitionPanel =
        document.querySelector<HTMLElement>('.transition-panel')
      const tPanelRed = document.querySelector<HTMLElement>('.t-panel-red')
      const tPanelDark = document.querySelector<HTMLElement>('.t-panel-dark')
      const firstName = document.querySelector<HTMLElement>('.preloader-first')
      const lastName = document.querySelector<HTMLElement>('.preloader-last')
      const dotName = document.querySelector<HTMLElement>('.preloader-dot')
      const chars = gsap.utils.toArray<HTMLElement>('.char-reveal')

      const getHeroNameSettle = () => {
        if (!preloaderContent) {
          return { x: 0, y: 0, scale: 1 }
        }

        gsap.set(preloaderContent, { clearProps: 'transform' })
        const source = preloaderContent.getBoundingClientRect()
        const mobile = window.innerWidth <= 768
        const pad = mobile ? 20 : 48
        const bottomPad = mobile
          ? Math.max(window.innerHeight * 0.2, 168)
          : 126
        const targetWidth = Math.max(280, window.innerWidth - pad * 2)
        const scale = Math.min(targetWidth / source.width, 2.65)
        const sourceCenterX = source.left + source.width / 2
        const sourceCenterY = source.top + source.height / 2
        const targetCenterX = window.innerWidth / 2
        const targetCenterY =
          window.innerHeight - bottomPad - (source.height * scale) / 2

        return {
          x: targetCenterX - sourceCenterX,
          y: targetCenterY - sourceCenterY,
          scale,
        }
      }

      const nameSettle = getHeroNameSettle()

      if (reduceMotion) {
        gsap.set(['.intro-bg', '.transition-panel', '.reveal-image-wrap'], {
          display: 'none',
        })
        gsap.set(nameLayer, {
          autoAlpha: 1,
          mixBlendMode: 'difference',
          clearProps: 'display',
        })
        gsap.set(preloaderContent, nameSettle)
        gsap.set(['.hero-tagline', '.hero-nav'], {
          autoAlpha: 1,
          clipPath: 'inset(0 0 0% 0)',
        })
        gsap.set('.hero-line', { autoAlpha: 1, scaleX: 1 })
        gsap.set(
          [
            '.about-copy',
            '.about-photo-card',
            '.project-copy-main',
            '.work-card',
            '.gallery-card',
            '.skills-panel',
            '.award-row',
            '.contact-card',
          ],
          { clearProps: 'all' },
        )
        return
      }

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
      gsap.set('.reveal-image-wrap', { autoAlpha: 0 })
      gsap.set('.reveal-seq', { scale: 0 })
      gsap.set('.reveal-overlay', { autoAlpha: 0 })
      gsap.set('.reveal-phrase', { autoAlpha: 0, filter: 'blur(10px)' })

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
        .set(nameLayer, { mixBlendMode: 'difference' }, '-=0.4')
        .set(transitionPanel, { display: 'none' })

      gsap.to('.hero-bg', {
        scale: 1.18,
        yPercent: 16,
        scrollTrigger: {
          trigger: '.scroll-wrap',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })

      const heroScroll = gsap.timeline({
        scrollTrigger: {
          trigger: '.scroll-wrap',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5,
        },
      })
      const exitLeft = window.innerWidth <= 768 ? '-38vw' : '-55vw'
      const exitRight = window.innerWidth <= 768 ? '38vw' : '55vw'
      heroScroll
        .fromTo(
          preloaderContent,
          { x: nameSettle.x, y: nameSettle.y, scale: nameSettle.scale },
          {
            x: nameSettle.x,
            y: 0,
            duration: 0.3,
            ease: 'none',
            immediateRender: false,
          },
          0,
        )
        .to(
          '.hero-tagline, .hero-nav, .hero-line',
          { autoAlpha: 0, duration: 0.15, ease: 'none' },
          0,
        )
        .fromTo(
          '.reveal-image-wrap',
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.01, ease: 'none' },
          0.3,
        )
        .fromTo(
          '.reveal-seq',
          { scale: 0 },
          { scale: 1, duration: 0.7, ease: 'none' },
          0.3,
        )
        .fromTo(
          firstName,
          { x: 0, autoAlpha: 1 },
          {
            x: exitLeft,
            autoAlpha: 0,
            duration: 0.7,
            ease: 'none',
            immediateRender: false,
          },
          0.3,
        )
        .fromTo(
          [lastName, dotName],
          { x: 0, autoAlpha: 1 },
          {
            x: exitRight,
            autoAlpha: 0,
            duration: 0.7,
            ease: 'none',
            immediateRender: false,
          },
          0.3,
        )
        .to(
          '.reveal-phrase',
          { autoAlpha: 1, filter: 'blur(0px)', duration: 0.12, ease: 'none' },
          0.62,
        )
        .set(nameLayer, { autoAlpha: 0 }, 0.98)

      gsap
        .timeline({
          scrollTrigger: {
            trigger: '.section-after',
            start: 'top bottom',
            end: 'top top',
            scrub: true,
          },
        })
        .to('.reveal-image-wrap', { y: '-50vh', ease: 'none', duration: 1 }, 0)
        .to(
          '.reveal-overlay',
          { autoAlpha: 0.72, ease: 'none', duration: 0.66 },
          0,
        )
        .to(
          '.reveal-phrase',
          { autoAlpha: 0, filter: 'blur(8px)', ease: 'none', duration: 0.24 },
          0.1,
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
      <div className="ribbons-cursor" aria-hidden="true">
        <Ribbons
          baseThickness={30}
          colors={RIBBONS_COLORS}
          speedMultiplier={0.5}
          maxAge={500}
          enableFade={false}
          enableShaderEffect={false}
        />
      </div>
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
        <div className="scroll-wrap">
          <section className="hero" data-timeline="Hero">
            <div className="hero-lines-layer" aria-hidden="true">
              <FloatingLines
                enabledWaves={HERO_FLOATING_WAVES}
                lineCount={8}
                lineDistance={8}
                bendRadius={8}
                bendStrength={-2}
                interactive
                parallax={true}
                animationSpeed={1}
                gradientStart="#e945f5"
                gradientMid="#6f6f6f"
                gradientEnd="#6a6a6a"
              />
            </div>
            <div className="hero-bg" aria-hidden="true" />
            <p className="hero-tagline">
              Full Stack Python Developer, <em>bringing AI ideas to life,</em>
              <br />
              through systems, detail and scalable platforms.
            </p>
            <div className="hero-line" aria-hidden="true" />
            <div className="hero-nav" id="hero-bar">
              <span className="version">
                <ArrowRight weight="fill" />
                V3.0
              </span>
              <nav className="hero-social" aria-label="Social links">
                <a href="#work">Behance</a>
                <span className="sep" aria-hidden="true">/</span>
                <a href="https://www.linkedin.com/in/benedict-thomas-m-20395b224/">
                  LinkedIn
                </a>
                <span className="sep" aria-hidden="true">/</span>
                <a href="https://github.com/Benny1704">GitHub</a>
              </nav>
              <nav className="hero-menu" aria-label="Page sections">
                <a href="#work">Work</a>
                <a href="#info">Info</a>
                <a href="#contact">Contact</a>
              </nav>
            </div>
          </section>
        </div>

        <div className="reveal-image-wrap" aria-hidden="true">
          <figure className="reveal-media reveal-seq">
            <img
              src={`${CDN}/art/Untitled2.png`}
              alt=""
            />
          </figure>
          <div className="reveal-frame reveal-seq">
            <span className="corner top-left" />
            <span className="corner top-right" />
            <span className="corner bottom-left" />
            <span className="corner bottom-right" />
          </div>
          <div className="reveal-overlay" />
          <p className="reveal-phrase">Basically, I build systems.</p>
        </div>

        <section className="section-after" id="info" data-timeline="Info">
          <div className="about">
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
