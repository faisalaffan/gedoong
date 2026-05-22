export default defineNuxtConfig({
  compatibilityDate: '2026-05-03',
  devtools: { enabled: true },

  app: {
    head: {
      htmlAttrs: { lang: 'id' },
      title: process.env.APP_NAME || 'Gedoong',
      titleTemplate: `%s - ${process.env.APP_NAME || 'Gedoong'}`,
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&display=swap' },
      ],
    },
  },

  runtimeConfig: {
    public: {
      appName: process.env.APP_NAME || 'Gedoong',
      appDescription: process.env.APP_DESCRIPTION || 'CRM Properti untuk Agen Independen Indonesia',
      appLogo: process.env.APP_LOGO || '/03_LOGO_MAIN.png',
      appLogoTransparent: process.env.APP_LOGO_TRANSPARENT || '/02_LOGO_TRANSPARENT.png',
      appBanner: process.env.APP_BANNER || '/01_BANNER.png',
      supportEmail: process.env.SUPPORT_EMAIL || 'support@gedoong.id',
      supportPhone: process.env.SUPPORT_PHONE || '0812-3456-7890',
      copyrightText: process.env.COPYRIGHT_TEXT || 'Gedoong. Seluruh hak cipta dilindungi.',
    }
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

