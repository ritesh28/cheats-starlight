import { getCollection } from "astro:content";
import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  // authorization middleware
  const user = await context.session?.get("user");
  const { slug } = context.params; // 'content/docs' md files are rendered in [...slug].astro

  const allCheats = await getCollection("docs");
  const allSlugs = allCheats.map((c) => c.id);

  // if non-logged user tries to access cheat-sheet, redirect him to home page
  if (slug && allSlugs.includes(slug) && !user) {
    return context.redirect("/");
  }

  return next();
});
