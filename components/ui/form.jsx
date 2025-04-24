"use client"

import React from "react"

export function Form({ className = "", ...props }) {
  return (
    <form className={className} {...props} />
  )
}

export function FormField({ name, children, className = "", ...props }) {
  return (
    <div className={`space-y-2 ${className}`} {...props}>
      {children}
    </div>
  )
}

export function FormItem({ className = "", ...props }) {
  return (
    <div className={`space-y-1 ${className}`} {...props} />
  )
}

export function FormLabel({ className = "", ...props }) {
  return (
    <label
      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
      {...props}
    />
  )
}

export function FormControl({ className = "", ...props }) {
  return (
    <div className={`mt-2 ${className}`} {...props} />
  )
}

export function FormDescription({ className = "", ...props }) {
  return (
    <p
      className={`text-sm text-muted-foreground ${className}`}
      {...props}
    />
  )
}

export function FormMessage({ className = "", children, ...props }) {
  return children ? (
    <p
      className={`text-sm font-medium text-destructive ${className}`}
      {...props}
    >
      {children}
    </p>
  ) : null
}
