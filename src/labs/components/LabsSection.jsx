export function LabsSection({ title, id, subtitle, children }) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-20">
      <header className="mb-4">
        <h2
          id={`${id}-heading`}
          className="text-xl font-bold tracking-tight text-labs-text md:text-2xl"
        >
          {title}
        </h2>
        {subtitle != null && (
          <p className="mt-1 max-w-3xl text-base text-labs-textMuted">{subtitle}</p>
        )}
      </header>
      {children}
    </section>
  );
}
