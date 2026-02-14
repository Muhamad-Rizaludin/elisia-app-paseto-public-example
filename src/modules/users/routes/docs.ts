const emptyMeta = {
  currentPage: 0,
  pageSize: 0,
  total: 0,
  totalPage: 0,
  hasNext: false,
  hasPrev: false
};

export const usersGetDetail = {
  tags: ["Users"],
  summary: "Get users",
  description: "Mengambil data users dalam format datatable. Endpoint ini hanya untuk role admin.",
  responses: {
    200: {
      description: "Data users berhasil diambil",
      content: {
        "application/json": {
          example: {
            status: 200,
            success: true,
            message: "Fetch users success",
            data: [
              {
                id: "8f6fd9df-5e2b-4a10-a70b-9f6f7cf6f90a",
                name: "System Admin",
                email: "admin@example.com",
                role: "admin",
                createdAt: "2026-02-14T05:00:00.000Z",
                updatedAt: "2026-02-14T05:00:00.000Z"
              }
            ],
            meta: {
              currentPage: 1,
              pageSize: 10,
              total: 1,
              totalPage: 1,
              hasNext: false,
              hasPrev: false
            }
          }
        }
      }
    },
    401: {
      description: "Unauthorized",
      content: {
        "application/json": {
          example: {
            status: 401,
            success: false,
            message: "Unauthorized",
            data: null,
            meta: emptyMeta
          }
        }
      }
    },
    403: {
      description: "Role tidak diizinkan",
      content: {
        "application/json": {
          example: {
            status: 403,
            success: false,
            message: "You do not have permission to access this resource",
            data: null,
            meta: emptyMeta
          }
        }
      }
    }
  }
} as const;
