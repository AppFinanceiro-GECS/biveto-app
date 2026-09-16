function base64UrlDecode(input: string): string {
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4)
  return atob(padded)
}

export function decodeToken(token: string): { exp?: number; sub?: string; type?: string } | null {
  try {
    const payload = token.split('.')[1]
    if (!payload) return null
    return JSON.parse(base64UrlDecode(payload))
  } catch {
    return null
  }
}

/** true se o token não existe, é inválido ou expira dentro de `bufferSeconds`. */
export function isTokenExpired(token: string | null, bufferSeconds = 30): boolean {
  if (!token) return true
  const payload = decodeToken(token)
  if (!payload?.exp) return true
  return Date.now() >= (payload.exp - bufferSeconds) * 1000
}
