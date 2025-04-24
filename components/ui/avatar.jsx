"use client"

import React from "react"

export function Avatar({ children, className = "" }) {
  return (
    <div className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`}>
      {children}
    </div>
  )
}

export function AvatarImage({ src, alt = "", className = "" }) {
  return src ? (
    <img 
      src={src} 
      alt={alt} 
      className={`aspect-square h-full w-full object-cover ${className}`}
    />
  ) : null
}

export function AvatarFallback({ children, className = "" }) {
  return (
    <div className={`flex h-full w-full items-center justify-center rounded-full bg-muted ${className}`}>
      {children}
    </div>
  )
}
