import { useQuery } from '@tanstack/react-query'
import { Stack } from 'expo-router'
import { useEffect } from 'react'

import { authApi } from '@/services/auth.api'
import { useAuthStore } from '@/stores/authStore'
import { colors } from '@/theme/colors'

export default function AppLayout() {
  const setUser = useAuthStore((s) => s.setUser)
  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: async () => (await authApi.me()).data,
  })

  useEffect(() => {
    if (user) setUser(user)
  }, [user, setUser])

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.navy },
        headerTintColor: colors.white,
        headerTitleStyle: { fontWeight: '600' },
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="transaction/new" options={{ title: 'Nova transação', presentation: 'modal' }} />
    </Stack>
  )
}
