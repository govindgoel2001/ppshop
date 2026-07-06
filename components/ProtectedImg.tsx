'use client';

/**
 * Image wrapper that deters casual saving: right-click menu blocked,
 * dragging disabled, pointer events routed to the wrapper. (A determined
 * visitor can always screenshot — this only removes the easy paths.)
 */
export function ProtectedImg({ src, alt }: { src: string; alt: string }) {
  return (
    <span
      className="pimg"
      onContextMenu={e => e.preventDefault()}
      onDragStart={e => e.preventDefault()}
    >
      <img src={src} alt={alt} loading="lazy" draggable={false} />
    </span>
  );
}
