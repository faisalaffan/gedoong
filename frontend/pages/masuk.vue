<template>
  <div class="auth-page">
    <div class="auth-card glass-panel">
      <div class="auth-header">
        <NuxtLink to="/" class="auth-logo">
          <img :src="appLogo" :alt="appName + ' Logo'" class="auth-logo-img" />
        </NuxtLink>
        <h1>Selamat Datang Kembali</h1>
        <p>Lanjutkan mengelola portal properti Anda</p>
      </div>

      <div v-if="errorMessage" class="alert alert-danger">
        <svg class="alert-icon" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg>
        <span>{{ errorMessage }}</span>
      </div>

      <div v-if="successMessage" class="alert alert-success">
        <svg class="alert-icon" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
        <span>{{ successMessage }}</span>
      </div>

      <form class="auth-form" @submit.prevent="handleLogin">
        <div class="field">
          <label class="field-label">Email</label>
          <input
            v-model="email"
            type="email"
            class="field-input"
            placeholder="agen@email.com"
            required
          />
        </div>

        <div class="field">
          <div class="field-header">
            <label class="field-label">Password</label>
            <a href="#" class="field-link">Lupa Password?</a>
          </div>
          <input
            v-model="password"
            type="password"
            class="field-input"
            placeholder="••••••••"
            required
          />
        </div>

        <div class="turnstile-wrap">
          <div id="turnstile-login"></div>
        </div>

        <button class="btn-submit" type="submit" :disabled="isLoading || !captchaVerified">
          <span v-if="isLoading" class="spinner"></span>
          <span v-else>Masuk ke Dashboard</span>
        </button>
      </form>

      <div class="divider">
        <span>atau masuk dengan</span>
      </div>

      <div class="social-buttons">
        <button class="btn-social btn-google" @click="loginWithGoogle" type="button" :disabled="isLoading || !captchaVerified">
          <svg class="social-icon" viewBox="0 0 24 24" width="20" height="20">
            <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.578-7.859-8s3.529-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l3.227-3.107C18.29 1.845 15.447 1 12.24 1a10.97 10.97 0 0 0-11 11 10.97 10.97 0 0 0 11 11c6.126 0 10.193-4.307 10.193-10.371 0-.695-.075-1.227-.168-1.743H12.24z"/>
          </svg>
          Google
        </button>
        <button class="btn-social btn-apple" @click="loginWithApple" type="button" :disabled="isLoading || !captchaVerified">
          <svg class="social-icon" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.22.67-2.94 1.5-.62.71-1.16 1.85-1.02 2.96 1.1.09 2.23-.55 2.97-1.4z"/>
          </svg>
          Apple
        </button>
      </div>

      <p class="auth-footer">
        Belum punya akun?
        <NuxtLink to="/daftar" class="auth-link">Daftar Gratis</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const appName = config.public.appName
const appLogo = config.public.appLogo
const turnstileSiteKey = config.public.turnstileSiteKey

useHead({
  title: 'Masuk ke Dashboard'
})

const supabase = useSupabaseClient()
const router = useRouter()
const { renderTurnstile, resetTurnstile, token: captchaToken, isVerified: captchaVerified } = useTurnstile()

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const loginAttempts = ref(0)

onMounted(() => {
  renderTurnstile("turnstile-login", turnstileSiteKey)
})

async function handleLogin() {
  if (!email.value || !password.value) {
    errorMessage.value = 'Silakan isi email dan password Anda.'
    return
  }
  if (!captchaToken.value) {
    errorMessage.value = 'Mohon selesaikan verifikasi keamanan di bawah.'
    return
  }

  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
      options: {
        captchaToken: captchaToken.value,
      },
    })

    if (error) {
      loginAttempts.value++
      errorMessage.value = error.message === 'Invalid login credentials'
        ? 'Email atau password salah.'
        : error.message
      resetTurnstile()
    } else {
      successMessage.value = 'Berhasil masuk! Mengarahkan ke dashboard...'
      setTimeout(() => {
        router.push('/dashboard')
      }, 1000)
    }
  } catch (e: any) {
    errorMessage.value = e.message || 'Terjadi kesalahan saat masuk.'
    resetTurnstile()
  } finally {
    isLoading.value = false
  }
}

async function loginWithGoogle() {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    })

    if (error) {
      errorMessage.value = error.message
      isLoading.value = false
    }
  } catch (e: any) {
    errorMessage.value = e.message || 'Terjadi kesalahan login Google.'
    isLoading.value = false
  }
}

async function loginWithApple() {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    })

    if (error) {
      errorMessage.value = error.message
      isLoading.value = false
    }
  } catch (e: any) {
    errorMessage.value = e.message || 'Terjadi kesalahan login Apple.'
    isLoading.value = false
  }
}
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
  max-width: 440px;
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

.field {
  display: flex;
  flex-direction: column;
}

.field-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.field-label {
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 700;
  color: var(--text-dark);
}

.field-link {
  font-family: var(--font-body);
  font-size: 12px;
  color: var(--primary);
  text-decoration: none;
  font-weight: 600;
  transition: color var(--transition-fast);
}

.field-link:hover {
  color: var(--primary-hover);
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

.turnstile-wrap {
  display: flex;
  justify-content: center;
  margin-bottom: 4px;
}

.btn-submit {
  display: flex;
  align-items: center;
  justify-content: center;
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

.btn-submit:hover:not(:disabled) {
  background: var(--primary-hover);
  box-shadow: 0 6px 20px rgba(0, 82, 204, 0.35);
  transform: translateY(-1px);
}

.btn-submit:active:not(:disabled) {
  transform: translateY(0);
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Alert styles */
.alert {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 20px;
  line-height: 1.4;
}

.alert-danger {
  background: #fdf2f2;
  border: 1px solid #fde8e8;
  color: #c81e1e;
}

.alert-success {
  background: #f3faf7;
  border: 1px solid #def7ec;
  color: #03543f;
}

.alert-icon {
  flex-shrink: 0;
}

/* Divider styles */
.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 24px 0;
  color: var(--text-muted);
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 500;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid var(--border-slate);
}

.divider:not(:empty)::before {
  margin-right: .75em;
}

.divider:not(:empty)::after {
  margin-left: .75em;
}

/* Social Buttons styles */
.social-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.btn-social {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 46px;
  border-radius: var(--radius-md);
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
  outline: none;
}

.btn-social:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-google {
  background: var(--bg-card);
  border: 1px solid var(--border-slate);
  color: var(--text-dark);
}

.btn-google:hover:not(:disabled) {
  background: #f8f9fa;
  border-color: #dadce0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  transform: translateY(-1px);
}

.btn-google:active:not(:disabled) {
  transform: translateY(0);
}

.btn-apple {
  background: #000;
  border: 1px solid #000;
  color: #fff;
}

.btn-apple:hover:not(:disabled) {
  background: #1a1a1a;
  border-color: #1a1a1a;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  transform: translateY(-1px);
}

.btn-apple:active:not(:disabled) {
  transform: translateY(0);
}

.social-icon {
  flex-shrink: 0;
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
