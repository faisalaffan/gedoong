<template>
  <div class="auth-page">
    <div class="auth-card glass-panel">
      <div class="auth-header">
        <NuxtLink to="/" class="auth-logo">
          <img src="/03_LOGO_MAIN.png" alt="Gedoong Logo" class="auth-logo-img" />
        </NuxtLink>
        <h1>Daftar Akun Baru</h1>
        <p>Mulai kelola portal properti Anda dalam hitungan detik</p>
      </div>

      <form class="auth-form" @submit.prevent>
        <div class="field-row">
          <div class="field">
            <label class="field-label">Nama Depan</label>
            <input
              v-model="firstName"
              type="text"
              class="field-input"
              placeholder="Budi"
            />
          </div>
          <div class="field">
            <label class="field-label">Nama Belakang</label>
            <input
              v-model="lastName"
              type="text"
              class="field-input"
              placeholder="Santoso"
            />
          </div>
        </div>

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
          <label class="field-label">Nomor HP</label>
          <input
            v-model="phone"
            type="tel"
            class="field-input"
            placeholder="0812-3456-7890"
          />
        </div>

        <div class="field">
          <label class="field-label">Password</label>
          <input
            v-model="password"
            type="password"
            class="field-input"
            placeholder="Min. 8 karakter"
          />
        </div>

        <button class="btn-submit" type="submit">Daftar Akun Gratis</button>
      </form>

      <p class="auth-footer">
        Sudah punya akun?
        <NuxtLink to="/masuk" class="auth-link">Masuk</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const firstName = ref('')
const lastName = ref('')
const email = ref('')
const phone = ref('')
const password = ref('')
</script>

<style scoped>
.auth-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 68px);
  padding: 60px 24px;
}

.auth-card {
  width: 100%;
  max-width: 460px;
  padding: 40px;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  transition: transform var(--transition-normal), box-shadow var(--transition-normal);
}

.auth-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover);
}

.auth-header {
  text-align: center;
  margin-bottom: 36px;
}

.auth-logo {
  display: inline-block;
  margin-bottom: 20px;
}

.auth-logo-img {
  height: 48px;
  width: auto;
  object-fit: contain;
  transition: transform var(--transition-fast);
}

.auth-logo-img:hover {
  transform: scale(1.03);
}

.auth-header h1 {
  font-family: var(--font-display);
  font-size: 24px;
  font-weight: 800;
  color: var(--text-dark);
  margin-bottom: 8px;
}

.auth-header p {
  font-family: var(--font-body);
  font-size: 14px;
  color: var(--text-muted);
  font-weight: 500;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.field-row {
  display: flex;
  gap: 16px;
}

.field-row .field {
  flex: 1;
}

.field {
  display: flex;
  flex-direction: column;
}

.field-label {
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 700;
  color: var(--text-dark);
  margin-bottom: 6px;
}

.field-input {
  height: 46px;
  padding: 0 16px;
  border: 1px solid var(--border-slate);
  border-radius: var(--radius-md);
  font-size: 14px;
  font-family: var(--font-body);
  color: var(--text-dark);
  background: var(--bg-card);
  outline: none;
  transition: all var(--transition-fast);
}

.field-input:hover {
  border-color: var(--primary);
}

.field-input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-glow);
}

.field-input::placeholder {
  color: var(--text-muted);
  opacity: 0.6;
}

.btn-submit {
  height: 48px;
  border: none;
  border-radius: var(--radius-md);
  background: var(--primary);
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  font-family: var(--font-display);
  cursor: pointer;
  box-shadow: 0 4px 12px var(--primary-glow);
  transition: all var(--transition-fast);
  margin-top: 8px;
}

.btn-submit:hover {
  background: var(--primary-hover);
  box-shadow: 0 6px 20px rgba(0, 82, 204, 0.35);
  transform: translateY(-1px);
}

.btn-submit:active {
  transform: translateY(0);
}

.auth-footer {
  text-align: center;
  font-family: var(--font-body);
  font-size: 14px;
  color: var(--text-muted);
  font-weight: 500;
  margin-top: 32px;
}

.auth-link {
  color: var(--primary);
  font-weight: 700;
  text-decoration: none;
  transition: color var(--transition-fast);
}

.auth-link:hover {
  color: var(--primary-hover);
}
</style>
