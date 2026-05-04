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
      <div class="brand-name">Gedoong</div>
      <div class="brand-sub">CRM Agent</div>
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
  width: 220px;
  background: #fff;
  border-right: 1px solid #e8ecf1;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.sidebar-brand {
  padding: 20px 16px;
  border-bottom: 1px solid #e8ecf1;
}

.brand-name {
  font-size: 18px;
  font-weight: 700;
  color: #0052CC;
}

.brand-sub {
  font-size: 11px;
  color: #737685;
  margin-top: 2px;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 12px 8px;
  flex: 1;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  text-decoration: none;
  color: #434654;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.15s;
}

.sidebar-link:hover {
  background: #f0f4ff;
  color: #0052CC;
}

.sidebar-link.active {
  background: #e8f0fe;
  color: #0052CC;
  font-weight: 600;
}

.sidebar-icon {
  font-size: 16px;
  width: 24px;
  text-align: center;
}

.sidebar-label {
  flex: 1;
}

.sidebar-footer {
  padding: 12px 8px;
  border-top: 1px solid #e8ecf1;
}

.back-link {
  color: #737685;
  font-size: 12px;
}

.back-link:hover {
  color: #0052CC;
}
</style>
