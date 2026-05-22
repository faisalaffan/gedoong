export default defineNuxtConfig({
  compatibilityDate: '2026-05-03',
  devtools: { enabled: true },

  app: {
    head: {
      htmlAttrs: { lang: 'id' },
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&display=swap' },
      ],
    },
  },

  modules: ['@nuxtjs/supabase'],

  supabase: {
    url: process.env.SUPABASE_URL || 'https://pkcjhfuelyexpsypqcct.supabase.co',
    key: process.env.SUPABASE_KEY || 'sb_publishable_RY2OFo6z33oRZlIVMh3Lyg_-asO0pQI',
    redirect: false,
  },

  css: ['~/assets/css/global.css'],

  devServer: {
    port: 3000,
  },
})
