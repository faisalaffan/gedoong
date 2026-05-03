# Git Crypt

Repo ini menggunakan [git-crypt](https://github.com/AGWA/git-crypt) untuk melindungi dokumen internal (`docs/internal/`).

## Cara kerja

File di `docs/internal/` otomatis terenkripsi saat commit. Di GitHub, isinya tampil sebagai binary. Hanya collaborator dengan akses yang bisa baca.

File di luar `docs/internal/` tetap plain text normal — semua orang bisa baca.

## Rules

Rule enkripsi didefinisikan di `.gitattributes`:

```
docs/internal/** filter=git-crypt diff=git-crypt
```

## Setup untuk collaborator

### Prasyarat

```bash
brew install git-crypt
```

### Unlock

1. Minta symmetric key ke repo owner (via secure channel: Signal, 1Password, atau ketemu langsung)
2. Jalankan:

```bash
make crypt-unlock
```

Atau manual:

```bash
git-crypt unlock /path/to/git-crypt.key
```

### Verifikasi

```bash
make crypt-status
# docs/internal/README.md → encrypted ✓
```

## Setup untuk repo owner (menambah collaborator)

```bash
# 1. Collaborator export GPG public key
gpg --armor --export [email] > pubkey.asc

# 2. Owner import key
gpg --import pubkey.asc

# 3. Owner daftarin key
make crypt-add-user KEY_ID=[KEY_ID]

# 4. Commit perubahan di .git-crypt/
git add .git-crypt/ && git commit -m "chore: add collaborator GPG key"
```

## File yang TIDAK dilindungi git-crypt

| File | Alasan |
|---|---|
| `.env` | Gitignored — tidak pernah commit |
| `*.secret`, `*.key` | Gitignored — tidak pernah commit |
| Private key GPG | Tidak pernah di repo |
| Symmetric key export | Gitignored — simpan di password manager |

## Troubleshooting

**git-crypt unlock gagal?**
- Pastikan symmetric key valid (file 128 bytes)
- Coba ulang dari iCloud: `cp ~/Library/Mobile\ Documents/com~apple~CloudDocs/keys/gedoong-git-crypt.key /tmp/`
