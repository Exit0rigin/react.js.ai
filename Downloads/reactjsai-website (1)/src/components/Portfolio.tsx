import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, MeshTransmissionMaterial, Sparkles, OrbitControls, ContactShadows, Stars, Billboard, Text, MeshDistortMaterial } from '@react-three/drei';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Mail, ArrowRight, Code2, Cpu, Database, Layout, Terminal, Layers, Zap, Globe, Check, X, Phone, Rocket, ShoppingCart, Search, Sparkles as SparklesIcon, Star, Send, IndianRupee, Menu } from 'lucide-react';
import * as THREE from 'three';

// -------------------
// PERFORMANCE UTILS
// -------------------

// Lazy-loading hook for 3D canvases to prevent GPU lag
function useInViewport(rootMargin = '400px') {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [rootMargin]);
  return { ref, isVisible };
}

function LazyBackdrop({ children }: { children: React.ReactNode }) {
  const { ref, isVisible } = useInViewport('600px');
  return (
    <div ref={ref} className="absolute inset-0 z-0 opacity-100 pointer-events-none">
      {isVisible && <Suspense fallback={null}>{children}</Suspense>}
    </div>
  );
}

// -------------------
// 3D Components
// -------------------

function HeroShape() {
  const mesh = useRef<THREE.Mesh>(null);
  const material = useRef<any>(null);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.5;
      mesh.current.rotation.y += 0.005;
      mesh.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
      <mesh ref={mesh} scale={1.8}>
        <torusKnotGeometry args={[1, 0.3, 64, 16]} />
        <MeshTransmissionMaterial
          ref={material}
          backside
          samples={2}
          thickness={0.5}
          roughness={0.1}
          transmission={1}
          ior={1.2}
          chromaticAberration={0.1}
          anisotropy={0.2}
          distortion={0.2}
          distortionScale={0.3}
          temporalDistortion={0.1}
          color="#00f0ff"
        />
      </mesh>
    </Float>
  );
}

function BackgroundParticles() {
  return (
    <group>
      <Stars radius={80} depth={40} count={600} factor={3} saturation={0} fade speed={0.8} />
      <Sparkles count={30} scale={12} size={2} speed={0.3} color="#00f0ff" opacity={0.4} />
      <Sparkles count={15} scale={12} size={3} speed={0.15} color="#a020f0" opacity={0.25} />
    </group>
  );
}

function SkillNode({ position, label, color, delay }: { position: [number, number, number], icon: React.ElementType, label: string, color: string, delay: number }) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (group.current) {
      group.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + delay) * 0.2;
    }
  });

  return (
    <group ref={group} position={position}>
      <Float speed={3} floatIntensity={1} rotationIntensity={0.5}>
        <mesh>
          <icosahedronGeometry args={[0.6, 1]} />
          <meshPhysicalMaterial
            color={color}
            wireframe
            emissive={color}
            emissiveIntensity={0.8}
            transparent
            opacity={0.8}
            roughness={0}
          />
        </mesh>
        <Billboard>
          <Text
            position={[0, -1, 0]}
            fontSize={0.25}
            color="#ffffff"
            font="https://fonts.gstatic.com/s/spacegrotesk/v15/V8mQoQDjQSkGpu8PNMs46o-EN2y1.woff"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#000000"
          >
            {label}
          </Text>
        </Billboard>
      </Float>
    </group>
  );
}

function SkillOrbit() {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.elapsedTime * 0.15;
      group.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <group ref={group}>
      <SkillNode position={[3.5, 0, 0]} icon={Code2} label="React & Next.js" color="#00f0ff" delay={0} />
      <SkillNode position={[-3.5, 0, 0]} icon={Terminal} label="Node & TS" color="#a020f0" delay={1} />
      <SkillNode position={[0, 0, 3.5]} icon={Layout} label="Three.js / WebGL" color="#39ff14" delay={2} />
      <SkillNode position={[0, 0, -3.5]} icon={Database} label="PostgreSQL" color="#ff0055" delay={3} />
      <SkillNode position={[2.5, 2.5, -2.5]} icon={Cpu} label="System Arch" color="#00f0ff" delay={4} />
      <SkillNode position={[-2.5, -2.5, 2.5]} icon={Code2} label="Performance" color="#a020f0" delay={5} />
    </group>
  );
}

// -------------------
// Section Backdrop 3D Scenes
// -------------------

function GlassOrb({ position, color, scale = 1, speed = 1 }: { position: [number, number, number]; color: string; scale?: number; speed?: number }) {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = state.clock.elapsedTime * 0.12 * speed;
      mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.08 * speed) * 0.25;
    }
  });
  return (
    <Float speed={0.7 * speed} rotationIntensity={0.25} floatIntensity={1}>
      <mesh ref={mesh} position={position} scale={scale}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshPhysicalMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.15}
          roughness={0.1}
          metalness={0.3}
          transparent
          opacity={0.6}
          transmission={0.6}
          thickness={0.5}
          ior={1.4}
        />
      </mesh>
    </Float>
  );
}

function MorphingBlob({ position, color, scale = 1, speed = 1 }: { position: [number, number, number]; color: string; scale?: number; speed?: number }) {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = state.clock.elapsedTime * 0.09 * speed;
      mesh.current.rotation.z = state.clock.elapsedTime * 0.07 * speed;
    }
  });
  return (
    <Float speed={0.55 * speed} rotationIntensity={0.3} floatIntensity={0.9}>
      <mesh ref={mesh} position={position} scale={scale}>
        <sphereGeometry args={[1, 24, 24]} />
        <MeshDistortMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.35}
          roughness={0.15}
          metalness={0.8}
          distort={0.4}
          speed={1.2 * speed}
        />
      </mesh>
    </Float>
  );
}

function HaloRing({ position, color, scale = 1, tilt = 0 }: { position: [number, number, number]; color: string; scale?: number; tilt?: number }) {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.z = state.clock.elapsedTime * 0.18;
    }
  });
  return (
    <mesh ref={mesh} position={position} rotation={[tilt, 0, 0]} scale={scale}>
      <torusGeometry args={[1.6, 0.012, 16, 128]} />
      <meshBasicMaterial color={color} transparent opacity={0.55} />
    </mesh>
  );
}

function ServicesBackdrop3D() {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 45 }} gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }} dpr={1}>
      <Suspense fallback={null}>
        <ambientLight intensity={0.4} />
        <spotLight position={[8, 8, 8]} angle={0.4} penumbra={1} intensity={1.5} color="#ffffff" />
        <pointLight position={[-8, -4, 4]} intensity={1.2} color="#a020f0" />
        <pointLight position={[8, -2, 2]} intensity={1} color="#00f0ff" />
        <Environment preset="city" />
        <MorphingBlob position={[-5.5, 2, -2]} color="#00f0ff" scale={1.6} speed={0.7} />
        <MorphingBlob position={[5.5, -2, -2]} color="#a020f0" scale={1.4} speed={0.9} />
        <GlassOrb position={[0, 0, -1]} color="#00f0ff" scale={1.1} speed={0.8} />
        <GlassOrb position={[3.5, 2.5, -3]} color="#a020f0" scale={0.7} speed={1.1} />
        <GlassOrb position={[-3.5, -2.5, -3]} color="#39ff14" scale={0.6} speed={1.0} />
        <HaloRing position={[0, 0, -2]} color="#00f0ff" scale={2.4} tilt={0.4} />
        <HaloRing position={[0, 0, -2.5]} color="#a020f0" scale={3.0} tilt={-0.6} />
        <Sparkles count={60} scale={[22, 14, 10]} size={1.4} speed={0.22} color="#00f0ff" opacity={0.6} />
        <Sparkles count={30} scale={[18, 12, 8]} size={2.5} speed={0.15} color="#a020f0" opacity={0.4} />
      </Suspense>
    </Canvas>
  );
}

function ContactBackdrop3D() {
  return (
    <Canvas camera={{ position: [0, 0, 8], fov: 50 }} gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }} dpr={1}>
      <Suspense fallback={null}>
        <ambientLight intensity={0.4} />
        <spotLight position={[8, 8, 8]} angle={0.3} penumbra={1} intensity={1.8} color="#ffffff" />
        <pointLight position={[-8, -4, 4]} intensity={1.2} color="#a020f0" />
        <pointLight position={[6, -2, 2]} intensity={0.9} color="#00f0ff" />
        <Environment preset="city" />
        <GlassOrb position={[0, 0, 0]} color="#00f0ff" scale={1.6} speed={0.6} />
        <MorphingBlob position={[-4.5, 2, -2]} color="#a020f0" scale={1.1} speed={0.8} />
        <MorphingBlob position={[4.5, -2, -2]} color="#00f0ff" scale={1.0} speed={0.9} />
        <GlassOrb position={[4, 3, -3]} color="#39ff14" scale={0.55} speed={1.0} />
        <GlassOrb position={[-4, -2.5, -3]} color="#a020f0" scale={0.6} speed={1.2} />
        <HaloRing position={[0, 0, -1]} color="#00f0ff" scale={2.6} tilt={0.5} />
        <HaloRing position={[0, 0, -1.5]} color="#a020f0" scale={3.4} tilt={-0.5} />
        <Sparkles count={60} scale={[20, 14, 8]} size={1.5} speed={0.22} color="#00f0ff" opacity={0.6} />
        <Sparkles count={30} scale={[18, 12, 6]} size={2.5} speed={0.15} color="#a020f0" opacity={0.4} />
      </Suspense>
    </Canvas>
  );
}

// -------------------
// Main Portfolio Component
// -------------------

export function Portfolio() {
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);
  const heroY = useTransform(scrollYProgress, [0, 0.15], [0, 50]);

  const [submitted, setSubmitted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const handleContactSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formEl = e.currentTarget;
    const data = new FormData(formEl);
    const entry = {
      id: `lead_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name: String(data.get('name') || '').trim(),
      email: String(data.get('email') || '').trim(),
      message: String(data.get('message') || '').trim(),
      createdAt: new Date().toISOString(),
    };
    if (!entry.name || !entry.email || !entry.message) return;

    // Send to WhatsApp
    const whatsappMessage = `*New Contact Form Submission*%0A%0A👤 *Name:* ${entry.name}%0A📧 *Email:* ${entry.email}%0A💬 *Message:* ${entry.message}%0A🕒 *Time:* ${new Date().toLocaleString()}`;
    const whatsappUrl = `https://wa.me/917558397248?text=${whatsappMessage}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

    try {
      const key = 'reactjsai:contact_submissions';
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      existing.unshift(entry);
      localStorage.setItem(key, JSON.stringify(existing.slice(0, 200)));
    } catch { }
    formEl.reset();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 6000);
  };

  const services = [
    {
      icon: <Globe className="w-6 h-6 text-cyan-400" />,
      title: "Website Development",
      description: "Custom websites built with modern React and Next.js. Fully responsive and SEO optimized.",
      accent: "text-cyan-400",
      glow: "from-cyan-500/20 to-blue-600/20"
    },
    {
      icon: <ShoppingCart className="w-6 h-6 text-violet-400" />,
      title: "E-Commerce Solutions",
      description: "Complete e-commerce platforms with payment integration, inventory, and admin panels.",
      accent: "text-violet-400",
      glow: "from-violet-500/20 to-fuchsia-600/20"
    },
    {
      icon: <Code2 className="w-6 h-6 text-lime-400" />,
      title: "Custom Web Apps",
      description: "Powerful web applications with real-time features, dashboards, and complex functionality.",
      accent: "text-lime-400",
      glow: "from-lime-500/20 to-emerald-600/20"
    },
    {
      icon: <SparklesIcon className="w-6 h-6 text-rose-400" />,
      title: "UI/UX Design",
      description: "Beautiful, intuitive designs that convert visitors into customers. User-focused approach.",
      accent: "text-rose-400",
      glow: "from-rose-500/20 to-orange-600/20"
    },
    {
      icon: <Layers className="w-6 h-6 text-amber-400" />,
      title: "3D Animation Website Development",
      description: "Immersive 3D experiences powered by Three.js and React Three Fiber. Interactive scenes that captivate visitors.",
      accent: "text-amber-400",
      glow: "from-amber-500/20 to-yellow-600/20"
    }
  ];

  type PlanFeature = { label: string; included: boolean };
  const plans: { name: string; price: string; tagline: string; popular?: boolean; accent: string; ring: string; features: PlanFeature[] }[] = [
    {
      name: "Starter",
      price: "₹4999* Onwards",
      tagline: "Perfect for small projects",
      accent: "text-cyan-400",
      ring: "border-white/10",
      features: [
        { label: "1-3 Pages", included: true },
        { label: "Mobile Friendly", included: true },
        { label: "Basic SEO", included: true },
        { label: "Admin Panel", included: false },
        { label: "E-Commerce", included: false },
        { label: "API Integration", included: false }
      ]
    },
    {
      name: "Business",
      price: "₹14999* Onwards",
      tagline: "Most popular choice",
      popular: true,
      accent: "text-white",
      ring: "border-cyan-400/50",
      features: [
        { label: "5-8 Pages", included: true },
        { label: "Custom Design", included: true },
        { label: "Admin Panel", included: true },
        { label: "WhatsApp Integration", included: true },
        { label: "Advanced SEO", included: true },
        { label: "Analytics Setup", included: true }
      ]
    },
    {
      name: "Premium",
      price: "₹34999* Onwards",
      tagline: "Advanced applications",
      accent: "text-violet-400",
      ring: "border-white/10",
      features: [
        { label: "React/Next.js App", included: true },
        { label: "Custom Backend", included: true },
        { label: "Authentication", included: true },
        { label: "Payment Gateway", included: true },
        { label: "Dashboard", included: true },
        { label: "Database Design", included: true }
      ]
    },
    {
      name: "E-Commerce",
      price: "₹49999* Onwards",
      tagline: "Complete online store",
      accent: "text-lime-400",
      ring: "border-white/10",
      features: [
        { label: "Product Listing", included: true },
        { label: "Shopping Cart", included: true },
        { label: "Order Tracking", included: true },
        { label: "Admin Panel", included: true },
        { label: "Payment Gateway", included: true },
        { label: "3 Months Support", included: true }
      ]
    },
    {
      name: "3D Animation website",
      price: "₹25999* Onwards",
      tagline: "Complete online store",
      accent: "text-blue-400",
      ring: "border-white/10",
      features: [
        { label: "Interactive 3D Models (WebGL / Three.js)", included: true },
        { label: "Smooth Animations & Transitions", included: true },
        { label: "Scroll-based 3D Effects", included: true },
        { label: "High-Quality Render Showcase", included: true },
        { label: "Fullscreen Experience Mode", included: true },
        { label: "Performance Optimized (Fast Loading)", included: true }
      ]
    },
    {
      name: "3D Portfolio Website",
      price: "₹19999* Onwards",
      tagline: "Showcase your work with immersive 3D experience",
      accent: "text-red-400",
      ring: "border-white/10",
      features: [
        { label: "Interactive 3D Project Showcase", included: true },
        { label: "Case Study / Project Detail Pages", included: true },
        { label: "Smooth Camera & Scene Transitions", included: true },
        { label: "Custom UI with 3D Elements", included: true },
        { label: "Contact Form / Hire Me Section", included: true },
        { label: "Performance Optimized (Fast Loading)", included: true }
      ]
    },
    {
      name: "3D Landing Page",
      price: "₹17999* Onwards",
      tagline: "High-converting landing page with stunning 3D visuals",
      accent: "text-green-400",
      ring: "border-white/10",
      features: [
        { label: "3D Hero Section (First Impression Focus)", included: true },
        { label: "Scroll-based 3D Animations", included: true },
        { label: "Call-To-Action Sections (Lead Generation)", included: true },
        { label: "Product/Service Highlights with 3D", included: true },
        { label: "Fully Responsive Design", included: true },
        { label: "SEO & Speed Optimized", included: true }
      ]
    }
  ];

  const addOns = [
    { name: "Domain & Hosting", price: "₹2000/year" },
    { name: "Payment Gateway Setup", price: "₹3000" },
    { name: "Monthly Maintenance", price: "₹2000" },
    { name: "Additional Pages", price: "₹1000/page" },
    { name: "Custom Features", price: "Custom Quote" },
    { name: "Mobile App", price: "Custom Quote" }
  ];

  const reasons = [
    {
      icon: <Zap className="w-6 h-6 text-cyan-400" />,
      title: "Fast Delivery",
      description: "Quick turnaround times without compromising quality. Your business goes live faster."
    },
    {
      icon: <IndianRupee className="w-6 h-6 text-lime-400" />,
      title: "Affordable Pricing",
      description: "Transparent pricing with no hidden charges. Great value for your investment."
    },
    {
      icon: <Rocket className="w-6 h-6 text-violet-400" />,
      title: "Modern Tech Stack",
      description: "React, Next.js, Node.js — we use the latest technologies for superior performance."
    },
    {
      icon: <Search className="w-6 h-6 text-rose-400" />,
      title: "SEO Friendly",
      description: "Built-in SEO optimization to ensure your website ranks high in search results."
    }
  ];

  return (
    <div className="bg-[#030305] text-slate-200 min-h-screen selection:bg-cyan-500/30 font-['Space_Grotesk'] overflow-x-hidden">
      {/* Noise Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.02] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* Background Glows */}
      <div className="fixed top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-cyan-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-violet-600/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 px-4 sm:px-6 py-3 sm:py-5 backdrop-blur-md bg-black/30 border-b border-white/5 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex justify-between items-center">

          {/* Logo + Brand */}
          <a href="#top" className="flex items-center gap-2 sm:gap-3 group">
            <div className="w-12 sm:w-16 h-12 sm:h-16 flex items-center justify-center overflow-hidden">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-cover scale-125" />
            </div>
            <div className="leading-tight">
              <div className="font-bold text-white tracking-tight text-sm sm:text-base">REACT.JS.AI</div>
              <div className="font-['JetBrains_Mono'] text-[8px] sm:text-[10px] tracking-widest text-cyan-400/80">THINK.CODE.LAUNCH</div>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8 font-['JetBrains_Mono'] text-[10px] lg:text-xs tracking-[0.18em]">
            <a href="#services" className="hover:text-cyan-400 transition-colors duration-300 uppercase relative group">
              Services
              <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-cyan-400 transition-all duration-300 group-hover:w-full" />
            </a>
            <a href="#pricing" className="hover:text-violet-400 transition-colors duration-300 uppercase relative group">
              Pricing
              <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-violet-400 transition-all duration-300 group-hover:w-full" />
            </a>
            <a href="#why" className="hover:text-lime-400 transition-colors duration-300 uppercase relative group">
              Why Us
              <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-lime-400 transition-all duration-300 group-hover:w-full" />
            </a>
            <a href="#contact" className="hover:text-rose-400 transition-colors duration-300 uppercase relative group">
              Contact
              <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-rose-400 transition-all duration-300 group-hover:w-full" />
            </a>
          </div>

          <div className="flex items-center gap-3">
            {/* CTA Button */}
            <a
              href="#contact"
              className="hidden sm:inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white text-black hover:bg-cyan-50 text-[10px] sm:text-xs font-bold font-['JetBrains_Mono'] uppercase tracking-widest transition-all duration-300"
            >
              Get Started
              <ArrowRight className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
            </a>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all duration-300"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="md:hidden overflow-hidden"
            >
              <div className="flex flex-col gap-1 pt-4 pb-2 font-['JetBrains_Mono'] text-xs tracking-[0.18em]">
                {[
                  { label: 'Services', href: '#services', color: 'hover:text-cyan-400 hover:bg-cyan-400/5' },
                  { label: 'Pricing', href: '#pricing', color: 'hover:text-violet-400 hover:bg-violet-400/5' },
                  { label: 'Why Us', href: '#why', color: 'hover:text-lime-400 hover:bg-lime-400/5' },
                  { label: 'Contact', href: '#contact', color: 'hover:text-rose-400 hover:bg-rose-400/5' },
                ].map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`uppercase px-4 py-3 rounded-xl transition-all duration-300 ${item.color}`}
                  >
                    {item.label}
                  </a>
                ))}
                <a
                  href="#contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="sm:hidden mt-2 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white text-black text-xs font-bold uppercase tracking-widest transition-all duration-300 active:scale-95"
                >
                  Get Started
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section id="top" className="relative min-h-screen sm:min-h-[100dvh] w-full flex items-center justify-center overflow-hidden pt-20 sm:pt-24 pb-12 sm:pb-16">
        <div className="absolute inset-0 z-0">
          <Canvas camera={{ position: [0, 0, 6], fov: 45 }} gl={{ antialias: false, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, powerPreference: "high-performance" }} dpr={1}>
            <Suspense fallback={null}>
              <ambientLight intensity={0.5} />
              <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color="#ffffff" castShadow />
              <spotLight position={[-10, -10, -10]} angle={0.15} penumbra={1} intensity={1} color="#a020f0" />
              <Environment preset="city" />
              <BackgroundParticles />
              <HeroShape />
              <ContactShadows position={[0, -2.5, 0]} opacity={0.6} scale={15} blur={2.5} far={4} color="#00f0ff" />
              <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2 + 0.2} minPolarAngle={Math.PI / 2 - 0.2} />
            </Suspense>
          </Canvas>
        </div>

        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
          className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto pointer-events-none"
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[6rem] font-bold tracking-tighter mb-4 sm:mb-6 text-white leading-[1.02]"
          >
            Build Your Business Website with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-violet-400 drop-shadow-[0_0_30px_rgba(0,240,255,0.3)]">
              React.js.ai
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-light mb-8 sm:mb-12"
          >
            Modern, fast, and scalable websites for your business growth. Powered by cutting-edge React and AI technology.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-20"
          >
            <a href="#contact" className="group relative inline-flex items-center justify-center gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-white text-black hover:bg-cyan-50 rounded-full text-xs sm:text-sm font-bold font-['JetBrains_Mono'] uppercase tracking-widest transition-all overflow-hidden w-full sm:w-auto active:scale-95 touch-manipulation">
              <span className="relative z-10">Get Started Now</span>
              <ArrowRight className="w-3.5 sm:w-4 h-3.5 sm:h-4 group-hover:translate-x-1 transition-transform relative z-10" />
            </a>
            <a href="#pricing" className="group relative inline-flex items-center justify-center gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-transparent border border-white/20 hover:border-white/50 text-white rounded-full text-xs sm:text-sm font-bold font-['JetBrains_Mono'] uppercase tracking-widest transition-all overflow-hidden w-full sm:w-auto backdrop-blur-sm active:scale-95 touch-manipulation">
              <span className="relative z-10">View Pricing</span>
            </a>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto grid grid-cols-1 gap-2 sm:gap-4 max-w-xs mx-auto"
          >
            {[
              { num: "99%", label: "Satisfaction" }
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md p-3 sm:p-4 md:p-6 text-center">
                <div className="text-xl sm:text-3xl md:text-4xl font-bold text-white font-['JetBrains_Mono'] tracking-tight">{stat.num}</div>
                <div className="text-[9px] sm:text-[10px] md:text-xs text-slate-500 uppercase tracking-widest mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
        >
          <div className="w-[1px] h-10 bg-gradient-to-b from-cyan-400 to-transparent animate-pulse" />
          <span className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.3em] text-cyan-400">Scroll</span>
        </motion.div>
      </section>

      {/* Services */}
      <section id="services" className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 relative z-10 bg-black/20 border-y border-white/5 overflow-hidden">
        {/* 3D backdrop */}
        <LazyBackdrop><ServicesBackdrop3D /></LazyBackdrop>
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[#030305]/40 via-transparent to-[#030305]/40 pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-10 sm:mb-14 md:mb-16 text-center"
          >
            <h2 className="font-['JetBrains_Mono'] text-cyan-400 mb-4 sm:mb-6 tracking-widest text-xs sm:text-sm uppercase">What we do</h2>
            <h3 className="text-2xl sm:text-4xl md:text-6xl font-bold text-white tracking-tighter mb-3 sm:mb-4">Our Services</h3>
            <p className="text-sm sm:text-base md:text-lg text-slate-400 max-w-2xl mx-auto font-light">Comprehensive web solutions to take your business to the next level.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5 md:gap-6">
            {services.map((service, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="group relative p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.04] transition-all overflow-hidden"
              >
                <div className={`absolute -inset-px rounded-2xl sm:rounded-3xl bg-gradient-to-br ${service.glow} opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-screen pointer-events-none`} />
                <div className="relative z-10">
                  <div className="w-11 sm:w-12 md:w-14 h-11 sm:h-12 md:h-14 rounded-xl sm:rounded-2xl bg-white/5 flex items-center justify-center mb-4 sm:mb-6 md:mb-8 border border-white/10">
                    {service.icon}
                  </div>
                  <h4 className="text-base sm:text-lg md:text-xl font-bold text-white mb-2 sm:mb-3 md:mb-4">{service.title}</h4>
                  <p className="text-slate-400 leading-relaxed font-light text-xs sm:text-sm">
                    {service.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 relative z-10 overflow-hidden bg-gradient-to-b from-transparent via-violet-900/10 to-transparent">
        {/* Simple animated gradient background */}
        <div className="absolute inset-0 z-0 pointer-events-none animate-gradient-shift opacity-40">
          <div className="absolute top-20 left-10 w-72 h-72 bg-violet-500/30 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-float-slow" />
        </div>
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[#030305]/20 via-transparent to-[#030305]/20 pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-10 sm:mb-14 md:mb-16 text-center"
          >
            <h2 className="font-['JetBrains_Mono'] text-violet-400 mb-4 sm:mb-6 tracking-widest text-xs sm:text-sm uppercase">Pricing</h2>
            <h3 className="text-2xl sm:text-4xl md:text-6xl font-bold text-white tracking-tighter mb-3 sm:mb-4">Simple, Transparent Pricing</h3>
            <p className="text-sm sm:text-base md:text-lg text-slate-400 max-w-2xl mx-auto font-light">Choose the perfect plan for your business needs.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
            {plans.map((plan, idx) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className={`relative p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border ${plan.ring} bg-white/[0.02] backdrop-blur-md flex flex-col ${plan.popular ? "sm:-translate-y-2 lg:-translate-y-4 shadow-[0_0_40px_rgba(0,240,255,0.15)] bg-gradient-to-b from-cyan-500/[0.06] to-transparent" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-2 sm:-top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 text-black text-[8px] sm:text-[10px] font-bold font-['JetBrains_Mono'] uppercase tracking-widest whitespace-nowrap">
                    <Star className="w-2.5 sm:w-3 h-2.5 sm:h-3 fill-current" />
                    Most Popular
                  </div>
                )}
                <div className="mb-4 sm:mb-5 md:mb-6">
                  <h4 className={`text-lg sm:text-xl md:text-2xl font-bold mb-1 ${plan.accent}`}>{plan.name}</h4>
                  <p className="text-slate-500 text-xs sm:text-sm">{plan.tagline}</p>
                </div>
                <div className="mb-4 sm:mb-5 md:mb-6">
                  <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white font-['JetBrains_Mono'] tracking-tight">{plan.price}</div>
                </div>
                <a
                  href={`https://wa.me/917558397248?text=${encodeURIComponent(`Hi, I'm interested in the ${plan.name} plan (${plan.price}).`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs font-bold font-['JetBrains_Mono'] uppercase tracking-widest mb-6 sm:mb-7 md:mb-8 transition-all active:scale-95 touch-manipulation ${plan.popular
                    ? "bg-white text-black hover:bg-cyan-50"
                    : "bg-white/5 border border-white/15 text-white hover:bg-white/10 hover:border-white/30"
                    }`}
                >
                  Choose Plan
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
                <ul className="space-y-2 sm:space-y-3 mt-auto">
                  {plan.features.map((f) => (
                    <li key={f.label} className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                      {f.included ? (
                        <span className="w-5 h-5 rounded-full bg-cyan-400/15 border border-cyan-400/30 flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 text-cyan-400" strokeWidth={3} />
                        </span>
                      ) : (
                        <span className="w-5 h-5 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center shrink-0">
                          <X className="w-3 h-3 text-slate-600" strokeWidth={3} />
                        </span>
                      )}
                      <span className={f.included ? "text-slate-200" : "text-slate-600 line-through"}>{f.label}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Add-ons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mt-12 sm:mt-16 md:mt-20"
          >
            <div className="flex items-baseline gap-3 sm:gap-4 mb-6 sm:mb-8">
              <h4 className="text-lg sm:text-2xl md:text-3xl font-bold text-white tracking-tight">Popular Add-Ons</h4>
              <div className="flex-1 h-[1px] bg-gradient-to-r from-white/15 to-transparent" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
              {addOns.map((addon) => (
                <div key={addon.name} className="flex items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-cyan-400/30 transition-all group">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-cyan-400 group-hover:shadow-[0_0_8px_rgba(0,240,255,0.8)] transition-all shrink-0" />
                    <span className="text-slate-200 font-medium text-xs sm:text-sm truncate">{addon.name}</span>
                  </div>
                  <span className="font-['JetBrains_Mono'] text-xs sm:text-sm text-cyan-400 whitespace-nowrap ml-2">{addon.price}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us — with 3D orbit background */}
      <section id="why" className="py-16 sm:py-24 md:py-32 relative min-h-screen sm:min-h-[800px] flex items-center overflow-hidden border-y border-white/5">
        <LazyBackdrop>
          <Canvas camera={{ position: [0, 0, 10], fov: 50 }} gl={{ antialias: false, alpha: true }} dpr={1}>
            <Suspense fallback={null}>
              <ambientLight intensity={0.2} />
              <pointLight position={[10, 10, 10]} intensity={1.5} color="#00f0ff" />
              <pointLight position={[-10, -10, -10]} intensity={1} color="#a020f0" />
              <SkillOrbit />
              <Stars radius={50} depth={20} count={600} factor={3} saturation={0} fade />
              <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
            </Suspense>
          </Canvas>
        </LazyBackdrop>
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[#030305]/60 via-transparent to-[#030305]/60 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-10 sm:mb-12 md:mb-14 text-center pointer-events-none"
          >
            <h2 className="font-['JetBrains_Mono'] text-lime-400 mb-4 sm:mb-6 tracking-widest text-xs sm:text-sm uppercase">The difference</h2>
            <h3 className="text-2xl sm:text-4xl md:text-6xl font-bold text-white tracking-tighter">Why Choose Us</h3>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
            {reasons.map((reason, idx) => (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="p-4 sm:p-5 md:p-7 rounded-2xl sm:rounded-3xl border border-white/10 bg-black/50 backdrop-blur-2xl hover:border-white/20 transition-colors"
              >
                <div className="w-10 sm:w-11 md:w-12 h-10 sm:h-11 md:h-12 rounded-lg sm:rounded-2xl bg-white/5 flex items-center justify-center mb-4 sm:mb-5 md:mb-6 border border-white/10">
                  {reason.icon}
                </div>
                <h4 className="text-base sm:text-lg font-bold text-white mb-2 sm:mb-3">{reason.title}</h4>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-light">{reason.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="pt-16 sm:pt-24 md:pt-32 pb-8 sm:pb-10 md:pb-12 px-4 sm:px-6 relative z-10 border-t border-white/10 overflow-hidden">
        {/* 3D backdrop */}
        <LazyBackdrop><ContactBackdrop3D /></LazyBackdrop>
        <div className="absolute inset-0 z-[1] pointer-events-none">
          <div className="absolute bottom-[-50%] left-1/2 -translate-x-1/2 w-[100vw] h-[100vw] bg-gradient-to-t from-cyan-900/20 to-transparent rounded-full blur-[100px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#030305]/40 via-transparent to-[#030305]/50" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-10 sm:mb-12 md:mb-14"
          >
            <h2 className="font-['JetBrains_Mono'] text-cyan-400 mb-4 sm:mb-6 tracking-widest text-xs sm:text-sm uppercase">Get in touch</h2>
            <h3 className="text-2xl sm:text-4xl md:text-6xl font-bold text-white tracking-tighter mb-3 sm:mb-4">Let's Get Started</h3>
            <p className="text-sm sm:text-base md:text-lg text-slate-400 max-w-2xl mx-auto font-light">Ready to transform your business? Drop us a message and let's build something amazing together!</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-7 md:gap-8">
            {/* Form */}
            <motion.form
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              onSubmit={handleContactSubmit}
              data-testid="contact-form"
              className="lg:col-span-3 p-4 sm:p-6 md:p-8 lg:p-10 rounded-xl sm:rounded-2xl md:rounded-[2rem] border border-white/10 bg-black/40 backdrop-blur-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none" />
              <AnimatePresence>
                {submitted && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    data-testid="contact-success"
                    className="relative z-10 mb-3 sm:mb-4 md:mb-5 flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-cyan-500/10 border border-cyan-400/30 text-cyan-100"
                  >
                    <Check className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-cyan-400 shrink-0" />
                    <span className="text-xs sm:text-sm font-medium">Thanks — your message is in. We'll reach out within 24 hours.</span>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="relative z-10 grid gap-3 sm:gap-4 md:gap-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-5">
                  <div>
                    <label className="block font-['JetBrains_Mono'] text-[8px] sm:text-[9px] md:text-[10px] tracking-widest uppercase text-slate-500 mb-1.5 sm:mb-2">Your Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="Jane Doe"
                      data-testid="input-name"
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder:text-slate-600 focus:border-cyan-400/60 focus:bg-white/[0.05] focus:outline-none transition-all text-sm touch-manipulation"
                    />
                  </div>
                  <div>
                    <label className="block font-['JetBrains_Mono'] text-[8px] sm:text-[9px] md:text-[10px] tracking-widest uppercase text-slate-500 mb-1.5 sm:mb-2">Your Phone number</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="(123) 456-7890"
                      data-testid="input-phone"
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder:text-slate-600 focus:border-cyan-400/60 focus:bg-white/[0.05] focus:outline-none transition-all text-sm touch-manipulation"
                    />
                  </div>
                  <div>
                    <label className="block font-['JetBrains_Mono'] text-[8px] sm:text-[9px] md:text-[10px] tracking-widest uppercase text-slate-500 mb-1.5 sm:mb-2">Your Email</label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="jane@company.com"
                      data-testid="input-email"
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder:text-slate-600 focus:border-cyan-400/60 focus:bg-white/[0.05] focus:outline-none transition-all text-sm touch-manipulation"
                    />
                  </div>

                </div>
                <div>
                  <label className="block font-['JetBrains_Mono'] text-[8px] sm:text-[9px] md:text-[10px] tracking-widest uppercase text-slate-500 mb-1.5 sm:mb-2">Tell us about your project</label>
                  <textarea
                    rows={4}
                    name="message"
                    required
                    placeholder="What are you looking to build?"
                    data-testid="input-message"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder:text-slate-600 focus:border-cyan-400/60 focus:bg-white/[0.05] focus:outline-none transition-all resize-none text-sm touch-manipulation"
                  />
                </div>
                <button
                  type="submit"
                  className="group inline-flex items-center justify-center gap-2 sm:gap-3 px-5 sm:px-8 py-2.5 sm:py-4 bg-white text-black hover:bg-cyan-50 rounded-full text-xs sm:text-sm font-bold font-['JetBrains_Mono'] uppercase tracking-widest transition-all active:scale-95 touch-manipulation"
                >
                  <Send className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                  Send Message
                  <ArrowRight className="w-3.5 sm:w-4 h-3.5 sm:h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.form>

            {/* Contact details */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-2 flex flex-col gap-3 sm:gap-4"
            >
              <div className="p-4 sm:p-5 md:p-7 rounded-xl sm:rounded-2xl md:rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-md">
                <h4 className="text-base sm:text-lg md:text-xl font-bold text-white mb-1.5 sm:mb-2">Need Guidance?</h4>
                <p className="text-slate-400 text-xs sm:text-sm font-light leading-relaxed">
                  Have questions about our services? Our team is here to help you find the perfect solution for your business needs.
                </p>
              </div>

              <a href="mailto:reactjsaiwebcrafting@gmail.com" className="group flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 md:p-5 rounded-lg sm:rounded-xl md:rounded-2xl border border-white/10 bg-white/[0.02] hover:border-cyan-400/40 hover:bg-cyan-500/[0.04] transition-all active:scale-95 touch-manipulation">
                <div className="w-9 sm:w-10 md:w-11 h-9 sm:h-10 md:h-11 rounded-lg sm:rounded-xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center shrink-0">
                  <Mail className="w-4 sm:w-5 h-4 sm:h-5 text-cyan-400" />
                </div>
                <div className="min-w-0">
                  <div className="font-['JetBrains_Mono'] text-[8px] sm:text-[9px] md:text-[10px] tracking-widest uppercase text-slate-500">Email Us</div>
                  <div className="text-white font-medium truncate text-xs sm:text-sm">reactjsaiwebcrafting@gmail.com</div>
                </div>
              </a>

              <a href="tel:+917558397248" className="group flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 md:p-5 rounded-lg sm:rounded-xl md:rounded-2xl border border-white/10 bg-white/[0.02] hover:border-violet-400/40 hover:bg-violet-500/[0.04] transition-all active:scale-95 touch-manipulation">
                <div className="w-9 sm:w-10 md:w-11 h-9 sm:h-10 md:h-11 rounded-lg sm:rounded-xl bg-violet-500/10 border border-violet-400/20 flex items-center justify-center shrink-0">
                  <Phone className="w-4 sm:w-5 h-4 sm:h-5 text-violet-400" />
                </div>
                <div>
                  <div className="font-['JetBrains_Mono'] text-[8px] sm:text-[9px] md:text-[10px] tracking-widest uppercase text-slate-500">Call Us</div>
                  <div className="text-white font-medium text-xs sm:text-sm">+91 75583 97248</div>
                </div>
              </a>

              <a href="https://wa.me/917558397248" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 md:p-5 rounded-lg sm:rounded-xl md:rounded-2xl border border-white/10 bg-white/[0.02] hover:border-[#25D366]/40 hover:bg-[#25D366]/[0.06] transition-all active:scale-95 touch-manipulation">
                <div className="w-9 sm:w-10 md:w-11 h-9 sm:h-10 md:h-11 rounded-lg sm:rounded-xl bg-[#25D366]/10 border border-[#25D366]/30 flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 32 32" className="w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6" aria-hidden="true">
                    <path fill="#25D366" d="M16.003 3C9.374 3 4 8.373 4 15c0 2.385.696 4.61 1.897 6.484L4 29l7.703-1.86A11.94 11.94 0 0 0 16.003 27C22.63 27 28 21.627 28 15S22.63 3 16.003 3z" />
                    <path fill="#FFFFFF" d="M21.93 18.86c-.32-.16-1.88-.93-2.17-1.04-.29-.11-.5-.16-.71.16-.21.32-.81 1.04-.99 1.25-.18.21-.36.24-.68.08-.32-.16-1.34-.49-2.55-1.57-.94-.84-1.58-1.88-1.76-2.2-.18-.32-.02-.49.14-.65.14-.14.32-.36.48-.54.16-.18.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.71-1.71-.97-2.34-.26-.62-.52-.54-.71-.55-.18-.01-.4-.01-.61-.01-.21 0-.56.08-.85.4-.29.32-1.11 1.08-1.11 2.64 0 1.56 1.13 3.07 1.29 3.28.16.21 2.23 3.41 5.4 4.78.75.32 1.34.51 1.8.65.76.24 1.45.21 2 .13.61-.09 1.88-.77 2.15-1.51.27-.74.27-1.38.19-1.51-.08-.13-.29-.21-.61-.37z" />
                  </svg>
                </div>
                <div>
                  <div className="font-['JetBrains_Mono'] text-[8px] sm:text-[9px] md:text-[10px] tracking-widest uppercase text-slate-500">WhatsApp</div>
                  <div className="text-white font-medium text-xs sm:text-sm">+91 75583 97248</div>
                </div>
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-black/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-10">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10 mb-4 sm:mb-5 md:mb-6">
            <div className="col-span-2 sm:col-span-1">
              <a href="#top" className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 group">
                <div className="w-10 sm:w-12 h-10 sm:h-12 flex items-center justify-center overflow-hidden">
                  <img src="/logo.png" alt="Logo" className="w-full h-full object-cover scale-125" />
                </div>
                <div className="font-bold text-white tracking-tight text-sm sm:text-base">REACT.JS.AI</div>
              </a>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-light mb-3 sm:mb-4">
                Building beautiful, fast, and scalable websites for modern businesses.
              </p>
              <div className="font-['JetBrains_Mono'] text-[8px] sm:text-xs text-cyan-400 tracking-widest uppercase">Think. Code. Launch.</div>
            </div>

            <div>
              <h5 className="font-['JetBrains_Mono'] text-[8px] sm:text-[9px] md:text-[10px] tracking-widest uppercase text-slate-500 mb-3 sm:mb-4">Services</h5>
              <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                {["Website Development", "E-Commerce", "Web Applications", "UI/UX Design"].map((item) => (
                  <li key={item}>
                    <a href="#services" className="text-slate-300 hover:text-cyan-400 transition-colors duration-300">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="font-['JetBrains_Mono'] text-[8px] sm:text-[9px] md:text-[10px] tracking-widest uppercase text-slate-500 mb-3 sm:mb-4">Quick Links</h5>
              <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                {[
                  { label: "Services", href: "#services" },
                  { label: "Pricing", href: "#pricing" },
                  { label: "Blog", href: "#" }
                ].map((item) => (
                  <li key={item.label}>
                    <a href={item.href} className="text-slate-300 hover:text-violet-400 transition-colors duration-300">{item.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="font-['JetBrains_Mono'] text-[8px] sm:text-[9px] md:text-[10px] tracking-widest uppercase text-slate-500 mb-3 sm:mb-4">Company</h5>
              <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                {["About Us", "Blog"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-slate-300 hover:text-lime-400 transition-colors duration-300">{item}</a>
                  </li>
                ))}
              </ul>
              <div className="mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-white/10">
                <h5 className="font-['JetBrains_Mono'] text-[8px] sm:text-[9px] md:text-[10px] tracking-widest uppercase text-slate-500 mb-2 sm:mb-3">Get in Touch</h5>
                <a href="mailto:reactjsaiwebcrafting@gmail.com" className="block text-xs sm:text-sm text-slate-300 hover:text-cyan-400 transition-colors duration-300 mb-1 break-all">reactjsaiwebcrafting@gmail.com</a>
                <a href="tel:+917558397248" className="block text-xs sm:text-sm text-slate-300 hover:text-cyan-400 transition-colors duration-300">+91 75583 97248</a>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-4 sm:pt-5 md:pt-6 border-t border-white/10 gap-2 sm:gap-3">
            <p className="font-['JetBrains_Mono'] text-[8px] sm:text-xs text-slate-500 tracking-wider text-center md:text-left">
              © {new Date().getFullYear()} React.js.ai. All rights reserved. Made with care by our team.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
