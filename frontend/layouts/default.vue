<template>
  <div class="layout-default">
    <NavbarPublic />
    <slot />
    <FooterPublic />
  </div>
</template>

<style scoped>
.layout-default {
  min-height: 100vh;
  background: #fafaf8;
}
</style>
