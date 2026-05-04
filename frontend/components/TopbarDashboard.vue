<template>
  <header class="topbar">
    <div class="topbar-left">
      <span class="topbar-logo">🏠</span>
      <span class="topbar-brand">Gedoong</span>
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
  height: 56px;
  padding: 0 24px;
  background: #fff;
  border-bottom: 1px solid #e8ecf1;
  flex-shrink: 0;
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.topbar-logo {
  font-size: 20px;
}

.topbar-brand {
  font-size: 16px;
  font-weight: 700;
  color: #0052CC;
}

.topbar-tag {
  font-size: 11px;
  color: #737685;
  background: #f0f4ff;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 500;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.topbar-agent-name {
  font-size: 13px;
  color: #737685;
}

.topbar-avatar {
  width: 32px;
  height: 32px;
  background: #0052CC;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 600;
  font-size: 13px;
}
</style>
