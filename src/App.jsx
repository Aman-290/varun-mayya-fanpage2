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

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Level 0: Typewriter Effect
      const tl0 = gsap.timeline();
      tl0.to("#type-1", { duration: 1.5, text: 'C:\\> initialize_dossier.exe --target "Varun Mayya"', ease: 'none', delay: 0.5 })
         .to("#type-2", { duration: 1, text: '> LOADING AGI PROTOCOLS...', ease: 'none' })
         .to("#type-3", { duration: 3, text: '> BIO_STATUS: "waiting for agi. i live to experiment. don\'t take me too seriously i am an idiot. content, games, and tools."', ease: 'none' })
         .to("#type-4", { duration: 1, text: '> PRESS SCROLL TO SPAWN.', ease: 'none' });

      // The Avatar Timeline mapped to entire scroll
      const tlAvatar = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1
        }
      });
      
      // Initial Spawn drop (left side)
      tlAvatar.fromTo(avatarRef.current, 
        { y: -300 }, 
        { y: 100, rotation: 360, duration: 1, ease: 'bounce.out' },
        0
      )
      // Level 2 dodge (moves to right side)
      .to(avatarRef.current, { x: "75vw", y: 50, duration: 1.5 }, 1)
      // Level 3 Boss drop (moves back to left)
      .to(avatarRef.current, { x: 0, y: 300, scale: 1.2, duration: 1 }, 2.5)
      // Level 4 split clone (moves to right)
      .to(avatarRef.current, { x: "75vw", y: 150, scale: 1, duration: 1 }, 3.5)
      // Level 5 final descent (moves to left)
      .to(avatarRef.current, { x: 0, y: 250, opacity: 0.5, duration: 1 }, 5);
      
      // Horizontal Scroll Level 2
      gsap.to("#level2-scroll", {
        xPercent: -66.6, // Scrols 2/3rds
        ease: "none",
        scrollTrigger: {
          trigger: "#level2",
          pin: true,
          scrub: 1,
          start: "top top",
          end: "+=2000"
        }
      });

      // Boss Fight Level 3 Shake & HUD
      ScrollTrigger.create({
        trigger: "#level3",
        start: "top center",
        onEnter: () => {
          setSerotonin(10);
          setIsRedAlert(true);
          const r = () => Math.floor(Math.random() * 10) - 5;
          gsap.to("#level3-box", { x: r, y: r, duration: 0.1, yoyo: true, repeat: 10 });
        },
        onLeaveBack: () => {
          setSerotonin(100);
          setIsRedAlert(false);
        }
      });

      // Level 4 clones
      ScrollTrigger.create({
        trigger: "#level4",
        start: "top center",
        onEnter: () => {
          gsap.to(".avatar-clone", { autoAlpha: 0.7, x: (i) => (i === 0 ? -150 : 150), duration: 0.5, stagger: 0.1 });
          gsap.to(viewsRef.current, {
            innerHTML: 1000000000,
            duration: 2.5,
            snap: { innerHTML: 50000000 },
            onUpdate: function() {
              viewsRef.current.innerHTML = String(Math.floor(this.targets()[0].innerHTML)).replace(/(.)(?=(\d{3})+$)/g,'$1,') + "+";
            }
          });
        },
        onLeaveBack: () => {
          gsap.to(".avatar-clone", { autoAlpha: 0, x: 0, duration: 0.5 });
          viewsRef.current.innerHTML = "0";
        }
      });

      // The Dojo Pin
      gsap.to("#dojo-scroll", {
        xPercent: -75,
        ease: "none",
        scrollTrigger: {
          trigger: "#dojo",
          pin: true,
          scrub: 1,
          start: "top top",
          end: "+=3000"
        }
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

      {/* AVATAR */}
      <div ref={avatarRef} className="fixed left-[5vw] md:left-[10vw] z-50 pointer-events-none mt-32 flex justify-center items-center">
        {/* Real Avatar */}
        <div className="relative w-24 h-24 rounded-bl-3xl rounded-tr-3xl overflow-hidden border-2 border-neon-green shadow-[0_0_20px_#00f5a0]">
          <img src="/varun-mayya-portrait.jpg" alt="Avatar Player" className="w-full h-full object-cover rounded-xl pixelated grayscale hover:grayscale-0 transition-all" style={{imageRendering: "pixelated"}} />
        </div>
        {/* Holographic Clones (Level 4) */}
        <div className="avatar-clone absolute w-24 h-24 rounded-lg opacity-0 pointer-events-none border-2 border-[#0ff] mix-blend-screen shadow-[0_0_20px_#0ff] overflow-hidden">
          <img src="/varun-mayya-portrait.jpg" className="w-full h-full object-cover grayscale brightness-150 contrast-150" />
        </div>
        <div className="avatar-clone absolute w-24 h-24 rounded-lg opacity-0 pointer-events-none border-2 border-[#f0f] mix-blend-screen shadow-[0_0_20px_#f0f] overflow-hidden">
          <img src="/varun-mayya-portrait.jpg" className="w-full h-full object-cover grayscale brightness-150 contrast-150" />
        </div>
      </div>

      {/* LEVEL 0 */}
      <section className="h-screen w-full relative flex items-center justify-center pt-20 px-8">
        <div className="absolute inset-0 z-0">
          <img src="/terminal_bootup_1774574448620.png" className="w-full h-full object-cover opacity-60 mix-blend-screen" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-bg-void"></div>
        </div>
        <div className="z-10 w-full max-w-4xl text-neon-green font-mono text-lg space-y-4">
          <div id="type-1" className="min-h-7"></div>
          <div id="type-2" className="min-h-7"></div>
          <div id="type-3" className="min-h-14"></div>
          <div id="type-4" className="min-h-7 mt-8 animate-pulse text-white"></div>
        </div>
      </section>

      {/* LEVEL 1 */}
      <section id="level1" className="min-h-screen relative flex items-center py-24 px-8 border-t border-white/5">
        <div className="absolute inset-0 z-0">
          <img src="/pixel_bedroom_1774574653249.png" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        <div className="z-10 w-full max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-5xl font-header text-neon-green uppercase mb-12">LEVEL 1: THE KID WHO WANTED TO BE SUPERMAN</h1>
          <div className="bg-bg-panel/80 p-6 md:p-8 rounded-xl border border-white/10 backdrop-blur-sm space-y-4">
            <p className="font-mono text-sm leading-loose">
              Born Feb 22, 1993, Bengaluru. Father: ENT surgeon from Bantwal. Mother: Chartered Accountant at ICICI for 26 years.
            </p>
            <p className="font-mono text-sm"><span className="text-neon-gold">Equipped Item:</span> Compaq Presario (Age 11, circa 2004).</p>
            <p className="font-mono text-sm"><span className="text-neon-gold">Grind Stats:</span> 10 hours a day on the computer. Self-taught coding. Built games using raycaster engines (Genesis3D/RealityFactory).</p>
            <blockquote className="border-l-4 border-white/30 pl-4 py-2 font-cinematic text-xl text-white/80 italic mt-6">
              "You need to drink Bombay water if you want to experience the hardships of life." - Mother's Lore
            </blockquote>
            <div className="bg-neon-green/10 p-4 rounded mt-6 border border-neon-green/30">
              <span className="text-neon-green font-pixel text-xs">Milestone:</span> Reached 500,000 views on a childhood YouTube channel before finishing school.
            </div>
          </div>
        </div>
      </section>

      {/* LEVEL 2 */}
      <section id="level2" className="h-screen relative bg-bg-void overflow-hidden flex items-center border-t border-white/5">
        <div className="absolute inset-0 z-0">
          <img src="/startup_garage_1774574674792.png" className="w-full h-full object-cover opacity-10" />
        </div>
        
        <div id="level2-scroll" className="flex w-[300vw] h-full items-center relative z-10 px-[10vw]">
          <div className="w-[100vw] flex-shrink-0 flex items-center justify-start">
            <h1 className="text-5xl md:text-7xl font-header font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-green to-blue-500 uppercase tracking-tight">
              LEVEL 2: THE SPEEDRUN<br/>
              <span className="text-4xl text-white/50">(COLLEGE TO VC)</span>
            </h1>
          </div>
          <div className="w-[80vw] flex-shrink-0 flex items-center pr-20">
            <div className="bg-bg-panel border-2 border-white/10 p-10 rounded-2xl w-full foil-card">
              <h2 className="font-pixel text-md text-neon-gold mb-6">QUEST 1: SIZR Studios (Age 19)</h2>
              <p className="text-lg leading-relaxed text-white/80">
                T-shirt company turned oDesk freelance dev. Billed $100/hr.<br/>
                Revenue: ₹30 Lakhs (~$36,000).<br/><br/>
                <span className="text-neon-green font-bold text-xl">Outcome: ✓ FUNDED THE NEXT STAGE.</span>
              </p>
            </div>
          </div>
          <div className="w-[80vw] flex-shrink-0 flex items-center">
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

      {/* LEVEL 3 */}
      <section id="level3" className="min-h-screen relative flex items-center py-32 px-8 border-t border-neon-red/30 bg-black overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/boss_skull_1774574898656.png" className="w-full h-full object-cover opacity-20 mix-blend-screen" />
          <div className={`absolute inset-0 transition-opacity duration-300 ${isRedAlert ? 'bg-red-900/10' : 'bg-transparent'}`}></div>
        </div>
        <div id="level3-box" className={`z-10 w-full max-w-4xl mx-auto rounded-none border-4 ${isRedAlert ? 'border-neon-red shadow-[0_0_50px_#ff3b5c]' : 'border-white/10'} bg-black/80 p-10 relative`}>
          <div className="absolute top-0 right-0 p-4 font-mono text-neon-red font-bold uppercase tracking-widest text-xl animate-pulse">
            ! CRITICAL WARNING !
          </div>
          <h1 className="text-5xl font-header text-red-500 uppercase mb-4 glitch-text" data-text="LEVEL 3: THE VALLEY OF DEATH (AVALON)">LEVEL 3: THE VALLEY OF DEATH (AVALON)</h1>
          <div className="bg-red-950/40 text-red-200 border-l-4 border-red-500 p-4 mb-8 font-mono">
            *WARNING: RUNWAY DEPLETED. DECEMBER SALARIES DUE.*
          </div>
          <p className="text-lg mb-6 text-white/80">
            Avalon Labs grew to 50 employees and $1M+ in revenue, but hit a near-death runway exhaustion.
          </p>
          <p className="text-xl text-yellow-500 font-cinematic italic mb-6">
            Buff Activated: Dragon Ball Mindset. "If I don't, who will?"
          </p>
          <div className="border border-white/20 p-6 rounded mb-8">
            <span className="text-neon-green font-bold">Outcome:</span> Called every contact. Closed 2 deals in the last 10 days of December. Survived.
          </div>
          <div className="border-t border-white/20 pt-8 mt-8">
            <h2 className="text-3xl font-header text-white mb-4">PIVOT: Avalon Meta -{'>'} Scenes</h2>
            <p className="text-white/70 mb-4">Raised $420,000. Reached 45,000 community members. Backed by Kunal Shah, Gaurav Munjal, Kalyan Krishnamurthy, Tanmay Bhat.</p>
            <div className="inline-block px-6 py-3 bg-red-900/50 border border-red-500 text-white font-bold tracking-widest">
              Boss Defeated: Acquired by Unacademy's Graphy (June 2023).
            </div>
          </div>
        </div>
      </section>

      {/* LEVEL 4 */}
      <section id="level4" className="min-h-screen relative flex items-center py-32 px-8 border-t border-white/10 bg-[#06060c]">
        <div className="absolute inset-0 z-0">
          <img src="/cyberpunk_servers_1774574922251.png" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#06060c] via-transparent to-[#06060c]"></div>
        </div>
        <div className="z-10 w-full max-w-5xl mx-auto backdrop-blur-md bg-[#0a0f18]/80 border border-blue-500/30 p-10 rounded-3xl shadow-[0_0_40px_rgba(0,100,255,0.1)]">
          <h1 className="text-5xl font-header text-[#00f5a0] uppercase mb-4 tracking-widest flex items-center gap-4">
            <span className="w-8 h-1 bg-[#00f5a0]"></span> LEVEL 4: THE CLONE JUTSU
          </h1>
          <h2 className="text-2xl text-white/50 font-mono mb-10">/THE INDUSTRIAL CONTENT ENGINE</h2>
          
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <p className="mb-4">
                <span className="text-blue-400 font-bold">Base of Operations:</span> Aeos Group (Bootstrapped, Zero VC funding). 500+ employees in 25,000 sq ft Bengaluru office.
              </p>
              <div className="bg-blue-900/20 p-6 rounded-xl border border-blue-500/20 mb-6">
                <h3 className="font-pixel text-xs text-blue-300 mb-4">SYSTEM STATS</h3>
                <ul className="space-y-2 font-mono text-sm text-green-400">
                  <li>{'>'} 50+ original channels</li>
                  <li>{'>'} 2,000+ videos per month</li>
                  <li>{'>'} 800+ B2B clients (Red Bull, Amazon Prime, Zerodha)</li>
                  <li className="mt-4 text-neon-gold text-lg font-bold !text-[#f5a623]">{'>'} OVER 1 BILLION MONTHLY VIEWS</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-black/50 p-6 rounded-xl border border-white/5">
              <h3 className="text-xl font-header text-white mb-6 uppercase border-b border-white/10 pb-2">The Hacker Era Inventory:</h3>
              <ul className="space-y-4 font-mono text-xs md:text-sm text-white/70">
                <li className="flex gap-3"><span className="text-pink-500">[God In A Box]</span> GPT on WhatsApp. One of the earliest implementations.</li>
                <li className="flex gap-3"><span className="text-pink-500">[AlphaCTR]</span> Fine-tuned Stable Diffusion for YouTube thumbnails.</li>
                <li className="flex gap-3"><span className="text-pink-500">[AutoCodePro]</span> Prompt-to-code architecture tool.</li>
                <li className="flex gap-3 items-center"><span className="text-pink-500">[HeyGen AI Clone]</span> <span className="text-white">Fans literally cannot tell when it's real Varun vs his ElevenLabs/HeyGen AI Avatar.</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* LEVEL 5 */}
      <section className="min-h-screen relative flex items-center py-32 px-8 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/unleash_avatar_1774574979324.png" className="w-full h-full object-cover opacity-40 mix-blend-luminosity" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#06060c] via-black/50 to-black"></div>
          {/* Fog animation simulation */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black to-transparent opacity-80 blur-2xl translate-y-20"></div>
        </div>
        <div className="z-10 w-full max-w-6xl mx-auto text-center space-y-8 mt-20">
          <h1 className="text-6xl md:text-8xl font-cinematic text-white drop-shadow-[0_0_20px_rgba(255,100,50,0.5)]">
            LEVEL 5:<br/>
            PROJECT 11A
          </h1>
          <h2 className="text-3xl text-[#f5a623] font-header tracking-[0.2em] uppercase">Unleash the Avatar</h2>
          
          <div className="grid md:grid-cols-2 gap-8 text-left max-w-4xl mx-auto mt-16 mt-16 bg-black/60 backdrop-blur border border-[#f5a623]/20 p-8 rounded">
            <div className="space-y-4 font-mono text-sm leading-relaxed text-white/80">
              <p><span className="text-white font-bold">Concept:</span> A 20+ year obsession culminating in India's first AAA action RPG.</p>
              <p><span className="text-white font-bold">Studio:</span> Aeos Games (Co-founded with brother Rohan).</p>
              <p><span className="text-white font-bold">Engine:</span> Unreal Engine 5.</p>
              <p><span className="text-white font-bold">Lore:</span> Set in Vishwapur, where the barrier between Earth and Naraka has collapsed, releasing demonic Nisthari Rakshas.</p>
            </div>
            <div className="space-y-4 font-mono text-sm leading-relaxed text-white/80">
              <p><span className="text-white font-bold">Mechanics:</span> Soulslike. "Feather prism combat" & "Fragmented chakra" ranged system.</p>
              <p><span className="text-white font-bold">World Building:</span> The world's largest scan library for a game. 1,000+ real Indian heritage sites scanned via photogrammetry.</p>
              <p><span className="text-white font-bold">Team:</span> 40+ veterans from Ghost of Tsushima, Hogwarts Legacy, Alan Wake Remastered.</p>
              <p><span className="text-neon-gold font-bold">Release:</span> ETA Fall 2026. Self-funded.</p>
            </div>
            <div className="col-span-full mt-6 bg-red-900/30 p-4 border border-red-500/20">
              <span className="font-pixel text-[10px] text-red-400 block mb-2">NPC MEME CHECK:</span>
              <p className="italic font-cinematic text-lg">"Security official at the airport today asked me 'when game' not even kidding."</p>
            </div>
          </div>
        </div>
      </section>

      {/* THE GUILD */}
      <section className="py-32 px-8 bg-[#0a0a0f] relative font-header text-center w-full z-10 border-t border-white/5">
        <h2 className="text-4xl text-neon-green mb-16 tracking-widest uppercase title-shadow">GUILD ROSTER: THE PARTY MEMBERS</h2>
        <div className="flex flex-wrap md:flex-nowrap justify-center gap-8 max-w-6xl mx-auto">
          
          {/* Card 1 */}
          <div className="foil-card w-full md:w-1/4 bg-bg-panel border border-[#0ff]/30 rounded-xl overflow-hidden shadow-[0_5px_20px_rgba(0,255,255,0.05)] cursor-crosshair">
            <div className="h-64 overflow-hidden relative border-b border-white/10">
              <div className="absolute inset-0 bg-gradient-to-t from-[#12121e] to-transparent z-10"></div>
              <img src="/achin-mayya.webp" className="w-full h-full object-cover object-top filter contrast-125" alt="Achina" />
            </div>
            <div className="p-6 text-left relative z-20">
              <h3 className="text-2xl text-white mb-1">Achina Mayya</h3>
              <p className="text-xs font-mono text-[#0ff] mb-4">[Class: Co-Founder/CEO of Aevy]</p>
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
              <p className="text-xs font-mono text-[#00f5a0] mb-4">[Class: Tech Lead, Aeos Games]</p>
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
              <p className="text-sm font-sans text-white/60">Co-creator of Overpowered (1.1M+ followers). Invested in Scenes. Audience magnet to Varun's technical explainer.</p>
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
              <p className="text-xs font-mono text-pink-500 mb-4">[Class: The Nostalgic NPC]</p>
              <p className="text-sm font-sans text-white/60">"Shanks & Varun" - The Avalon Labs era co-founder.</p>
            </div>
          </div>

        </div>
      </section>

      {/* THE DOJO */}
      <section id="dojo" className="h-[120vh] relative bg-black overflow-hidden flex items-center border-t border-white/10 w-full z-10">
        <div className="absolute left-10 top-10 font-mono text-white/20 text-4xl">SKILL TREE INIT...</div>
        <div id="dojo-scroll" className="flex w-[400vw] h-full items-center pl-[10vw]">
          <h2 className="text-6xl md:text-8xl w-[60vw] flex-shrink-0 font-header text-white pr-20">
            THE KATA SERIES:<br/>
            <span className="text-[#0ff]">EQUIPPABLE</span><br/>
            <span className="text-[#00f5a0]">MENTAL MODELS</span>
          </h2>
          
          <div className="w-[80vw] flex-shrink-0 flex items-center pr-20 relative">
            <div className="bg-bg-panel border border-white/20 p-10 backdrop-blur rounded-full w-[400px] h-[400px] flex flex-col justify-center items-center text-center foil-card shadow-[0_0_50px_rgba(255,255,255,0.05)]">
              <h3 className="text-2xl font-header text-[#00f5a0] mb-4">The 300-Year Bug</h3>
              <p className="font-mono text-sm leading-relaxed text-white/80 px-4">"Jobs are not a law of nature. They are 300-400 years old. The screen-based desk job is barely 20-30 years old. As AI replaces tasks, move one level up."</p>
            </div>
            {/* Connecting line */}
            <div className="absolute right-0 top-1/2 w-40 h-1 bg-gradient-to-r from-white/20 to-[#0ff] -translate-y-1/2 z-0"></div>
          </div>
          
          <div className="w-[80vw] flex-shrink-0 flex items-center pr-20 relative">
            <div className="bg-bg-panel border border-white/20 p-10 backdrop-blur rounded-full w-[400px] h-[400px] flex flex-col justify-center items-center text-center foil-card shadow-[0_0_50px_rgba(255,255,255,0.05)]">
              <h3 className="text-2xl font-header text-[#0ff] mb-4">The Curse of Knowledge</h3>
              <p className="font-mono text-sm leading-relaxed text-white/80 px-4">(Steven Pinker influence). If you cannot imagine what it is like to NOT know something, you cannot prompt AI, write copy, or build communities.</p>
            </div>
            <div className="absolute right-0 top-1/2 w-40 h-1 bg-gradient-to-r from-[#0ff] to-[#f5a623] -translate-y-1/2 z-0"></div>
          </div>

          <div className="w-[80vw] flex-shrink-0 flex items-center pr-20 relative">
            <div className="bg-bg-panel border border-white/20 p-10 backdrop-blur rounded-full w-[400px] h-[400px] flex flex-col justify-center items-center text-center foil-card shadow-[0_0_50px_rgba(255,255,255,0.05)] relative z-10">
               <h3 className="text-2xl font-header text-[#f5a623] mb-4">Distribution {'>'} Product</h3>
               <p className="font-mono text-sm leading-relaxed text-white/80 px-4">"I expect a role/status inversion between tech and media... Only distribution will be king in the near future."</p>
            </div>
            <div className="absolute right-0 top-1/2 w-40 h-1 bg-gradient-to-r from-[#f5a623] to-[#ff3b5c] -translate-y-1/2 z-0"></div>
          </div>

          <div className="w-[80vw] flex-shrink-0 flex items-center pr-20">
            <div className="bg-bg-panel border border-white/20 p-10 backdrop-blur rounded-full w-[400px] h-[400px] flex flex-col justify-center items-center text-center foil-card shadow-[0_0_50px_rgba(255,59,92,0.1)] relative z-10">
               <h3 className="text-2xl font-header text-neon-red mb-4">Bootstrap = Hard Mode</h3>
               <p className="font-mono text-sm leading-relaxed text-white/80 px-4">"Valuations are a type of status game. I hope more founders feel the same way about dilution. In this company, money is meant to try new things."</p>
            </div>
          </div>

        </div>
      </section>

      {/* ENDGAME / FOOTER */}
      <footer className="w-full bg-black border-t border-white/5 py-20 px-8 flex flex-col items-center justify-center text-center relative z-20">
        <h2 className="text-5xl font-cinematic italic text-white/40 mb-10 hover:text-white/80 transition-colors cursor-default">"Odds are for losers."</h2>
        <p className="font-mono text-sm text-white/30 mb-10">Built by the AI tinkerers at <strong className="text-white/60">Brokai Labs</strong>.</p>
        <button className="px-8 py-4 bg-transparent border border-neon-green text-neon-green font-mono uppercase text-sm hover:bg-neon-green hover:text-black transition-all">
          Initialize Your Own AI Lab
        </button>
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
