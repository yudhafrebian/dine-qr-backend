export const buildFrontendUrl = (path: string) => {
  const base = process.env.FRONTEND_URL?.replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
};
