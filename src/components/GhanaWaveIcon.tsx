interface GhanaWaveIconProps extends React.SVGProps<SVGSVGElement> {}

export function GhanaWaveIcon(props: GhanaWaveIconProps) {
  return (
    <svg
      width="64"
      height="80"
      viewBox="0 0 64 80"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs>
        <linearGradient id="gradWave" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8E44AD" />
          <stop offset="100%" stopColor="#FF4D8D" />
        </linearGradient>
        <clipPath id="ghanaClipWave">
          <path d="M20 2 L44 2 L50 18 L60 30 L58 60 L40 78 L18 74 L8 50 L10 30 L18 18 Z" />
        </clipPath>
      </defs>
      <path
        d="M20 2 L44 2 L50 18 L60 30 L58 60 L40 78 L18 74 L8 50 L10 30 L18 18 Z"
        fill="#FF4D8D"
        opacity="0.12"
      />
      <g clipPath="url(#ghanaClipWave)">
        <path
          id="wave"
          d="M0 50 Q16 45 32 50 T64 50 V80 H0 Z"
          fill="url(#gradWave)"
        >
          <animateTransform
            attributeName="transform"
            type="translate"
            from="0,30"
            to="0,-2"
            dur="1.5s"
            fill="freeze"
          />
          <animate
            attributeName="d"
            dur="2s"
            repeatCount="indefinite"
            values="M0 50 Q16 45 32 50 T64 50 V80 H0 Z;M0 50 Q16 55 32 50 T64 50 V80 H0 Z;M0 50 Q16 45 32 50 T64 50 V80 H0 Z"
          />
        </path>
      </g>
      <path
        d="M20 2 L44 2 L50 18 L60 30 L58 60 L40 78 L18 74 L8 50 L10 30 L18 18 Z"
        fill="none"
        stroke="#8E44AD"
        strokeWidth="1.5"
      />
    </svg>
  );
}
