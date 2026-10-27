import { Component } from 'solid-js';

interface BarcodeProps {
  value: string;
  class?: string;
}

/** Decorative barcode derived from a string. Not scannable. */
const Barcode: Component<BarcodeProps> = (props) => {
  const bars = () => {
    const out: { x: number; w: number }[] = [];
    let x = 0;
    for (const ch of props.value) {
      const code = ch.charCodeAt(0);
      for (let i = 0; i < 3; i++) {
        const w = ((code >> (i * 2)) & 3) + 1;
        out.push({ x, w });
        x += w + ((code >> (i + 1)) & 1) + 1;
      }
    }
    return { out, width: x };
  };

  return (
    <svg
      class={props.class}
      viewBox={`0 0 ${bars().width} 40`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {bars().out.map((b) => (
        <rect x={b.x} y="0" width={b.w} height="40" fill="currentColor" />
      ))}
    </svg>
  );
};

export default Barcode;
