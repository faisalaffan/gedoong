<template>
  <div class="layout-dashboard">
    <TopbarDashboard />
    <div class="dashboard-body">
      <SidebarDashboard />
      <main class="dashboard-content">
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped>
.layout-dashboard {
  min-height: 100vh;
  background: #f5f5f7;
  display: flex;
  flex-direction: column;
}

.dashboard-body {
  display: flex;
  flex: 1;
}

.dashboard-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}
</style>
