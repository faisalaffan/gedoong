<script setup lang="ts">
const isOpen = ref(false);
const links = [
  { label: "Beranda", to: "/" },
  { label: "Tentang", to: "/tentang" },
];

const config = useRuntimeConfig();
const appName = config.public.appName;
const appLogo = config.public.appLogo;
</script>

<template>
  <header class="navbar glass-panel">
    <div class="navbar-inner">
      <NuxtLink to="/" class="logo">
        <img :src="appLogo" :alt="appName + ' Logo'" class="logo-img" />
      </NuxtLink>

      <nav class="nav-links" :class="{ open: isOpen }">
        <NuxtLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="nav-link"
        >
          {{ link.label }}
        </NuxtLink>
        <div class="nav-actions">
          <NuxtLink to="/masuk" class="btn-ghost">Masuk</NuxtLink>
          <NuxtLink to="/daftar" class="btn-primary">Daftar Gratis</NuxtLink>
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
  height: 68px;
  display: flex;
  align-items: center;
  background: var(--bg-nav);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border-light);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);
}

.navbar-inner {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  height: 44px;
}

.logo-img {
  height: 42px;
  width: auto;
  object-fit: contain;
  transition: transform var(--transition-fast);
}

.logo-img:hover {
  transform: translateY(-1px) scale(1.02);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 32px;
}

.nav-link {
  text-decoration: none;
  color: var(--text-medium);
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 500;
  position: relative;
  padding: 6px 0;
  transition: color var(--transition-fast);
}

.nav-link::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: var(--primary);
  transform: scaleX(0);
  transform-origin: right;
  transition: transform var(--transition-fast);
}

.nav-link:hover::after,
.nav-link.router-link-active::after {
  transform: scaleX(1);
  transform-origin: left;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--primary);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: 16px;
}

.btn-ghost {
  padding: 10px 24px;
  border: 1px solid var(--border-slate);
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--text-medium);
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-ghost:hover {
  border-color: var(--primary);
  color: var(--primary);
  background: var(--primary-light);
}

.btn-primary {
  padding: 10px 24px;
  border: none;
  border-radius: var(--radius-sm);
  background: var(--primary);
  color: #fff;
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(0, 82, 204, 0.2);
  transition: all var(--transition-fast);
}

.btn-primary:hover {
  background: var(--primary-hover);
  box-shadow: 0 6px 20px rgba(0, 82, 204, 0.3);
  transform: translateY(-1px);
}

.btn-primary:active {
  transform: translateY(0);
}

.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  padding: 8px;
  border: none;
  background: none;
  cursor: pointer;
}

.bar {
  display: block;
  width: 22px;
  height: 2px;
  background: var(--text-dark);
  border-radius: 2px;
  transition:
    transform 0.2s,
    opacity 0.2s;
}

.bar.open:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}
.bar.open:nth-child(2) {
  opacity: 0;
}
.bar.open:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

@media (max-width: 768px) {
  .nav-links {
    display: none;
    position: absolute;
    top: 68px;
    left: 0;
    right: 0;
    flex-direction: column;
    background: #fff;
    padding: 24px;
    border-bottom: 1px solid var(--border-light);
    box-shadow: var(--shadow-lg);
    gap: 16px;
    backdrop-filter: blur(20px);
  }

  .nav-links.open {
    display: flex;
  }
  .nav-actions {
    margin-left: 0;
    flex-direction: column;
    width: 100%;
  }
  .nav-actions :deep(a) {
    width: 100%;
    text-align: center;
    text-decoration: none;
  }
  .hamburger {
    display: flex;
  }
}
</style>
