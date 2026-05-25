export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser()

  // Check if route requires dashboard authentication
  const isDashboardRoute = 
    to.meta.layout === 'dashboard' || 
    to.path.startsWith('/dashboard') || 
    ['/pipeline', '/listing', '/klien', '/komisi'].includes(to.path)

  // Make sure not to block public listing detail pages (e.g., /listing/[id])
  const isPublicListingDetail = to.path.startsWith('/listing/') && to.params.id

  // Check if we are in an active OAuth callback flow (hash parameters or query code/error)
  const isAuthCallback = 
    to.hash.includes('access_token') || 
    to.hash.includes('id_token') || 
    !!to.query.code || 
    !!to.query.error

  const requiresAuth = isDashboardRoute && !isPublicListingDetail && !isAuthCallback

  // 1. Redirect to login page if unauthenticated
  if (requiresAuth && !user.value) {
    return navigateTo('/masuk')
  }

  // 2. Redirect to dashboard if already logged in and trying to access /masuk or /daftar
  const isAuthRoute = ['/masuk', '/daftar'].includes(to.path)
  if (isAuthRoute && user.value) {
    return navigateTo('/dashboard')
  }
})
