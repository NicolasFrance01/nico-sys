import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null
        }
        
        const user = await prisma.user.findUnique({
          where: {
            username: credentials.username as string
          }
        })
        
        if (!user) {
          return null
        }
        
        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        )
        
        if (!isPasswordValid) {
          return null
        }
        
        return {
          id: user.id,
          name: user.username,
          role: user.role,
        }
      }
    })
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string
      }
      return session
    }
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.AUTH_SECRET,
})
