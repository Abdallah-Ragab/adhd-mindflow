import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const secret = new TextEncoder().encode(process.env.JWT_SECRET)

export async function createToken(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret)
}

export async function verifyAuth(token: string) {
  try {
    const verified = await jwtVerify(token, secret)
    return verified.payload
  } catch (err) {
    throw new Error('Your token has expired.')
  }
}

export async function getSession() {
  const token = cookies().get('token')?.value
  if (!token) return null
  try {
    return await verifyAuth(token)
  } catch (err) {
    return null
  }
}
