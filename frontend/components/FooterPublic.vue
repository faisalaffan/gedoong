<script setup lang="ts">
const config = useRuntimeConfig();
const appName = config.public.appName;
const appDescription = config.public.appDescription;
const appLogoTransparent = config.public.appLogoTransparent;
const copyrightText = config.public.copyrightText;
const githubRepo = config.public.githubRepo;
</script>

<template>
  <footer class="footer">
    <div class="footer-inner">
      <div class="footer-brand">
        <div class="footer-logo">
          <img
            :src="appLogoTransparent"
            :alt="appName + ' Logo'"
            class="footer-logo-img"
          />
        </div>
        <p class="footer-desc">
          Gedoong adalah CRM properti <strong>open-core (MIT)</strong> untuk
          agen independen Indonesia. Kelola listing, pipeline transaksi, klien,
          dan komisi dalam satu dashboard — <strong>gratis</strong>, transparan,
          dan bisa di-self-host.
        </p>
      </div>
      <div class="footer-links">
        <div class="footer-col">
          <h4>Properti</h4>
          <NuxtLink to="/?propertyType=jual">Rumah Dijual</NuxtLink>
          <NuxtLink to="/?propertyType=sewa">Rumah Disewakan</NuxtLink>
          <NuxtLink to="/?propertyType=jual">Apartemen</NuxtLink>
          <NuxtLink to="/?propertyType=sewa">Kost</NuxtLink>
          <NuxtLink to="/?propertyType=jual">Ruko</NuxtLink>
        </div>
        <div class="footer-col">
          <h4>Perusahaan</h4>
          <NuxtLink to="/tentang">Tentang Kami</NuxtLink>
          <NuxtLink to="/karir">Karir</NuxtLink>
          <NuxtLink to="/kontak">Kontak</NuxtLink>
          <NuxtLink to="/blog">Blog</NuxtLink>
        </div>
        <div class="footer-col">
          <h4>Dukungan</h4>
          <NuxtLink to="/faq">FAQ</NuxtLink>
          <NuxtLink to="/bantuan">Pusat Bantuan</NuxtLink>
          <NuxtLink to="/syarat">Syarat & Ketentuan</NuxtLink>
          <NuxtLink to="/privasi">Kebijakan Privasi</NuxtLink>
        </div>
      </div>
    </div>
    <div class="footer-open-source">
      <div class="footer-open-source-inner">
        <svg
          class="footer-open-source-icon"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.605-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12 24 5.37 18.63 0 12 0z"
          />
        </svg>
        <p>
          <strong>Open Core (MIT)</strong> &mdash; Core CRM Gedoong 100% open
          source.
          <a :href="githubRepo" target="_blank" rel="noopener noreferrer"
            >Lihat kode kami di GitHub &rarr;</a
          >
        </p>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; {{ new Date().getFullYear() }} {{ copyrightText }}</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: #061120;
  color: var(--text-muted);
  margin-top: 80px;
  border-top: 1px solid var(--border-light);
  font-family: var(--font-body);
}

.footer-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 64px 24px 48px;
  display: grid;
  grid-template-columns: 1.2fr 2fr;
  gap: 48px;
}

.footer-logo {
  margin-bottom: 16px;
}

.footer-logo-img {
  height: 44px;
  width: auto;
  object-fit: contain;
  filter: brightness(0) invert(1); /* Ensure perfect high-contrast white on dark theme */
  opacity: 0.95;
  transition: transform var(--transition-fast);
}

.footer-logo-img:hover {
  transform: scale(1.02);
}

.footer-desc {
  font-size: 14px;
  line-height: 1.7;
  color: #8c93a6;
  max-width: 320px;
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}

.footer-col h4 {
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 20px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.footer-col a {
  display: block;
  font-size: 14px;
  color: #8c93a6;
  text-decoration: none;
  margin-bottom: 12px;
  transition: all var(--transition-fast);
}

.footer-col a:hover {
  color: var(--secondary);
  transform: translateX(2px);
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.04);
  padding: 24px 24px;
  text-align: center;
  font-size: 13px;
  color: #5d6475;
}

.footer-open-source {
  background: rgba(255, 255, 255, 0.02);
  border-top: 1px solid rgba(255, 255, 255, 0.04);
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

.footer-open-source-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.footer-open-source-icon {
  width: 18px;
  height: 18px;
  color: #8c93a6;
  flex-shrink: 0;
}

.footer-open-source-inner p {
  font-size: 13px;
  color: #8c93a6;
  margin: 0;
}

.footer-open-source-inner p strong {
  color: #fff;
  font-weight: 600;
}

.footer-open-source-inner a {
  color: var(--secondary);
  text-decoration: none;
  font-weight: 500;
  transition: color var(--transition-fast);
}

.footer-open-source-inner a:hover {
  color: #fff;
}

@media (max-width: 768px) {
  .footer-inner {
    grid-template-columns: 1fr;
    gap: 40px;
    padding: 48px 20px 32px;
  }

  .footer-links {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
}
</style>
