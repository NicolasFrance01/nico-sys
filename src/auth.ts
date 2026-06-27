import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { authConfig } from "./auth.config"

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log('Login attempt for:', credentials?.username)
        if (!credentials?.username || !credentials?.password) {
          console.log('Missing credentials')
          return null
        }
        
        try {
          const user = await prisma.user.findUnique({
            where: {
              username: credentials.username as string
            }
          })
          
          if (!user) {
            console.log('User not found in DB')
            return null
          }
          
          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            user.password
          )
          
          if (!isPasswordValid) {
            console.log('Invalid password')
            return null
          }
          
          console.log('Login successful for:', user.username)
          return {
            id: user.id,
            name: user.username,
            role: user.role,
          }
        } catch (err) {
          console.error('Error during authorization:', err)
          return null
        }
      }
    })
  ]
})
