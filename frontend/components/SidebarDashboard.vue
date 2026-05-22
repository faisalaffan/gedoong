<script setup lang="ts">
const route = useRoute()

const menu = [
  { label: 'Dashboard', to: '/dashboard', icon: '📊' },
  { label: 'Listing', to: '/listing', icon: '🏠' },
  { label: 'Pipeline', to: '/pipeline', icon: '📋' },
  { label: 'Klien', to: '/klien', icon: '👥' },
  { label: 'Komisi', to: '/komisi', icon: '💰' },
]

function isActive(to: string) {
  return route.path === to
}
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar-brand">
      <img src="/03_LOGO_MAIN.png" alt="Gedoong Logo" class="brand-logo-img" />
      <div class="brand-sub">CRM Agent Dashboard</div>
    </div>

    <nav class="sidebar-nav">
      <NuxtLink
        v-for="item in menu"
        :key="item.to"
        :to="item.to"
        class="sidebar-link"
        :class="{ active: isActive(item.to) }"
      >
        <span class="sidebar-icon">{{ item.icon }}</span>
        <span class="sidebar-label">{{ item.label }}</span>
      </NuxtLink>
    </nav>

    <div class="sidebar-footer">
      <NuxtLink to="/" class="sidebar-link back-link">
        <span class="sidebar-icon">←</span>
        <span class="sidebar-label">Kembali ke Beranda</span>
      </NuxtLink>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 240px;
  background: var(--bg-card);
  border-right: 1px solid var(--border-light);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  box-shadow: var(--shadow-sm);
}

.sidebar-brand {
  padding: 24px 20px;
  border-bottom: 1px solid var(--border-light);
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.brand-logo-img {
  height: 38px;
  width: auto;
  object-fit: contain;
  align-self: flex-start;
}

.brand-sub {
  font-family: var(--font-display);
  font-size: 11px;
  color: var(--text-muted);
  font-weight: 700;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 20px 12px;
  flex: 1;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: var(--radius-md);
  text-decoration: none;
  color: var(--text-medium);
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 600;
  transition: all var(--transition-fast);
  position: relative;
}

.sidebar-link::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%) scaleY(0.4);
  width: 4px;
  height: 20px;
  background: var(--primary);
  border-radius: var(--radius-full);
  opacity: 0;
  transition: all var(--transition-fast);
}

.sidebar-link:hover {
  background: var(--primary-light);
  color: var(--primary);
}

.sidebar-link:hover::before {
  opacity: 0.5;
  transform: translateY(-50%) scaleY(0.8);
}

.sidebar-link.active {
  background: var(--primary-light);
  color: var(--primary);
}

.sidebar-link.active::before {
  opacity: 1;
  transform: translateY(-50%) scaleY(1);
}

.sidebar-icon {
  font-size: 16px;
  width: 24px;
  text-align: center;
  transition: transform var(--transition-fast);
}

.sidebar-link:hover .sidebar-icon {
  transform: scale(1.15);
}

.sidebar-label {
  flex: 1;
}

.sidebar-footer {
  padding: 16px 12px;
  border-top: 1px solid var(--border-light);
}

.back-link {
  color: var(--text-muted);
  font-size: 13px;
}

.back-link::before {
  display: none !important;
}

.back-link:hover {
  color: var(--primary);
  background: var(--primary-light);
}
</style>
