import { useEffect, useMemo, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { ArrowDown, ArrowRight, Check, ChevronDown, Heart, LockKeyhole, Mail, Music, Pause, RotateCcw, Sparkles, Star, Unlock } from "lucide-react";
import { birthday } from "./data/content";

const PHASES = { GATE: "gate", UNLOCKING: "unlocking", BIRTHDAY: "birthday" };

function FloatingHearts() {
  return <div className="floating-hearts" aria-hidden="true">
    {Array.from({length:18}).map((_,i)=><span key={i} style={{"--i":i}}>{i%3===0?"♡":i%3===1?"✦":"·"}</span>)}
  </div>;
}

function Countdown() {
  const target = new Date(birthday.birthday).getTime();
  const [now,setNow]=useState(Date.now());
  useEffect(()=>{const t=setInterval(()=>setNow(Date.now()),1000);return()=>clearInterval(t)},[]);
  const v=useMemo(()=>{
    const d=Math.max(0,target-now);
    return {days:Math.floor(d/86400000),hours:Math.floor(d/3600000)%24,minutes:Math.floor(d/60000)%60,seconds:Math.floor(d/1000)%60,today:d===0};
  },[now,target]);
  if(v.today)return <div className="today-countdown">It's your day! ♡</div>;
  return <div className="countdown-grid">{[["days",v.days],["hours",v.hours],["minutes",v.minutes],["seconds",v.seconds]].map(([l,n])=>
    <div className="countdown-box" key={l}><strong>{String(n).padStart(2,"0")}</strong><span>{l}</span></div>)}</div>;
}

function Gate({onUnlock}) {
  const [password,setPassword]=useState(""),[error,setError]=useState(""),[hint,setHint]=useState(false),[shake,setShake]=useState(false);
  const submit=e=>{e.preventDefault(); if(password.trim()===birthday.password){onUnlock();return} setError("Not quite… try the little hint below ♡");setShake(true);setTimeout(()=>setShake(false),500)};
  return <main className="gate-page"><FloatingHearts/><div className="moon-glow"/><div className="gate-stars">{Array.from({length:45}).map((_,i)=><i key={i} style={{"--i":i}}/>)}</div>
    <section className={`gate-card ${shake?"shake":""}`}>
      <div className="lock-orbit"><div className="lock-ring ring-one"/><div className="lock-ring ring-two"/><div className="lock-icon"><LockKeyhole size={25}/></div></div>
      <span className="eyebrow"><Sparkles size={14}/>{birthday.opening.eyebrow}</span>
      <h1>{birthday.opening.title}</h1><p className="gate-subtitle">{birthday.opening.subtitle}</p>
      <form onSubmit={submit} className="password-form"><label htmlFor="secret">Enter the secret password</label>
        <div className="password-field"><LockKeyhole size={18}/><input id="secret" type="password" value={password} onChange={e=>{setPassword(e.target.value);setError("")}} placeholder="••••••••" autoComplete="off"/><button type="submit" aria-label="Unlock"><ArrowRight size={20}/></button></div>
        <button type="button" className="hint-button" onClick={()=>setHint(v=>!v)}>{hint?"Hide hint":"I need a hint"}</button>
        {hint&&<div className="hint-box">{birthday.opening.hint}</div>}{error&&<p className="form-error">{error}</p>}
      </form>
      <div className="gate-footer"><Heart size={14} fill="currentColor"/>Made with a ridiculous amount of love<Heart size={14} fill="currentColor"/></div>
    </section>
  </main>;
}

function Unlocking({onDone}) {
  useEffect(()=>{confetti({particleCount:90,spread:80,origin:{y:.55},colors:["#ff5c8a","#ffd166","#fff","#c9ff72"]});const t=setTimeout(onDone,2100);return()=>clearTimeout(t)},[onDone]);
  return <main className="unlock-page"><div className="unlock-heart"><Heart size={52} fill="currentColor"/></div><Sparkles className="unlock-sparkle one"/><Sparkles className="unlock-sparkle two"/><span className="eyebrow">Unlocked</span><h1>The surprise is yours now.</h1><p>Get ready, {birthday.nickname}…</p><div className="loading-line"><span/></div></main>;
}

function PhotoCard({memory,index}) {
  const [failed,setFailed]=useState(false);
  return <article className="memory-card" style={{transform:`rotate(${memory.rotate})`}}><div className="memory-photo">
    {!failed&&<img src={memory.image} alt={memory.title} onError={()=>setFailed(true)}/>}
    <div className={`photo-placeholder ${!failed?"hidden":""}`}><Heart size={30}/><span>YOUR PHOTO {index+1}</span><small>Add it to /public/photos/</small></div>
    <span className="photo-number">0{index+1}</span></div>
    <div className="memory-copy"><span>{memory.title}</span><p>{memory.text}</p></div></article>;
}

function BirthdayPage() {
  const [letterOpen,setLetterOpen]=useState(false),[reasonIndex,setReasonIndex]=useState(null),[secretOpen,setSecretOpen]=useState(false),[wishMade,setWishMade]=useState(false),[playing,setPlaying]=useState(false),[toast,setToast]=useState("");
  const audioRef=useRef(null);
  useEffect(()=>{const t=setTimeout(()=>confetti({particleCount:35,spread:55,origin:{x:.5,y:.75},scalar:.75}),600);return()=>clearTimeout(t)},[]);
  const showToast=m=>{setToast(m);setTimeout(()=>setToast(""),2800)};
  const toggleMusic=async()=>{if(!audioRef.current){showToast("Add your song as public/music/our-song.mp3 first ♫");return}try{if(playing){audioRef.current.pause();setPlaying(false)}else{await audioRef.current.play();setPlaying(true)}}catch{showToast("Your browser blocked autoplay. Tap again to play ♫")}};
  const makeWish=()=>{setWishMade(true);confetti({particleCount:170,spread:100,startVelocity:35,origin:{y:.65},colors:["#ff5c8a","#ffd166","#c9ff72","#fff"]});showToast("Wish sent to the universe ✨")};
  return <div className="birthday-page"><audio ref={audioRef} loop src="/music/our-song.mp3"/>
    <header className="birthday-nav"><a href="#top" className="brand"><span><Heart size={17} fill="currentColor"/></span>for {birthday.name}</a><div className="nav-actions"><button className="music-button" onClick={toggleMusic}>{playing?<Pause size={16}/>:<Music size={16}/>} {playing?"Pause":"Our song"}</button><a className="nav-link" href="#letter">My letter</a></div></header>
    <section className="hero-section" id="top"><FloatingHearts/><div className="hero-orb orb-a"/><div className="hero-orb orb-b"/><div className="hero-content"><span className="eyebrow"><Sparkles size={14}/>20 • 10 • 2026</span><p className="tiny-kicker">Today, the world gets to celebrate you.</p><h1>Happy Birthday,<br/><em>{birthday.name}.</em></h1><p className="hero-subtitle">If I could wrap every good wish in the world and give it to you, this is what it would look like.</p><a href="#letter" className="primary-button">Open my heart <Heart size={17} fill="currentColor"/></a></div><div className="scroll-cue"><ArrowDown size={15}/><span>keep scrolling</span></div></section>

    <section className="section countdown-section"><div className="section-heading centered"><span className="eyebrow">A little time machine</span><h2>Counting down to your next chapter.</h2><p>Every second gets us a little closer to another beautiful year of you.</p></div><Countdown/></section>

    <section className="section letter-section" id="letter"><div className="letter-intro"><span className="eyebrow"><Mail size={14}/>A letter for you</span><h2>Some things are easier to write than to say.</h2><p>So I made you a letter you can open whenever you want a little reminder of how special you are.</p></div>
      <div className={`envelope ${letterOpen?"open":""}`}><div className="envelope-back"/><div className="letter-paper"><div className="letter-topline"><span>TO: {birthday.nickname}</span><Heart size={14} fill="currentColor"/></div><div className="letter-content">{birthday.letter.map((p,i)=><p key={i} style={{"--delay":`${i*90}ms`}}>{p}</p>)}<div className="signature">— {birthday.signature} ♡</div></div></div><div className="envelope-front"/>{!letterOpen&&<button className="envelope-seal" onClick={()=>setLetterOpen(true)}><Heart size={23} fill="currentColor"/></button>}</div>
      {!letterOpen&&<button className="secondary-button letter-open-button" onClick={()=>setLetterOpen(true)}>Open the letter <ArrowDown size={16}/></button>}
    </section>

    <section className="section memories-section"><div className="section-heading"><span className="eyebrow">Little pieces of us</span><h2>Memories deserve a place to stay.</h2><p>I left these ready for your favorite photos. Replace the three images and turn this into your own little digital scrapbook.</p></div><div className="memory-grid">{birthday.memories.map((m,i)=><PhotoCard key={m.title} memory={m} index={i}/>)}</div></section>

    <section className="section reasons-section"><div className="section-heading centered"><span className="eyebrow"><Heart size={14}/>Six little reasons</span><h2>Things I hope you never forget.</h2><p>Tap a card. Each one has a tiny message waiting underneath.</p></div><div className="reasons-grid">{birthday.reasons.map((r,i)=><button className={`reason-card ${reasonIndex===i?"active":""}`} key={r} onClick={()=>setReasonIndex(reasonIndex===i?null:i)}><span className="reason-number">0{i+1}</span><Heart size={20}/><span className="reason-title">{reasonIndex===i?r:"Tap to open"}</span><ChevronDown size={16}/></button>)}</div></section>

    <section className="section timeline-section"><div className="section-heading"><span className="eyebrow">Our little timeline</span><h2>From one moment to another.</h2></div><div className="timeline">{birthday.timeline.map((item,i)=><article className="timeline-item" key={item.date}><div className="timeline-dot"><Heart size={12} fill="currentColor"/></div><div className="timeline-card"><span>{item.date}</span><h3>{item.title}</h3><p>{item.text}</p></div><strong>0{i+1}</strong></article>)}</div></section>

    <section className="secret-section"><div className="secret-card"><div className="secret-icon">{secretOpen?<Unlock size={27}/>:<LockKeyhole size={27}/>}</div><span className="eyebrow">One last secret</span>{!secretOpen?<><h2>There is still something hidden here.</h2><p>Because every good birthday surprise needs one more little twist.</p><button className="primary-button" onClick={()=>setSecretOpen(true)}>Reveal it <Sparkles size={17}/></button></>:<div className="secret-reveal"><Sparkles size={25}/><h2>My favorite part of today?</h2><p>Knowing that somewhere in the world, you are smiling while reading this. That's enough for me.</p><div className="secret-hearts">♡ &nbsp; ♡ &nbsp; ♡</div></div>}</div></section>

    <section className="wish-section"><div className="wish-glow"/><div className="wish-content"><Star size={26} fill="currentColor"/><span className="eyebrow">Your turn</span><h2>Close your eyes.<br/>Make a wish.</h2><p>Make one quietly. I won't ask what it is. I'll just hope the universe is listening.</p><button className="wish-button" onClick={makeWish}>{wishMade?<Check size={18}/>:<Sparkles size={18}/>} {wishMade?"Wish sent ✨":"Make my wish"}</button>{wishMade&&<p className="wish-note">Okay. It's official. I hope it comes true. ♡</p>}</div></section>
    <footer className="birthday-footer"><Heart size={16} fill="currentColor"/><span>Made especially for {birthday.name}</span><Heart size={16} fill="currentColor"/></footer>
    {toast&&<div className="toast-message"><Sparkles size={16}/>{toast}</div>}<button className="back-to-top" onClick={()=>window.scrollTo({top:0,behavior:"smooth"})} aria-label="Back to top"><RotateCcw size={17}/></button>
  </div>;
}

export default function App(){const [phase,setPhase]=useState(PHASES.GATE);if(phase===PHASES.GATE)return <Gate onUnlock={()=>setPhase(PHASES.UNLOCKING)}/>;if(phase===PHASES.UNLOCKING)return <Unlocking onDone={()=>setPhase(PHASES.BIRTHDAY)}/>;return <BirthdayPage/>}