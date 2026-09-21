import { useEffect, useRef } from "react";

export function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const cursor = ref.current;
    if (!cursor || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let x = innerWidth / 2, y = innerHeight / 2, tx = x, ty = y, raf = 0;
    const move = (event: PointerEvent) => { tx = event.clientX; ty = event.clientY; cursor.dataset.visible = "true"; };
    const tick = () => { x += (tx - x) * 0.18; y += (ty - y) * 0.18; cursor.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`; raf = requestAnimationFrame(tick); };
    const over = (event: PointerEvent) => cursor.toggleAttribute("data-active", Boolean((event.target as Element).closest("a, button, [data-cursor]")));
    window.addEventListener("pointermove", move);
    document.addEventListener("pointerover", over);
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("pointermove", move); document.removeEventListener("pointerover", over); };
  }, []);
  return <div ref={ref} className="custom-cursor" aria-hidden="true" />;
}