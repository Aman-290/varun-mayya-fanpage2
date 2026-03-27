import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';

gsap.registerPlugin(ScrollTrigger, TextPlugin);

export default function App() {
  const containerRef = useRef();
  const avatarRef = useRef();
  const viewsRef = useRef();
  const [serotonin, setSerotonin] = useState(100);
  const [isRedAlert, setIsRedAlert] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState(1);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Hero Area Animation
      const tl0 = gsap.timeline();
      tl0.to("#type-1", { duration: 1.2, text: 'initialize_dossier.exe --target', ease: 'none', delay: 0.5 })
         .to("#hero-title", { opacity: 1, duration: 0.5, ease: "power2.out" })
         .fromTo("#hero-title", { x: -20 }, { x: 0, duration: 0.5, ease: "back.out" }, "<")
         .to("#type-2", { duration: 0.8, text: 'LOADING AGI PROTOCOLS...', ease: 'none' })
         .to("#type-3", { duration: 2, text: 'BIO_STATUS: "Waiting for AGI. I live to experiment. Don\'t take me too seriously I am an idiot. Content, games, and tools."', ease: 'none' })
         .to("#type-4", { duration: 0.8, text: 'PRESS SCROLL TO SPAWN.', ease: 'none' });

      // Breathing animation for hero avatar
      gsap.to("#hero-avatar", {
        y: -30,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      // Setup Movement Triggers for the Avatar across levels
      // It starts initialized off-screen or invisible
      gsap.set(avatarRef.current, { autoAlpha: 0, y: -200, x: 0 });

      // (Master Visibility Trigger moved below pins to fix range calculation)

      // Horizontal Scroll Level 2
      gsap.to("#level2-scroll", {
        xPercent: -66.6, 
        ease: "none",
        scrollTrigger: {
          trigger: "#level2",
          pin: true,
          scrub: 1,
          start: "top top",
          end: "+=2000"
        }
      });

      // THE HUD DYNAMIC ENGINE (Views & Serotonin)
      const viewsProxy = { value: 0 };
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          // 1. Views Counter: Animate from 0 to 1B based on total scroll %
          const targetViews = Math.floor(self.progress * 1000000000);
          viewsRef.current.innerHTML = targetViews.toLocaleString() + "+";

          // 2. Serotonin Logic: Default is progress-linked, but Level 3 is a Crisis override
          // Check if we are inside Level 3
          const level3 = document.getElementById("level3");
          const l3Rect = level3.getBoundingClientRect();
          const isInLevel3 = l3Rect.top < window.innerHeight / 2 && l3Rect.bottom > window.innerHeight / 2;

          if (isInLevel3) {
            setSerotonin(10);
            setIsRedAlert(true);
          } else {
            setIsRedAlert(false);
            // Gradually fill bar as user progresses, or keep at 100 after Level 0
            setSerotonin(Math.max(20, Math.min(100, self.progress * 200))); 
          }
        }
      });

      // Boss Fight Level 3 Shake
      ScrollTrigger.create({
        trigger: "#level3",
        start: "top center",
        onEnter: () => {
          const r = () => Math.floor(Math.random() * 10) - 5;
          gsap.to("#level3-box", { x: r, y: r, duration: 0.1, yoyo: true, repeat: 10 });
        }
      });

      // NO LONGER NEEDED: Level 4 Exp Counter (Merged into HUD engine)
      
      // The Dojo Pin
      gsap.to("#dojo-scroll", {
        xPercent: -77.7, // (450vw - 100vw) / 450vw approx
        ease: "none",
        scrollTrigger: {
          trigger: "#dojo",
          pin: true,
          scrub: 1,
          start: "top top",
          end: "+=3000"
        }
      });

      const avatarMoves = {
        1: { x: 0, y: 300, scale: 1.8 },
        2: { x: "70vw", y: 350, scale: 1 },
        3: { x: 0, y: 350, scale: 1.8 },
        4: { x: "70vw", y: 350, scale: 1.8 },
        5: { x: 0, y: 400, scale: 1.8 }
      };

      // Unified Visibility Control: Show avatar ONLY between Level 1 and Level 5
      // Placed after pins to ensure correct coordinates for Level 4/5
      ScrollTrigger.create({
        trigger: "#level1",
        start: "top center",
        endTrigger: "#level5",
        end: "bottom center",
        onToggle: (self) => {
          gsap.to(avatarRef.current, { 
            autoAlpha: self.isActive ? 1 : 0, 
            duration: 0.4, 
            overwrite: 'auto' 
          });
        },
        onLeaveBack: () => {
          gsap.to(avatarRef.current, { 
            autoAlpha: 0, 
            duration: 0.4, 
            overwrite: 'auto', 
            y: -200,
            x: 0,
            scale: 1 
          });
        }
      });

      [1, 2, 3, 4, 5].forEach((level) => {
        ScrollTrigger.create({
          trigger: `#level${level}`,
          start: "top center",
          end: "bottom center",
          onEnter: () => {
             setCurrentAvatar(level);
             gsap.to(avatarRef.current, { 
               x: avatarMoves[level].x, 
               y: avatarMoves[level].y, 
               scale: avatarMoves[level].scale,
               duration: 0.5, 
               ease: "power1.inOut",
               overwrite: 'auto'
             });
          },
          onEnterBack: () => {
             setCurrentAvatar(level);
             gsap.to(avatarRef.current, { 
               x: avatarMoves[level].x, 
               y: avatarMoves[level].y, 
               scale: avatarMoves[level].scale,
               duration: 0.5, 
               ease: "power1.inOut",
               overwrite: 'auto'
             });
          }
        });
      });

    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="w-full relative bg-bg-void font-mono overflow-hidden">
      
      {/* HUD HEADER */}
      <header className="fixed top-0 w-full z-[100] bg-black/80 backdrop-blur-md border-b border-white/10 flex justify-between px-6 py-4 items-center">
        <div className="flex flex-col gap-1 w-1/3">
          <span className="text-xs font-pixel text-white/70">SEROTONIN</span>
          <div className={`h-2 w-full rounded-full border border-white/20 transition-all duration-300 ${isRedAlert ? 'animate-pulse border-neon-red' : ''}`}>
            <div className={`h-full rounded-full transition-all duration-[2s] ${isRedAlert ? 'bg-neon-red' : 'bg-neon-green'}`} style={{width: `${serotonin}%`}}></div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-xs font-pixel text-white/70 tracking-widest">VIEWS / EXP</span>
          <span ref={viewsRef} className="text-2xl font-mono text-neon-gold font-bold">0</span>
        </div>
      </header>

      {/* DYNAMIC PLAYER AVATAR */}
      <div ref={avatarRef} className="fixed left-[8vw] top-0 z-50 pointer-events-none flex justify-center items-center origin-center">
        {/* Real Avatar Box - Large Square */}
        <div className="relative w-40 h-40 overflow-hidden border-2 border-neon-green shadow-[0_0_20px_#00f5a0] bg-black isolate rounded-lg transition-all duration-300">
          <img src={`/level/level${currentAvatar}.png`} alt={`Level ${currentAvatar}`} className="w-full h-full object-cover" />
        </div>
      </div>

      {/* LEVEL 0: THE TERMINAL BOOTUP */}
      <section id="level0" className="h-screen w-full relative flex items-center justify-center px-8 border-b border-white/5 bg-black overflow-hidden">
        {/* CRT Background Layer */}
        <div className="absolute inset-0 z-0 select-none">
          <img src="/crt.gif" className="w-full h-full object-cover opacity-90 terminal-glow grayscale brightness-[0.15] blur-[1px]" />
          <div className="crt-overlay"></div>
          <div className="scanline"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/80"></div>
        </div>

        <div className="z-10 w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          {/* Terminal Text Block */}
          <div className="w-full md:w-3/5 space-y-6">
            <div className="inline-block px-3 py-1 bg-neon-green/20 border border-neon-green/40 rounded text-[10px] font-pixel text-neon-green animate-pulse">
              SYSTEM STATUS: ONLINE // AGI_CORE_LOADED
            </div>
            
            <div className="font-mono space-y-8">
              <div className="flex gap-4 items-start text-xl md:text-2xl">
                <span className="text-neon-green flex-shrink-0">C:\&gt;</span>
                <span id="type-1" className="text-white/80"></span>
              </div>

              {/* Central Emphasis Area */}
              <div className="pl-12 py-4">
                 <h1 id="hero-title" className="text-6xl md:text-8xl font-header font-bold text-white tracking-tighter leading-none opacity-0 glitch-hover" data-text="VARUN MAYYA">
                    VARUN <span className="text-neon-green drop-shadow-[0_0_20px_#00f5a0]">MAYYA</span>
                 </h1>
                 <div id="type-2" className="text-neon-green font-bold text-lg mt-4 min-h-7"></div>
              </div>

              <div className="pl-12 space-y-4">
                <div id="type-3" className="text-white/70 border-l-2 border-white/10 pl-6 py-2 italic font-cinematic text-lg max-w-lg"></div>
                
                <div className="flex items-center gap-6 group">
                  <div className="w-8 h-[1px] bg-neon-green/20"></div>
                  <div id="type-4" className="text-[11px] font-pixel tracking-[0.4em] text-neon-green/50"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Portrait */}
          <div className="w-full md:w-2/5 flex justify-center relative">
             <div className="absolute inset-0 bg-neon-green/10 blur-[130px] rounded-full scale-75 animate-pulse"></div>
             <div id="hero-avatar" className="relative drop-shadow-[0_0_60px_rgba(0,255,160,0.3)]">
               <img src="/hero-avatar.png" alt="Hero Avatar" className="w-[420px] h-auto drop-shadow-2xl brightness-110 filter contrast-110" />
             </div>
          </div>
        </div>
      </section>

      {/* LEVEL 1: AVATAR LEFT, CONTENT RIGHT */}
      <section id="level1" className="min-h-screen relative flex items-center py-24 px-8 border-b border-white/5 bg-black">
        <div className="absolute inset-0 z-0">
          <img src="/pixel_bedroom_1774574653249.png" className="w-full h-full object-cover opacity-20" />
          <img src="/banglore-skyline.png" className="absolute bottom-0 right-0 w-full h-1/2 object-contain opacity-10 mix-blend-screen" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent"></div>
        </div>
        <div className="z-10 w-full flex justify-end md:pr-[5vw]">
          <div className="max-w-2xl space-y-6">
            <h1 className="text-4xl md:text-5xl font-header text-neon-green uppercase mb-12 glitch-hover" data-text="LEVEL 1: THE KID WHO WANTED TO BE SUPERMAN">LEVEL 1: THE KID WHO WANTED TO BE SUPERMAN</h1>
            <div className="bg-bg-panel/90 p-6 md:p-8 rounded-xl border border-white/10 backdrop-blur-sm space-y-4 shadow-xl">
              <div className="flex items-center gap-4 mb-4">
                <img src="/Brokai_logo.png" className="w-12 h-12 rounded object-contain border border-white/10" alt="Brokai" />
                <span className="text-xs font-pixel text-neon-green animate-pulse tracking-tighter">EST. 1993 // BENGALURU</span>
              </div>
              <p className="font-mono text-sm leading-loose">
                Born Feb 22, 1993, Bengaluru. Father: ENT surgeon from Bantwal. Mother: Chartered Accountant at ICICI for 26 years.
              </p>
              <p className="font-mono text-sm"><span className="text-neon-gold">Equipped Item:</span> Compaq Presario (Age 11, circa 2004).</p>
              <p className="font-mono text-sm"><span className="text-neon-gold">Grind Stats:</span> 10 hours a day on the computer. Self-taught coding. Built games using raycaster engines (Genesis3D/RealityFactory).</p>
              <blockquote className="border-l-4 border-white/30 pl-4 py-2 font-cinematic text-xl text-white/80 italic mt-6">
                "You need to drink Bombay water if you want to experience the hardships of life." - Mother's Lore
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* LEVEL 2: AVATAR RIGHT, CONTENT LEFT */}
      <section id="level2" className="h-screen relative bg-bg-void overflow-hidden flex items-center border-b border-white/5">
        <div className="absolute inset-0 z-0">
          <img src="/startup_garage_1774574674792.png" className="w-full h-full object-cover opacity-10" />
        </div>
        
        <div id="level2-scroll" className="flex w-[300vw] h-full items-center relative z-10">
          
          <div className="w-[100vw] flex-shrink-0 flex items-center justify-start pl-[5vw] pr-[40vw]">
             <div>
              <h1 className="text-5xl md:text-7xl font-header font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-green to-blue-500 uppercase tracking-tight glitch-hover" data-text="LEVEL 2: THE SPEEDRUN">
                LEVEL 2: THE SPEEDRUN<br/>
                <span className="text-4xl text-white/50">(COLLEGE TO VC)</span>
              </h1>
              <div className="flex gap-4 mt-8">
                <img src="/Aeos Group logo.jpg" className="w-16 h-16 rounded border border-white/10" />
                <img src="/YAAS Media logo.jpg" className="w-16 h-16 rounded border border-white/10" />
              </div>
            </div>
          </div>
          
          <div className="w-[100vw] flex-shrink-0 flex items-center pl-[5vw] pr-[40vw]">
            <div className="bg-bg-panel border-2 border-white/10 p-10 rounded-2xl w-full foil-card relative overflow-hidden">
               <img src="/aevytvlogo.jpg" className="absolute -right-8 -top-8 w-32 h-32 opacity-10 rotate-12" />
               <h2 className="font-pixel text-md text-neon-gold mb-6 relative z-10">QUEST 1: SIZR Studios (Age 19)</h2>
               <p className="text-lg leading-relaxed text-white/80 relative z-10">
                T-shirt company turned oDesk freelance dev. Billed $100/hr.<br/>
                Revenue: ₹30 Lakhs (~$36,000).<br/><br/>
                <span className="text-neon-green font-bold text-xl">Outcome: ✓ FUNDED THE NEXT STAGE.</span>
              </p>
            </div>
          </div>
          
          <div className="w-[100vw] flex-shrink-0 flex items-center pl-[5vw] pr-[40vw]">
            <div className="bg-bg-panel border-2 border-neon-gold/50 p-10 rounded-2xl w-full shadow-[0_0_30px_rgba(245,166,35,0.2)] foil-card">
              <h2 className="font-pixel text-md text-neon-gold mb-6">QUEST 2: Jobspire (Age 20)</h2>
              <p className="text-lg leading-relaxed text-white/80">
                Co-founded recruitment platform. Scaled to 190,000 applicants, 1,500+ companies (Uber, Swiggy). Served 4M+ requests.
              </p>
              <div className="my-6 p-4 bg-black/40 border border-neon-gold/30 rounded">
                <span className="block text-neon-gold font-pixel text-xs mb-2">Achievement Unlocked:</span>
                Raised $262,000 (₹1.7 crore) Seed from Purvi Capital.
              </div>
              <p className="text-neon-green font-bold text-xl">Outcome: ✓ ACQUIRED by TurnToTech (2017).</p>
            </div>
          </div>
          
        </div>
      </section>

      {/* LEVEL 3: AVATAR LEFT, CONTENT RIGHT */}
      <section id="level3" className="min-h-screen relative flex items-center py-32 px-8 border-b border-neon-red/30 bg-black overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/boss_skull_1774574898656.png" className="w-full h-full object-cover opacity-20 mix-blend-screen" />
          <div className={`absolute inset-0 transition-opacity duration-300 ${isRedAlert ? 'bg-red-900/10' : 'bg-transparent'}`}></div>
        </div>
        <div className="z-10 w-full flex justify-end md:pr-[5vw]">
          <div id="level3-box" className={`w-full max-w-3xl rounded-none border-4 ${isRedAlert ? 'border-neon-red shadow-[0_0_50px_#ff3b5c]' : 'border-white/10'} bg-black/80 p-10 relative overflow-hidden`}>
            <div className="absolute top-0 right-0 p-4 font-mono text-neon-red font-bold uppercase tracking-widest text-xl animate-pulse">
              ! CRITICAL WARNING !
            </div>
            <h1 className="text-5xl font-header text-red-500 uppercase mb-4 glitch-text glitch-hover" data-text="LEVEL  3: AVALON">LEVEL 3: AVALON</h1>
            <div className="bg-red-950/40 text-red-200 border-l-4 border-red-500 p-4 mb-8 font-mono">
              *WARNING: RUNWAY DEPLETED. DECEMBER SALARIES DUE.*
            </div>
            <p className="text-lg mb-6 text-white/80">
              Avalon Labs grew to 50 employees and $1M+ in revenue, but hit a near-death runway exhaustion.
            </p>
            <div className="border border-white/20 p-6 rounded mb-8 bg-black/40">
              <span className="text-neon-green font-bold">Outcome:</span> Called every contact. Closed 2 deals in the last 10 days of December. Survived.
            </div>
            <div className="border-t border-white/20 pt-8 mt-8 flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1">
                <h2 className="text-3xl font-header text-white mb-4 uppercase">PIVOT: Avalon Meta -{'>'} Scenes</h2>
                <p className="text-white/70 mb-4 text-sm">Raised $420,000. Reached 45,000 community members. Backed by Gaurav Munjal, Tanmay Bhat.</p>
                <div className="inline-block px-6 py-3 bg-red-900/50 border border-red-500 text-white font-bold tracking-widest text-xs">
                  Acquired by Unacademy's Graphy (June 2023).
                </div>
              </div>
              <img src="/Overpowered channel logo.jpg" className="w-24 h-24 border-2 border-neon-red shadow-[0_0_20px_rgba(255,59,92,0.5)] rounded-full animate-bounce" />
            </div>
          </div>
        </div>
      </section>

      {/* LEVEL 4: AVATAR RIGHT, CONTENT LEFT */}
      <section id="level4" className="min-h-screen relative flex items-center py-32 px-8 border-b border-white/10 bg-[#06060c]">
        <div className="absolute inset-0 z-0 opacity-20 flex pointer-events-none">
           <img src="/The Content Creator Handbook — book cover image.jpg" className="w-48 h-auto rotate-12 -translate-x-10 translate-y-20" />
           <img src="/Pyjama Profit — book cover image.jpg" className="w-48 h-auto -rotate-12 translate-x-40 translate-y-60" />
        </div>
        <div className="absolute inset-0 z-0">
          <img src="/cyberpunk_servers_1774574922251.png" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#06060c] via-transparent to-[#06060c]"></div>
        </div>
        <div className="z-10 w-full flex justify-start pl-[5vw] md:pl-[5vw]">
          <div className="w-full max-w-4xl backdrop-blur-md bg-[#0a0f18]/80 border border-blue-500/30 p-10 rounded-3xl shadow-[0_0_40px_rgba(0,100,255,0.1)]">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-5xl font-header text-[#00f5a0] uppercase tracking-widest flex items-center gap-4 glitch-hover" data-text="LEVEL 4: CLONE JUTSU">
                <span className="w-8 h-1 bg-[#00f5a0]"></span> LEVEL 4: CLONE JUTSU
              </h1>
              <img src="/100xEngineers logo.jpg" className="w-16 h-16 rounded border border-blue-500/50" />
            </div>
            <h2 className="text-2xl text-white/50 font-mono mb-10">/CONTENT ENGINE</h2>
            
            <div className="grid md:grid-cols-2 gap-10">
              <div>
                <p className="mb-4 text-sm">
                  <span className="text-blue-400 font-bold uppercase">AEOS GROUP:</span> 500+ employees in Bengaluru. Zero VC funding (Bootstrapped).
                </p>
                <div className="bg-blue-900/20 p-6 rounded-xl border border-blue-500/20 mb-6">
                  <h3 className="font-pixel text-[10px] text-blue-300 mb-4">ENGINE STATS</h3>
                  <ul className="space-y-2 font-mono text-sm text-green-400">
                    <li>{'>'} 50+ original channels</li>
                    <li>{'>'} 2,000+ videos per month</li>
                    <li>{'>'} 800+ B2B clients</li>
                    <li className="mt-4 text-neon-gold text-lg font-bold !text-[#f5a623]">{'>'} 1 BILLION MONTHLY VIEWS</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-black/50 p-6 rounded-xl border border-white/5 relative overflow-hidden">
                <img src="/Community Masters — cover if it has one.jpg" className="absolute -right-10 -bottom-10 w-40 h-auto opacity-10 -rotate-6" />
                <h3 className="text-xl font-header text-white mb-6 uppercase border-b border-white/10 pb-2 relative z-10">Inventory:</h3>
                <ul className="space-y-4 font-mono text-sm text-white/70 relative z-10">
                  <li><span className="text-pink-500 block mb-1">[God In A Box]</span> GPT on WhatsApp.</li>
                  <li><span className="text-pink-500 block mb-1">[AlphaCTR]</span> Fine-tuned Stable Diffusion.</li>
                  <li><span className="text-pink-500 block mb-1">[HeyGen AI Clone]</span> "The Ultimate Deepfake".</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LEVEL 5: AVATAR LEFT, CONTENT RIGHT */}
      <section id="level5" className="min-h-screen relative flex items-center py-32 px-8 overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 z-0">
          <img src="/unleash_avatar_1774574979324.png" className="w-full h-full object-cover opacity-40 mix-blend-luminosity" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#06060c] via-black/50 to-black"></div>
          {/* Fog animation simulation */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black to-transparent opacity-80 blur-2xl translate-y-20"></div>
        </div>
        <div className="z-10 w-full flex justify-end pr-[5vw] md:pr-[10vw]">
          <div className="max-w-4xl text-left space-y-8 mt-20 p-8 rounded border border-[#f5a623]/20 bg-black/60 backdrop-blur relative">
            <div className="absolute -left-12 -top-12 border border-[#f5a623]/30 p-2 shadow-[0_0_30px_rgba(245,166,35,0.2)] bg-black/80 rotate-[-5deg]">
               <img src="/Unleash the Avatar logo.jpg" className="w-40 h-auto" />
            </div>
            <h1 className="text-5xl md:text-7xl font-cinematic text-white drop-shadow-[0_0_20px_rgba(255,100,50,0.5)] glitch-hover" data-text="LEVEL 5: PROJECT 11A">
              LEVEL 5:<br/>PROJECT 11A
            </h1>
            <div className="flex items-center gap-6">
              <h2 className="text-3xl text-[#f5a623] font-header tracking-[0.2em] uppercase">Unleash the Avatar</h2>
              <img src="/Aeos Games logo.webp" className="w-12 h-12" />
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div className="space-y-4 font-mono text-sm leading-relaxed text-white/80">
                <p><span className="text-white font-bold">Studio:</span> Aeos Games (Co-founded with Rohan).</p>
                <p><span className="text-white font-bold">Engine:</span> Unreal Engine 5.</p>
                <img src="/Unleash the Avatar.jpg" className="w-full h-40 object-cover border border-white/10 mt-4 rounded" />
              </div>
              <div className="space-y-4 font-mono text-sm leading-relaxed text-white/80">
                <p><span className="text-white font-bold">Team:</span> 40+ veterans (Ghost of Tsushima core).</p>
                <p><span className="text-neon-gold font-bold">Release:</span> ETA Fall 2026. Self-funded.</p>
                <div className="p-4 bg-[#f5a623]/10 border border-[#f5a623]/30 text-[#f5a623] text-xs font-pixel mt-4">
                  *Vishwapur photogrammetry project: 1,000+ real heritage sites scanned.*
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THE GUILD (Full Width, standard) */}
      <section className="py-32 px-8 bg-[#0a0a0f] relative font-header text-center w-full z-10 border-b border-white/5">
        <h2 className="text-4xl text-neon-green mb-16 tracking-widest uppercase title-shadow glitch-hover" data-text="GUILD ROSTER: THE PARTY MEMBERS">GUILD ROSTER: THE PARTY MEMBERS</h2>
        <div className="flex flex-wrap md:flex-nowrap justify-center gap-8 max-w-6xl mx-auto">
          
          {/* Card 1 */}
          <div className="foil-card w-full md:w-1/4 bg-bg-panel border border-[#0ff]/30 rounded-xl overflow-hidden shadow-[0_5px_20px_rgba(0,255,255,0.05)] cursor-crosshair">
            <div className="h-64 overflow-hidden relative border-b border-white/10">
              <div className="absolute inset-0 bg-gradient-to-t from-[#12121e] to-transparent z-10"></div>
              <img src="/achin-mayya.webp" className="w-full h-full object-cover object-top filter contrast-125" alt="Achina" />
            </div>
            <div className="p-6 text-left relative z-20">
              <h3 className="text-2xl text-white mb-1">Achina Mayya</h3>
              <p className="text-xs font-mono text-[#0ff] mb-4">[Class: Co-Founder]</p>
              <p className="text-sm font-sans text-white/60">Co-authored the Golden Book Award-winning *The Content Creator Handbook*.</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="foil-card w-full md:w-1/4 bg-bg-panel border border-[#00f5a0]/30 rounded-xl overflow-hidden shadow-[0_5px_20px_rgba(0,245,160,0.05)] cursor-crosshair">
            <div className="h-64 overflow-hidden relative border-b border-white/10">
              <div className="absolute inset-0 bg-gradient-to-t from-[#12121e] to-transparent z-10"></div>
              <img src="/Rohan Mayya.jpg" className="w-full h-full object-cover object-top filter contrast-125 saturate-50" alt="Rohan" />
            </div>
            <div className="p-6 text-left relative z-20">
              <h3 className="text-2xl text-white mb-1">Rohan Mayya</h3>
              <p className="text-xs font-mono text-[#00f5a0] mb-4">[Class: Tech Lead]</p>
              <p className="text-sm font-sans text-white/60">Ex-Y Combinator alum. Master of UE5.</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="foil-card w-full md:w-1/4 bg-bg-panel border border-[#f5a623]/30 rounded-xl overflow-hidden shadow-[0_5px_20px_rgba(245,166,35,0.05)] cursor-crosshair">
            <div className="h-64 overflow-hidden relative border-b border-white/10">
              <div className="absolute inset-0 bg-gradient-to-t from-[#12121e] to-transparent z-10"></div>
              <img src="/Tanmay Bhat.webp" className="w-full h-full object-cover object-top filter contrast-125" alt="Tanmay" />
            </div>
            <div className="p-6 text-left relative z-20">
              <h3 className="text-2xl text-white mb-1">Tanmay Bhat</h3>
              <p className="text-xs font-mono text-[#f5a623] mb-4">[Class: Comedy Mage]</p>
              <p className="text-sm font-sans text-white/60">Invested in Scenes. Audience magnet to Varun's technical explainer.</p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="foil-card w-full md:w-1/4 bg-bg-panel border border-pink-500/30 rounded-xl overflow-hidden shadow-[0_5px_20px_rgba(255,0,150,0.05)] cursor-crosshair">
            <div className="h-64 overflow-hidden relative border-b border-white/10">
              <div className="absolute inset-0 bg-gradient-to-t from-[#12121e] to-transparent z-10"></div>
              <img src="/Shashank Udupa.jpg" className="w-full h-full object-cover object-top filter contrast-125 saturate-0" alt="Shashank" />
            </div>
            <div className="p-6 text-left relative z-20">
              <h3 className="text-2xl text-white mb-1">Shashank Udupa</h3>
              <p className="text-xs font-mono text-pink-500 mb-4">[Class: Nostalgic NPC]</p>
              <p className="text-sm font-sans text-white/60">The Avalon Labs era co-founder.</p>
            </div>
          </div>

        </div>
      </section>
      
      {/* THE DOJO */}
      <section id="dojo" className="h-screen relative bg-black overflow-hidden flex items-center border-b border-white/10 w-full z-10">
        <div className="absolute left-10 top-10 font-mono text-white/10 text-xl tracking-tighter select-none">SKILL TREE INIT...</div>
        
        <div id="dojo-scroll" className="flex w-[450vw] h-auto items-center pl-[10vw]">
          {/* Main Dojo Title Section */}
          <div className="w-[100vw] flex-shrink-0 flex flex-col justify-center pr-20">
            <h2 className="text-7xl md:text-9xl font-header font-bold text-white tracking-widest leading-none glitch-hover" data-text="THE KATA SERIES">
              THE<br/>
              KATA<br/>
              SERIES
            </h2>
            <div className="flex items-center gap-6 mt-12">
               <div className="h-[2px] w-24 bg-neon-green"></div>
               <span className="text-[#0ff] font-pixel text-xl tracking-[0.5em] uppercase">Equippable Mental Models</span>
            </div>
             <p className="mt-8 font-mono text-white/40 text-sm max-w-lg italic">
              "Master the protocols of the new world. Your status is determined by your perception."
            </p>
          </div>
          
          {/* Skill Node 1 */}
          <div className="w-[85vw] flex-shrink-0 flex items-center pr-20 relative group">
            <div className="bg-bg-panel/40 border-l-4 border-neon-green p-12 backdrop-blur-xl w-full max-w-4xl foil-card relative overflow-hidden flex flex-col md:flex-row gap-10 items-center">
              <div className="w-full md:w-1/3 flex-shrink-0 relative">
                 <img src="/Pyjama Profit — book cover image.jpg" className="w-full h-auto rounded border border-white/10 rotate-[-5deg] grayscale group-hover:grayscale-0 transition-all duration-700 shadow-2xl" />
                 <div className="absolute inset-0 bg-neon-green/10 mix-blend-color group-hover:opacity-0 transition-opacity"></div>
              </div>
              <div className="flex-1 space-y-6">
                 <h3 className="text-4xl font-header text-white mb-4 uppercase tracking-tighter">The 300-Year Bug</h3>
                 <p className="font-mono text-lg leading-relaxed text-white/80">"Jobs are not a law of nature. They are 300-400 years old. The screen-based desk job is barely 20-30 years old."</p>
                 <div className="p-4 bg-neon-green/10 border border-neon-green/30 text-neon-green text-sm font-mono italic">
                   Perception: As AI replaces tasks, move one level up.
                 </div>
              </div>
            </div>
          </div>
          
          {/* Skill Node 2 */}
          <div className="w-[85vw] flex-shrink-0 flex items-center pr-20 relative group">
            <div className="bg-bg-panel/40 border-l-4 border-[#0ff] p-12 backdrop-blur-xl w-full max-w-4xl foil-card relative overflow-hidden flex flex-col md:flex-row gap-10 items-center">
              <div className="w-full md:w-1/3 flex-shrink-0 overflow-hidden rounded-xl border border-white/5">
                 <img src="/Abhinav Chhikara.jpg" className="w-full h-full object-cover filter contrast-125 saturate-50 group-hover:saturate-100 transition-all duration-700" />
              </div>
              <div className="flex-1 space-y-6">
                 <h3 className="text-4xl font-header text-white mb-4 uppercase tracking-tighter">The Curse of Knowledge</h3>
                 <p className="font-mono text-lg leading-relaxed text-white/80">If you cannot imagine what it is like to NOT know something, you cannot prompt AI, write copy, or build communities. (Steven Pinker influence).</p>
                 <div className="inline-block px-4 py-2 border border-[#0ff]/40 text-[#0ff] font-pixel text-xs tracking-widest bg-[#0ff]/5">
                   Requirement: Empathy Engine Active.
                 </div>
              </div>
            </div>
          </div>

          {/* Skill Node 3 */}
          <div className="w-[85vw] flex-shrink-0 flex items-center pr-20 relative group">
            <div className="bg-bg-panel/40 border-l-4 border-neon-gold p-12 backdrop-blur-xl w-full max-w-4xl foil-card relative overflow-hidden flex flex-col md:flex-row-reverse gap-10 items-center">
              <div className="w-full md:w-1/3 flex-shrink-0 relative">
                 <img src="/The Content Creator Handbook — book cover image.jpg" className="w-full h-auto rounded-lg border border-[#f5a623]/30 rotate-[5deg] shadow-[0_20px_50px_rgba(245,166,35,0.2)]" />
              </div>
              <div className="flex-1 space-y-6">
                 <h3 className="text-4xl font-header text-white mb-4 uppercase tracking-tighter">Distribution {'>'} Product</h3>
                 <p className="font-mono text-lg leading-relaxed text-white/80">"I expect a role/status inversion between tech and media... Only distribution will be king in the near future."</p>
                 <blockquote className="border-l-4 border-[#f5a623] pl-4 text-white/50 text-sm font-cinematic italic">
                   The status game is changing. Media is the leverage.
                 </blockquote>
              </div>
            </div>
          </div>

          {/* Skill Node 4 */}
          <div className="w-[85vw] flex-shrink-0 flex items-center pr-[10vw] relative group">
            <div className="bg-bg-panel/40 border-l-4 border-neon-red p-12 backdrop-blur-xl w-full max-w-4xl foil-card relative overflow-hidden flex flex-col md:flex-row gap-10 items-center">
              <div className="w-full md:w-1/3 flex-shrink-0">
                 <img src="/Shashank Udupa.jpg" className="w-full h-auto rounded-full border-4 border-neon-red shadow-[0_0_30px_#ff3b5c] filter contrast-110 sepia-[0.3]" />
              </div>
              <div className="flex-1 space-y-6">
                 <h3 className="text-4xl font-header text-white mb-4 uppercase tracking-tighter">Bootstrap = Hard Mode</h3>
                 <p className="font-mono text-lg leading-relaxed text-white/80">"Valuations are a type of status game. In this company, money is meant to try new things."</p>
                 <div className="text-neon-red font-pixel text-xs animate-pulse tracking-[0.3em]">
                   BOSS STATUS: UNLOCKED
                 </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ENDGAME / FOOTER */}
      <footer className="w-full bg-black py-20 px-8 flex flex-col items-center justify-center text-center relative z-20">
        <h2 className="text-5xl font-cinematic italic text-white/40 mb-10 hover:text-white/80 transition-colors cursor-default glitch-hover" data-text='"Odds are for losers."'>"Odds are for losers."</h2>
        <p className="font-mono text-sm text-white/30 mb-10">Built by the AI tinkerers at <strong className="text-white/60">Brokai Labs</strong>.</p>
        <a 
          href="https://brokailabs.com" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="px-8 py-4 bg-transparent border border-neon-green text-neon-green font-mono uppercase text-sm hover:bg-neon-green hover:text-black transition-all cursor-pointer"
        >
          Initialize Your Own AI Lab
        </a>
      </footer>

      {/* EASTER EGG */}
      <button 
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full border border-pink-500 bg-pink-500/10 text-pink-500 text-xl font-bold font-mono z-[100] hover:bg-pink-500 hover:text-black transition-colors animate-pulse"
      >
        ?
      </button>

      {showModal && (
        <div className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-bg-panel border border-[#ff3b5c] shadow-[0_0_50px_#ff3b5c] max-w-lg w-full p-8 mx-4">
            <h3 className="font-pixel text-xl text-[#ff3b5c] mb-6">DOOMSCROLL TAX:</h3>
            <p className="font-mono text-lg text-white/90 leading-relaxed mb-8">
              "You just spent 3 minutes doomscrolling this playthrough. That will be $1."
            </p>
            <div className="flex justify-end">
              <button onClick={() => setShowModal(false)} className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white font-mono border border-white/20">
                PAY UP
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
