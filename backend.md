# Backend

## Project Path
`/Users/adamc/Desktop/kea/Webudvikling/Backend/washworld_2`

## Stack
- Python / Flask
- MariaDB (MySQL) via Docker
- JWT auth via `flask_jwt_extended`

## Base URL
`http://127.0.0.1`

## Running
```
cd /Users/adamc/Desktop/kea/Webudvikling/Backend/washworld_2/backend
docker compose up
```
- Flask app: `http://localhost:80`
- phpMyAdmin: `http://localhost:8080`
- MariaDB: `localhost:3306`

## Key Source Files
- Routes + controllers: `@/Users/adamc/Desktop/kea/Webudvikling/Backend/washworld_2/backend/app.py`
- Helpers + validation: `@/Users/adamc/Desktop/kea/Webudvikling/Backend/washworld_2/backend/x.py`

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Health check |
| GET | `/login` | Login page (HTML) |
| POST | `/login` | Login — returns `{ access_token }` as JSON |
| GET | `/sign-up` | Sign-up page (HTML) |
| POST | `/sign-up` | Create account — sends verification email |
| GET | `/verify/<key>` | Verify email (uuid4, 32 hex chars) |
| GET | `/forgot-password` | Forgot password page (HTML) |
| POST | `/forgot-password` | Send reset email |
| GET | `/reset-password/<key>` | Reset password page (HTML, key is 64 hex chars) |
| POST | `/reset-password` | Save new password |
| GET | `/profile` | Profile page (JWT not yet enforced) |
| GET | `/people` | Returns hardcoded list of people (test route) |

## Auth
- Login returns a JWT access token in `{ "access_token": "..." }`
- Protected routes use `@jwt_required()` — send token as `Authorization: Bearer <token>`
- JWT secret: `"your-secret-key"` (dev only)

## Validation Rules (from x.py)
| Field | Min | Max | Notes |
|-------|-----|-----|-------|
| first_name | 2 | 20 | any chars |
| last_name | 2 | 20 | any chars |
| email | — | — | standard regex |
| password | 8 | 50 | any chars |

## POST Body Format
All POST endpoints expect `application/x-www-form-urlencoded` (form data), not JSON.

## Error Format
Errors return plain text with an HTTP status code (e.g. `"invalid email"`, 400).
Success returns either plain text or JSON depending on the endpoint.

## Database
- Host: `mariadb` (inside Docker) / `localhost` (from host)
- DB name: `2026_1_wash_world`
- Users table columns: `user_pk, user_first_name, user_verification_key, user_verified_at, user_reset_password_key, user_email, user_password`
