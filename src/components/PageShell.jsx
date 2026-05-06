export default function PageShell({
  title,
  subtitle,
  children,
  actions = null,
  hideTitle = false,
}) {
  const shouldShowTitle = !hideTitle && (title || subtitle);
  const shouldShowHeader = shouldShowTitle || actions;

  return (
    <section className="space-y-5">
      {shouldShowHeader ? (
        <div className="flex flex-wrap items-start justify-between gap-4">
          {shouldShowTitle ? (
            <div>
              {title ? (
                <h2 className="text-2xl font-black text-slate-900">
                  {title}
                </h2>
              ) : null}

              {subtitle ? (
                <p className="text-slate-500 mt-1">
                  {subtitle}
                </p>
              ) : null}
            </div>
          ) : (
            <div />
          )}

          {actions ? (
            <div className="flex flex-wrap items-center gap-2">
              {actions}
            </div>
          ) : null}
        </div>
      ) : null}

      {children}
    </section>
  );
}