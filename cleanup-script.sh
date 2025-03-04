#!/bin/bash

# Script to apply ESLint fixes

# Color codes for prettier output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Applying ESLint fixes...${NC}"

# Backup existing files
echo -e "${YELLOW}Making backups of existing ESLint configs...${NC}"
cp eslint.config.js eslint.config.js.bak
cp packages/frontend/eslint.config.js packages/frontend/eslint.config.js.bak
cp packages/backend/eslint.config.js packages/backend/eslint.config.js.bak

# Remove .eslintignore files
echo -e "${YELLOW}Removing any .eslintignore files...${NC}"
find . -name ".eslintignore" -type f -exec rm {} \;

# Apply the new configurations
echo -e "${YELLOW}Applying new ESLint configurations...${NC}"
cp fixed-eslint-config.js eslint.config.js
cp fixed-frontend-eslint.js packages/frontend/eslint.config.js
cp fixed-backend-eslint.js packages/backend/eslint.config.js

echo -e "${GREEN}ESLint configurations have been updated.${NC}"
echo -e "${YELLOW}You can now run:${NC} nx run frontend:lint"
echo -e "${YELLOW}If you need to revert:${NC} mv eslint.config.js.bak eslint.config.js"