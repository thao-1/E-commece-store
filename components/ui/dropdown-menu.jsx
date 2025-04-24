"use client"

import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"

export function DropdownMenu({ children, ...props }) {
  return <div className="relative inline-block text-left" {...props}>{children}</div>
}

export function DropdownMenuTrigger({ children, asChild, ...props }) {
  return (
    <button 
      type="button" 
      className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500" 
      {...props}
    >
      {children}
    </button>
  )
}

export function DropdownMenuContent({ children, align = "right", ...props }) {
  return (
    <div 
      className={`origin-top-${align} absolute ${align}-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50`}
      {...props}
    >
      <div className="py-1">{children}</div>
    </div>
  )
}

export function DropdownMenuItem({ children, className = "", ...props }) {
  return (
    <div 
      className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer ${className}`}
      role="menuitem"
      {...props}
    >
      {children}
    </div>
  )
}

export function DropdownMenuLabel({ children, className = "", ...props }) {
  return (
    <div 
      className={`block px-4 py-2 text-sm text-gray-700 font-medium ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export function DropdownMenuSeparator({ className = "", ...props }) {
  return (
    <div 
      className={`border-t border-gray-100 my-1 ${className}`}
      role="separator"
      {...props}
    />
  )
}
