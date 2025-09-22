import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();
  const html = await response.text();

  // todo: authentication
  //   if (user === "your_username" && pwd === "your_password") {
  //   return next();
  // } else {
  //   return new Response("Unauthorized", {
  //     status: 401,
  //     headers: {
  //       "WWW-Authenticate": 'Basic realm="Secure Area"',
  //     },
  //   });
  // }

  return next();
});
