import crypto from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 16

const getMasterKey = () => {
  const key = process.env.MASTER_KEY
  if (!key || key.length !== 32) {
    throw new Error('MASTER_KEY must be exactly 32 characters long.')
  }
  return key
}

export const encrypt = (text: string): string => {
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(getMasterKey()), iv)
  
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  
  const authTag = cipher.getAuthTag().toString('hex')
  
  return `${iv.toString('hex')}:${authTag}:${encrypted}`
}

export const decrypt = (encryptedText: string): string => {
  const parts = encryptedText.split(':')
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted text format')
  }
  
  const [ivHex, authTagHex, encrypted] = parts
  
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    Buffer.from(getMasterKey()),
    Buffer.from(ivHex, 'hex')
  )
  
  decipher.setAuthTag(Buffer.from(authTagHex, 'hex'))
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  
  return decrypted
}
