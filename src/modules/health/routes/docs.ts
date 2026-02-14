export const healthGetDetail = {
  tags: ["Health"],
  summary: "Health check",
  description: "Mengecek status aplikasi dan uptime service.",
  responses: {
    200: {
      description: "Service sehat",
      content: {
        "application/json": {
          example: {
            status: 200,
            success: true,
            message: "OK",
            data: {
              status: "healthy",
              uptime: 12.3,
              timestamp: "2026-02-14T05:00:00.000Z"
            },
            meta: {
              currentPage: 0,
              pageSize: 0,
              total: 0,
              totalPage: 0,
              hasNext: false,
              hasPrev: false
            }
          }
        }
      }
    }
  }
} as const;
