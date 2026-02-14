export const getHealthService = () => {
  return {
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  };
};
