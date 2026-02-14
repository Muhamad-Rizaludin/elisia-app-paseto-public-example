# Elysia Production Ready API

Backend API production-ready berbasis Bun + TypeScript + Elysia.js dengan PostgreSQL, Sequelize, PASETO public, Yup, Winston, dan Swagger (aktif hanya non-production).

## Stack
- Bun runtime + package manager
- Node.js 20+ (tooling)
- TypeScript (strict)
- Elysia.js
- PostgreSQL
- Sequelize ORM + sequelize-cli (migration & seeder)
- PASETO public (access + refresh token)
- bcryptjs
- Winston logger
- Yup validation
- Swagger OpenAPI otomatis dari Elysia

## Aturan Arsitektur yang Dipenuhi
- Flow endpoint: `route -> controller -> service -> repository`
- Env memakai `dotenv` + file `.env.*` tanpa `env.ts`
- `dotenv` hanya di-load sekali di `src/index.ts`
- Konfigurasi Sequelize di root: `sequelize.config.js`
- `sequelize-cli` selalu memakai `--config sequelize.config.js`
- Migration dan seeder berada di `src/migrations` dan `src/seeders`
- Semua import source code menggunakan module alias (`@config`, `@routes`, dst)
- Selain Sequelize Model dan `BaseError`, seluruh logic function-based (tanpa class)
- Model hanya di `src/schemas/models/`
- Relasi dipisah per module di `src/relations/<module>/`
- Type/interface/enum module-specific berada di `src/modules/<feature>/types/index.ts`
- Validator module-specific berada di `src/modules/<feature>/validators/index.ts`
- Service pattern: 1 file = 1 fungsi, tanpa `index.ts` di `services`
- Repository pattern: 1 file = 1 method + `index.ts` module repository
- Route pattern: 1 file = 1 endpoint, compose via `index.ts`
- Controller pattern: 1 file = 1 controller function
- Nama file disederhanakan sesuai folder (tanpa suffix `.controller/.service/.repository/.route`)
- Middleware, validation, auth guard, role check dilakukan di layer route
- Response formatting dan logging endpoint dilakukan di layer controller
- Base response dan pagination helper berada di `src/common/baseResponse.ts` dan `src/common/pagination.ts`
- Swagger aktif hanya pada `development` dan `staging`

## Struktur Folder
```text
.
|-- package.json
|-- tsconfig.json
|-- sequelize.config.js
|-- docker-compose.yml
|-- Dockerfile
|-- src/
|   |-- index.ts
|   |-- common/
|   |   |-- BaseError.ts
|   |   |-- errorFactory.ts
|   |   |-- baseResponse.ts
|   |   `-- pagination.ts
|   |-- config/
|   |-- middlewares/
|   |-- modules/
|   |   |-- auth/
|   |   |   |-- controllers/
|   |   |   |-- repositories/
|   |   |   |-- routes/
|   |   |   |-- services/
|   |   |   |-- types/
|   |   |   `-- validators/
|   |   |-- users/
|   |   `-- health/
|   |-- plugins/
|   |-- routes/
|   |-- schemas/models/
|   |-- relations/
|   |   |-- auth/
|   |   `-- users/
|   |-- migrations/
|   |-- seeders/
|   `-- utils/
`-- tests/
    |-- unit/
    `-- integration/
```

## Environment
File environment tersedia:
- `.env.development`
- `.env.staging`
- `.env.production`
- `.env.test`

Auth env utama:
- `ACCESS_TOKEN_TTL=8h`
- `REFRESH_TOKEN_TTL=8h`
- `SESSION_MAX_AGE=8h`

## Script Bun
- `bun run dev`
- `bun run build`
- `bun run start`
- `bun run db:migrate`
- `bun run db:seed`
- `bun run db:reset`
- `bun run test`
- `bun run test:unit`
- `bun run test:integration`

Semua command sequelize-cli memakai `--config sequelize.config.js` dengan path migration/seeder di `src`.

## Membuat Migration & Seeder Baru
Gunakan `sequelize-cli` dan selalu sertakan config root project:

1. Buat migration baru:
   - `bunx sequelize-cli migration:generate --name create-example-table --config sequelize.config.js --migrations-path src/migrations`
2. Buat seeder baru:
   - `bunx sequelize-cli seed:generate --name seed-example-data --config sequelize.config.js --seeders-path src/seeders`
3. Jalankan migration:
   - `bun run db:migrate`
4. Jalankan seeder:
   - `bun run db:seed`

## Endpoint
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`
- `GET /api/v1/users` (datatable, admin only)
- `GET /api/v1/health`

## Auth & Security
- Access token PASETO: 8 jam (`ACCESS_TOKEN_TTL`)
- Refresh token PASETO: 8 jam (`REFRESH_TOKEN_TTL`)
- Absolute session expiry: 8 jam (`SESSION_MAX_AGE`) untuk auto-logout
- Refresh token rotation aktif
- Refresh token disimpan hash di database
- Token dikirim via HTTP-only cookie: `token`, `refreshToken`, dan `expiredToken`
- Response auth (`register/login/refresh`) mengembalikan `token`, `refreshToken`, dan `expiredToken` (detik)
- bcryptjs untuk password/hash token
- Rate limit aktif di endpoint login dan refresh
- Global error handler dengan format error standar

## Base Response Standard
### Success
```json
{
  "status": 200,
  "success": true,
  "message": "string",
  "data": {},
  "meta": {
    "currentPage": 1,
    "pageSize": 10,
    "total": 100,
    "totalPage": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Error
```json
{
  "status": 400,
  "success": false,
  "message": "string",
  "data": null,
  "meta": {
    "currentPage": 0,
    "pageSize": 0,
    "total": 0,
    "totalPage": 0,
    "hasNext": false,
    "hasPrev": false
  }
}
```

## Logging
- Log disimpan ke folder root: `logs/`
- File info harian: `logs/info-YYYY-MM-DD.log`
- File error harian: `logs/error-YYYY-MM-DD.log`
- Retensi file error: 7 hari (otomatis dibersihkan saat app start)
- Retensi file info: 30 hari (otomatis dibersihkan saat app start)
- Console logging tetap aktif untuk observability saat development/container runtime

## Swagger
- Aktif saat `NODE_ENV=development|staging` (`/docs`)
- Nonaktif di production
- Dokumentasi endpoint berisi:
  - tags
  - summary + description
  - contoh response sukses
  - contoh response error (validasi, unauthorized, forbidden, rate limit, dll)

## Menjalankan Project
1. Install dependency:
   - `bun install`
2. Siapkan PostgreSQL sesuai `.env.<environment>`
3. Generate key pair PASETO (`keys/private.key` dan `keys/public.key`) secara lokal
4. Jalankan migrasi:
   - `bun run db:migrate`
5. Jalankan seeder:
   - `bun run db:seed`
6. Jalankan app:
   - `bun run dev`

## Docker
Jalankan dengan docker compose:
```bash
docker compose up --build
```

## Testing Strategy (Kondisi Saat Ini)
- Framework test: `bun:test`
- Struktur test aktif:
  - `tests/unit/auth/services.test.ts`
  - `tests/unit/auth/repositories.test.ts`
  - `tests/unit/users/services.test.ts`
  - `tests/unit/users/repositories.test.ts`
  - `tests/unit/health/services.test.ts`
  - `tests/unit/date.util.test.ts`
  - `tests/integration/auth/api.test.ts`
  - `tests/integration/users/api.test.ts`
  - `tests/integration/health/api.test.ts`
- Unit test memakai mock untuk dependency repository/model/helper.
- API test per module saat ini berbasis mock (bukan real DB flow end-to-end).
- Tidak ada integration test DB end-to-end aktif pada kondisi sekarang.

## Aturan Generate Test
- Saat menambah/ubah module:
  - wajib tambah/update unit test service module terkait
  - wajib tambah/update unit test repository module terkait
  - wajib tambah/update API test module terkait
- Minimal coverage per module:
  - `services.test.ts` untuk business logic utama + error path
  - `repositories.test.ts` untuk memastikan query method dipanggil dengan parameter benar
  - `api.test.ts` untuk contract response endpoint utama
- Lokasi file test wajib mengikuti pola:
  - `tests/unit/<module>/services.test.ts`
  - `tests/unit/<module>/repositories.test.ts`
  - `tests/integration/<module>/api.test.ts`
