<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-header">
        <div class="auth-icon">🏠</div>
        <h1>Masuk ke Gedoong</h1>
        <p>Lanjutkan mengelola properti Anda</p>
      </div>

      <form class="auth-form" @submit.prevent>
        <div class="field">
          <label class="field-label">Email</label>
          <input
            v-model="email"
            type="email"
            class="field-input"
            placeholder="agen@email.com"
          />
        </div>

        <div class="field">
          <div class="field-header">
            <label class="field-label">Password</label>
            <a href="#" class="field-link">Lupa password?</a>
          </div>
          <input
            v-model="password"
            type="password"
            class="field-input"
            placeholder="••••••••"
          />
        </div>

        <button class="btn-submit" type="submit">Masuk</button>
      </form>

      <p class="auth-footer">
        Belum punya akun?
        <NuxtLink to="/daftar" class="auth-link">Daftar Gratis</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const email = ref('')
const password = ref('')
</script>

<style scoped>
.auth-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 64px);
  padding: 48px 24px;
}

.auth-card {
  width: 100%;
  max-width: 400px;
}

.auth-header {
  text-align: center;
  margin-bottom: 32px;
}

.auth-icon {
  font-size: 28px;
  margin-bottom: 12px;
}

.auth-header h1 {
  font-size: 22px;
  font-weight: 700;
  color: #041b3c;
  margin-bottom: 4px;
}

.auth-header p {
  font-size: 14px;
  color: #737685;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.field {
  display: flex;
  flex-direction: column;
}

.field-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.field-label {
  font-size: 13px;
  font-weight: 600;
  color: #041b3c;
}

.field-link {
  font-size: 12px;
  color: #0052CC;
  text-decoration: none;
}

.field-link:hover {
  text-decoration: underline;
}

.field-input {
  height: 44px;
  padding: 0 12px;
  border: 1px solid #d7e2ff;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  color: #041b3c;
  background: #fff;
  outline: none;
  transition: border-color 0.15s;
}

.field-input:focus {
  border-color: #0052CC;
  box-shadow: 0 0 0 3px rgba(0, 82, 204, 0.1);
}

.field-input::placeholder {
  color: #a1a5b0;
}

.btn-submit {
  height: 44px;
  border: none;
  border-radius: 8px;
  background: #0052CC;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.15s;
  margin-top: 4px;
}

.btn-submit:hover {
  background: #003d9b;
}

.auth-footer {
  text-align: center;
  font-size: 13px;
  color: #737685;
  margin-top: 24px;
}

.auth-link {
  color: #0052CC;
  font-weight: 600;
  text-decoration: none;
}

.auth-link:hover {
  text-decoration: underline;
}
</style>
