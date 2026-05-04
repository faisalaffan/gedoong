<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-header">
        <div class="auth-icon">🚀</div>
        <h1>Daftar Gratis</h1>
        <p>Mulai kelola properti dalam hitungan detik</p>
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

        <button class="btn-submit" type="submit">Daftar Gratis</button>
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

.field-row {
  display: flex;
  gap: 12px;
}

.field-row .field {
  flex: 1;
}

.field {
  display: flex;
  flex-direction: column;
}

.field-label {
  font-size: 13px;
  font-weight: 600;
  color: #041b3c;
  margin-bottom: 4px;
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
