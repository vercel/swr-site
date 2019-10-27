import React from 'react'

const Logo = () => {
  return (
    <svg height={50} viewBox="0 0 226 200">
      <defs>
        <linearGradient x1="196.572%" y1="228.815%" x2="50%" y2="50%" id="a">
          <stop offset="0%" stopColor="var(--bg)" />
          <stop offset="100%" stopColor="var(--fg)" />
        </linearGradient>
      </defs>
      <path
        fill="url(#a)"
        d="M254 156.46L367 356H141z"
        transform="translate(-141 -156)"
      />
    </svg>
  )
}

export default Logo
