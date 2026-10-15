// Keep the visible position in the middle copy without changing the picture.
export function wrapShowcasePosition(position, origin, span) {
  if (span <= 0) return position;
  return origin + ((position - origin) % span + span) % span;
}

export function nextShowcasePosition(position, origin, step, direction) {
  if (step <= 0) return position;
  const card = (position - origin) / step;
  // A small tolerance avoids skipping a card because of subpixel rounding.
  const index = direction > 0 ? Math.floor(card + 0.002) + 1 : Math.ceil(card - 0.002) - 1;
  return origin + index * step;
}
