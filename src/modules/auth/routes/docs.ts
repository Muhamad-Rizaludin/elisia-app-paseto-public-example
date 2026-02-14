const emptyMeta = {
  currentPage: 0,
  pageSize: 0,
  total: 0,
  totalPage: 0,
  hasNext: false,
  hasPrev: false
};

const authDataExample = {
  user: {
    id: "8f6fd9df-5e2b-4a10-a70b-9f6f7cf6f90a",
    name: "System Admin",
    email: "admin@example.com",
    role: "admin"
  },
  token: "v4.public.example-access-token",
  refreshToken: "v4.public.example-refresh-token",
  expiredToken: 28800
};

const unauthorizedExample = {
  status: 401,
  success: false,
  message: "Unauthorized",
  data: null,
  meta: emptyMeta
};

const validationExample = {
  status: 400,
  success: false,
  message: "Validation error",
  data: null,
  meta: emptyMeta
};

const tooManyRequestsExample = {
  status: 429,
  success: false,
  message: "Too many requests, please try again later",
  data: null,
  meta: emptyMeta
};

export const registerDetail = {
  tags: ["Auth"],
  summary: "Register user",
  description:
    "Membuat akun baru, mengembalikan access token dan refresh token di body serta mengirim cookie token HTTP-only.",
  responses: {
    201: {
      description: "Register berhasil",
      content: {
        "application/json": {
          example: {
            status: 201,
            success: true,
            message: "Register success",
            data: authDataExample,
            meta: emptyMeta
          }
        }
      }
    },
    400: {
      description: "Validasi body gagal",
      content: { "application/json": { example: validationExample } }
    },
    409: {
      description: "Email sudah terdaftar",
      content: {
        "application/json": {
          example: {
            status: 409,
            success: false,
            message: "Email already registered",
            data: null,
            meta: emptyMeta
          }
        }
      }
    }
  }
} as const;

export const loginDetail = {
  tags: ["Auth"],
  summary: "Login",
  description:
    "Autentikasi user dengan email dan password. Mengembalikan access/refresh token di body dan cookie HTTP-only.",
  responses: {
    200: {
      description: "Login berhasil",
      content: {
        "application/json": {
          example: {
            status: 200,
            success: true,
            message: "Login success",
            data: authDataExample,
            meta: emptyMeta
          }
        }
      }
    },
    400: {
      description: "Validasi body gagal",
      content: { "application/json": { example: validationExample } }
    },
    401: {
      description: "Kredensial tidak valid",
      content: {
        "application/json": {
          example: {
            status: 401,
            success: false,
            message: "Invalid email or password",
            data: null,
            meta: emptyMeta
          }
        }
      }
    },
    429: {
      description: "Rate limit login",
      content: { "application/json": { example: tooManyRequestsExample } }
    }
  }
} as const;

export const refreshDetail = {
  tags: ["Auth"],
  summary: "Refresh token",
  description:
    "Rotasi refresh token dan mengeluarkan access token baru. Token lama otomatis di-revoke.",
  responses: {
    200: {
      description: "Refresh berhasil",
      content: {
        "application/json": {
          example: {
            status: 200,
            success: true,
            message: "Refresh success",
            data: authDataExample,
            meta: emptyMeta
          }
        }
      }
    },
    400: {
      description: "Token refresh tidak diberikan atau body tidak valid",
      content: { "application/json": { example: validationExample } }
    },
    401: {
      description: "Refresh token tidak valid/expired/sesi habis",
      content: { "application/json": { example: unauthorizedExample } }
    },
    429: {
      description: "Rate limit refresh",
      content: { "application/json": { example: tooManyRequestsExample } }
    }
  }
} as const;

export const logoutDetail = {
  tags: ["Auth"],
  summary: "Logout",
  description: "Mencabut seluruh refresh token pada session aktif dan menghapus cookie auth.",
  responses: {
    200: {
      description: "Logout berhasil",
      content: {
        "application/json": {
          example: {
            status: 200,
            success: true,
            message: "Logout success",
            data: null,
            meta: emptyMeta
          }
        }
      }
    },
    401: {
      description: "Refresh token tidak valid",
      content: { "application/json": { example: unauthorizedExample } }
    }
  }
} as const;

export const meDetail = {
  tags: ["Auth"],
  summary: "Current user",
  description: "Mengambil profil user yang sedang login.",
  responses: {
    200: {
      description: "Profil user berhasil diambil",
      content: {
        "application/json": {
          example: {
            status: 200,
            success: true,
            message: "Fetch current user success",
            data: authDataExample.user,
            meta: emptyMeta
          }
        }
      }
    },
    401: {
      description: "Access token tidak valid",
      content: { "application/json": { example: unauthorizedExample } }
    }
  }
} as const;
