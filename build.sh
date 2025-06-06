#!/bin/bash

# Exit on error
set -e

echo "=== Starting build process ==="

# Install npm dependencies
echo "Installing npm dependencies..."
npm install || {
    echo "Error: npm install failed"
    exit 1
}

# Create public directory if it doesn't exist
mkdir -p public/images

# Generate default OG image if it doesn't exist
if [ ! -f "public/images/og-default.jpg" ]; then
    echo "Generating default OG image..."
    # Skip image generation if canvas dependencies are not available
    if command -v node &> /dev/null; then
        node generate-og-image.js || echo "Warning: Failed to generate default OG image"
    else
        echo "Warning: Node.js not available, skipping OG image generation"
    fi
fi

echo "=== Build completed successfully ==="
