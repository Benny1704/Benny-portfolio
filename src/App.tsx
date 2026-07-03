import { useEffect, useRef, useState, type CSSProperties } from 'react'
import {
  ArrowRight,
  ArrowUpRight,
  Brain,
  Lightning,
  Stack,
} from '@phosphor-icons/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import FloatingLines from './components/FloatingLines'
import './App.css'

gsap.registerPlugin(ScrollTrigger)

const CDN = 'https://lukebaffait.fr/assets/images'
const HERO_FLOATING_WAVES: Array<'top' | 'middle' | 'bottom'> = [
  'top',
  'middle',
  'bottom',
]

type Project = {
  title: string
  meta: string
  image: string
  label: string
  year: string
  summary: string
  tools: string[]
  accent: string
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
    year: '2026',
    summary:
      'A production OCR workflow for extracting, validating and routing document data with local AI models.',
    tools: ['Python', 'FastAPI', 'OCR', 'LLM'],
    accent: 'oklch(0.67 0.24 29)',
    image: `${CDN}/projects/Covers/cyberDiag_web.avif`,
  },
  {
    title: 'SDLC Reverse Engineering',
    meta: 'Enterprise AI',
    label: 'Legacy Codebase Modernization',
    year: '2025',
    summary:
      'A modernization system that reads legacy code, reconstructs intent and turns delivery knowledge into usable specs.',
    tools: ['LangGraph', 'RAG', 'Python', 'React'],
    accent: 'oklch(0.72 0.15 165)',
    image: `${CDN}/projects/Covers/Anima.avif`,
  },
  {
    title: '8-K Filing RAG',
    meta: 'Internal AI',
    label: 'SEC EDGAR and GraphRAG Platform',
    year: '2025',
    summary:
      'A GraphRAG platform for SEC filings with entity-aware retrieval, structured answers and citation-first workflows.',
    tools: ['GraphRAG', 'PostgreSQL', 'FastAPI', 'EDGAR'],
    accent: 'oklch(0.69 0.19 285)',
    image: `${CDN}/projects/Covers/CyberDiag.avif`,
  },
  {
    title: 'Clarium Edge',
    meta: 'Product',
    label: 'Angular and React Component Platform',
    year: '2024',
    summary:
      'A shared component platform built to keep multi-framework enterprise interfaces consistent and faster to ship.',
    tools: ['React', 'Angular', 'Storybook', 'TypeScript'],
    accent: 'oklch(0.75 0.16 85)',
    image: `${CDN}/projects/Covers/Zenith.avif`,
  },
  {
    title: 'Benefitmall',
    meta: 'Company Project',
    label: 'Insurance Platform Modernization',
    year: '2024',
    summary:
      'Modernized insurance platform flows with cleaner UI architecture and reliable integration boundaries.',
    tools: ['React', 'APIs', 'SQL', 'Auth'],
    accent: 'oklch(0.62 0.21 240)',
    image: `${CDN}/projects/Covers/SkymcDB.avif`,
  },
  {
    title: 'SOW Tracker',
    meta: 'Internal Product',
    label: 'Business Operations Analytics',
    year: '2024',
    summary:
      'A business operations tracker that turns SOW status, delivery motion and reporting data into one readable surface.',
    tools: ['FastAPI', 'Pandas', 'Dashboards', 'PostgreSQL'],
    accent: 'oklch(0.7 0.18 135)',
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
  const activeProjectIndexRef = useRef(0)
  const [activeProject, setActiveProject] = useState(0)
  const [openSkill, setOpenSkill] = useState(0)

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
            '.info-heading-text',
            '.info-image-wrap',
            '.bento-card',
            '.info-narrative',
            '.projects-copy',
            '.project-stack-card',
            '.project-card-copy > *',
            '.skills-panel',
            '.award-row',
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
            onEnter: () => gsap.set('.reveal-image-wrap', { zIndex: 8 }),
            onLeaveBack: () =>
              gsap.set('.reveal-image-wrap', {
                zIndex: 75,
                visibility: 'visible',
              }),
            onLeave: () => gsap.set('.reveal-image-wrap', { visibility: 'hidden' }),
            onEnterBack: () =>
              gsap.set('.reveal-image-wrap', { visibility: 'visible' }),
          },
        })
        .to(
          '.reveal-image-wrap',
          { y: '-62vh', autoAlpha: 0, ease: 'none', duration: 1 },
          0,
        )
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

      // Premium Info Section Animations
      gsap.to('.info-heading-text', {
        clipPath: 'inset(0 0 0% 0)',
        y: 0,
        duration: 1.1,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.info',
          start: 'top 65%',
        },
      })

      gsap.to('.info-image-wrap', {
        clipPath: 'inset(0% 0 0 0)',
        duration: 1.2,
        ease: 'power3.inOut',
        scrollTrigger: {
          trigger: '.info-image-wrap',
          start: 'top 75%',
        },
      })

      gsap.to('.info-image-wrap img', {
        y: '10%',
        ease: 'none',
        scrollTrigger: {
          trigger: '.info-image-wrap',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })

      gsap.to('.bento-card', {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.info-bento',
          start: 'top 75%',
        },
      })

      gsap.from('.info-narrative', {
        y: 40,
        autoAlpha: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: '.info-narrative',
          start: 'top 75%',
        },
      })

      gsap.from('.projects-copy > *', {
        y: 34,
        autoAlpha: 0,
        duration: 0.86,
        stagger: 0.08,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: '.projects',
          start: 'top 64%',
        },
      })

      const projectCards = gsap.utils.toArray<HTMLElement>('.project-stack-card')

      if (projectCards.length) {
        const projectCardCopyChildren = projectCards.flatMap((card) =>
          gsap.utils.toArray<HTMLElement>('.project-card-copy > *', card),
        )

        gsap.set(projectCards, {
          transformOrigin: '50% 90%',
          force3D: true,
          clipPath: 'inset(0% 0% 0% 0% round 8px)',
        })
        gsap.set(projectCards.slice(1), {
          xPercent: 16,
          yPercent: 98,
          scale: 0.76,
          rotate: 8,
          autoAlpha: 0,
          filter: 'blur(18px)',
          clipPath: 'inset(9% 7% 9% 7% round 8px)',
        })
        gsap.set(projectCards[0], {
          xPercent: 0,
          yPercent: 0,
          scale: 1,
          rotate: -0.8,
          autoAlpha: 1,
          filter: 'blur(0px)',
        })
        gsap.set(projectCardCopyChildren, { y: 28, autoAlpha: 0 })
        gsap.set('.project-stack-card:first-child .project-card-copy > *', {
          y: 0,
          autoAlpha: 1,
        })
        gsap.set('.project-stack-card img', {
          scale: 1.14,
          yPercent: 3,
        })
        gsap.set('.project-stack-card:first-child img', {
          scale: 1.05,
          yPercent: 0,
        })

        const projectStack = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: '.projects',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.78,
            pin: '.projects-pin',
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const nextIndex = Math.min(
                projects.length - 1,
                Math.floor(self.progress * projects.length),
              )

              if (activeProjectIndexRef.current !== nextIndex) {
                activeProjectIndexRef.current = nextIndex
                setActiveProject(nextIndex)
              }
            },
          },
        })

        projectStack
          .to(
            '.project-progress-fill',
            { scaleX: 1, duration: projects.length - 1 },
            0,
          )
          .to(
            '.project-orbit',
            {
              rotate: (_, target: HTMLElement) =>
                target.classList.contains('orbit-b') ? -150 : 180,
              duration: projects.length - 1,
            },
            0,
          )
          .to(
            '.project-stage-beam',
            { xPercent: 58, autoAlpha: 0.86, duration: projects.length - 1 },
            0,
          )
          .to(
            '.project-stage-grid',
            { xPercent: -8, yPercent: 6, duration: projects.length - 1 },
            0,
          )

        projectCards.slice(1).forEach((card, index) => {
          const previous = projectCards[index]
          const direction = index % 2 === 0 ? -1 : 1
          const at = index + 0.16
          const previousCopy = gsap.utils.toArray<HTMLElement>(
            '.project-card-copy > *',
            previous,
          )
          const nextCopy = gsap.utils.toArray<HTMLElement>(
            '.project-card-copy > *',
            card,
          )
          const previousImage = previous.querySelector('img')
          const nextImage = card.querySelector('img')

          projectStack
            .to(
              previousCopy,
              {
                y: -22,
                autoAlpha: 0,
                duration: 0.26,
                stagger: { each: 0.025, from: 'end' },
              },
              at,
            )
            .to(
              previousImage,
              {
                scale: 1.18,
                yPercent: -5,
                duration: 0.78,
              },
              at,
            )
            .to(
              previous,
              {
                xPercent: direction * -16,
                yPercent: -68,
                scale: 0.72,
                rotate: direction * -12,
                autoAlpha: 0.16,
                filter: 'blur(18px)',
                clipPath: 'inset(14% 12% 14% 12% round 8px)',
                duration: 0.86,
              },
              at,
            )
            .fromTo(
              nextImage,
              { scale: 1.22, yPercent: 7 },
              {
                scale: 1.04,
                yPercent: 0,
                duration: 0.94,
              },
              at + 0.02,
            )
            .to(
              card,
              {
                xPercent: 0,
                yPercent: 0,
                scale: 1,
                rotate: direction * 0.8,
                autoAlpha: 1,
                filter: 'blur(0px)',
                clipPath: 'inset(0% 0% 0% 0% round 8px)',
                duration: 0.94,
              },
              at,
            )
            .to(
              nextCopy,
              {
                y: 0,
                autoAlpha: 1,
                duration: 0.44,
                stagger: 0.05,
                ease: 'expo.out',
              },
              at + 0.32,
            )
        })
      }

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

      gsap.to('.skills-flow', {
        '--flow-progress': 1,
        ease: 'none',
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
                <a href="#skills">Skills</a>
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
          <div className="info">
            <div className="info-layout">
              {/* Sticky Left Column */}
              <div className="info-sticky">
                <div className="info-label">
                  <span className="info-label-dot" aria-hidden="true" />
                  About
                </div>

                <div className="info-hero">
                  <h2 className="info-heading">
                    <span className="info-heading-line">
                      <span className="info-heading-text">
                        I craft <em>intelligent</em>
                      </span>
                    </span>
                    <span className="info-heading-line">
                      <span className="info-heading-text">
                        systems that
                      </span>
                    </span>
                    <span className="info-heading-line">
                      <span className="info-heading-text">
                        <em>scale.</em>
                      </span>
                    </span>
                  </h2>
                </div>

                <div className="info-cta">
                  <a className="info-cta-btn primary" href="#skills">
                    Explore Skills
                    <ArrowUpRight weight="bold" />
                  </a>
                </div>
              </div>

              {/* Scrolling Right Column */}
              <div className="info-content">
                <figure className="info-image-wrap">
                  <img src={`${CDN}/art/Untitled2.png`} alt="Abstract representation of AI systems" />
                </figure>

                <div className="info-narrative">
                  <p>
                    From backend architectures to AI-powered document intelligence,
                    I work across the full spectrum of modern software engineering.
                    Every system I build is designed with
                    <strong> production readiness</strong> and
                    <strong> real-world scale</strong> in mind.
                  </p>
                  <p>
                    My core stack spans Python, FastAPI, React, TypeScript,
                    PostgreSQL, Docker, Kafka, LangChain, LangGraph and vLLM, with
                    deep experience in OCR pipelines, RAG systems, and enterprise
                    modernization.
                  </p>
                </div>

                <div className="info-bento">
                  <div className="bento-card wide">
                    <div className="bento-stat-num">3+</div>
                    <div>
                      <div className="bento-stat-label">Years of</div>
                      <h3>Production Experience</h3>
                      <p>Building resilient, scalable software systems.</p>
                    </div>
                  </div>
                  
                  <div className="bento-card">
                    <div className="bento-icon" aria-hidden="true">
                      <Brain weight="duotone" />
                    </div>
                    <div>
                      <h3>AI & LLMs</h3>
                      <p>Local inference, agents & RAG.</p>
                    </div>
                  </div>

                  <div className="bento-card">
                    <div className="bento-icon" aria-hidden="true">
                      <Lightning weight="duotone" />
                    </div>
                    <div>
                      <h3>Full Stack</h3>
                      <p>From DB schemas to polished UIs.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="projects" id="work" data-timeline="Work">
          <div className="projects-ambient" aria-hidden="true">
            <span className="project-orbit orbit-a" />
            <span className="project-orbit orbit-b" />
            <span className="project-stage-beam" />
          </div>
          <div className="projects-pin">
            <div className="projects-layout">
              <aside className="projects-copy">
                <div className="project-stage-label">
                  <span>Work archive</span>
                  <span>
                    {String(activeProject + 1).padStart(2, '0')} /{' '}
                    {String(projects.length).padStart(2, '0')}
                  </span>
                </div>
                <div
                  className="project-current"
                  key={currentProject.title}
                  style={
                    {
                      '--project-accent': currentProject.accent,
                    } as CSSProperties
                  }
                >
                  <span className="project-current-meta">
                    {currentProject.meta} / {currentProject.year}
                  </span>
                  <h3>{currentProject.title}</h3>
                  <p>{currentProject.summary}</p>
                  <div className="project-current-tags" aria-label="Project stack">
                    {currentProject.tools.map((tool) => (
                      <span key={tool}>{tool}</span>
                    ))}
                  </div>
                </div>

                <ol className="project-index" aria-label="Project sequence">
                  {projects.map((project, index) => (
                    <li
                      className={`project-index-item ${
                        activeProject === index ? 'active' : ''
                      }`}
                      key={project.title}
                      style={
                        {
                          '--project-accent': project.accent,
                        } as CSSProperties
                      }
                      aria-current={activeProject === index ? 'step' : undefined}
                    >
                      <span>{String(index + 1).padStart(2, '0')}</span>
                      <strong>{project.title}</strong>
                    </li>
                  ))}
                </ol>

                <div className="project-progress" aria-hidden="true">
                  <span className="project-progress-fill" />
                </div>
              </aside>

              <div className="project-stack-wrap">
                <div className="project-stage-grid" aria-hidden="true" />
                <div className="project-stack" aria-label="Featured projects">
                  {projects.map((project, index) => (
                    <article
                      className="project-stack-card"
                      key={project.title}
                      style={
                        {
                          '--project-accent': project.accent,
                          '--card-index': index,
                        } as CSSProperties
                      }
                    >
                      <figure>
                        <img
                          src={project.image}
                          alt={`${project.title} project cover`}
                        />
                      </figure>
                      <div className="project-card-sheen" aria-hidden="true" />
                      <div className="project-card-glow" aria-hidden="true" />
                      <div className="project-card-top">
                        <span>{String(index + 1).padStart(2, '0')}</span>
                        <span>{project.year}</span>
                      </div>
                      <div className="project-card-copy">
                        <Stack weight="duotone" />
                        <span>{project.meta}</span>
                        <h3>{project.title}</h3>
                        <p>{project.label}</p>
                        <div
                          className="project-card-tools"
                          aria-label={`${project.title} stack`}
                        >
                          {project.tools.slice(0, 3).map((tool) => (
                            <span key={tool}>{tool}</span>
                          ))}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="skills" id="skills" data-timeline="Skills">
          <div className="skills-panel skills-left">
            <span className="skills-subtitle">Skills</span>
            <h2>
              Full Stack Python Developer building AI-powered platforms,
              document intelligence systems and enterprise modernization tools.
            </h2>
            <div className="skills-flow" aria-hidden="true">
              <span className="skills-flow-track" />
              <span className="skills-flow-marker" />
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
