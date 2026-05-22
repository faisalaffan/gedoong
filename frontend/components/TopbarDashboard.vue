<template>
  <header class="topbar">
    <div class="topbar-left">
      <img src="/03_LOGO_MAIN.png" alt="Gedoong Logo" class="topbar-logo-img" />
      <span class="topbar-tag">CRM Agent</span>
    </div>
    <div class="topbar-right">
      <span class="topbar-agent-name">Agen: Budi Santoso</span>
      <div class="topbar-avatar">BS</div>
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
  gap: 16px;
}

.topbar-agent-name {
  font-family: var(--font-body);
  font-size: 13px;
  color: var(--text-medium);
  font-weight: 500;
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
}
</style>
