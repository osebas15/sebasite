let observer: IntersectionObserver | undefined;

function getObserver(): IntersectionObserver | undefined {
  if (typeof IntersectionObserver === 'undefined') return undefined;
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.setAttribute('data-visible', '');
          observer?.unobserve(entry.target);
        }
      }
    },
    { rootMargin: '0px 0px -10% 0px' },
  );
  return observer;
}

/** Use as `ref={reveal}`; sets `data-visible` once the element scrolls into view. */
export function reveal(el: Element) {
  const io = getObserver();
  if (io) io.observe(el);
  else el.setAttribute('data-visible', '');
}
