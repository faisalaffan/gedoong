<script setup lang="ts">
const isOpen = ref(false)
const links = [
  { label: 'Beranda', to: '/' },
  { label: 'Cari Properti', to: '/cari' },
  { label: 'Tentang', to: '/tentang' },
]
</script>

<template>
  <header class="navbar">
    <div class="navbar-inner">
      <NuxtLink to="/" class="logo">
        <span class="logo-icon">🏠</span>
        <span class="logo-text">Gedoong</span>
      </NuxtLink>

      <nav class="nav-links" :class="{ open: isOpen }">
        <NuxtLink v-for="link in links" :key="link.to" :to="link.to" class="nav-link">
          {{ link.label }}
        </NuxtLink>
        <div class="nav-actions">
          <button class="btn-ghost">Masuk</button>
          <button class="btn-primary">Daftar Gratis</button>
        </div>
      </nav>

      <button class="hamburger" @click="isOpen = !isOpen" aria-label="Menu">
        <span :class="{ bar: true, open: isOpen }"></span>
        <span :class="{ bar: true, open: isOpen }"></span>
        <span :class="{ bar: true, open: isOpen }"></span>
      </button>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid #e8ecf1;
}

.navbar-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: #003d9b;
  font-weight: 700;
  font-size: 22px;
}

.logo-icon { font-size: 26px; }

.nav-links {
  display: flex;
  align-items: center;
  gap: 32px;
}

.nav-link {
  text-decoration: none;
  color: #434654;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.15s;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: #0052CC;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: 16px;
}

.btn-ghost {
  padding: 8px 20px;
  border: 1px solid #c3c6d6;
  border-radius: 8px;
  background: transparent;
  color: #434654;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.15s;
}

.btn-ghost:hover { border-color: #0052CC; color: #0052CC; }

.btn-primary {
  padding: 8px 20px;
  border: none;
  border-radius: 8px;
  background: #0052CC;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}

.btn-primary:hover { background: #003d9b; }

.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  padding: 4px;
  border: none;
  background: none;
  cursor: pointer;
}

.bar {
  display: block;
  width: 22px;
  height: 2px;
  background: #041b3c;
  border-radius: 2px;
  transition: transform 0.2s, opacity 0.2s;
}

.bar.open:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.bar.open:nth-child(2) { opacity: 0; }
.bar.open:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

@media (max-width: 768px) {
  .nav-links {
    display: none;
    position: absolute;
    top: 64px;
    left: 0;
    right: 0;
    flex-direction: column;
    background: #fff;
    padding: 24px;
    border-bottom: 1px solid #e8ecf1;
    gap: 16px;
  }

  .nav-links.open { display: flex; }
  .nav-actions { margin-left: 0; flex-direction: column; width: 100%; }
  .nav-actions button { width: 100%; }
  .hamburger { display: flex; }
}
</style>
