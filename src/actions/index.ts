import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";

export const server = {
  auth: defineAction({
    accept: "form",
    input: z.object({
      phone: z.string(),
      password: z.string(),
    }),
    handler: async ({ phone, password }, context) => {
      if (
        phone === import.meta.env.AUTH_CREDENTIALS_PHONE &&
        password === import.meta.env.AUTH_CREDENTIALS_PASSWORD
      ) {
        const user = { userName: "Ritesh" };
        context.session?.set("user", user);
        return { user };
      }
      throw new ActionError({
        code: "UNAUTHORIZED",
        message: "User not found",
      });
    },
  }),
};
