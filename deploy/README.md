# Production deployment

This is one Laravel application: Apache serves `public/`, Laravel handles `/api`, and the React build is served from `/build`. Deploy the root Dockerfile on a container host with managed PostgreSQL and HTTPS.

1. Create a PostgreSQL database and a container web service using this repository's root Dockerfile.
2. Set environment variables in the host's secret settings (never commit `.env`):
   - `APP_KEY`: generate once with `php artisan key:generate --show`; retain it across deployments.
   - `APP_URL`: the service's HTTPS URL.
   - `APP_ENV=production`, `APP_DEBUG=false`.
   - `DB_CONNECTION=pgsql`, `DB_HOST`, `DB_PORT=5432`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`.
   - `DB_SSLMODE=require` if required by the database provider.
   - `SESSION_DRIVER=database`, `SESSION_SECURE_COOKIE=true`, `SESSION_HTTP_ONLY=true`, `SESSION_SAME_SITE=lax`.
   - `DEMO_LOGIN_ENABLED=false` (default). Set true only to expose shared Amina, Fatih, and Vedad accounts.
   - `TRUSTED_PROXIES`: comma-separated trusted reverse proxy IPs/CIDRs supplied by the host, if applicable. Use `*` only when the origin is accessible exclusively through the host's trusted proxy.
3. Before routing traffic, run the release commands in the deployed container:
   ```sh
   php artisan migrate --force
   php artisan db:seed --force
   ```
   The seeder installs the recipe/exercise catalog needed for registration. Demo accounts are created only when demo access is enabled. Existing personal records are preserved; never run `migrate:fresh` on production.
4. Start the service with its default command. `PORT` is honored when supplied by the host. Configure `/up` as the health check.
5. Check signup, onboarding, logout, login after refresh, and protected images through the public HTTPS URL. Verify the session cookie is Secure/HttpOnly and requests without CSRF fail.

Keep the database persistent and backed up. Existing images ship privately in the image; Laravel authorizes their delivery. No user-upload feature exists yet. Sessions persist in PostgreSQL. The file-based login limiter is suitable for a single instance; before scaling to multiple replicas configure a shared Redis cache and install the PHP Redis extension.

The Docker image has not been built locally because Docker Desktop's engine is unavailable. Publishing still requires a hosting account; no production URL has been created.
