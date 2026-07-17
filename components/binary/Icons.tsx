export function ArrowIcon({ className = '' }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className={className} aria-hidden="true">
      <path d="M3 9h12m0 0-5-5m5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PlusIcon({ className = '' }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className={className} aria-hidden="true">
      <path d="M9 2.5v13M2.5 9h13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function StudioMark({ className = '' }: { className?: string }) {
  return (
    <img
      src="/brand/er-yuan-window-mark.svg"
      alt=""
      className={`block object-contain object-center ${className}`}
      aria-hidden="true"
      draggable={false}
    />
  );
}

export function AnnotationLayer() {
  return (
    <svg viewBox="0 0 560 720" className="absolute inset-0 h-full w-full" fill="none" aria-hidden="true">
      <path d="M72 92h416v536H72z" stroke="currentColor" strokeOpacity="0.16" strokeWidth="1.5" />
      <path d="M115 146h330M115 574h330M112 150v420M448 150v420" stroke="currentColor" strokeOpacity="0.12" />
      <path d="M438 520c-48 12-101 7-148-13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="m298 502-12 4 7 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M153 223c24-26 59-42 103-49" stroke="#9d8ec7" strokeWidth="2" strokeLinecap="round" />
      <circle cx="468" cy="188" r="18" fill="#e9ff33" />
      <circle cx="104" cy="534" r="13" fill="currentColor" />
      <circle cx="476" cy="482" r="9" fill="currentColor" />
      <path d="M48 48h84M48 48v84M512 672h-84M512 672v-84" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
