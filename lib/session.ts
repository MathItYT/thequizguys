'use server'

import { JWTPayload, SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { DiscordData, getDiscordData } from './discord-data'
import { cache } from 'react'
import { NextRequest, NextResponse } from 'next/server'
 
const secretKey = process.env.SESSION_SECRET
const encodedKey = new TextEncoder().encode(secretKey)

export interface SessionPayload extends JWTPayload, DiscordData {
  user: DiscordData['user']
  roles: DiscordData['roles'],
}
 
export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey)
}
 
export async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify<SessionPayload>(session, encodedKey, {
      algorithms: ['HS256'],
    })
    return payload
  } catch {
    return null
  }
}

export async function createSession(code: string) {
  try {
    const { user, roles } = await getDiscordData(code);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    const session = await encrypt({
      user,
      roles,
    });
    const cookieStore = await cookies()

    cookieStore.set('session', session, {
      httpOnly: true,
      secure: true,
      expires: expiresAt,
      sameSite: 'lax',
      path: '/',
    })

    return true
  } catch (e) {
    console.error(e)
    return false
  }
}

export const verifySession = cache(async (req: NextRequest) => {
  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)

  if (!session) {
    return NextResponse.redirect(new URL(process.env.DISCORD_LOGIN_URL!, req.url))
  }
  
  return NextResponse.next()
})

export const getSessionData = cache(async () => {
  const cookie = (await cookies()).get('session')?.value
  return await decrypt(cookie)
})

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
}