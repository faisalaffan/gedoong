.PHONY: help dev build test lint clean db-up db-down db-migrate db-seed crypt-lock crypt-unlock crypt-status

# Gedoong Makefile
# Usage: make [target]

help: ## Tampilkan semua command yang tersedia
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | \
	awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# ── Dev ──────────────────────────────────────────────────

dev: ## Jalankan semua service di development (backend + frontend + mobile)
	@echo "Starting all services..."
	docker compose up -d

dev-down: ## Hentikan semua service development
	docker compose down

build: ## Build semua service
	cd backend && go build ./...
	cd frontend && npm run build

lint: ## Jalankan linter di semua service
	cd backend && go vet ./...
	cd frontend && npm run lint

test: ## Jalankan test di semua service
	cd backend && go test ./...
	cd frontend && npm run test

clean: ## Bersihkan build artifacts
	rm -rf backend/bin/
	rm -rf frontend/.output/ frontend/dist/ frontend/.nuxt/
	rm -rf mobile/build/

# ── Database ─────────────────────────────────────────────

db-up: ## Jalankan MySQL & Redis via Docker
	docker compose up -d mysql redis

db-down: ## Hentikan MySQL & Redis
	docker compose stop mysql redis

db-migrate: ## Jalankan database migration
	cd backend && go run ./cmd/migrate up

db-seed: ## Seed database dengan data development
	cd backend && go run ./cmd/migrate seed

# ── Git Crypt ────────────────────────────────────────────

crypt-lock: ## Kunci repo (wajib setelah clone di mesin baru atau selesai kerja)
	git-crypt lock

crypt-unlock: ## Buka kunci repo — butuh symmetric key
	@test -f /tmp/gedoong-git-crypt.key || { \
		echo "⛔ Key tidak ditemukan."; \
		echo "   Copy dari iCloud dulu:"; \
		echo "   cp ~/Library/Mobile\\ Documents/com~apple~CloudDocs/keys/gedoong-git-crypt.key /tmp/"; \
		exit 1; \
	}
	git-crypt unlock /tmp/gedoong-git-crypt.key && rm /tmp/gedoong-git-crypt.key

crypt-status: ## Cek file mana yang terenkripsi
	git-crypt status

crypt-add-user: ## Tambah collaborator GPG (usage: make crypt-add-user KEY_ID=XXXX)
	@test -z "$(KEY_ID)" && { echo "⛔ Usage: make crypt-add-user KEY_ID=<gpg-key-id>"; exit 1; } || true
	git-crypt add-gpg-user $(KEY_ID)

# ── Docker ───────────────────────────────────────────────

docker-build: ## Build semua Docker image
	docker compose build

docker-push: ## Push Docker image ke registry
	docker compose push

# ── Setup/Utilitas ────────────────────────────────────────

setup-oauth: ## Jalankan CLI otomatisasi konfigurasi Supabase Google & Apple Auth
	@chmod +x scripts/setup-supabase-oauth.sh
	@./scripts/setup-supabase-oauth.sh

