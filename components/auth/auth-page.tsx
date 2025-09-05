"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { LoginForm } from "./login-form"
import { RegisterForm } from "./register-form"
import { Building2 } from "lucide-react"

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">PropertySync</h1>
          <p className="text-slate-600 mt-2">Property Calendar Management</p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-0">
            {isLogin ? (
              <LoginForm onToggleMode={() => setIsLogin(false)} />
            ) : (
              <RegisterForm onToggleMode={() => setIsLogin(true)} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
