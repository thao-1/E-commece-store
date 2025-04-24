"use client"

import React, { createContext, useContext, useState } from "react"

const TabsContext = createContext({
  selectedTab: "",
  setSelectedTab: () => {},
})

export function Tabs({ children, defaultValue }) {
  const [selectedTab, setSelectedTab] = useState(defaultValue)
  
  return (
    <TabsContext.Provider value={{ selectedTab, setSelectedTab }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  )
}

export function TabsList({ children, className = "" }) {
  return (
    <div className={`flex ${className}`}>
      {children}
    </div>
  )
}

export function TabsTrigger({ children, value, className = "" }) {
  const { selectedTab, setSelectedTab } = useContext(TabsContext)
  
  return (
    <button
      className={`px-4 py-2 text-sm font-medium ${
        selectedTab === value 
          ? "bg-primary text-primary-foreground" 
          : "bg-background hover:bg-muted"
      } ${className}`}
      onClick={() => setSelectedTab(value)}
    >
      {children}
    </button>
  )
}

export function TabsContent({ children, value, className = "" }) {
  const { selectedTab } = useContext(TabsContext)
  
  if (selectedTab !== value) return null
  
  return (
    <div className={className}>
      {children}
    </div>
  )
}
