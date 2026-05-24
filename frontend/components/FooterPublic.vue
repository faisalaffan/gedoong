<script setup lang="ts">
const config = useRuntimeConfig();
const appName = config.public.appName;
const appDescription = config.public.appDescription;
const appLogoTransparent = config.public.appLogoTransparent;
const copyrightText = config.public.copyrightText;
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
          {{ appDescription }}
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
    <div class="footer-bottom">
      <p>
        &copy; {{ new Date().getFullYear() }} {{ copyrightText }}
      </p>
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
