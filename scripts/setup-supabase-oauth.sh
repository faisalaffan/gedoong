#!/bin/bash

# Setup Supabase Google & Apple OAuth automatically
# Path: scripts/setup-supabase-oauth.sh

# Colors for premium CLI styling
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}===================================================${NC}"
echo -e "${BLUE}    Gedoong Supabase OAuth Automator Setup CLI     ${NC}"
echo -e "${BLUE}===================================================${NC}"

# Coba baca SUPABASE_URL dari frontend/.env
ENV_FILE="frontend/.env"
PROJECT_REF="pkcjhfuelyexpsypqcct" # Default fallback

if [ -f "$ENV_FILE" ]; then
    URL_LINE=$(grep -E "^SUPABASE_URL=" "$ENV_FILE" | cut -d'=' -f2- | tr -d '"' | tr -d "'")
    if [ ! -z "$URL_LINE" ]; then
        # Ekstrak ref dari format https://<ref>.supabase.co atau https://<ref>.supabase.in
        PARSED_REF=$(echo "$URL_LINE" | sed -E 's|https://([^.]+)\.supabase\..*|\1|')
        if [ ! -z "$PARSED_REF" ]; then
            PROJECT_REF="$PARSED_REF"
        fi
    fi
fi

echo -e "Target Project Ref: ${GREEN}${PROJECT_REF}${NC} (Dideteksi dari ${ENV_FILE})"
echo ""
echo -e "Untuk melakukan otomatisasi setup, Anda memerlukan:"
echo -e "1. ${YELLOW}Supabase Personal Access Token${NC} (Dapat dari Dashboard -> Account -> Access Tokens)"
echo ""

# Input Access Token
read -sp "Masukkan Supabase Personal Access Token Anda: " ACCESS_TOKEN
echo ""

if [ -z "$ACCESS_TOKEN" ]; then
    echo -e "${RED}Error: Access Token tidak boleh kosong.${NC}"
    exit 1
fi

echo -e "\nPilih Provider yang ingin dikonfigurasi:"
echo "1) Google OAuth"
echo "2) Apple OAuth"
echo "3) Keduanya (Google & Apple)"
read -p "Masukkan pilihan (1/2/3): " CHOICE

PAYLOAD="{"

if [ "$CHOICE" == "1" ] || [ "$CHOICE" == "3" ]; then
    echo -e "\n${BLUE}--- Konfigurasi Google Auth ---${NC}"
    read -p "Masukkan Google Client ID: " GOOGLE_CLIENT_ID
    read -sp "Masukkan Google Client Secret: " GOOGLE_CLIENT_SECRET
    echo ""
    
    PAYLOAD="${PAYLOAD}\"external_google_enabled\": true, \"external_google_client_id\": \"${GOOGLE_CLIENT_ID}\", \"external_google_secret\": \"${GOOGLE_CLIENT_SECRET}\""
fi

if [ "$CHOICE" == "2" ] || [ "$CHOICE" == "3" ]; then
    if [ "$CHOICE" == "3" ]; then
        PAYLOAD="${PAYLOAD}, "
    fi
    echo -e "\n${BLUE}--- Konfigurasi Apple Auth ---${NC}"
    read -p "Masukkan Apple Client ID (Services ID): " APPLE_CLIENT_ID
    read -sp "Masukkan Apple Client Secret (Secret Key): " APPLE_CLIENT_SECRET
    echo ""
    
    PAYLOAD="${PAYLOAD}\"external_apple_enabled\": true, \"external_apple_client_id\": \"${APPLE_CLIENT_ID}\", \"external_apple_secret\": \"${APPLE_CLIENT_SECRET}\""
fi

PAYLOAD="${PAYLOAD}}"

echo -e "\n${BLUE}Mengirim konfigurasi ke Supabase Management API...${NC}"

RESPONSE=$(curl -s -w "\n%{http_code}" -X PATCH \
  "https://api.supabase.com/v1/projects/${PROJECT_REF}/config/auth" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD")

HTTP_BODY=$(echo "$RESPONSE" | head -n -1)
HTTP_STATUS=$(echo "$RESPONSE" | tail -n 1)

if [ "$HTTP_STATUS" == "200" ] || [ "$HTTP_STATUS" == "201" ]; then
    echo -e "${GREEN}✓ Sukses! Konfigurasi Auth Supabase Anda berhasil diperbarui secara otomatis.${NC}"
    echo -e "Anda sekarang dapat langsung menggunakan Google/Apple login di lokal maupun production!"
else
    echo -e "${RED}✗ Gagal memperbarui konfigurasi. HTTP Status: ${HTTP_STATUS}${NC}"
    echo -e "${RED}Response: ${HTTP_BODY}${NC}"
fi
