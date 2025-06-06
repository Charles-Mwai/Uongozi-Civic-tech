#!/bin/bash

# Install system dependencies
apt-get update
apt-get install -y \
    build-essential \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev

# Install npm dependencies
npm install

# Generate default OG image
mkdir -p public/images
if [ ! -f "public/images/og-default.jpg" ]; then
    node generate-og-image.js
fi
