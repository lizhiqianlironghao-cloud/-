import { useLayoutEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ArrowLeft, ArrowUpRight, FrameCorners, Play, X } from '@phosphor-icons/react';
import { profile, projects } from '../content.js';
import { useReducedMotionPreference } from '../motion/usePortfolioMotion.js';
import ProjectContent from './ProjectContent.jsx';
import './WorkShowcase.css';

const filters = [
  { id: 'all', label: '全部作品', matches: () => true },
  { id: 'video', label: '视频作品', matches: project => Boolean(project.video) },
  { id: 'visual', label: '视觉样稿', matches: project => !project.video },
];

// Independent implementation inspired by the public filterable-grid demo.
// No React Bits Pro source, assets, registry access or dependencies are used.
function ShowcaseCard({ project, index, onSelect, buttonRef }) {
  return <article className="showcase-card-slot" role="listitem" data-media={project.video ? 'video' : 'visual'}>
    <button ref={buttonRef} type="button" className="showcase-card" onClick={() => onSelect(project)} aria-label={`${project.video ? '播放作品' : '查看视觉样稿'}：${project.title}`}>
      <div className="showcase-card-visual">
        <div className="showcase-image-motion">
          <img className="showcase-poster" src={project.image} alt={project.imageAlt} style={{ objectPosition: project.imagePosition || 'center' }} loading={index < 2 ? 'eager' : 'lazy'} decoding="async" draggable="false" />
        </div>
        <div className="showcase-card-shade" />
        <span className="showcase-card-number mono">{String(index + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}</span>
        <span className="showcase-card-kind">{project.video ? `视频作品 · ${project.durationLabel || '完整影片'}` : '视觉样稿'}</span>
        <span className="showcase-card-open" aria-hidden="true">{project.video ? <Play size={23} weight="fill" /> : <ArrowUpRight size={26} weight="light" />}</span>
        <span className="showcase-image-reveal" aria-hidden="true" />
      </div>
      <div className="showcase-card-caption">
        <div><span className="showcase-card-category">{project.category}</span><h3>{project.title}</h3></div>
        <span className="showcase-card-action">{project.video ? '观看影片' : '查看样稿'} <ArrowUpRight size={16} /></span>
      </div>
      <p className="showcase-card-tags">{project.tags.join(' / ')}</p>
    </button>
  </article>;
}

export default function WorkShowcase({ onClose }) {
  const dialog = useRef(null);
  const grid = useRef(null);
  const cardButtons = useRef(new Map());
  const galleryScroll = useRef(0);
  const returnFrame = useRef(null);
  const [selected, setSelected] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const reduce = useReducedMotionPreference();
  const currentFilter = filters.find(filter => filter.id === activeFilter);
  const visibleProjects = projects.filter(currentFilter.matches);
  const videos = projects.filter(project => project.video).length;

  useLayoutEffect(() => {
    const element = dialog.current;
    const previousOverflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      element.close();
      document.body.style.overflow = previousOverflow;
      cancelAnimationFrame(returnFrame.current);
    };
  }, []);

  useGSAP(() => {
    if (reduce) return;
    gsap.fromTo('.showcase-title-line',
      { yPercent: 115, scaleY: 0.72, rotation: 3 },
      { yPercent: 0, scaleY: 1, rotation: 0, duration: 1.35, ease: 'power4.out', stagger: 0.1, clearProps: 'transform' });
  }, { scope: dialog, dependencies: [reduce], revertOnUpdate: true });

  useGSAP((_context, contextSafe) => {
    const element = grid.current;
    if (!element || reduce) return;
    const cards = Array.from(element.children);
    if (!cards.length) return;
    const revealed = new WeakSet();
    gsap.set(cards, { y: 48, scale: 0.98, opacity: 0 });
    gsap.set(element.querySelectorAll('.showcase-poster'), { scale: 1.13 });
    // Reset the pixel translation parsed from the CSS fallback before using
    // percentage movement, otherwise the shutter can start above the image.
    gsap.set(element.querySelectorAll('.showcase-image-reveal'), { y: 0, yPercent: 0 });

    const reveal = contextSafe(entries => {
      const batch = entries.filter(entry => entry.isIntersecting && !revealed.has(entry.target)).map(entry => entry.target);
      if (!batch.length) return;
      batch.forEach(card => { revealed.add(card); observer.unobserve(card); });
      const images = batch.map(card => card.querySelector('.showcase-poster'));
      const masks = batch.map(card => card.querySelector('.showcase-image-reveal'));
      gsap.timeline({ defaults: { ease: 'power4.out', stagger: 0.09 } })
        .to(batch, { y: 0, scale: 1, opacity: 1, duration: 0.95, clearProps: 'transform,opacity' })
        .to(masks, { yPercent: -101, duration: 1.1 }, 0.08)
        .to(images, { scale: 1, duration: 1.3, clearProps: 'transform' }, 0.08);
    });
    const observer = new IntersectionObserver(reveal, { root: dialog.current, threshold: 0.06 });
    cards.forEach(card => observer.observe(card));

    const showFocusedCard = contextSafe(event => {
      const card = event.target.closest('.showcase-card-slot');
      if (!card) return;
      revealed.add(card);
      observer.unobserve(card);
      const image = card.querySelector('.showcase-poster');
      const mask = card.querySelector('.showcase-image-reveal');
      gsap.killTweensOf([card, image, mask]);
      gsap.set(card, { clearProps: 'transform,opacity' });
      gsap.set(image, { clearProps: 'transform' });
      gsap.set(mask, { y: 0, yPercent: -101 });
    });
    element.addEventListener('focusin', showFocusedCard);
    return () => { observer.disconnect(); element.removeEventListener('focusin', showFocusedCard); };
  }, { scope: grid, dependencies: [activeFilter, reduce], revertOnUpdate: true });

  const selectProject = project => {
    galleryScroll.current = dialog.current.scrollTop;
    setSelected(project);
    dialog.current.scrollTop = 0;
  };
  const backToGallery = () => {
    const projectId = selected.id;
    setSelected(null);
    returnFrame.current = requestAnimationFrame(() => {
      if (!dialog.current) return;
      dialog.current.scrollTop = galleryScroll.current;
      cardButtons.current.get(projectId)?.focus({ preventScroll: true });
    });
  };

  return <dialog ref={dialog} className="work-showcase" aria-labelledby={selected ? 'showcase-project-title' : 'showcase-title'} onCancel={event => { event.preventDefault(); selected ? backToGallery() : onClose(); }}>
    <div className="showcase-shell">
      <header className="showcase-topbar">
        <div className="showcase-brand"><FrameCorners size={26} weight="light" /><span>{profile.name}<small>DIRECTOR & EDITOR</small></span></div>
        <div className="showcase-top-actions">
          {selected && <button type="button" className="showcase-back" onClick={backToGallery} autoFocus><ArrowLeft size={18} />返回作品展厅</button>}
          <button type="button" className="showcase-close" onClick={onClose} aria-label="关闭作品展厅" autoFocus={!selected}><span>关闭</span><X size={23} weight="light" /></button>
        </div>
      </header>

      <div className="showcase-stage" hidden={Boolean(selected)}>
        <div className="showcase-intro">
          <p>精选作品 / 从创意到成片</p>
          <h2 id="showcase-title"><span className="showcase-title-mask"><span className="showcase-title-line">SELECTED</span></span><span className="showcase-title-mask"><span className="showcase-title-line">FRAMES<span className="accent-period">.</span></span></span></h2>
          <p className="showcase-intro-copy">把每一次表达，留在画面里。</p>
        </div>

        <div className="showcase-filterbar">
          <div className="showcase-filters" role="group" aria-label="作品分类筛选">
            {filters.map(filter => <button key={filter.id} type="button" className="showcase-filter" aria-pressed={activeFilter === filter.id} aria-controls="showcase-grid" onClick={() => setActiveFilter(filter.id)}>
              {filter.label}<span aria-hidden="true">{String(projects.filter(filter.matches).length).padStart(2, '0')}</span>
            </button>)}
          </div>
          <p className="showcase-result-count" role="status" aria-atomic="true">{String(visibleProjects.length).padStart(2, '0')} 件作品</p>
        </div>

        <section className="showcase-viewport" aria-label="可筛选的作品列表">
          <div ref={grid} id="showcase-grid" className="showcase-grid" role="list" aria-label={currentFilter.label}>
            {visibleProjects.map(project => <ShowcaseCard key={project.id} project={project} index={projects.indexOf(project)} onSelect={selectProject} buttonRef={element => { if (element) cardButtons.current.set(project.id, element); else cardButtons.current.delete(project.id); }} />)}
          </div>
          {!visibleProjects.length && <div className="showcase-empty">{projects.length ? '这个分类的作品正在整理中，可先浏览全部作品。' : '作品正在整理，欢迎通过邮箱联系我。'}</div>}
        </section>

        <footer className="showcase-footer">
          <p>{videos} 条作品视频 / {projects.length - videos} 件视觉样稿</p>
          <span>点击卡片，查看作品详情 <ArrowUpRight size={15} /></span>
        </footer>
      </div>

      {selected && <div className="showcase-player"><ProjectContent project={selected} titleId="showcase-project-title" /></div>}
    </div>
  </dialog>;
}
