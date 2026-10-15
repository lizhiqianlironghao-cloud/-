import { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ArrowLeft, ArrowRight, ArrowUpRight, FrameCorners, Play, X } from '@phosphor-icons/react';
import { profile, projects } from '../content.js';
import { useReducedMotionPreference } from '../motion/usePortfolioMotion.js';
import ProjectContent from './ProjectContent.jsx';
import './WorkShowcase.css';

// Original gallery implementation. No React Bits Pro source or assets are used.
function ShowcaseCard({ project, index, onSelect, dragging, reduce, buttonRef }) {
  const surface = useRef(null);
  const tilt = useRef(null);
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(hover: hover) and (pointer: fine)', () => {
      if (reduce) return;
      tilt.current = {
        x: gsap.quickTo(surface.current, 'rotationX', { duration: 0.55, ease: 'power3.out' }),
        y: gsap.quickTo(surface.current, 'rotationY', { duration: 0.55, ease: 'power3.out' }),
      };
      return () => { tilt.current = null; };
    });
    return () => media.revert();
  }, { scope: surface, dependencies: [reduce], revertOnUpdate: true });

  const move = event => {
    if (!tilt.current || dragging.current || event.pointerType !== 'mouse') return;
    const box = event.currentTarget.getBoundingClientRect();
    tilt.current.x((0.5 - (event.clientY - box.top) / box.height) * 12);
    tilt.current.y(((event.clientX - box.left) / box.width - 0.5) * 14);
  };
  const reset = () => { tilt.current?.x(0); tilt.current?.y(0); };
  return <article className="showcase-card-slot">
    <button ref={buttonRef} type="button" className="showcase-card" onPointerMove={move} onPointerLeave={reset} onClick={() => onSelect(project)} aria-label={`${project.video ? '播放作品' : '查看视觉样稿'}：${project.title}`}>
      <div ref={surface} className={`showcase-card-visual ${project.video ? 'has-video' : ''}`}>
        <img className="showcase-poster" src={project.image} alt={project.imageAlt} style={{ objectPosition: project.imagePosition || 'center' }} loading={index < 3 ? 'eager' : 'lazy'} decoding="async" draggable="false" />
        <div className="showcase-card-shade" />
        <span className="showcase-card-number mono">{String(index + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}</span>
        <span className="showcase-card-kind">{project.isDemo ? '视觉样稿' : `视频作品 · ${project.durationLabel}`}</span>
        <span className="showcase-card-open">{project.video ? <Play size={22} weight="fill" /> : <ArrowUpRight size={27} weight="light" />}</span>
      </div>
      <div className="showcase-card-caption"><span>{project.category}</span><h3>{project.title}</h3></div>
      <div className="showcase-card-meta"><span>{project.tags.join(' / ')}</span><span>{project.video ? '观看影片' : '查看样稿'} <ArrowUpRight size={14} /></span></div>
    </button>
  </article>;
}

export default function WorkShowcase({ onClose }) {
  const dialog = useRef(null);
  const viewport = useRef(null);
  const cardButtons = useRef(new Map());
  const drag = useRef(null);
  const dragging = useRef(false);
  const suppressClick = useRef(false);
  const clickTimer = useRef(null);
  const scrollFrame = useRef(null);
  const galleryScroll = useRef(0);
  const [selected, setSelected] = useState(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  const reduce = useReducedMotionPreference();

  useEffect(() => {
    const element = dialog.current;
    const previousOverflow = document.body.style.overflow;
    element.showModal();
    viewport.current?.scrollTo({ left: 0, behavior: 'instant' });
    document.body.style.overflow = 'hidden';
    return () => {
      element.close();
      document.body.style.overflow = previousOverflow;
      clearTimeout(clickTimer.current);
      cancelAnimationFrame(scrollFrame.current);
    };
  }, []);

  useGSAP(() => {
    if (reduce) return;
    const timeline = gsap.timeline({ defaults: { ease: 'power4.out' } });
    timeline
      .fromTo('.showcase-title-line', { yPercent: 115, scaleY: 0.72, rotation: 3 }, { yPercent: 0, scaleY: 1, rotation: 0, duration: 1.35, stagger: 0.1, clearProps: 'transform' }, 0)
      .fromTo('.showcase-card', { y: 72, scale: 0.97, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 1.5, stagger: 0.12, clearProps: 'transform,opacity' }, 0.2);
  }, { scope: dialog, dependencies: [reduce], revertOnUpdate: true });

  const updateEdges = () => {
    const element = viewport.current;
    if (!element) return;
    const next = { start: element.scrollLeft < 2, end: element.scrollWidth - element.clientWidth - element.scrollLeft < 2 };
    setEdges(previous => previous.start === next.start && previous.end === next.end ? previous : next);
  };
  useEffect(() => {
    if (!viewport.current) return;
    const observer = new ResizeObserver(updateEdges);
    observer.observe(viewport.current);
    updateEdges();
    return () => observer.disconnect();
  }, []);

  const onScroll = () => {
    cancelAnimationFrame(scrollFrame.current);
    scrollFrame.current = requestAnimationFrame(updateEdges);
  };
  const advance = direction => {
    const element = viewport.current;
    const card = element.querySelector('.showcase-card-slot');
    const step = card?.nextElementSibling ? card.nextElementSibling.offsetLeft - card.offsetLeft : element.clientWidth;
    element.scrollBy({ left: direction * step, behavior: reduce ? 'instant' : 'smooth' });
  };
  const pointerDown = event => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    suppressClick.current = false;
    drag.current = { id: event.pointerId, x: event.clientX, scroll: viewport.current.scrollLeft };
  };
  const pointerMove = event => {
    const start = drag.current;
    if (!start || start.id !== event.pointerId) return;
    if (!(event.buttons & 1)) { finishDrag(event); return; }
    const delta = event.clientX - start.x;
    if (!dragging.current && Math.abs(delta) < 8) return;
    if (!dragging.current) {
      dragging.current = true;
      suppressClick.current = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      event.currentTarget.classList.add('is-dragging');
    }
    event.preventDefault();
    event.currentTarget.scrollLeft = start.scroll - delta;
  };
  const finishDrag = event => {
    if (drag.current?.id !== event.pointerId) return;
    drag.current = null;
    dragging.current = false;
    event.currentTarget.classList.remove('is-dragging');
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    clearTimeout(clickTimer.current);
    clickTimer.current = setTimeout(() => { suppressClick.current = false; }, 0);
    updateEdges();
  };
  const selectProject = project => {
    galleryScroll.current = dialog.current.scrollTop;
    setSelected(project);
    dialog.current.scrollTop = 0;
  };
  const backToGallery = () => {
    const projectId = selected.id;
    setSelected(null);
    requestAnimationFrame(() => {
      if (!dialog.current) return;
      dialog.current.scrollTop = galleryScroll.current;
      cardButtons.current.get(projectId)?.focus({ preventScroll: true });
    });
  };
  const videos = projects.filter(project => project.video).length;

  return <dialog ref={dialog} className="work-showcase" aria-labelledby={selected ? 'showcase-project-title' : 'showcase-title'} onCancel={event => { event.preventDefault(); selected ? backToGallery() : onClose(); }}>
    <div className="showcase-shell">
      <header className="showcase-topbar">
        <div className="showcase-brand"><FrameCorners size={26} weight="light" /><span>{profile.name}<small>DIRECTOR & EDITOR</small></span></div>
        <div className="showcase-top-actions">{selected && <button type="button" className="showcase-back" onClick={backToGallery} autoFocus><ArrowLeft size={18} />返回作品展厅</button>}<button type="button" className="showcase-close" onClick={onClose} aria-label="关闭作品展厅" autoFocus={!selected}><span>关闭</span><X size={23} weight="light" /></button></div>
      </header>

      <div className="showcase-stage" hidden={Boolean(selected)}>
        <div className="showcase-intro"><p>精选作品 / 从创意到成片</p><h2 id="showcase-title"><span className="showcase-title-mask"><span className="showcase-title-line">SELECTED</span></span><span className="showcase-title-mask"><span className="showcase-title-line">FRAMES<span className="accent-period">.</span></span></span></h2><p className="showcase-intro-copy">把每一次表达，留在画面里。</p></div>
        {projects.length ? <>
          <div ref={viewport} className="showcase-viewport" role="region" aria-label="可拖动的作品列表" tabIndex={0} onScroll={onScroll} onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={finishDrag} onPointerCancel={finishDrag} onLostPointerCapture={finishDrag} onClickCapture={event => { if (suppressClick.current && event.detail > 0) { event.preventDefault(); event.stopPropagation(); } }} onKeyDown={event => { if (event.target === event.currentTarget && ['ArrowLeft', 'ArrowRight'].includes(event.key)) { event.preventDefault(); advance(event.key === 'ArrowRight' ? 1 : -1); } }}>
            <div className="showcase-track">{projects.map((project, index) => <ShowcaseCard key={project.id} project={project} index={index} onSelect={selectProject} dragging={dragging} reduce={reduce} buttonRef={element => { if (element) cardButtons.current.set(project.id, element); else cardButtons.current.delete(project.id); }} />)}</div>
          </div>
          <footer className="showcase-footer"><div><span className="showcase-count">{String(projects.length).padStart(2, '0')}<small>件作品</small></span><p>{videos} 条作品视频{projects.length > videos && ` / ${projects.length - videos} 件视觉样稿`}</p></div><div className="showcase-browse"><span>拖动浏览 · 点击打开</span><div className="showcase-arrows"><button type="button" onClick={() => advance(-1)} disabled={edges.start} aria-label="向前浏览作品"><ArrowLeft size={20} /></button><button type="button" onClick={() => advance(1)} disabled={edges.end} aria-label="向后浏览作品"><ArrowRight size={20} /></button></div></div></footer>
        </> : <div className="showcase-empty">作品正在整理，欢迎通过邮箱联系我。</div>}
      </div>

      {selected && <div className="showcase-player"><ProjectContent project={selected} titleId="showcase-project-title" /></div>}
    </div>
  </dialog>;
}
