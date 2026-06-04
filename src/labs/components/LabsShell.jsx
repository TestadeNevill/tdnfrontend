import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { LabsGridBackground } from "./LabsGridBackground";

export function LabsShell({
  title,
  subtitle,
  breadcrumb,
  children,
  fillViewport = true,
}) {
  const rootRef = useRef(null);
  const pointerRef = useRef(null);
  const requestFrameRef = useRef(null);
  const [active, setActive] = useState(false);

  const applyPointer = useCallback((clientX, clientY) => {
    const el = rootRef.current;
    if (el == null) return;
    const r = el.getBoundingClientRect();
    if (r.width <= 0 || r.height <= 0) return;
    pointerRef.current = {
      x: Math.min(1, Math.max(0, (clientX - r.left) / r.width)),
      y: Math.min(1, Math.max(0, (clientY - r.top) / r.height)),
    };
    requestFrameRef.current?.();
  }, []);

  const onMouseMove = useCallback(
    (e) => {
      applyPointer(e.clientX, e.clientY);
    },
    [applyPointer],
  );

  const resetWarp = useCallback(() => {
    pointerRef.current = null;
    requestFrameRef.current?.();
  }, []);

  const onMouseEnter = useCallback(() => {
    setActive(true);
    requestFrameRef.current?.();
  }, []);

  const onMouseLeave = useCallback(() => {
    setActive(false);
    resetWarp();
  }, [resetWarp]);

  useEffect(() => {
    requestFrameRef.current?.();
  }, [active]);

  return (
    <div
      ref={rootRef}
      className={[
        "labs-root",
        active ? "labs-root--active" : "",
        fillViewport ? "labs-root--fill flex flex-col" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <LabsGridBackground
        active={active}
        pointerRef={pointerRef}
        requestFrameRef={requestFrameRef}
      />
      <div className="labs-container relative z-10 py-6 md:py-8">
        {breadcrumb != null && breadcrumb.length > 0 && (
          <nav className="mb-4 text-xs font-labsMono text-labs-textMuted" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1">
              {breadcrumb.map((b, i) => (
                <li key={`${b.label}-${i}`} className="flex items-center gap-1">
                  {i > 0 && <span className="text-labs-border">/</span>}
                  {b.to != null ? (
                    <Link to={b.to} className="hover:text-labs-accent">
                      {b.label}
                    </Link>
                  ) : (
                    <span className="text-labs-text">{b.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        <header className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-labs-text md:text-3xl">
            {title}
          </h1>
          {subtitle != null && (
            <p className="mt-2 max-w-4xl text-lg text-labs-textMuted md:text-xl">
              {subtitle}
            </p>
          )}
        </header>
        <div className="space-y-4">{children}</div>
      </div>
    </div>
  );
}
