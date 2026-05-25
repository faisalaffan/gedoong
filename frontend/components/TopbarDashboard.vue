<script setup lang="ts">
import { ref, computed } from 'vue'

const config = useRuntimeConfig()
const appName = config.public.appName
const appLogo = config.public.appLogo

const supabase = useSupabaseClient()
const user = useSupabaseUser()

const isMenuOpen = ref(false)

const agentName = computed(() => {
  if (!user.value) return 'Tamu'
  return user.value.user_metadata?.full_name || user.value.email?.split('@')[0] || 'Agen'
})

const agentInitials = computed(() => {
  const name = agentName.value
  const parts = name.split(' ').filter(Boolean)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
})

const userEmail = computed(() => {
  return user.value?.email || 'tidak_ada_email@domain.com'
})

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}

async function handleLogout() {
  isMenuOpen.value = false
  try {
    await supabase.auth.signOut()
    navigateTo('/masuk')
  } catch (error) {
    console.error('Error logging out:', error)
    navigateTo('/masuk')
  }
}
</script>

<template>
  <header class="topbar">
    <div class="topbar-left">
      <img :src="appLogo" :alt="appName + ' Logo'" class="topbar-logo-img" />
      <span class="topbar-tag">CRM Agent</span>
    </div>
    
    <div class="topbar-right">
      <!-- Clickable Profile Area -->
      <div class="agent-profile" @click="toggleMenu">
        <span class="topbar-agent-name">Agen: {{ agentName }}</span>
        <div class="topbar-avatar" :class="{ 'avatar-active': isMenuOpen }">
          {{ agentInitials }}
        </div>
      </div>
      
      <!-- Backdrop click-outside helper -->
      <div v-if="isMenuOpen" class="menu-overlay" @click="isMenuOpen = false"></div>

      <!-- Dropdown Menu -->
      <transition name="fade-slide">
        <div v-if="isMenuOpen" class="profile-dropdown">
          <div class="dropdown-header">
            <div class="user-avatar-large">{{ agentInitials }}</div>
            <div class="user-info-wrap">
              <span class="user-name">{{ agentName }}</span>
              <span class="user-email" :title="userEmail">{{ userEmail }}</span>
            </div>
          </div>
          <div class="dropdown-divider"></div>
          <button @click="handleLogout" class="dropdown-item logout-item">
            <svg class="logout-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
            </svg>
            <span>Keluar dari Akun</span>
          </button>
        </div>
      </transition>
    </div>
  </header>
</template>

<style scoped>
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  padding: 0 24px;
  background: var(--bg-card);
  border-bottom: 1px solid var(--border-light);
  flex-shrink: 0;
  box-shadow: var(--shadow-sm);
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.topbar-logo-img {
  height: 36px;
  width: auto;
  object-fit: contain;
}

.topbar-tag {
  font-family: var(--font-display);
  font-size: 11px;
  color: var(--primary);
  background: var(--primary-light);
  padding: 4px 10px;
  border-radius: var(--radius-sm);
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 20px;
  position: relative;
}

.agent-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: var(--radius-md);
  transition: background var(--transition-fast);
  user-select: none;
}

.agent-profile:hover {
  background: var(--bg-default, #f8fafc);
}

.topbar-agent-name {
  font-family: var(--font-body);
  font-size: 13px;
  color: var(--text-medium);
  font-weight: 600;
}

.topbar-avatar {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 13px;
  box-shadow: 0 2px 8px rgba(0, 82, 204, 0.25);
  border: 2px solid #fff;
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
}

.agent-profile:hover .topbar-avatar,
.avatar-active {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 82, 204, 0.35);
}

/* Backdrop */
.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 998;
  background: transparent;
}

/* Profile Dropdown Card */
.profile-dropdown {
  position: absolute;
  top: 52px;
  right: 0;
  width: 240px;
  background: #fff;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  padding: 8px;
  z-index: 999;
  transform-origin: top right;
}

.dropdown-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 8px;
}

.user-avatar-large {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 14px;
}

.user-info-wrap {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  max-width: 160px;
}

.user-name {
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 700;
  color: var(--text-dark);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.3;
}

.user-email {
  font-family: var(--font-body);
  font-size: 11px;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 2px;
}

.dropdown-divider {
  height: 1px;
  background: var(--border-light);
  margin: 6px 0;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 12px;
  border: none;
  background: transparent;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  text-align: left;
}

.logout-item {
  color: #c81e1e;
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 700;
}

.logout-item:hover {
  background: #fdf2f2;
}

.logout-icon {
  flex-shrink: 0;
}

/* Vue Transitions */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.95);
}
</style>


