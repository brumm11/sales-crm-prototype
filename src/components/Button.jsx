// Reusable button with full state coverage: default / hover / focus-visible /
// active(pressed) / disabled / loading. Used consistently across all screens.
// Every variant honours a 44px minimum tap target (Fitts's Law).

const base =
  'relative inline-flex items-center justify-center gap-2 font-semibold ' +
  'rounded-2xl select-none transition-all duration-150 ease-out ' +
  'focus-ring active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50';

const sizes = {
  md: 'h-11 px-4 text-sm min-w-[44px]',
  lg: 'h-12 px-5 text-base w-full',
  icon: 'h-11 w-11',
};

const variants = {
  primary:
    'bg-accent-600 text-white shadow-sm hover:bg-accent-700 active:bg-accent-700',
  secondary:
    'bg-white text-ink border border-neutral-200 shadow-sm hover:bg-neutral-50 hover:border-neutral-300 active:bg-neutral-100',
  ghost:
    'bg-transparent text-ink-soft hover:bg-neutral-100 active:bg-neutral-200',
  subtle:
    'bg-neutral-100 text-ink hover:bg-neutral-200 active:bg-neutral-200',
  danger:
    'bg-white text-rose-600 border border-rose-200 hover:bg-rose-50 active:bg-rose-100',
};

export default function Button({
  as: Tag = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  children,
  ...rest
}) {
  const isDisabled = disabled || loading;
  return (
    <Tag
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      disabled={Tag === 'button' ? isDisabled : undefined}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading && (
        <span
          className="absolute inline-flex h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent opacity-90"
          aria-hidden="true"
        />
      )}
      <span className={`inline-flex items-center gap-2 ${loading ? 'opacity-0' : ''}`}>
        {children}
      </span>
    </Tag>
  );
}
