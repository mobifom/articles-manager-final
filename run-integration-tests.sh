#!/bin/bash
# run-integration-tests.sh
# Script to fix and run the integration tests

# Text colors
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting integration tests setup and run...${NC}"

# Create necessary directories if they don't exist
echo -e "${YELLOW}Ensuring integration test directories exist...${NC}"
mkdir -p packages/frontend/src/tests/integration

# Copy the improved integration test file
echo -e "${YELLOW}Installing improved integration test...${NC}"
cp integration-test.js packages/frontend/src/tests/integration/ArticleManagement.test.tsx

# Run the fix script
echo -e "${YELLOW}Running fix script for integration tests configuration...${NC}"
node fix-integration-tests.js

# Run the tests
echo -e "${YELLOW}Running integration tests...${NC}"
npx nx run frontend:test:integration

# Check the result
if [ $? -eq 0 ]; then
  echo -e "${GREEN}Integration tests passed!${NC}"
else
  echo -e "${RED}Integration tests failed. Please check the output above for details.${NC}"
fi

echo -e "${YELLOW}Done!${NC}"