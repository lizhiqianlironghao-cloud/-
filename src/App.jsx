import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUpRight, ArrowRight, Check, Copy, EnvelopeSimple, FrameCorners, ChartLineUp, Scissors, Target, Pause, Play, X, List } from '@phosphor-icons/react';
import { profile, projects, capabilities, navigation } from './content.js';
import BorderGlow from './components/BorderGlow.jsx';
import { usePortfolioMotion, useReducedMotionPreference } from './motion/usePortfolioMotion.js';

const iconMap = { target: Target, frame: FrameCorners, scissors: Scissors, chart: ChartLineUp };

function Reveal({ children, className = '', delay = 0, ...props }) {
  return <div className={className} data-reveal data-reveal-delay={delay} {...props}>{children}</div>;
}

function Opening({ onSkip }) {
  return <><div className="opening-overlay" aria-hidden="true"><div className="opening-panel opening-panel-left" /><div className="opening-panel opening-panel-right" /><div className="opening-identity"><span className="opening-text-mask"><span className="opening-name">{profile.name}<span className="opening-mark">.</span></span></span><span className="opening-text-mask"><span className="opening-caption">CREATIVE DIRECTION · FILM & EDIT</span></span><span className="opening-rule" /></div><span className="opening-edition mono">PORTFOLIO / 2026</span></div><button className="opening-skip" onClick={onSkip}>跳过开场 <ArrowUpRight size={16} /></button></>;
}

function SectionIntro({ index, label, english }) {
  return <div className="section-intro" data-section-intro><SectionLabel index={index}>{label}</SectionLabel><div className="section-english" aria-hidden="true"><span className="english-mask"><span className="english-line">{english}<span className="accent-period">.</span></span></span></div></div>;
}

function ImageReveal({ src, alt }) {
  return <><div className="media-parallax" data-parallax><div className="image-scale"><img src={src} alt={alt} loading="lazy" /></div></div><div className="image-reveal-panel" data-image-reveal aria-hidden="true" /></>;
}

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState('');
  useEffect(() => {
    const hero = document.getElementById('hero-header-sentinel');
    const observer = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting));
    if (hero) observer.observe(hero);
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) setActive(entry.target.id); });
    }, { rootMargin: '-25% 0px -50% 0px' });
    document.querySelectorAll('main > section[id]').forEach((section) => sectionObserver.observe(section));
    return () => { observer.disconnect(); sectionObserver.disconnect(); };
  }, []);
  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event) => { if (event.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [menuOpen]);
  return <header className={`header ${scrolled ? 'is-scrolled' : ''}`}>
    <div className="header-inner container">
      <a className="wordmark" href="#home" aria-label={`${profile.name}，返回首页`} onClick={() => setMenuOpen(false)}>
        <FrameCorners size={30} weight="light" /><span>{profile.name}<small>DIRECTOR & EDITOR</small></span>
      </a>
      <nav className="desktop-nav" aria-label="主导航">{navigation.map((item) => <a key={item.id} href={`#${item.id}`} className={active === item.id ? 'is-active' : ''}>{item.label}</a>)}</nav>
      <a className="header-contact" href="#contact">聊聊合作 <ArrowUpRight size={17} /></a>
      <button className="menu-button icon-button" aria-label={menuOpen ? '关闭导航' : '打开导航'} aria-expanded={menuOpen} aria-controls="mobile-nav" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={24} /> : <List size={24} />}</button>
    </div>
    {menuOpen && <nav id="mobile-nav" className="mobile-nav" aria-label="移动导航">{[...navigation, { id: 'contact', label: '聊聊合作' }].map((item) => <a href={`#${item.id}`} key={item.id} onClick={() => setMenuOpen(false)}>{item.label}<ArrowUpRight size={20} /></a>)}</nav>}
  </header>;
}

function Hero({ onOpen, isProjectOpen }) {
  const root = useRef(null);
  const video = useRef(null);
  const reduce = useReducedMotionPreference();
  const [playing, setPlaying] = useState(!reduce);
  const [videoReady, setVideoReady] = useState(false);
  const firstVideoProject = projects.find(project => project.video);
  useEffect(() => { if (reduce) setPlaying(false); }, [reduce]);
  useEffect(() => {
    const element = video.current;
    if (!element) return;
    let disposed = false;
    const syncPlayback = () => {
      const visible = root.current?.getBoundingClientRect().bottom > 0;
      if (playing && visible && !isProjectOpen && !document.hidden) element.play().catch((error) => { if (!disposed && error.name !== 'AbortError') setPlaying(false); });
      else element.pause();
    };
    const observer = new IntersectionObserver(syncPlayback);
    if (root.current) observer.observe(root.current);
    document.addEventListener('visibilitychange', syncPlayback);
    syncPlayback();
    return () => { disposed = true; observer.disconnect(); document.removeEventListener('visibilitychange', syncPlayback); element.pause(); };
  }, [playing, isProjectOpen]);
  return <section id="home" className="hero" ref={root} aria-labelledby="hero-title">
    <span id="hero-header-sentinel" className="header-sentinel" aria-hidden="true" />
    <div className="hero-media" aria-hidden="true"><div className="hero-parallax">
      <img src={profile.heroPoster} className="hero-poster" alt="" fetchPriority="high" />
      <video ref={video} className={`hero-video ${videoReady ? 'is-ready' : ''}`} src={profile.heroVideo} poster={profile.heroPoster} muted loop playsInline preload="metadata" onLoadedData={() => setVideoReady(true)} onError={() => { setVideoReady(false); setPlaying(false); }} />
    </div></div>
    <div className="hero-shade" aria-hidden="true" />
    <div className="hero-grain" aria-hidden="true" />
    <div className="hero-content container">
      <p className="hero-kicker"><span className="status-dot" />{profile.role}</p>
      <h1 id="hero-title" aria-label="让内容，有下一步。"><span className="hero-title-row" aria-hidden="true">{Array.from('让内容，').map((char, index) => <span className="hero-glyph" key={index}>{char}</span>)}</span><span className="hero-title-row" aria-hidden="true">{Array.from('有下一步。').map((char, index) => <span className={`hero-glyph ${char === '。' ? 'accent-period' : 'hero-highlight'}`} key={index}>{char}</span>)}</span></h1>
      <div className="hero-description">
        <p><span className="hero-copy-mask"><span className="hero-copy-line">用创意吸引目光，用剪辑推进表达。</span></span><span className="hero-copy-mask"><span className="hero-copy-line">从一帧好画面，到一次有效行动。</span></span></p>
        <div className="hero-cta-motion">{firstVideoProject ? <button type="button" className="pill-button primary" aria-haspopup="dialog" onClick={() => onOpen(firstVideoProject)}>浏览作品 <ArrowUpRight size={20} /></button> : <a className="pill-button primary" href="#work">浏览作品 <ArrowUpRight size={20} /></a>}</div>
      </div>
    </div>
    <div className="hero-side-note" aria-hidden="true"><span>IDEA. FRAME. ACTION.</span><i /></div>
    <div className="hero-bottom container">
      <a href="#about" className="scroll-link"><ArrowDown size={17} /><span>向下探索</span><small>SCROLL TO EXPLORE</small></a>
      <div className="hero-bottom-right"><span className="mono">PORTFOLIO / 2026</span><button className="video-toggle" disabled={!videoReady} onClick={() => setPlaying(!playing)} aria-label={playing ? '暂停背景视频' : '播放背景视频'}>{playing ? <Pause size={15} weight="fill" /> : <Play size={15} weight="fill" />}<span>{playing ? '暂停画面' : '播放画面'}</span></button></div>
    </div>
  </section>;
}

function SectionLabel({ index, children }) { return <div className="section-label"><span className="mono">{index}</span><span>{children}</span></div>; }

function About() {
  return <section id="about" className="about section-space container" aria-labelledby="about-title">
    <SectionIntro index="01" label="关于我 / ABOUT" english="THE PROFILE" />
    <div className="about-grid">
      <Reveal className="portrait-wrap" data-parallax-trigger><div data-reveal-inner><div className="portrait-image"><ImageReveal src={profile.portrait} alt="查看巨量千川投放数据的工作场景示意，屏幕使用演示数据" /><div className="portrait-caption"><FrameCorners size={23} weight="light" /><span>BEHIND THE FRAME<small>工作场景示意</small></span></div></div><div className="portrait-credit"><span>CREATIVE MIND. PRACTICAL HANDS.</span><span className="mono">[ 01 / 05 ]</span></div></div></Reveal>
      <div className="about-content">
        <Reveal data-section-copy><h2 id="about-title">理解产品的人，<br /><span className="muted-heading">也理解镜头。</span></h2></Reveal>
        <Reveal delay={0.08}><p className="about-lead">{profile.introduction}</p><p className="body-copy">{profile.philosophy}</p></Reveal>
        <Reveal delay={0.12}><div className="experience-list"><div><span className="mono">DIRECTION</span><h3>信息流编导</h3><p>选题洞察 / 创意脚本 / 分镜与拍摄</p></div><div><span className="mono">EDITING</span><h3>商业视频剪辑</h3><p>节奏重构 / 声画设计 / 素材迭代</p></div></div></Reveal>
        <Reveal delay={0.16}><a className="text-link about-email" href={`mailto:${profile.email}`}><EnvelopeSimple size={20} />{profile.email}<ArrowUpRight size={18} /></a></Reveal>
      </div>
    </div>
    <Reveal><div className="metrics">{profile.metrics.map((metric) => <div className="metric" key={metric.label}><span className="metric-value">{metric.value}</span><div><h3>{metric.label}</h3><span>{metric.note}</span></div></div>)}<p className="metrics-note">真实项目，真实反馈。<br />项目数据将在核验后公开。</p></div></Reveal>
  </section>;
}

function ProjectCard({ project, onOpen }) {
  return <Reveal className="project-item" data-parallax-trigger><div className="card-motion" data-card-reveal>
    <BorderGlow className="project-glow" backgroundColor="#101411" borderRadius={8} glowRadius={24} glowIntensity={0.8} fillOpacity={0.12}>
    <button className="project-card" onClick={() => onOpen(project)} aria-label={`${project.video ? '播放作品' : '查看项目'}：${project.title}`}>
      <div className="project-cover"><ImageReveal src={project.image} alt={project.imageAlt} /><div className="project-image-shade" /><span className="project-number mono">{project.id} / SELECTED</span><span className="project-study-label">{project.isDemo ? '视觉样稿' : `视频作品 · ${project.durationLabel}`}</span></div>
      <div className="project-meta"><div className="project-heading"><div><span>{project.category}</span><h3>{project.title}</h3></div><span className="project-open">{project.video ? <Play size={21} weight="fill" /> : <ArrowUpRight size={24} weight="light" />}</span></div><p>{project.subtitle}</p><div className="project-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div>
    </button>
    </BorderGlow>
  </div></Reveal>;
}

function Work({ onOpen }) {
  return <section id="work" className="work section-space container" aria-labelledby="work-title">
    <SectionIntro index="02" label="精选项目 / SELECTED WORK" english="SELECTED WORK" />
    <div className="section-title-row" data-section-copy><h2 id="work-title">每个画面，<br />都有它的任务<span className="accent-period">。</span></h2><p>从吸引注意，到讲清价值。<br />在创意与结果之间，找到合适的表达。</p></div>
    <div className="projects-grid" data-card-grid>{projects.map((project) => <ProjectCard key={project.id} project={project} onOpen={onOpen} />)}</div>
    <div className="work-note"><span className="mono">VIDEO WORK / VISUAL STUDIES</span><p>已加入 {projects.filter(project => project.video).length} 条作品视频。标注“视觉样稿”的卡片为视觉练习，作品持续更新。</p></div>
  </section>;
}

function Expertise() {
  return <section id="expertise" className="expertise section-space" aria-labelledby="expertise-title"><div className="container">
    <SectionIntro index="03" label="个人优势 / WHAT I BRING" english="EXPERTISE" />
    <div className="expertise-heading" data-section-copy><h2 id="expertise-title">创意之外，<br />还有把它落地的能力。</h2><div className="expertise-phrase mono">THINK CLEAR.<br /><span>CUT PRECISE.</span></div></div>
    <div className="capabilities-grid" data-card-grid>{capabilities.map((item, index) => { const Icon = iconMap[item.icon]; return <Reveal key={item.id} delay={index * 0.05} className="capability-slot"><div className="card-motion" data-card-reveal><BorderGlow className="capability-glow" backgroundColor="#1b231c" borderRadius={8} glowRadius={24} glowIntensity={0.8} fillOpacity={0.16}><div className="capability"><div className="capability-top"><Icon size={33} weight="light" /><span className="mono">/{item.id}</span></div><h3>{item.title}</h3><p>{item.description}</p><div className="capability-tags">{item.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div></BorderGlow></div></Reveal>; })}</div>
    <Reveal><div className="workflow"><span>从想法，到交付</span><div>{['产品理解', '创意脚本', '拍摄制作', '剪辑交付', '反馈迭代'].map((step, index) => <span key={step}>{index > 0 && <ArrowRight size={16} />}<b>{step}</b></span>)}</div></div></Reveal>
  </div></section>;
}

function Contact() {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const copyEmail = async () => {
    try { await navigator.clipboard.writeText(profile.email); setCopied(true); setCopyError(false); clearTimeout(timer.current); timer.current = setTimeout(() => setCopied(false), 2500); }
    catch { setCopyError(true); }
  };
  return <section id="contact" className="contact" aria-labelledby="contact-title"><div className="contact-background-word" aria-hidden="true">LET’S TALK</div><div className="container contact-inner">
    <SectionIntro index="04" label="联系我 / NEXT CHAPTER" english="LET’S TALK" />
    <Reveal className="contact-main"><p className="contact-availability"><span className="status-dot" />期待下一次创意合作</p><h2 id="contact-title">下一条好内容，<br /><span>从一次对话开始。</span></h2><div className="contact-email-row"><a href={`mailto:${profile.email}`} className="contact-email">{profile.email}<ArrowUpRight weight="light" /></a><button className="copy-button icon-button" onClick={copyEmail} aria-label={copied ? '邮箱已复制' : '复制邮箱'}>{copied ? <Check size={23} /> : <Copy size={23} />}</button></div><p className="copy-status" role="status">{copied ? '邮箱已复制，期待你的消息。' : copyError ? '复制未成功，请直接选择邮箱文字复制。' : '项目合作 / 自由职业 / 内容交流'}</p><a className="pill-button primary contact-cta" href={`mailto:${profile.email}?subject=${encodeURIComponent('作品集 · 项目合作沟通')}`}>聊聊合作 <ArrowUpRight size={20} /></a></Reveal>
    <footer className="site-footer"><a className="footer-brand" href="#home">{profile.name}<span>DIRECTOR & EDITOR</span></a><span>© 2026 {profile.name} · 保持好奇，持续创作。</span><a className="back-top" href="#home">回到顶部 <ArrowUpRight size={17} /></a></footer>
  </div></section>;
}

function ProjectDialog({ project, onClose }) {
  const dialog = useRef(null);
  useEffect(() => {
    const element = dialog.current;
    element.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { element.close(); document.body.style.overflow = previousOverflow; };
  }, []);
  return <dialog ref={dialog} className="project-dialog" onCancel={(event) => { event.preventDefault(); onClose(); }} onClick={(event) => { if (event.target === dialog.current) onClose(); }} aria-labelledby="dialog-title"><div className="dialog-panel"><button className="dialog-close icon-button" onClick={onClose} aria-label="关闭项目详情"><X size={25} /></button><div className={`dialog-visual ${project.video ? 'is-video' : ''}`}>{project.video ? <video src={project.video} controls autoPlay playsInline preload="metadata" poster={project.image} aria-label={`${project.title}，完整作品视频`} /> : <img src={project.image} alt={project.imageAlt} />}</div><div className="dialog-content"><p className="dialog-category mono">{project.category} / {project.isDemo ? 'VISUAL STUDY' : 'PROJECT'}</p><h2 id="dialog-title">{project.title}</h2><p>{project.description}</p><ul>{project.approach.map((step) => <li key={step}><span /><p>{step}</p></li>)}</ul>{project.isDemo && <div className="dialog-demo-note">此处为网站视觉样稿，不代表客户案例或投放成绩。正式项目视频与数据待补充。</div>}<a className="text-link" href={`mailto:${profile.email}?subject=${encodeURIComponent(`项目沟通：${project.title}`)}`}>交流类似项目 <ArrowUpRight size={18} /></a></div></div></dialog>;
}

export default function App() {
  const root = useRef(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const skipOpening = usePortfolioMotion(root);
  return <div ref={root} className="portfolio-app"><a className="skip-link" href="#about">跳到主要内容</a><div className="reading-progress" aria-hidden="true" /><Opening onSkip={skipOpening} /><Header /><main><Hero onOpen={setSelectedProject} isProjectOpen={Boolean(selectedProject)} /><About /><Work onOpen={setSelectedProject} /><Expertise /><Contact /></main>{selectedProject && <ProjectDialog project={selectedProject} onClose={() => setSelectedProject(null)} />}</div>;
}
