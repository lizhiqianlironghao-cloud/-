import { useCallback, useRef, useSyncExternalStore } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const motionQuery = '(prefers-reduced-motion: reduce)';
const subscribeToMotion = (callback) => {
  const media = window.matchMedia(motionQuery);
  media.addEventListener('change', callback);
  return () => media.removeEventListener('change', callback);
};

export function useReducedMotionPreference() {
  return useSyncExternalStore(subscribeToMotion, () => window.matchMedia(motionQuery).matches, () => true);
}

export function usePortfolioMotion(rootRef) {
  const openingRef = useRef(null);
  const openingPlayed = useRef(false);
  const revealed = useRef(new WeakSet());
  const skipOpening = useCallback(() => openingRef.current?.progress(1), []);

  useGSAP(() => {
    const root = rootRef.current;
    const select = gsap.utils.selector(root);
    const media = gsap.matchMedia();
    const scrollRestoration = window.history.scrollRestoration;
    // Prevent a later browser restore from overwriting the opening or hash target.
    ScrollTrigger.clearScrollMemory('manual');
    let disposed = false;
    let refreshFrame;
    let anchorFrame;
    const refresh = () => {
      if (disposed) return;
      cancelAnimationFrame(refreshFrame);
      refreshFrame = requestAnimationFrame(() => { if (!disposed) ScrollTrigger.refresh(); });
    };

    media.add({ desktop: '(min-width: 961px)', compact: '(max-width: 960px)', reduce: motionQuery }, (context) => {
      const { desktop, reduce } = context.conditions;
      const entries = [];
      const parallaxLayers = select('[data-parallax]');
      const overlay = select('.opening-overlay');
      const skip = select('.opening-skip');
      let opening;
      root.dataset.motion = reduce ? 'reduced' : 'full';

      gsap.fromTo(select('.reading-progress'), { scaleX: 0 }, {
        scaleX: 1, ease: 'none',
        scrollTrigger: { trigger: document.documentElement, start: 0, end: 'max', scrub: reduce ? true : 0.45 },
      });

      if (reduce) {
        openingPlayed.current = true;
        root.dataset.opening = 'reduced';
        gsap.set([...overlay, ...skip], { autoAlpha: 0 });
        root.querySelectorAll('main > section').forEach(section => { section.dataset.entry = 'static'; });
        return;
      }

      // Each timeline owns a separate transform layer: opening, parallax, and image scale.
      const atHome = !window.location.hash || window.location.hash === '#home';
      if (atHome && !openingPlayed.current) {
        // Hash navigation/scroll restoration can settle after React's layout effect.
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        root.dataset.opening = 'playing';
        gsap.set([...overlay, ...skip], { autoAlpha: 1 });
        opening = gsap.timeline({
          defaults: { ease: 'power4.out' },
          onComplete: () => {
            openingPlayed.current = true;
            root.dataset.opening = 'complete';
            openingRef.current = null;
          },
        });
        openingRef.current = opening;
        opening
          .fromTo(select('.opening-rule'), { scaleX: 0 }, { scaleX: 1, duration: 1.15 }, 0.1)
          .fromTo(select('.opening-name'), { yPercent: 115, scaleY: 0.7 }, { yPercent: 0, scaleY: 1, duration: 1.1 }, 0.12)
          .fromTo(select('.opening-caption'), { yPercent: 125 }, { yPercent: 0, duration: 1.1 }, 0.42)
          .to(select('.opening-name'), { yPercent: -120, duration: 0.8, ease: 'power3.in' }, 1.28)
          .to(select('.opening-caption'), { yPercent: -150, duration: 0.75, ease: 'power3.in' }, 1.4)
          .to(select('.opening-rule'), { scaleX: 0, duration: 0.7, ease: 'power3.inOut' }, 1.45)
          .to(select('.opening-panel-left'), { xPercent: -102, duration: 1.8, ease: 'power4.inOut' }, 1.58)
          .to(select('.opening-panel-right'), { xPercent: 102, duration: 1.8, ease: 'power4.inOut' }, 1.58)
          .fromTo(select('.hero-media'), { scale: 1.2 }, { scale: 1, duration: 2.5, ease: 'power3.out', clearProps: 'transform' }, 1.65)
          .fromTo(select('.header-inner'), { y: -50, opacity: 0 }, { y: 0, opacity: 1, duration: 1.4, clearProps: 'transform,opacity' }, 2.15)
          .fromTo(select('.hero-kicker'), { y: 35, opacity: 0 }, { y: 0, opacity: 1, duration: 1.3, clearProps: 'transform,opacity' }, 2.15)
          .fromTo(select('.hero-glyph'), { yPercent: 125, scaleY: 0.48, scaleX: 1.12, skewY: 7, rotation: 2 }, {
            yPercent: 0, scaleY: 1, scaleX: 1, skewY: 0, rotation: 0, duration: 1.7,
            stagger: 0.065, ease: 'expo.out', clearProps: 'transform',
          }, 2.32)
          .fromTo(select('.hero-copy-line'), { yPercent: 125 }, { yPercent: 0, duration: 1.45, stagger: 0.13, clearProps: 'transform' }, 2.85)
          .fromTo(select('.hero-cta-motion'), { y: 55, scale: 0.88, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 1.45, clearProps: 'transform,opacity' }, 3.0)
          .fromTo(select('.hero-bottom'), { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1.4, clearProps: 'transform,opacity' }, 3.08)
          .fromTo(select('.hero-side-note'), { opacity: 0 }, { opacity: 0.65, duration: 1.4, clearProps: 'opacity' }, 3.08)
          .set([...overlay, ...skip], { autoAlpha: 0 }, 3.4);
      } else {
        root.dataset.opening = 'skipped';
        gsap.set([...overlay, ...skip], { autoAlpha: 0 });
      }

      const finishOpening = () => openingRef.current?.progress(1);
      const onKey = (event) => {
        if (['Escape', 'ArrowDown', 'PageDown', 'End'].includes(event.key)) finishOpening();
      };
      window.addEventListener('wheel', finishOpening, { passive: true });
      window.addEventListener('touchmove', finishOpening, { passive: true });
      window.addEventListener('keydown', onKey);

      // Large masked type leads each chapter. The content gets its own viewport trigger.
      root.querySelectorAll('[data-section-intro]').forEach((intro) => {
        const section = intro.closest('section');
        const lines = intro.querySelectorAll('.english-line');
        const label = intro.querySelector('.section-label');
        const copy = section.querySelector('[data-section-copy]');
        if (revealed.current.has(intro) || intro.getBoundingClientRect().bottom < 0) return;
        section.dataset.entry = 'pending';
        const timeline = gsap.timeline({
          scrollTrigger: { trigger: intro, start: 'top 86%', end: 'bottom top', once: true, fastScrollEnd: true },
          onStart: () => { section.dataset.entry = 'playing'; },
          onComplete: () => { revealed.current.add(intro); section.dataset.entry = 'complete'; },
        });
        timeline
          .fromTo(lines, { yPercent: 135, xPercent: -9, scaleY: 0.65, skewY: 8, rotation: -1.4 }, {
            yPercent: 0, xPercent: 0, scaleY: 1, skewY: 0, rotation: 0,
            duration: 1.9, ease: 'power4.out', clearProps: 'transform',
          }, 0)
          .fromTo(label, { x: -35, opacity: 0 }, { x: 0, opacity: 1, duration: 1.2, ease: 'power3.out', clearProps: 'transform,opacity' }, 0.25);
        if (copy) timeline.fromTo(copy, { y: 65, scaleY: 0.92, opacity: 0 }, {
          y: 0, scaleY: 1, opacity: 1, duration: 1.5, ease: 'power4.out', clearProps: 'transform,opacity',
        }, 0.7);
        entries.push({ elements: [section], timeline });
      });

      const revealImages = (timeline, elements, at = 0, stagger = 0) => {
        const panels = elements.flatMap(el => Array.from(el.querySelectorAll('[data-image-reveal]')));
        const images = elements.flatMap(el => Array.from(el.querySelectorAll('.image-scale')));
        if (!panels.length) return;
        timeline
          .fromTo(panels, { y: 0, yPercent: 0 }, { y: 0, yPercent: -103, duration: 1.75, stagger, ease: 'power4.inOut' }, at + 0.16)
          .fromTo(images, { scale: 1.2 }, { scale: 1, duration: 2.3, stagger, ease: 'power3.out', clearProps: 'transform' }, at + 0.08);
      };

      // Group by the actual grid row so every row staggers while it is on screen.
      root.querySelectorAll('[data-card-grid]').forEach(grid => {
        const columns = getComputedStyle(grid).gridTemplateColumns.split(' ').length;
        const slots = Array.from(grid.children);
        for (let index = 0; index < slots.length; index += columns) {
          const row = slots.slice(index, index + columns).filter(slot => !revealed.current.has(slot));
          if (!row.length || row[0].getBoundingClientRect().bottom < 0) continue;
          const cards = row.map(slot => slot.querySelector('[data-card-reveal]'));
          row.forEach(slot => { slot.dataset.cardEntry = 'pending'; });
          const timeline = gsap.timeline({
            scrollTrigger: { trigger: row[0], start: 'top 87%', end: 'bottom top', once: true, fastScrollEnd: true },
            onStart: () => { row.forEach(slot => { slot.dataset.cardEntry = 'playing'; }); },
            onComplete: () => { row.forEach(slot => { revealed.current.add(slot); slot.dataset.cardEntry = 'complete'; }); },
          });
          timeline
            .set(cards, { willChange: 'transform,opacity' }, 0)
            .fromTo(cards, { y: desktop ? 140 : 95, scale: 0.89, rotation: index % 2 ? -2.4 : 2.4, opacity: 0 }, {
              y: 0, scale: 1, rotation: 0, opacity: 1, duration: 1.65, stagger: 0.22,
              ease: 'power4.out', clearProps: 'transform,opacity',
            }, 0);
          revealImages(timeline, row, 0.12, 0.22);
          timeline.set(cards, { clearProps: 'willChange' });
          entries.push({ elements: row, timeline });
        }
      });

      root.querySelectorAll('[data-reveal]').forEach(element => {
        if (element.matches('.project-item,.capability-slot,[data-section-copy]') || revealed.current.has(element) || element.getBoundingClientRect().bottom < 0) return;
        const timeline = gsap.timeline({
          scrollTrigger: { trigger: element, start: 'top 86%', end: 'bottom top', once: true, fastScrollEnd: true },
          onComplete: () => revealed.current.add(element),
        });
        timeline.fromTo(element.querySelector('[data-reveal-inner]') || element, {
          y: element.matches('.portrait-wrap') ? 110 : 70,
          scale: element.matches('.portrait-wrap') ? 0.94 : 1,
          rotation: element.matches('.portrait-wrap') ? -2 : 0, opacity: 0,
        }, {
          y: 0, scale: 1, rotation: 0, opacity: 1, duration: 1.65,
          delay: Number(element.dataset.revealDelay || 0), ease: 'power4.out', clearProps: 'transform,opacity',
        });
        revealImages(timeline, [element], 0.08);
        entries.push({ elements: [element], timeline });
      });

      if (desktop) {
        gsap.to(select('.hero-parallax'), {
          yPercent: 7, ease: 'none',
          scrollTrigger: { trigger: select('#home')[0], start: 'top top', end: 'bottom top', scrub: 1.2 },
        });
        parallaxLayers.forEach(layer => {
          const trigger = layer.closest('[data-parallax-trigger]');
          gsap.fromTo(layer, { yPercent: -4 }, {
            yPercent: 4, ease: 'none',
            scrollTrigger: {
              trigger, start: 'top bottom', end: 'bottom top', scrub: 1.1,
              onToggle: self => { layer.style.willChange = self.isActive ? 'transform' : 'auto'; },
            },
          });
        });
      }

      const onFocus = (event) => {
        entries.forEach(({ elements, timeline }) => {
          if (elements.some(element => element.contains(event.target))) timeline.progress(1);
        });
      };
      root.addEventListener('focusin', onFocus);
      return () => {
        openingRef.current = null;
        window.removeEventListener('wheel', finishOpening);
        window.removeEventListener('touchmove', finishOpening);
        window.removeEventListener('keydown', onKey);
        root.removeEventListener('focusin', onFocus);
        parallaxLayers.forEach(layer => layer.style.removeProperty('will-change'));
      };
    }, root);

    // React creates the anchor targets after the browser's initial hash lookup.
    const initialHash = window.location.hash;
    const anchorId = initialHash.slice(1);
    if (['about', 'work', 'expertise', 'contact'].includes(anchorId)) {
      const alignInitialAnchor = () => {
        if (disposed) return;
        anchorFrame = requestAnimationFrame(() => {
          if (disposed || window.location.hash !== initialHash) return;
          const target = root.querySelector(`#${anchorId}`);
          const padding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
          window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - padding, left: 0, behavior: 'instant' });
          ScrollTrigger.refresh();
        });
      };
      if (document.fonts?.ready) document.fonts.ready.then(alignInitialAnchor);
      else alignInitialAnchor();
    }

    const images = Array.from(root.querySelectorAll('img'));
    images.forEach(img => img.addEventListener('load', refresh));
    document.fonts?.ready.then(refresh);
    refresh();
    return () => {
      disposed = true;
      cancelAnimationFrame(refreshFrame);
      cancelAnimationFrame(anchorFrame);
      images.forEach(img => img.removeEventListener('load', refresh));
      media.revert();
      ScrollTrigger.clearScrollMemory(scrollRestoration);
    };
  }, { scope: rootRef });

  return skipOpening;
}
