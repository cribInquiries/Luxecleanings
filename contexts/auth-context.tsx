"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  email: string
  name: string
  role: "admin" | "manager" | "viewer"
  avatar?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Demo users for testing
const demoUsers: User[] = [
  {
    id: "1",
    email: "admin@example.com",
    name: "Admin User",
    role: "admin",
    avatar: "/placeholder.svg?height=32&width=32&text=A",
  },
  {
    id: "2",
    email: "manager@example.com",
    name: "Property Manager",
    role: "manager",
    avatar: "/placeholder.svg?height=32&width=32&text=M",
  },
  {
    id: "3",
    email: "viewer@example.com",
    name: "Viewer User",
    role: "viewer",
    avatar: "/placeholder.svg?height=32&width=32&text=V",
  },
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on mount
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        localStorage.removeItem("user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Demo authentication - check against demo users
    const demoUser = demoUsers.find((u) => u.email === email)
    const validPasswords = {
      "admin@example.com": "admin123",
      "manager@example.com": "manager123",
      "viewer@example.com": "viewer123",
    }

    if (demoUser && validPasswords[email as keyof typeof validPasswords] === password) {
      setUser(demoUser)
      localStorage.setItem("user", JSON.stringify(demoUser))
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check if user already exists
    if (demoUsers.some((u) => u.email === email)) {
      setIsLoading(false)
      return false
    }

    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      role: "viewer",
      avatar: `/placeholder.svg?height=32&width=32&text=${name.charAt(0).toUpperCase()}`,
    }

    setUser(newUser)
    localStorage.setItem("user", JSON.stringify(newUser))
    setIsLoading(false)
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
