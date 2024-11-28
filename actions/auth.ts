"use server";

import { z } from "zod";
import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/actions/user";
import { DEFAULT_AUTH_REDIRECT, DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LoginSchema, RegisterSchema } from "@/schemas";
import { revalidatePath } from "next/cache";

export async function login(credentials: z.infer<typeof LoginSchema>) {
  const result = LoginSchema.safeParse(credentials);

  if (result.error) {
    return { error: "Credenciales invalidas!" };
  }

  const { email, password } = result.data;

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        default:
          return { error: "Something went wrong in the process!" };
      }
    }

    throw error;
  }
}

export async function register(credentials: z.infer<typeof RegisterSchema>) {
  const result = RegisterSchema.safeParse(credentials);

  if (result.error) {
    return { error: "Invalid credentials!" };
  }

  const { email, password, name } = result.data;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return { error: "The entered email is already in use!" };
    }

    await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        default:
          return { error: "Something went wrong in the process!" };
      }
    }

    throw error;
  }
}

export async function logout() {
  await signOut({ redirectTo: DEFAULT_AUTH_REDIRECT });
}