import Google from "next-auth/providers/google";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "./schemas";
import { getUserByEmail } from "./actions/user";
import bcrypt from "bcryptjs";

export const authConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    MicrosoftEntraID({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid profile email User.Read",
        },
        url: "https://login.microsoftonline.com/consumers/oauth2/v2.0/authorize",
      },
      token: "https://login.microsoftonline.com/consumers/oauth2/v2.0/token",
    }),
    Credentials({
      authorize: async (credentials) => {
        const result = LoginSchema.safeParse(credentials);

        if (result.success) {
          const { email, password } = result.data;

          const user = await getUserByEmail(email);

          if (!user || !user.password) {
            throw new Error("Credenciales inválidas!");
          }

          const passwordMatch = await bcrypt.compare(password, user.password);

          if (passwordMatch) return user;
        }

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;