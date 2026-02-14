const getEnv = (name, fallback) => process.env[name] || fallback;

const base = {
  username: getEnv("DB_USERNAME", "postgres"),
  password: getEnv("DB_PASSWORD", "postgres"),
  database: getEnv("DB_NAME", "elisia_app"),
  host: getEnv("DB_HOST", "127.0.0.1"),
  port: Number(getEnv("DB_PORT", "5432")),
  dialect: "postgres",
  migrationStorageTableName: "sequelize_meta",
  seederStorage: "sequelize",
  seederStorageTableName: "sequelize_data",
  migrationStoragePath: "src/migrations",
  seederStoragePath: "src/seeders"
};

module.exports = {
  development: {
    ...base,
    logging: console.log,
    migrationStoragePath: "src/migrations",
    seederStoragePath: "src/seeders"
  },
  staging: {
    ...base,
    logging: false,
    migrationStoragePath: "src/migrations",
    seederStoragePath: "src/seeders"
  },
  production: {
    ...base,
    logging: false,
    migrationStoragePath: "src/migrations",
    seederStoragePath: "src/seeders"
  },
  test: {
    ...base,
    database: getEnv("DB_NAME_TEST", "elisia_app_test"),
    logging: false,
    migrationStoragePath: "src/migrations",
    seederStoragePath: "src/seeders"
  }
};
