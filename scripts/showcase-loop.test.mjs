import test from 'node:test';
import assert from 'node:assert/strict';
import { nextShowcasePosition, wrapShowcasePosition } from '../src/motion/showcaseLoop.js';

const step = 372.625;
const span = step * 9;
const origin = span;
const close = (actual, expected) => assert.ok(Math.abs(actual - expected) < 0.00001, `${actual} != ${expected}`);

test('both seams preserve the same picture, including fractional positions', () => {
  close(wrapShowcasePosition(origin + span, origin, span), origin);
  close(wrapShowcasePosition(origin - 0.4, origin, span), origin + span - 0.4);
  close(wrapShowcasePosition(origin + span + 0.4, origin, span), origin + 0.4);
  for (const offset of [0, 0.125, step, span - 0.125]) {
    for (const loops of [-20, -1, 0, 1, 20]) {
      close(wrapShowcasePosition(origin + offset + loops * span, origin, span), origin + offset);
    }
  }
});

test('nine arrow steps return to the first card in either direction', () => {
  for (const direction of [-1, 1]) {
    let position = origin;
    for (let index = 0; index < 9; index++) {
      position = wrapShowcasePosition(nextShowcasePosition(position, origin, step, direction), origin, span);
      close(position, wrapShowcasePosition(origin + (index + 1) * direction * step, origin, span));
    }
    close(position, origin);
  }
});

test('arrows finish a partly visible card and tolerate subpixel rounding', () => {
  close(nextShowcasePosition(origin + step * 2.4, origin, step, 1), origin + step * 3);
  close(nextShowcasePosition(origin + step * 2.4, origin, step, -1), origin + step * 2);
  close(nextShowcasePosition(origin + step * 2 + 0.05, origin, step, -1), origin + step);
  close(nextShowcasePosition(origin + step * 2 - 0.05, origin, step, 1), origin + step * 3);
});

test('rebasing a drag keeps its next pointer position continuous across either seam', () => {
  for (const delta of [-span - 21.5, span + 21.5]) {
    let dragStart = origin;
    const next = dragStart - delta;
    const wrapped = wrapShowcasePosition(next, origin, span);
    dragStart += wrapped - next;
    close(dragStart - delta, wrapped);
    close(wrapShowcasePosition(dragStart - (delta + 7), origin, span), wrapShowcasePosition(wrapped - 7, origin, span));
  }
});

test('empty geometry is safe before the dialog is laid out', () => {
  assert.equal(wrapShowcasePosition(100, 0, 0), 100);
  assert.equal(nextShowcasePosition(100, 0, 0, 1), 100);
});
