"use client"

import React, { useState } from "react"

export function Sheet({ children }) {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <SheetContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </SheetContext.Provider>
  )
}

const SheetContext = React.createContext({
  isOpen: false,
  setIsOpen: () => {},
})

export function SheetTrigger({ children, asChild }) {
  const { setIsOpen } = React.useContext(SheetContext)
  
  const handleClick = () => {
    setIsOpen(prev => !prev)
  }
  
  if (asChild) {
    return React.cloneElement(React.Children.only(children), {
      onClick: handleClick,
    })
  }
  
  return (
    <button onClick={handleClick}>
      {children}
    </button>
  )
}

export function SheetContent({ children, side = "right" }) {
  const { isOpen, setIsOpen } = React.useContext(SheetContext)
  
  if (!isOpen) return null
  
  const sideStyles = {
    right: "right-0",
    left: "left-0",
    top: "top-0",
    bottom: "bottom-0",
  }
  
  const sizeStyles = {
    right: "h-full w-[300px]",
    left: "h-full w-[300px]",
    top: "w-full h-[300px]",
    bottom: "w-full h-[300px]",
  }
  
  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-50"
        onClick={() => setIsOpen(false)}
      />
      <div 
        className={`fixed ${sideStyles[side]} ${sizeStyles[side]} bg-white p-6 shadow-lg z-50 overflow-auto`}
      >
        {children}
      </div>
    </>
  )
}
