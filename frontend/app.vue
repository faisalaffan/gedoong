<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { watch } from 'vue'

const route = useRoute()
const router = useRouter()
const user = useSupabaseUser()

// Clean up auth query parameters (?code=... or ?error=...) once session is established
watch(user, (newUser) => {
  if (newUser && (route.query.code || route.query.error)) {
    const query = { ...route.query }
    delete query.code
    delete query.error
    
    router.replace({
      path: route.path,
      query,
      hash: route.hash
    })
  }
}, { immediate: true })
</script>
