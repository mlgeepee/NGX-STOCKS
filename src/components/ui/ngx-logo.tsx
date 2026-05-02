import * as React from "react";

function LogoFrame({
  children,
  ...props
}: React.SVGProps<SVGSVGElement> & { children: React.ReactNode }) {
  const gradientId = React.useId();

  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={gradientId} x1="4" y1="3.5" x2="20" y2="21">
          <stop offset="0%" stopColor="#0f8a5f" />
          <stop offset="58%" stopColor="#137e71" />
          <stop offset="100%" stopColor="#d2a14a" />
        </linearGradient>
      </defs>

      <rect
        x="2.25"
        y="2.25"
        width="19.5"
        height="19.5"
        rx="6"
        fill={`url(#${gradientId})`}
      />
      <rect
        x="2.85"
        y="2.85"
        width="18.3"
        height="18.3"
        rx="5.4"
        stroke="rgba(255,255,255,0.22)"
        strokeWidth="0.9"
      />
      <path
        d="M5.9 16.6C8 15.2 9.5 13.4 11 11.7C12.2 10.4 13.2 9.2 14.3 8.8C15.2 8.5 16.1 8.6 17.1 9.1"
        stroke="rgba(255,255,255,0.16)"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      {children}
    </svg>
  );
}

export const NGXLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <LogoFrame {...props}>
    <rect x="6.35" y="11.9" width="1.95" height="5.2" rx="0.98" fill="white" />
    <rect x="10.15" y="9.35" width="1.95" height="7.75" rx="0.98" fill="white" />
    <rect x="13.95" y="6.95" width="1.95" height="10.15" rx="0.98" fill="white" />
    <path
      d="M6.95 14.95L10.35 12.1L13.4 13.05L17.3 8.25"
      stroke="#fff3d8"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="17.3" cy="8.25" r="1.15" fill="#fff3d8" />
  </LogoFrame>
);

export const SimpleNGXLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <LogoFrame {...props}>
    <rect x="6.5" y="12.05" width="2.1" height="4.95" rx="1.05" fill="white" />
    <rect x="10.55" y="9.75" width="2.1" height="7.25" rx="1.05" fill="white" />
    <path
      d="M8.1 14.55L12.05 11.25L15.95 8.55"
      stroke="#fff3d8"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="15.95" cy="8.55" r="1.15" fill="#fff3d8" />
  </LogoFrame>
);
