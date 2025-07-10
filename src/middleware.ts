import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();
  const html = await response.text();

  // todo: authentication

  return next();
});
