# Database Migrations

This document describes how to manage database migrations for the project.

## Migration Scripts

### Run Migrations

To apply all pending migrations:

```bash
# For local development
npm run migrate

# For production (Netlify)
npm run netlify-migrate
```

### Create a New Migration

1. First, make your schema changes in the appropriate schema files.
2. Generate a new migration:
   ```bash
   npm run generate-migration
   ```
3. Review the generated migration file in the `migrations` directory.
4. Test the migration locally before committing.

### Reset Database (Development Only)

⚠️ **Warning**: This will drop all tables and data in your local database.

```bash
npm run reset-db
```

## Netlify Integration

Migrations run automatically during the Netlify build process. You can also trigger them manually using the Netlify Functions endpoint:

```bash
curl -X POST https://your-site.netlify.app/.netlify/functions/run-migrations \
  -H "Authorization: Bearer $MIGRATION_TOKEN"
```

## Migration Files

- Migrations are stored in the `migrations` directory.
- Each migration file follows the pattern: `[VERSION]_[DESCRIPTION].sql`
- The `_migrations` table tracks which migrations have been applied.

## Troubleshooting

### Common Issues

1. **Migrations not applying**:
   - Check the `_migrations` table to see which migrations have been applied.
   - Verify that the migration files are in the correct format and location.

2. **Connection issues**:
   - Ensure your environment variables are set correctly.
   - Check that your database is running and accessible.

3. **Migration errors**:
   - Check the Netlify function logs for detailed error messages.
   - Rollback any failed migrations before retrying.

## Best Practices

- Always test migrations in a development environment first.
- Never modify migration files after they've been applied to production.
- Keep migrations small and focused on a single change.
- Include comments in your migration files to explain the purpose of each change.
