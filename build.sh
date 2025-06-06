#!/bin/bash

# Exit on error
set -e

# Install system dependencies if running in a Netlify environment
if [ -n "$NETLIFY" ]; then
    echo "Running in Netlify environment"
    
    # Install required system dependencies
    apt-get update
    apt-get install -y \
        build-essential \
        libcairo2-dev \
        libpango1.0-dev \
        libjpeg-dev \
        libgif-dev \
        librsvg2-dev
fi

# Install npm dependencies
echo "Installing npm dependencies..."
npm install

# Generate default OG image if it doesn't exist
mkdir -p public/images
if [ ! -f "public/images/og-default.jpg" ]; then
    echo "Generating default OG image..."
    node generate-og-image.js || echo "Warning: Failed to generate default OG image"
fi

echo "Build completed successfully!"
