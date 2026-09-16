import * as SecureStore from 'expo-secure-store'
import { Platform } from 'react-native'

// Tokens ficam no Keychain (iOS) / Keystore (Android). No web (só dev) cai no localStorage.
const isWeb = Platform.OS === 'web'

export const secureStorage = {
  async get(key: string): Promise<string | null> {
    if (isWeb) return globalThis.localStorage?.getItem(key) ?? null
    return SecureStore.getItemAsync(key)
  },
  async set(key: string, value: string): Promise<void> {
    if (isWeb) return globalThis.localStorage?.setItem(key, value)
    await SecureStore.setItemAsync(key, value)
  },
  async remove(key: string): Promise<void> {
    if (isWeb) return globalThis.localStorage?.removeItem(key)
    await SecureStore.deleteItemAsync(key)
  },
}
