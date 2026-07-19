/**
 * Tern bird logo – single color, inherits currentColor.
 * A stylized tern in flight rendered as an SVG.
 */
export default function TernLogo({ size = 18, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Tern bird in flight – single color silhouette */}
      <path
        d="M2 12.5C2 12.5 5.5 10 8 9.5C10.5 9 12 9.5 12 9.5L22 5C22 5 18 8.5 16 9.5C14 10.5 12.5 10.5 12.5 10.5C12.5 10.5 16 11 18 11.5C20 12 22 13 22 13C22 13 17 13.5 14.5 13C12 12.5 10.5 11.5 10.5 11.5L4 14.5C4 14.5 6 13.5 8 13C8 13 5 14 3.5 15.5C2 17 2 19 2 19C2 19 1.5 16 2 14.5C2.5 13 4 12 4 12L2 12.5Z"
        fill="currentColor"
      />
      {/* Tail feathers */}
      <path
        d="M3 15C3 15 2.5 17 3 18C3 18 3.5 16.5 4.5 15.5"
        fill="currentColor"
      />
      {/* Eye dot */}
      <circle cx="20" cy="6.5" r="0.75" fill="currentColor" />
    </svg>
  );
}
