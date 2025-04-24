"use client"

import React from "react"

export function RadioGroup({ className = "", ...props }) {
  return (
    <div className={`grid gap-2 ${className}`} {...props} />
  )
}

export function RadioGroupItem({ children, value, name, id, className = "", ...props }) {
  return (
    <div className="flex items-center space-x-2">
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        className={`h-4 w-4 text-primary border-gray-300 focus:ring-primary ${className}`}
        {...props}
      />
      <label htmlFor={id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {children}
      </label>
    </div>
  )
}
