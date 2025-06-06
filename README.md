# Uongozi Civic Tech Exam

An interactive civic knowledge exam with social sharing capabilities.

## Features

- Interactive quiz interface
- Score tracking and results
- Dynamic Open Graph image generation for social sharing
- Responsive design for all devices

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Generate default Open Graph image:
   ```bash
   npm run generate-og-image
   ```
4. Start the development server:
   ```bash
   npm start
   ```

## Deployment

This project is configured for deployment on Netlify. The following environment variables are used:

- `NODE_VERSION`: 18.0.0
- `NPM_FLAGS`: --build-from-source
- `NPM_VERBOSE`: true
- `NPM_CONFIG_PREFIX`: /opt/buildhome/.npm-global

## Project Structure

- `index.html`: Main HTML file
- `script.js`: Main JavaScript file
- `styles.css`: Main stylesheet
- `netlify/functions/og-image.js`: Netlify function for generating Open Graph images
- `public/`: Static files
  - `images/`: Default Open Graph image
  - `_headers`: HTTP headers for CORS
- `netlify.toml`: Netlify configuration
- `package.json`: Project dependencies and scripts

## License

MIT
