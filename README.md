# Favia Health

React 19 + TypeScript + Vite frontend, with a Laravel 12 API and PostgreSQL.
The frontend and API live in this repository's root. In development, Vite serves the app at one URL and proxies API requests to Laravel. In production, Laravel serves the built React app and API from the same URL.
The app uses Laravel session authentication with signup, login, logout, CSRF protection, and per-user authorization. Optional shared demo accounts are disabled by default. There is no AI generation, billing, or external integration.

For deployment, see [Production deployment](deploy/README.md).

## Run locally

### Prerequisites

Install Node.js 22+, PHP 8.2+ with the `pdo_pgsql` extension, Composer, and PostgreSQL. PHP also needs `pdo_sqlite` to run the automated test suite. Confirm the tools are available:

```powershell
node --version
php --version
composer --version
psql --version
```

### First-time setup

Clone the repository, then run the following from its root. The commands below use PowerShell; on macOS or Linux, replace `Copy-Item` with `cp`.

```powershell
composer install
npm install
Copy-Item .env.example .env
php artisan key:generate
```

Create a local PostgreSQL database. You can use pgAdmin or run this with a PostgreSQL account that can create databases:

```sql
CREATE DATABASE favia_health;
```

Open `.env` and set the connection details for that database. Keep this file local; it is ignored by Git.

```dotenv
APP_ENV=local
APP_URL=http://localhost:8000
APP_TIMEZONE=Europe/Sarajevo

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=favia_health
DB_USERNAME=postgres
DB_PASSWORD=your-local-postgres-password

FRONTEND_URL=http://localhost:3000
SESSION_SECURE_COOKIE=false
```

Run the migrations and seed the shared recipe and workout catalogue:

```powershell
php artisan migrate
php artisan db:seed
```

The application is now ready. Start both the Laravel API and the Vite frontend:

```powershell
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The browser uses Vite at port 3000, which forwards `/api` calls to Laravel at port 8000.

To serve the compiled app from Laravel at one local URL instead, run:

```powershell
npm run build
php artisan serve
```

Then open [http://localhost:8000](http://localhost:8000).

### Database migrations

Use this command whenever you pull changes containing new files in `database/migrations`:

```powershell
php artisan migrate
```

It only applies migrations that have not already run and preserves existing local accounts and plans. Check the state with:

```powershell
php artisan migrate:status
```

For a disposable local database that can be erased, rebuild everything from scratch with:

```powershell
php artisan migrate:fresh --seed
```

This deletes every table in the database configured in `.env`. Do not use it if you need to keep your local data.

### Optional demo accounts

The default setup seeds the recipe and workout catalogue but does not create shared demo users. To add Amina, Fatih, and Vedad locally, change this in `.env`:

```dotenv
DEMO_LOGIN_ENABLED=true
```

Then run:

```powershell
php artisan db:seed
```

The login screen will show the three demo accounts. Their usernames are `amina`, `fatih`, and `vedad`, and each uses the password `password123`; they are shared sample data, so do not enter personal information there.

No external AI key is required.

## Authentication and demo data

`GET /api/auth/session` returns the signed-in identity (or null), a CSRF token, and optional demo choices. Signup requires a display name, unique username, email, and password. Login accepts either the email or username. Each user belongs to a plan: Basic (level `0`), Plus (level `1`), or Premium (level `2`); new accounts start on Basic. Plans, features, and per-plan allowances are stored in `plans`, `features`, and `feature_plan`. All seeded features are currently allowed for every plan, with no feature gating yet. `POST /api/auth/register`, `/api/auth/login`, and `/api/auth/logout` use Laravel session cookies. Writes require `X-CSRF-TOKEN`. Passwords are hashed, authentication attempts are rate limited, session IDs rotate at login, and logout invalidates the session.

New accounts get separate profiles, meal assignments, and workout assignments from the shared catalog. User IDs in URLs never grant access to someone else's records. Recipe/exercise illustrations live outside `public/` and are delivered through authorized API routes. No personal image upload feature is implemented.

Set `DEMO_LOGIN_ENABLED=true` and run `php artisan db:seed` to enable Amina, Fatih, and Vedad. The login screen labels these as shared sample accounts; avoid entering personal information in them. The demo endpoint accepts only the three configured demo identities. `X-Demo-User` and browser local storage no longer authenticate requests.

With demo mode enabled, seeds contain:


- Amina, age 32, with the original health profile and EN/light preferences.
- Seven days, 28 assigned meals, 43 recipes, and 208 ingredient rows.
- Three workout templates/assignments and 13 assigned exercises.
- 19 exercise alternatives (32 exercise rows including alternatives).
- Seven shared evidence records and three notifications.
- Existing local meal pictures and the five original Workout A pictures, served through authenticated Laravel image endpoints.

The original seed content is preserved in `database/seeders/data/demo.json`.
Original frontend mock files remain as references, but no active screen imports them.
Running `db:seed` again during the same week preserves profile/settings, meal replacements, and snacks. It is intended as a development seeder, not a recurring production scheduler.

On first load, the existing onboarding flow appears. Completing it persists name, age, profile, and completion status. Refresh then returns to the dashboard.
Users must authenticate before onboarding.

## Existing UI scope

Navigation remains the same six client-side tabs: dashboard, meals, workouts, profile, pricing, settings.
Sidebar groups marked **Soon**, including standalone Recipes, remain disabled. No backend routes were added for them.

Connected flows:

- Dashboard profile, counts, weekly plans, current-day check-in, and safeguards.
- Meal/day selection, macros, ingredients, images, research/evidence, and recipe replacement.
- Workout selection, instructions, sets/reps, evidence, and read-only alternative descriptions.
- Onboarding, profile editing, check-in, and EN/BS + light/night settings.
- Notifications list/read status and snack addition.

Inspection found that the original snack callback had no button and no notifications UI existed. To expose those two explicitly requested flows, a small **Add snack** button and a compact dashboard notifications card were added using existing styling. Existing cards, navigation, responsive classes, and theme styles were retained.
Exercise alternatives were display-only in the prototype, so no exercise replacement action was introduced.
Pricing remains its original static/demo UI, with no payment processing.
EN/BS persists the selected preference; the original prototype does not translate its interface, and translation was not added.

## Backend structure

- `app/Models`: Eloquent entities and relationships.
- `app/Http/Controllers/Api`: user/profile/settings, meals, workouts, check-ins, notifications.
- `app/Http/Requests`: profile/onboarding and check-in validation; small writes are validated in controllers.
- `app/Http/Resources`: camelCase response shapes matching existing React types.
- `app/Services`: recipe compatibility, transactional plan reconciliation, workout adjustment, dashboard aggregation.
- `database/migrations`, `database/seeders`, `routes/api.php`.
- `src/api/client.ts`: typed fetch client with timeout and validation/network errors.

Domain tables: `users`, `health_profiles`, `daily_check_ins`, `evidence_references`, `recipes`, `recipe_ingredients`, `meal_plans`, `meal_plan_days`, `meal_plan_meals`, `workouts`, `exercises`, `workout_exercises`, `exercise_alternatives`, `user_workouts`, `notifications`.
The stock Laravel migration includes the sessions table used in production. Password reset and email verification flows are not implemented.
Profiles, source lists, tags, visual descriptions, and small adjustment metadata use JSONB. Plans, meals, ingredients, exercises, and assignments use relational rows with foreign keys and uniqueness constraints.

## API

All endpoints return JSON directly (no extra `data` envelope).

| Method | Path | Purpose |
|---|---|---|
| GET | /api/auth/session | Session identity, CSRF token, optional demo accounts |
| POST | /api/auth/register | Create account and session |
| POST | /api/auth/login | Authenticate |
| POST | /api/auth/logout | Invalidate session |
| POST | /api/auth/demo | Optional shared demo session |
| GET | /api/users/{user} | Basic user data |
| GET | /api/users/{user}/dashboard | Initial application data and computed summary |
| GET / PUT | /api/users/{user}/health-profile | Read/update profile |
| PUT | /api/users/{user}/onboarding | Save name, age, profile, completion |
| GET / PUT | /api/users/{user}/settings | Language/theme |
| GET | /api/users/{user}/meal-plan | Seven days keyed by day name |
| GET | /api/users/{user}/meal-plan/{date} | Meals for YYYY-MM-DD |
| GET | /api/user-meals/{meal}/alternatives | Compatible recipes of the same meal type |
| POST | /api/user-meals/{meal}/replace | Replace with `{ "recipeId": 29 }` |
| POST | /api/users/{user}/meals/snack | Add `{ "day": "Tuesday", "recipeId": 4 }`; recipeId optional |
| GET | /api/recipes/{recipe} | Recipe, ingredients, image, evidence |
| GET | /api/users/{user}/workouts | Assigned workouts |
| GET | /api/user-workouts/{userWorkout} | One assigned workout |
| GET | /api/exercises/{exercise}/alternatives | Read-only alternatives |
| POST | /api/users/{user}/check-ins | Save/upsert today's check-in |
| GET | /api/users/{user}/check-ins/latest | Most recent check-in or null |
| GET | /api/users/{user}/notifications | Notifications |
| PATCH | /api/notifications/{notification}/read | Mark read, idempotently |

Profile writes accept `conditions`, `allergies`, `dietaryPreferences`, `physicalLimitations` as string arrays.
Onboarding additionally requires `name` and integer `age` (1–120).
Profile/onboarding/check-in writes return refreshed dashboard data.
Meal/snack writes return the complete updated/created meal; React updates it without a reload.

Check-in body:

```json
{
  "energy": "lower",
  "recovery": "poor",
  "pain": "moderate",
  "affectedAreas": ["Lower back"],
  "note": "Back discomfort and poor sleep"
}
```

Allowed values: energy `lower|same|higher`, recovery `poor|okay|well`, pain `none|mild|moderate|significant`.
Date is assigned by the server in the configured timezone.
Writes return 200, or 201 for a new daily check-in/snack. Invalid values return 422 with Laravel's `message` and `errors` fields; missing, malformed, or out-of-scope IDs return 404.

## Deterministic demo rules and limits

`RecipeCompatibility` filters the stored metadata for the eight existing allergen options, vegetarian/vegan, gluten-free, dairy/lactose-free, halal, and kosher preferences; celiac profiles also require gluten-free recipes.
The seed includes simple compatible alternatives. Unknown custom allergies/preferences with no supported mapping return a clear 422 rather than silently claiming compatibility.
Profile updates replace only incompatible assigned meals and preserve compatible user choices. Profile and meal updates roll back together if no compatible replacement exists.

`WorkoutAdjustmentService` mirrors the original Workout A flow:
lower energy or poor recovery gives an intensity modifier of 0.8; poor recovery reduces each exercise by one set (minimum two) and displays 35 minutes; moderate/significant lower-back discomfort marks supported variations.
Templates are never overwritten. Repeated check-ins overwrite that day's entry without accumulating reductions. Adjustment flags only apply on their recorded date; the dashboard excludes yesterday's check-in.

The free-text check-in UI retains its original simple keyword-to-values mapping; no language model is called.
Weekly plans are seeded demo assignments, not automatically regenerated each week.
Recipe quantities, nutrition numbers, inherited reference content, and alternatives are illustrative and not medically validated.
Images are private files, referenced by authorized API URLs, never database blobs.

## Verification

From the repository root:

```bash
php artisan test
php vendor/bin/pint --test
composer validate --no-check-publish
```

Tests default to an isolated SQLite in-memory database; production/development remains PostgreSQL.
To run the same tests against PostgreSQL, create a separate disposable `favia_health_test` database and override the test environment (PowerShell example):

```powershell
$env:DB_CONNECTION='pgsql'
$env:DB_DATABASE='favia_health_test'
$env:DB_HOST='127.0.0.1'
$env:DB_PORT='5432'
$env:DB_USERNAME='postgres'
# Set DB_PASSWORD locally if needed.
php artisan test
```

The suite migrates/rebuilds its configured test database. Never point it at application data.
Close that terminal or remove these environment overrides before running the normal app.

Frontend checks from repository root:

```bash
npm run lint
npm run build
```

Verified during implementation: migrations + seeds on PostgreSQL 17, backend tests on SQLite and PostgreSQL, TypeScript/build, and real HTTP requests through the Vite proxy for onboarding, meal replacement, snack, check-in, settings, notifications, CORS, and local image serving.
Interactive browser/visual QA was not available in the agent session.
