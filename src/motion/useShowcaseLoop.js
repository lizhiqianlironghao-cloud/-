import { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { nextShowcasePosition, wrapShowcasePosition } from './showcaseLoop.js';

const SPEED = 26; // CSS pixels per second, independent of display refresh rate.
const INTERACTION_DELAY = 3500;

export function useShowcaseLoop({ viewport, scope, count, enabled, reduce, drag, dragging }) {
  const [paused, setPaused] = useState(false);
  const settings = useRef({ enabled, paused });
  const controller = useRef(null);
  const phase = useRef(0);

  useEffect(() => { settings.current = { enabled, paused }; }, [enabled, paused]);

  useGSAP(() => {
    const element = viewport.current;
    if (!element || count < 2) return;
    let metrics = { origin: 0, span: 0, step: 0 };
    let position = 0;
    let tween = null;
    let hasSize = false;
    let inView = false;
    let hovered = element.matches(':hover') && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    let focused = element.contains(document.activeElement) && document.activeElement.matches(':focus-visible');
    let resumeAt = performance.now() + 2200;
    const pointers = new Set();
    const listeners = [];

    const listen = (target, name, listener, options) => {
      target.addEventListener(name, listener, options);
      listeners.push(() => target.removeEventListener(name, listener, options));
    };
    const hold = (delay = INTERACTION_DELAY) => { resumeAt = performance.now() + delay; };
    const stopTween = () => { tween?.kill(); tween = null; };
    const write = next => {
      const wrapped = wrapShowcasePosition(next, metrics.origin, metrics.span);
      // Rebase an active drag too, so the next pointer move cannot jump back.
      if (drag.current) drag.current.scroll += wrapped - next;
      position = wrapped;
      phase.current = (wrapped - metrics.origin) / metrics.span;
      element.scrollLeft = wrapped;
    };
    const measure = () => {
      hasSize = element.clientWidth > 0;
      if (!hasSize) return;
      const cards = element.querySelectorAll('.showcase-card-slot');
      const first = cards[count];
      const nextCopy = cards[count * 2];
      if (!first || !nextCopy) return;
      stopTween();
      const firstLeft = first.getBoundingClientRect().left;
      metrics = {
        origin: firstLeft - element.getBoundingClientRect().left + element.scrollLeft,
        span: nextCopy.getBoundingClientRect().left - firstLeft,
        step: cards[count + 1].getBoundingClientRect().left - firstLeft,
      };
      if (metrics.span > 0) write(metrics.origin + phase.current * metrics.span);
    };
    const advance = direction => {
      if (!hasSize || !metrics.span) return;
      stopTween();
      hold();
      const target = nextShowcasePosition(position, metrics.origin, metrics.step, direction);
      if (reduce) { write(target); return; }
      const playhead = { value: position };
      tween = gsap.to(playhead, {
        value: target, duration: 0.85, ease: 'power3.inOut',
        onUpdate: () => write(playhead.value),
        onComplete: () => { tween = null; },
      });
    };
    controller.current = { advance, hold, stopTween };

    listen(element, 'scroll', () => {
      if (!hasSize || !settings.current.enabled || !metrics.span) return;
      const actual = element.scrollLeft;
      // Ignore our own writes; native touch, wheel and keyboard scrolling still
      // update the same loop and delay automatic movement until reading ends.
      if (Math.abs(actual - position) < 1) return;
      stopTween();
      hold();
      write(actual);
    }, { passive: true });
    listen(element, 'pointerenter', event => {
      if (event.pointerType !== 'mouse') return;
      hovered = true;
      stopTween();
    });
    listen(element, 'pointerleave', event => {
      if (event.pointerType !== 'mouse') return;
      hovered = false;
      hold(1200);
    });
    listen(element, 'pointerdown', event => {
      pointers.add(event.pointerId);
      stopTween();
      hold();
    }, { passive: true });
    const release = event => {
      if (!pointers.delete(event.pointerId)) return;
      hold();
    };
    listen(window, 'pointerup', release);
    listen(window, 'pointercancel', release);
    listen(element, 'wheel', () => { stopTween(); hold(); }, { passive: true });
    listen(element, 'focusin', event => {
      // Keyboard focus holds the carousel still. A mouse drag must not leave
      // it permanently paused just because the original button took focus.
      focused = event.target.matches(':focus-visible');
      stopTween();
      hold();
    });
    listen(element, 'keydown', () => { focused = true; stopTween(); });
    listen(element, 'focusout', event => {
      focused = element.contains(event.relatedTarget) && event.relatedTarget.matches(':focus-visible');
      hold();
    });
    listen(document, 'visibilitychange', () => { stopTween(); hold(1200); });
    listen(window, 'blur', () => {
      pointers.clear();
      drag.current = null;
      dragging.current = false;
      element.classList.remove('is-dragging');
      stopTween();
      hold();
    });

    const resize = new ResizeObserver(measure);
    resize.observe(element);
    const intersection = new IntersectionObserver(entries => {
      inView = entries[0].isIntersecting;
    }, { threshold: 0.01 });
    intersection.observe(element);
    measure();

    const tick = (_time, deltaTime) => {
      if (reduce || !settings.current.enabled || settings.current.paused || document.hidden ||
          !inView || !hasSize || !metrics.span || hovered || focused || pointers.size ||
          dragging.current || tween || performance.now() < resumeAt) return;
      // Cap long frames to avoid a catch-up jump when returning to the page.
      write(position + SPEED * Math.min(deltaTime, 48) / 1000);
    };
    gsap.ticker.add(tick);
    return () => {
      stopTween();
      gsap.ticker.remove(tick);
      resize.disconnect();
      intersection.disconnect();
      listeners.forEach(remove => remove());
      controller.current = null;
    };
  }, { scope, dependencies: [count, reduce], revertOnUpdate: true });

  useEffect(() => {
    controller.current?.stopTween();
    if (enabled) controller.current?.hold();
  }, [enabled, paused]);

  return {
    paused,
    togglePaused: () => setPaused(value => !value),
    advance: direction => controller.current?.advance(direction),
  };
}
