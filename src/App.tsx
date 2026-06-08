import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { TechUniverseScene } from "./scenes/TechUniverseScene";
import { ErrorBoundary } from "./components/ui/ErrorBoundary";

gsap.registerPlugin(ScrollTrigger);

const EXPLORE_LINKS = [
  { label: "International Exhibitions", desc: "Cutting-edge robotics and technology exhibits from 20+ countries.", href: "#" },
  { label: "Keynote Lecture Series", desc: "Insights from Nobel laureates, global CEOs, and tech pioneers.", href: "#" },
  { label: "Festival Schedule", desc: "Chronological breakdown of events, panels, and tech reveals.", href: "#" },
  { label: "Initiative: Jaagruti", desc: "Techfest's nationwide mental health awareness social campaign.", href: "#" },
  { label: "Social Campaign: SHE", desc: "Promoting sanitation and hygiene education across rural districts.", href: "#" },
  { label: "Campus Ambassador", desc: "Join the network of 10,000+ student leaders representing Techfest.", href: "#" },
  { label: "Corporate Exhibitors", desc: "Interact with R&D teams from Fortune 500 tech companies.", href: "#" },
  { label: "Media & Press Kit", desc: "Official press releases, resources, and accredited media coverage.", href: "#" },
];

const LEARN_LINKS = [
  { label: "Sophia Humanoid Talk", desc: "An interactive conversation with the world's first robot citizen.", href: "#" },
  { label: "Artificial Intelligence", desc: "IIT Bombay certified training in deep learning and NLP architectures.", href: "#" },
  { label: "Cybersecurity & Hacking", desc: "Hands-on masterclass in ethical hacking and defense protocols.", href: "#" },
  { label: "Blockchain & Web3.0", desc: "Smart contracts, decentralized finance, and distributed consensus.", href: "#" },
  { label: "Machine Learning Lab", desc: "Applied predictive analytics, classification, and neural nets.", href: "#" },
  { label: "Internet of Things (IoT)", desc: "Edge computing, sensor integrations, and smart hardware design.", href: "#" },
  { label: "Robotics Masterclass", desc: "Design and programming of autonomous industrial robotic arms.", href: "#" },
  { label: "Data Science Analytics", desc: "Big data pipelines, visualization, and statistical modeling.", href: "#" },
];

const BUILD_LINKS = [
  { label: "Robowars (Combat)", desc: "Asia's largest combat robotics arena for 60kg and 15kg classes.", href: "#" },
  { label: "Meshmerize (Pathfinding)", desc: "High-speed autonomous line-follower and maze-solving challenge.", href: "#" },
  { label: "Boeing Aeromodelling", desc: "National challenge for fixed-wing aircraft design and flight tests.", href: "#" },
  { label: "Techfest Olympiad", desc: "National aptitude test testing scientific reasoning and logic.", href: "#" },
  { label: "Algorithmic Trading", desc: "Build high-frequency trading algorithms competing on live markets.", href: "#" },
  { label: "Drone Racing League", desc: "FPV drone pilots navigating high-speed obstacles in real-time.", href: "#" },
  { label: "Code the Matrix", desc: "Advanced competitive programming and algorithmic puzzles.", href: "#" },
  { label: "Task Finder Robotics", desc: "Autonomous robots solving real-world warehouse logistics.", href: "#" },
];

const BRIDGE_LINKS = [
  { label: "Techfest Startup Expo", desc: "Showcase your innovations to 50,000+ attendees and tech buyers.", href: "#" },
  { label: "VC Pitching Lounge", desc: "Pitch your MVP directly to leading early-stage venture capital firms.", href: "#" },
  { label: "Industry Connect Panel", desc: "Interact with corporate executives looking for startup solutions.", href: "#" },
  { label: "Angel Investor Hub", desc: "Secure seed funding from active angel syndicates and partners.", href: "#" },
  { label: "Incubation Partners", desc: "Connect with SINE IIT Bombay and top global accelerators.", href: "#" },
  { label: "Networking Lounge", desc: "High-value networking sessions for founders and tech developers.", href: "#" },
  { label: "R&D Innovations Showcase", desc: "Patented technologies looking for licensing and commercialization.", href: "#" },
  { label: "Alumni Mentorship", desc: "Get guided by successful IIT Bombay founders and entrepreneurs.", href: "#" },
];

const SECTIONS = [
  {
    id: "landing",
    title: "Ignition Gateway",
    subtitle: "IIT BOMBAY GATEWAY",
    tagline: "DECEMBER 18–20, 2026 // 30TH EDITION",
    desc: "Enter the gateway to Asia's largest science and technology festival. Celebrating 30 years of engineering excellence, innovation, and global collaboration at IIT Bombay.",
    stats: ["30th Anniversary", "180,000+ Footfall", "50+ Countries"],
    links: EXPLORE_LINKS,
    accent: "#f8fafc", // Platinum White
    accentRgb: "248, 250, 252"
  },
  {
    id: "learn",
    title: "Knowledge Exchange",
    subtitle: "LECTURES & WORKSHOPS",
    tagline: "MASTERCLASSES // EXPERT TALKS // WEB3 & AI",
    desc: "Engage with global visionaries. Attend professional workshops certified by IIT Bombay, and listen to insights from Nobel laureates and tech pioneers.",
    stats: ["40+ Workshops", "15+ Lectures", "IITB Certified"],
    links: LEARN_LINKS,
    accent: "#cbd5e1", // Silver Grey
    accentRgb: "203, 213, 225"
  },
  {
    id: "build",
    title: "Competition Arena",
    subtitle: "BUILD HUB & ARENAS",
    tagline: "ROBOWARS // AEROMODELLING // CODING",
    desc: "Prove your engineering skills in Asia's most fiercely contested arenas. Compete for massive prize pools against international teams in combat robotics and automated systems.",
    stats: ["INR 40L+ Prize Pool", "5000+ Teams", "Int'l Matches"],
    links: BUILD_LINKS,
    accent: "#94a3b8", // Steel Slate
    accentRgb: "148, 163, 184"
  },
  {
    id: "bridge",
    title: "Innovation Summit",
    subtitle: "BRIDGE METAVERSE",
    tagline: "STARTUPS // VC INVESTORS // MENTORSHIP",
    desc: "The ultimate intersection of technology and business. Pitch to top venture capital firms, find accelerators, and scale your startup on a global stage.",
    stats: ["150+ Startups", "30+ VC Funds", "INR 10Cr+ Seed Pool"],
    links: BRIDGE_LINKS,
    accent: "#64748b", // Dark Slate Titanium
    accentRgb: "100, 116, 139"
  }
];

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        setProgress(self.progress);
        const index = Math.min(
          Math.floor(self.progress * SECTIONS.length),
          SECTIONS.length - 1
        );
        setActiveSection(index);
      },
    });

    const timer = setTimeout(() => setIsLoaded(true), 1200);

    return () => {
      lenis.destroy();
      trigger.kill();
      clearTimeout(timer);
    };
  }, []);

  const scrollToSection = (index: number) => {
    if (lenisRef.current) {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const targetScroll = (index / (SECTIONS.length - 1)) * maxScroll;
      lenisRef.current.scrollTo(targetScroll, { duration: 1.5 });
    }
  };

  return (
    <ErrorBoundary>
      <div 
        ref={containerRef} 
        className="relative h-[450vh] bg-zinc-950 text-zinc-100 font-sans overflow-hidden"
        style={{
          "--accent": SECTIONS[activeSection].accent,
          "--accent-rgb": SECTIONS[activeSection].accentRgb,
        } as React.CSSProperties}
      >
        <div className="cinematic-grain" />
        <div className="fixed inset-0 tech-grid opacity-5 pointer-events-none" />

        {/* Dynamic dual-source atmospheric lights (Slate vs Champagne) */}
        <div 
          className="ambient-glow glow-top-right" 
          style={{ background: `radial-gradient(circle, rgba(148, 163, 184, 0.05) 0%, transparent 70%)` }}
        />
        <div 
          className="ambient-glow glow-bottom-left" 
          style={{ background: `radial-gradient(circle, rgba(212, 163, 115, 0.035) 0%, transparent 70%)` }}
        />

        {/* 3D Visual Layer */}
        <div className="fixed inset-0 z-0">
          <TechUniverseScene 
            progress={progress} 
            activeSection={activeSection}
            accentColor={SECTIONS[activeSection].accent}
            onCardClick={scrollToSection}
          />
        </div>

        {/* Premium Translucent Header */}
        <nav className="fixed top-0 left-0 w-full z-50 glass-nav px-8 py-4 flex justify-between items-center border-b border-white/5">
          <div className="flex items-center gap-16">
            <button onClick={() => scrollToSection(0)} className="flex flex-col text-left focus:outline-none cursor-pointer">
              <span className="font-mono text-[8px] tracking-[0.4em] text-zinc-500 uppercase leading-none">IIT BOMBAY</span>
              <span className="font-sans font-bold text-lg tracking-tight text-white leading-none mt-1.5">
                techfest<span style={{ color: "var(--accent)" }}>/</span>26
              </span>
            </button>
            
            {/* Apple/Vercel Capsule Navigation */}
            <div className="hidden lg:flex gap-2 p-1 bg-zinc-900/40 border border-white/5 rounded-full font-sans font-medium text-xs text-zinc-400">
              <button 
                onClick={() => scrollToSection(0)} 
                className={`cursor-pointer focus:outline-none transition-all duration-300 px-4 py-1.5 rounded-full ${activeSection === 0 ? "bg-white/10 text-white border border-white/5 shadow-sm" : "hover:text-white"}`}
              >
                Explore
              </button>
              <button 
                onClick={() => scrollToSection(1)} 
                className={`cursor-pointer focus:outline-none transition-all duration-300 px-4 py-1.5 rounded-full ${activeSection === 1 ? "bg-white/10 text-white border border-white/5 shadow-sm" : "hover:text-white"}`}
              >
                Learn
              </button>
              <button 
                onClick={() => scrollToSection(2)} 
                className={`cursor-pointer focus:outline-none transition-all duration-300 px-4 py-1.5 rounded-full ${activeSection === 2 ? "bg-white/10 text-white border border-white/5 shadow-sm" : "hover:text-white"}`}
              >
                Build
              </button>
              <button 
                onClick={() => scrollToSection(3)} 
                className={`cursor-pointer focus:outline-none transition-all duration-300 px-4 py-1.5 rounded-full ${activeSection === 3 ? "bg-white/10 text-white border border-white/5 shadow-sm" : "hover:text-white"}`}
              >
                Bridge
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:block font-mono text-[9px] text-zinc-500 tracking-wider uppercase">
              PORTAL_SYS // v2.6.0
            </div>
            {/* Solid White Accent Button */}
            <button 
              className="bg-white text-zinc-950 hover:bg-zinc-200 transition-all font-sans text-xs font-semibold px-5 py-2.5 rounded-full cursor-pointer focus:outline-none border-none shadow-sm"
              onClick={() => scrollToSection(3)}
            >
              LAUNCH PORTAL
            </button>
          </div>
        </nav>

        {/* Minimalist Dashboard Footer */}
        <div className="fixed bottom-0 left-0 w-full z-40 bg-zinc-950/40 backdrop-blur-md border-t border-white/5 py-4 px-8 flex justify-between items-center pointer-events-none text-zinc-500 font-mono text-[9px] tracking-wider border-t border-white/5">
          <div>© 2026 IIT BOMBAY TECHFEST. ALL RIGHTS RESERVED.</div>
          {/* Pulsing Green Status Indicator */}
          <div className="hidden md:flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            <span>SYSTEM // ONLINE_ACTIVE</span>
          </div>
        </div>

        {/* Content Staging */}
        <main className="fixed inset-0 z-10 pointer-events-none flex flex-col justify-center px-8 md:px-24 pt-20 pb-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 15, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -15, filter: "blur(10px)" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full flex flex-col lg:flex-row items-center lg:items-end justify-between gap-12"
            >
              {/* Left Column: Hero Text */}
              <div className="max-w-xl">
                <div className="space-y-4 mb-6">
                  {/* Dynamic Metrics Row */}
                  <div className="flex gap-6 text-[10px] font-mono tracking-widest text-zinc-500 uppercase">
                    {SECTIONS[activeSection].stats.map((stat, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <span className="h-1 w-1 rounded-full bg-zinc-600" />
                        <span>{stat}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-1">
                    <div 
                      className="font-mono text-[10px] tracking-[0.4em] font-medium uppercase opacity-55 transition-colors duration-500"
                      style={{ color: "var(--accent)" }}
                    >
                      PHASE 0{activeSection + 1} // {SECTIONS[activeSection].subtitle}
                    </div>
                    <h2 className="font-sans font-extrabold text-5xl md:text-7xl tracking-tight text-white leading-tight gradient-text-shimmer">
                      {SECTIONS[activeSection].title}
                    </h2>
                  </div>
                </div>

                <p className="max-w-md text-sm leading-relaxed text-zinc-400 tracking-wide font-normal">
                  {SECTIONS[activeSection].desc}
                </p>
                
                <div className="mt-8 pointer-events-auto">
                  <button 
                    onClick={() => scrollToSection((activeSection + 1) % SECTIONS.length)}
                    className="button-ape px-6 py-2.5 text-xs font-medium rounded-full cursor-pointer border border-white/10 bg-white/5 hover:bg-white hover:text-black hover:border-white transition-all shadow-sm"
                  >
                    Explore {SECTIONS[activeSection].title}
                  </button>
                </div>
              </div>

              {/* Right Column: Grid Links with rich descriptions */}
              <div className="hidden lg:grid grid-cols-2 gap-3 max-w-lg w-full pointer-events-auto">
                {SECTIONS[activeSection].links.map((link, idx) => (
                  <motion.a
                    key={idx}
                    href={link.href}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="glass-box p-3.5 rounded-xl flex flex-col group border border-white/5 bg-zinc-950/20 backdrop-blur-md transition-all duration-300 hover:border-white/15 hover:bg-zinc-900/40 hover:scale-[1.01]"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-sans text-xs font-semibold tracking-wide text-zinc-300 group-hover:text-white transition-colors">{link.label}</span>
                      <span className="font-mono text-[8px] opacity-20">0{idx + 1}</span>
                    </div>
                    <span className="font-sans text-[10px] text-zinc-500 group-hover:text-zinc-400 leading-normal transition-colors">{link.desc}</span>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Scroll HUD Sidebar */}
        <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-6">
          {SECTIONS.map((_, i) => (
            <button 
              key={i} 
              onClick={() => scrollToSection(i)}
              className="flex flex-col items-center gap-3 cursor-pointer group focus:outline-none"
            >
              <span className={`font-mono text-[9px] transition-all duration-300 ${i === activeSection ? "text-white font-bold" : "text-zinc-500 group-hover:text-zinc-300"}`}>
                0{i + 1}
              </span>
              <div
                className={`w-[1px] transition-all duration-500 ${
                  i === activeSection ? "h-10 bg-white" : "h-5 bg-zinc-800 group-hover:bg-zinc-600"
                }`}
                style={{ backgroundColor: i === activeSection ? "var(--accent)" : undefined }}
              />
            </button>
          ))}
        </div>

        {/* Scroll Indicator Mouse Icon */}
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2 pointer-events-none opacity-30">
          <div className="w-[16px] h-[26px] border border-white/20 rounded-full flex justify-center p-[4px]">
            <div className="w-[2px] h-[5px] bg-white rounded-full animate-scroll-wheel" />
          </div>
          <span className="font-mono text-[7px] tracking-wider uppercase opacity-40">Scroll Down</span>
        </div>
      </div>
    </ErrorBoundary>
  );
}
