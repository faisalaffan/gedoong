<template>
  <footer class="footer">
    <div class="footer-inner">
      <div class="footer-brand">
        <span class="footer-logo">🏠 Gedoong</span>
        <p class="footer-desc">
          Platform properti terpercaya yang menghubungkan pencari properti dengan agen-agen independen di seluruh Indonesia.
        </p>
      </div>
      <div class="footer-links">
        <div class="footer-col">
          <h4>Properti</h4>
          <a href="#">Rumah Dijual</a>
          <a href="#">Rumah Disewakan</a>
          <a href="#">Apartemen</a>
          <a href="#">Kost</a>
          <a href="#">Ruko</a>
        </div>
        <div class="footer-col">
          <h4>Perusahaan</h4>
          <a href="#">Tentang Kami</a>
          <a href="#">Karir</a>
          <a href="#">Kontak</a>
          <a href="#">Blog</a>
        </div>
        <div class="footer-col">
          <h4>Dukungan</h4>
          <a href="#">FAQ</a>
          <a href="#">Pusat Bantuan</a>
          <a href="#">Syarat & Ketentuan</a>
          <a href="#">Kebijakan Privasi</a>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; {{ new Date().getFullYear() }} Gedoong. Seluruh hak cipta dilindungi.</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: #041b3c;
  color: #c3c6d6;
  margin-top: 80px;
}

.footer-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 64px 24px 48px;
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 48px;
}

.footer-logo { font-size: 22px; font-weight: 700; color: #fff; }

.footer-desc {
  font-size: 14px;
  line-height: 1.7;
  margin-top: 12px;
  max-width: 320px;
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}

.footer-col h4 {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 16px;
}

.footer-col a {
  display: block;
  font-size: 13px;
  color: #c3c6d6;
  text-decoration: none;
  margin-bottom: 10px;
  transition: color 0.15s;
}

.footer-col a:hover { color: #fff; }

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding: 20px 24px;
  text-align: center;
  font-size: 13px;
}

@media (max-width: 768px) {
  .footer-inner {
    grid-template-columns: 1fr;
    gap: 36px;
  }

  .footer-links {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
