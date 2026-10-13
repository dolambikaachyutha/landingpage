import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sparkles, Stars } from '@react-three/drei';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { ArrowRight, MoveRight, Play, Sparkles as SparklesIcon } from 'lucide-react';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

const cardData = [
  {
    name: 'AETHER',
    label: 'Chrome Core',
    accent: '#8fe7ff',
    description: 'Liquid-metal symmetry with atmospheric bloom and cinematic reflections.',
    shape: 'sphere',
  },
  {
    name: 'LUMOSA',
    label: 'Glass Pulse',
    accent: '#8d7cff',
    description: 'Translucent geometry tuned to amplify ambient light and motion depth.',
    shape: 'torus',
  },
  {
    name: 'NEXUS',
    label: 'Crystalline Flow',
    accent: '#7cf3d4',
    description: 'A precise lattice of energy lines built to feel alive as you scroll.',
    shape: 'octa',
  },
  {
    name: 'ORBITAL',
    label: 'Void Ring',
    accent: '#ffb4a2',
    description: 'An elegant loop that anchors motion with soft dusk-toned velocity.',
    shape: 'ring',
  },
];

function HeroScene() {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (!group.current) return;

    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, state.pointer.x * 0.8, 0.04);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, state.pointer.y * -0.5, 0.04);
    group.current.position.y = Math.sin(t * 1.2) * 0.3;
    group.current.position.z = Math.cos(t * 1.1) * 0.2;
  });

  return (
    <>
      <color attach="background" args={['#040816']} />
      <fog attach="fog" args={['#040816', 10, 25]} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 4, 2]} intensity={1.8} color="#b4d7ff" />
      <pointLight position={[-3, -1, 3]} intensity={12} color="#8d7cff" />
      <pointLight position={[2, 2, -2]} intensity={10} color="#6aeaff" />
      <Stars radius={35} depth={18} count={2500} factor={4} fade speed={1.5} />
      <Sparkles count={140} scale={[10, 6, 8]} size={3.4} speed={0.35} color="#9fe6ff" />

      <group ref={group}>
        <Float speed={2.2} rotationIntensity={0.9} floatIntensity={1.2}>
          <mesh position={[0, 0.6, 0]}>
            <icosahedronGeometry args={[1.4, 1]} />
            <MeshDistortMaterial color="#8ce5ff" emissive="#2f8cff" emissiveIntensity={0.6} roughness={0.1} metalness={0.8} distort={0.4} speed={2.5} />
          </mesh>
        </Float>

        <Float speed={2.1} rotationIntensity={1.1} floatIntensity={0.9}>
          <mesh position={[-3.1, -0.8, -1.5]} rotation={[0.8, 0.3, 0.5]}>
            <torusGeometry args={[1, 0.2, 24, 180]} />
            <meshStandardMaterial color="#d7dcff" metalness={0.9} roughness={0.18} emissive="#6659ff" emissiveIntensity={0.5} />
          </mesh>
        </Float>

        <Float speed={2.5} rotationIntensity={1.3} floatIntensity={1.5}>
          <mesh position={[2.9, -0.3, -2.3]} rotation={[0.5, 1.1, 0.2]}>
            <octahedronGeometry args={[1.2, 0]} />
            <meshStandardMaterial color="#7bf0ff" metalness={0.4} roughness={0.2} emissive="#08d1ff" emissiveIntensity={0.6} />
          </mesh>
        </Float>

        <OrbitingCluster />
      </group>
    </>
  );
}

function GalleryObject({ shape, color }: { shape: string; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += 0.01;
    meshRef.current.rotation.y += 0.015;
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime + meshRef.current.position.x) * 0.1;
  });

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      {shape === 'sphere' && <sphereGeometry args={[0.78, 40, 40]} />}
      {shape === 'torus' && <torusGeometry args={[0.7, 0.18, 20, 180]} />}
      {shape === 'octa' && <octahedronGeometry args={[0.8, 0]} />}
      {shape === 'ring' && <ringGeometry args={[0.55, 0.82, 64]} />}
      <meshStandardMaterial color={color} metalness={0.9} roughness={0.15} emissive={color} emissiveIntensity={0.7} />
    </mesh>
  );
}

function OrbitingCluster() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.4;
    groupRef.current.rotation.x = state.clock.elapsedTime * 0.2;
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: 14 }, (_, index) => {
        const angle = (index / 14) * Math.PI * 2;
        const radius = 3.6 + (index % 5) * 0.5;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle * 1.7) * 1.35;
        const z = Math.sin(angle) * radius * 0.8;

        return (
          <Float key={index} speed={1.8 + (index % 4) * 0.6} rotationIntensity={1.8} floatIntensity={1.1}>
            <mesh position={[x, y, z]}>
              <icosahedronGeometry args={[0.18 + (index % 3) * 0.05, 0]} />
              <meshStandardMaterial
                color={index % 2 === 0 ? '#8fe7ff' : '#b89cff'}
                emissive={index % 2 === 0 ? '#3aa7ff' : '#8d7cff'}
                emissiveIntensity={1.2}
                metalness={0.85}
                roughness={0.18}
              />
            </mesh>
          </Float>
        );
      })}
    </group>
  );
}

function App() {
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const rafId = requestAnimationFrame(raf);

    gsap.utils.toArray<HTMLElement>('.parallax-layer').forEach((layer) => {
      gsap.to(layer, {
        yPercent: -18,
        ease: 'none',
        scrollTrigger: {
          trigger: '.landscape',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    });

    const storyProgressLine = document.querySelector<HTMLElement>('.story-progress-line');
    if (storyProgressLine) {
      gsap.to(storyProgressLine, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: '.story',
          start: 'top center',
          end: 'bottom center',
          scrub: true,
        },
      });
    }

    gsap.utils.toArray<HTMLElement>('.story-stage').forEach((stage) => {
      gsap.fromTo(
        stage,
        { opacity: 0.3, y: 30 },
        {
          opacity: 1,
          y: 0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: stage,
            start: 'top 75%',
            end: 'bottom 50%',
            toggleActions: 'play none none reverse',
          },
        },
      );
    });

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const { innerWidth, innerHeight } = window;
    pointer.current.x = (event.clientX / innerWidth - 0.5) * 2;
    pointer.current.y = (event.clientY / innerHeight - 0.5) * 2;
    document.documentElement.style.setProperty('--cursor-x', `${pointer.current.x}`);
    document.documentElement.style.setProperty('--cursor-y', `${pointer.current.y}`);
  };

  return (
    <div className="page-shell" onPointerMove={handlePointerMove}>
      <header className="topbar">
        <div className="brand-mark">
          <span className="brand-dot" />
          QUANTUM DRIFT
        </div>
        <nav className="main-nav">
          <a href="#story">Story</a>
          <a href="#gallery">Gallery</a>
          <a href="#experience">Experience</a>
          <a href="#contact">Contact</a>
        </nav>
        <button className="nav-button">Launch</button>
      </header>

      <main>
        <motion.section
          className="hero panel"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        >
          <div className="hero-glow" />
          <div className="hero-copy">
            <span className="eyebrow">
              <SparklesIcon size={14} /> A future-built journey
            </span>
            <h1>
              SCROLL <span>BEYOND</span>
              <br />
              REALITY.
            </h1>
            <p>
              An interactive journey through depth, motion, and imagination.
            </p>
            <div className="cta-row">
              <button className="primary-cta">
                Explore the Experience <ArrowRight size={18} />
              </button>
              <button className="secondary-cta">
                <Play size={16} /> Watch Vision
              </button>
            </div>
            <div className="ambient-pills" aria-hidden="true">
              <span className="float-pill pill-1">Depth</span>
              <span className="float-pill pill-2">Motion</span>
              <span className="float-pill pill-3">Energy</span>
            </div>
          </div>

          <div className="hero-viewport">
            <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
              <HeroScene />
            </Canvas>
          </div>

          <div className="scroll-hint">
            <span>Scroll</span>
            <div className="scroll-line" />
          </div>
        </motion.section>

        <section className="landscape panel" id="story">
          <div className="section-header compact">
            <span className="eyebrow dark">Depth in motion</span>
            <h2>Layered space, shaped by time.</h2>
          </div>

          <div className="landscape-scene">
            <div className="parallax-layer far" />
            <div className="parallax-layer mid" />
            <div className="parallax-layer near" />
            <div className="parallax-layer particles" />

            <div className="landscape-copy">
              <p>
                We build worlds that move with intention—where every gradient, silhouette, and particle behaves like a living layer in a cinematic atmosphere.
              </p>
            </div>
          </div>
        </section>

        <section className="gallery panel" id="gallery">
          <div className="section-header">
            <span className="eyebrow dark">Object gallery</span>
            <h2>Three-dimensional forms tuned for wonder.</h2>
          </div>

          <div className="gallery-grid">
            {cardData.map((item) => (
              <article className="gallery-card" key={item.name}>
                <div className="object-stage" style={{ ['--accent' as string]: item.accent }}>
                  <Canvas camera={{ position: [0, 0, 4.5], fov: 42 }}>
                    <ambientLight intensity={1.5} />
                    <pointLight position={[2, 2, 2]} color={item.accent} intensity={12} />
                    <GalleryObject shape={item.shape} color={item.accent} />
                  </Canvas>
                </div>
                <div className="card-meta">
                  <span>{item.label}</span>
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="story panel" id="experience">
          <div className="story-header">
            <div className="story-track">
              <span className="story-progress-line" />
            </div>
            <div className="story-copy-block">
              <span className="eyebrow dark">Cinematic story</span>
              <h2>From quiet origin to infinite scale.</h2>
            </div>
          </div>

          <div className="story-columns">
            <div className="story-stage" data-index="0">
              <span className="stage-no">01</span>
              <h3>ORIGIN</h3>
              <p>Minimal darkness gives way to a heartbeat of particles and a careful invitation into the field.</p>
            </div>
            <div className="story-stage" data-index="1">
              <span className="stage-no">02</span>
              <h3>EXPANSION</h3>
              <p>Layers begin to move, lights intensify, and the scene arrives with confident weight and momentum.</p>
            </div>
            <div className="story-stage" data-index="2">
              <span className="stage-no">03</span>
              <h3>INFINITE</h3>
              <p>Depth becomes a universe of motion, where loops, glows, and parallel planes stretch beyond the frame.</p>
            </div>
          </div>
        </section>

        <section className="depth panel">
          <div className="depth-intro">
            <span className="eyebrow dark">Interactive depth</span>
            <h2>Move your cursor. Explore the space.</h2>
          </div>

          <div className="depth-scene">
            <div className="depth-grid">
              <div className="depth-card card-1">
                <span>Signal</span>
                <strong>01</strong>
              </div>
              <div className="depth-card card-2">
                <span>Drift</span>
                <strong>02</strong>
              </div>
              <div className="depth-card card-3">
                <span>Vector</span>
                <strong>03</strong>
              </div>
            </div>
            <div className="depth-orbit">
              <div className="orbit-ring ring-one" />
              <div className="orbit-ring ring-two" />
              <div className="orbit-core" />
            </div>
          </div>
        </section>

        <section className="editorial panel">
          <div className="headline-wrap">
            <h2>
              DEPTH IS NOT A <span>DIMENSION.</span>
            </h2>
            <h2>
              IT IS AN <span>EXPERIENCE.</span>
            </h2>
          </div>
        </section>

        <section className="final panel" id="contact">
          <div className="final-scene">
            <div className="final-glow" />
            <Canvas camera={{ position: [0, 0, 8], fov: 48 }}>
              <ambientLight intensity={1.1} />
              <directionalLight position={[3, 3, 4]} intensity={1.8} color="#8fe7ff" />
              <Float speed={2.8} rotationIntensity={1.2} floatIntensity={1.5}>
                <mesh position={[0, 0, 0]}>
                  <sphereGeometry args={[1.5, 48, 48]} />
                  <meshStandardMaterial color="#7aebff" emissive="#4e8cff" emissiveIntensity={0.75} roughness={0.12} metalness={0.78} />
                </mesh>
              </Float>
              <Float speed={2.5} rotationIntensity={1.5} floatIntensity={0.6}>
                <mesh position={[-2.5, -0.4, -1]} rotation={[0.5, 0.8, 0.3]}>
                  <torusGeometry args={[1.1, 0.18, 40, 200]} />
                  <meshStandardMaterial color="#dfe6ff" metalness={0.9} roughness={0.16} emissive="#8d7cff" emissiveIntensity={0.8} />
                </mesh>
              </Float>
              <Sparkles count={170} scale={[8, 6, 7]} size={3.2} speed={0.45} color="#e2f5ff" />
            </Canvas>
          </div>

          <div className="callout-box">
            <span className="eyebrow dark">Final destination</span>
            <h3>Step into a world built to feel alive.</h3>
            <button className="primary-cta">
              Begin the Journey <MoveRight size={18} />
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
