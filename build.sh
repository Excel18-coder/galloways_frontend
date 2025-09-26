#!/bin/bash
set -e

echo "Starting Vercel build process..."

# Navigate to frontend directory
cd frontend

echo "Installing frontend dependencies..."
pnpm install --frozen-lockfile

echo "Building frontend application..."
pnpm run build

echo "Build completed successfully!"