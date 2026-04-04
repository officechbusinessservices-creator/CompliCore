#!/usr/bin/env bash
# Environment Variable Validation Script
# Validates that required environment files exist and contain necessary variables

set -e

echo "🔍 Validating Environment Configuration..."
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

errors=0
warnings=0

# Check frontend .env.local
echo "📁 Checking Frontend Environment (.env.local)..."
if [ -f ".env.local" ]; then
  echo -e "${GREEN}✓${NC} .env.local exists"

  # Check required variables
  if grep -q "NEXTAUTH_SECRET=" .env.local && [ "$(grep NEXTAUTH_SECRET= .env.local | cut -d'=' -f2 | wc -c)" -gt 32 ]; then
    echo -e "${GREEN}✓${NC} NEXTAUTH_SECRET is set and appears valid (>32 chars)"
  else
    echo -e "${RED}✗${NC} NEXTAUTH_SECRET is missing or too short (minimum 32 characters)"
    errors=$((errors + 1))
  fi

  if grep -q "NEXTAUTH_URL=" .env.local; then
    echo -e "${GREEN}✓${NC} NEXTAUTH_URL is set"
  else
    echo -e "${RED}✗${NC} NEXTAUTH_URL is missing"
    errors=$((errors + 1))
  fi

  if grep -q "NEXT_PUBLIC_API_BASE=" .env.local; then
    echo -e "${GREEN}✓${NC} NEXT_PUBLIC_API_BASE is set"
  else
    echo -e "${YELLOW}⚠${NC} NEXT_PUBLIC_API_BASE is missing (optional but recommended)"
    warnings=$((warnings + 1))
  fi
else
  echo -e "${RED}✗${NC} .env.local not found. Run: cp .env.local.example .env.local"
  errors=$((errors + 1))
fi

echo ""

# Check backend .env
echo "📁 Checking Backend Environment (backend/.env)..."
if [ -f "backend/.env" ]; then
  echo -e "${GREEN}✓${NC} backend/.env exists"

  # Check required variables
  if grep -q "DATABASE_URL=" backend/.env && [ -n "$(grep DATABASE_URL= backend/.env | cut -d'=' -f2)" ]; then
    echo -e "${GREEN}✓${NC} DATABASE_URL is set"
  else
    echo -e "${RED}✗${NC} DATABASE_URL is missing or empty"
    errors=$((errors + 1))
  fi

  if grep -q "JWT_SECRET=" backend/.env && [ "$(grep JWT_SECRET= backend/.env | cut -d'=' -f2 | wc -c)" -gt 32 ]; then
    echo -e "${GREEN}✓${NC} JWT_SECRET is set and appears valid (>32 chars)"
  else
    echo -e "${RED}✗${NC} JWT_SECRET is missing or too short (minimum 32 characters)"
    errors=$((errors + 1))
  fi

  if grep -q "PMS_WEBHOOK_SECRET=" backend/.env && [ "$(grep PMS_WEBHOOK_SECRET= backend/.env | cut -d'=' -f2 | wc -c)" -gt 20 ]; then
    echo -e "${GREEN}✓${NC} PMS_WEBHOOK_SECRET is set"
  else
    echo -e "${YELLOW}⚠${NC} PMS_WEBHOOK_SECRET is missing or appears to be default value"
    warnings=$((warnings + 1))
  fi
else
  echo -e "${RED}✗${NC} backend/.env not found. Run: cp backend/.env.example backend/.env"
  errors=$((errors + 1))
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $errors -eq 0 ] && [ $warnings -eq 0 ]; then
  echo -e "${GREEN}✅ All environment checks passed!${NC}"
  exit 0
elif [ $errors -eq 0 ]; then
  echo -e "${YELLOW}⚠️  Environment validated with $warnings warning(s)${NC}"
  exit 0
else
  echo -e "${RED}❌ Environment validation failed with $errors error(s) and $warnings warning(s)${NC}"
  echo ""
  echo "Please fix the errors above before running the application."
  exit 1
fi
