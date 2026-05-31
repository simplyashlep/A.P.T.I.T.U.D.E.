import React from "react"

// A.P.T.I.T.U.D.E. scale/balance logo as SVG
const ScaleLogo = ({ className = "", ...props }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path
      d="M50 10v80M20 30l30 20 30-20M20 70l30-20 30 20"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <circle cx="50" cy="10" r="3" fill="currentColor" />
  </svg>
)

// A.P.T.I.T.U.D.E. wordmark SVG
const Wordmark = ({ className = "", ...props }) => (
  <svg
    viewBox="0 0 400 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <text
      x="0"
      y="45"
      fontFamily="'Playfair Display', Georgia, serif"
      fontSize="42"
      fontWeight="700"
      letterSpacing="8"
      fill="currentColor"
    >
      A<tspan fill="#C8A97E">.</tspan>P<tspan fill="#C8A97E">.</tspan>T<tspan fill="#C8A97E">.</tspan>I<tspan fill="#C8A97E">.</tspan>T<tspan fill="#C8A97E">.</tspan>U<tspan fill="#C8A97E">.</tspan>D<tspan fill="#C8A97E">.</tspan>E<tspan fill="#C8A97E">.</tspan>
    </text>
  </svg>
)

export { ScaleLogo, Wordmark }
