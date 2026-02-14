# Elysia Production Ready API

Backend API production-ready berbasis **Bun + TypeScript + Elysia.js** dengan PostgreSQL, Sequelize, PASETO public, Yup, Winston, dan Swagger (aktif hanya non-production).

## Stack
- Bun runtime + package manager
- Node.js 20+ (tooling)
- TypeScript strict
- Elysia.js
- PostgreSQL
- Sequelize ORM + sequelize-cli
- PASETO public (access + refresh token)
- bcryptjs
- Winston logger
- Yup validation
- Swagger OpenAPI via Elysia

## Arsitektur
Flow endpoint:

`route -> controller -> service -> repository`

Aturan yang dipakai:
- `dotenv` di-load sekali di `src/index.ts`
- Konfigurasi Sequelize di root: `sequelize.config.js`
- Command sequelize-cli selalu pakai `--config sequelize.config.js`
- Migration/seeder disimpan di `src/migrations` dan `src/seeders`
- Import source code menggunakan module alias (`@config`, `@routes`, dst)
- Selain Sequelize Model dan `BaseError`, logic function-based
- Model hanya di `src/schemas/models`
- Relasi dipisah per module di `src/relations/<module>`
- Service: 1 file = 1 fungsi (tanpa `index.ts`)
- Repository: 1 file = 1 method + `index.ts`
- Route: 1 file = 1 endpoint + compose di `index.ts`
- Controller: 1 file = 1 function
- Nama file disederhanakan sesuai folder (tanpa suffix `.controller/.service/.repository/.route`)
- Middleware/validasi/auth guard/role check di route layer
- Response format + endpoint logging di controller layer
- Base response dan pagination helper ada di `src/common/baseResponse.ts` dan `src/common/pagination.ts`

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
Tersedia file:
- `.env.development`
- `.env.staging`
- `.env.production`
- `.env.test`

Auth env utama:
- `ACCESS_TOKEN_TTL=8h`
- `REFRESH_TOKEN_TTL=8h`
- `SESSION_MAX_AGE=8h`

## Generate Key PASETO
Buat key pair sebelum menjalankan auth endpoint. File wajib berada di:
- `keys/private.key`
- `keys/public.key`

### Opsi 1 (Node.js one-liner)
```bash
node -e "const {generateKeyPairSync}=require('crypto');const {privateKey,publicKey}=generateKeyPairSync('ed25519');require('fs').mkdirSync('keys',{recursive:true});require('fs').writeFileSync('keys/private.key',privateKey.export({type:'pkcs8',format:'pem'}));require('fs').writeFileSync('keys/public.key',publicKey.export({type:'spki',format:'pem'}));"
```

### Opsi 2 (OpenSSL)
```bash
mkdir -p keys
openssl genpkey -algorithm ed25519 -out keys/private.key
openssl pkey -in keys/private.key -pubout -out keys/public.key
```

Jika path key diubah, sesuaikan env:
- `PRIVATE_KEY_PATH`
- `PUBLIC_KEY_PATH`

Catatan:
- Folder `keys/` di-ignore git dan tidak ikut di-push.

## Endpoint
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`
- `GET /api/v1/users` (admin only)
- `GET /api/v1/health`

## Behavior Auth
- Login/register/refresh mengembalikan:
  - `token`
  - `refreshToken`
  - `expiredToken` (detik)
- Cookie HTTP-only otomatis:
  - `token`
  - `refreshToken`
  - `expiredToken`
- Refresh token rotation aktif
- Refresh token disimpan hash di DB
- Session absolute expiry (`SESSION_MAX_AGE`) diterapkan

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

## Swagger
- Aktif saat `NODE_ENV=development|staging`
- URL: `/docs`
- Nonaktif di production
- Dokumentasi endpoint mencakup:
  - tags
  - summary + description
  - contoh response sukses
  - contoh response error (validasi, unauthorized, forbidden, rate limit, dll)

## Logging
- Log folder: `logs/`
- `logs/info-YYYY-MM-DD.log`
- `logs/error-YYYY-MM-DD.log`
- Cleanup saat app start:
  - error logs > 7 hari dihapus
  - info logs > 30 hari dihapus

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

## Migration & Seeder Baru
```bash
bunx sequelize-cli migration:generate --name create-example-table --config sequelize.config.js --migrations-path src/migrations
bunx sequelize-cli seed:generate --name seed-example-data --config sequelize.config.js --seeders-path src/seeders
```

## Jalankan Project
1. Install dependency
   - `bun install`
2. Siapkan PostgreSQL sesuai `.env.<environment>`
3. Generate key pair PASETO (`keys/private.key` dan `keys/public.key`)
4. Jalankan migration
   - `bun run db:migrate`
5. Jalankan seeder
   - `bun run db:seed`
6. Jalankan app
   - `bun run dev`

## Docker
```bash
docker compose up --build
```

## Default Seed Admin
- Email: `admin@example.com`
- Password: `Admin123!`

## Testing Strategy
- Unit test (`tests/unit`): utility, service, repository dengan mock
- API test per module (`tests/integration`): auth, users, health
- Test berjalan via `bun test`
