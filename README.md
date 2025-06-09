# Uongozi Civic Tech Exam

An interactive civic knowledge exam with social sharing capabilities and admin dashboard.

## Features

- Interactive quiz interface
- Score tracking and results
- Admin dashboard with analytics
- Demographic analysis by age group and gender
- Dynamic Open Graph image generation for social sharing
- Responsive design for all devices

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the root directory with the following variables:
   ```
   DATABASE_URL=your_neon_database_url
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=choose_a_strong_password
   ```
4. Generate default Open Graph image:
   ```bash
   npm run generate-og-image
   ```
5. Run database migrations:
   ```bash
   npm run db:migrate
   ```
6. Start the development server:
   ```bash
   npm start
   ```

## Deployment

This project is configured for deployment on Netlify. The following environment variables are required:

- `NODE_VERSION`: 20.0.0
- `DATABASE_URL`: Your Neon database connection string
- `ADMIN_USERNAME`: Admin username for the dashboard
- `ADMIN_PASSWORD`: Admin password (choose a strong one)
- `NPM_FLAGS`: --build-from-source
- `NPM_VERBOSE`: true
- `NPM_CONFIG_PREFIX`: /opt/buildhome/.npm-global

### Netlify Setup

1. Set up a new site in Netlify
2. Connect your GitHub repository
3. Set the environment variables in Netlify:
   - Go to Site settings > Build & deploy > Environment
   - Add each variable from your `.env.local` file
4. Deploy the site

## Project Structure

- `index.html`: Main HTML file
- `admin.html`: Admin dashboard
- `script.js`: Main JavaScript file
- `styles.css`: Main stylesheet
- `db/`: Database configuration and schema
  - `schema.ts`: Database schema definitions
  - `queries.ts`: Database queries
  - `index.ts`: Database connection setup
- `netlify/functions/`: Serverless functions
  - `scores/`: API endpoints for score data
  - `submit-score/`: Endpoint for submitting new scores
- `public/`: Static files
  - `images/`: Default Open Graph image
  - `_headers`: HTTP headers for CORS
- `netlify.toml`: Netlify configuration
- `package.json`: Project dependencies and scripts
- `tsconfig.json`: TypeScript configuration
- `drizzle.config.ts`: Drizzle ORM configuration
- `migrations/`: Database migration files (auto-generated)

## Admin Dashboard

Access the admin dashboard at `/admin` after deployment. Use the credentials you set in the environment variables.

The dashboard includes:

- Overview of total submissions and average scores
- Score distribution charts
- Demographic analysis by age group and gender
- Activity timeline

## Database

This project uses PostgreSQL with Drizzle ORM. To make changes to the database schema:

1. Update `db/schema.ts`
2. Generate a new migration:
   ```bash
   npm run db:generate
   ```
3. Apply the migration:
   ```bash
   npm run db:migrate
   ```

## License

MIT
