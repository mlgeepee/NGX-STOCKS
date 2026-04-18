import * as React from "react";

export const NGXLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 2L2 7v10l10 5 10-5V7l-10-5z" fill="oklch(var(--primary))" />
    <path
      d="M12 6v12M8 10l4 2 4-2"
      stroke="#ffffff"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <text
      x="12"
      y="16"
      textAnchor="middle"
      fill="#ffffff"
      fontSize="6"
      fontWeight="bold"
      fontFamily="Arial, sans-serif"
    >
      NGX
    </text>
  </svg>
);

export const SimpleNGXLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="4" y="6" width="16" height="12" rx="3" fill="oklch(var(--primary))" />
    <text
      x="12"
      y="16"
      textAnchor="middle"
      fill="#ffffff"
      fontSize="8"
      fontWeight="bold"
      fontFamily="Arial, sans-serif"
    >
      NGX
    </text>
  </svg>
);
