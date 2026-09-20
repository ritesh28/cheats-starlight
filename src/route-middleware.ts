import { defineRouteMiddleware } from "@astrojs/starlight/route-data";

export const onRequest = defineRouteMiddleware(async (context, next) => {
  // table of contents middleware
  const { starlightRoute } = context.locals;
  const overviewItem = starlightRoute.toc?.items[0];

  // rename the default "Overview" label in the page TOC
  if (overviewItem) {
    overviewItem.text = "Terms & Concepts";
  }

  return next();
});
