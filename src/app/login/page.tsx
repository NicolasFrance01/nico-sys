'use client'

import { useActionState } from 'react'
import { authenticate } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import { motion } from 'framer-motion'

export default function LoginPage() {
  const [errorMessage, dispatch, isPending] = useActionState(authenticate, undefined)

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-zinc-950 -z-10" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="flex justify-center mb-8">
          <Image 
            src="/logosys.png" 
            alt="NicoSys Manager" 
            width={180} 
            height={60}
            className="object-contain"
            priority
          />
        </div>
        
        <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur-xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-semibold tracking-tight text-zinc-100">
              Bienvenido de vuelta
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Ingresa tus credenciales para acceder al sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={dispatch} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-zinc-300">Usuario</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="nfrance"
                  required
                  className="bg-zinc-950 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-zinc-700"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-zinc-300">Contraseña</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="bg-zinc-950 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-zinc-700"
                />
              </div>
              
              {errorMessage && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="text-sm text-red-500 bg-red-500/10 border border-red-500/20 p-3 rounded-md"
                >
                  {errorMessage}
                </motion.div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-zinc-100 text-zinc-900 hover:bg-zinc-200 mt-2"
                disabled={isPending}
              >
                {isPending ? 'Iniciando sesión...' : 'Ingresar al Dashboard'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
