"use server";

import { UserData } from "@/components/common/sidebar/profile-modal";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function getUserByEmail(email: string) {
  try {
    const user = await db.user.findUnique({
      where: { email },
    });

    return user;
  } catch {
    return null;
  }
}

export async function getUserByEmailAndProvider(
  email: string,
  provider: string
) {
  try {
    const user = await db.user.findFirst({
      where: {
        email,
        accounts: {
          some: {
            provider,
          },
        },
      },
      include: {
        accounts: true,
      },
    });

    return user;
  } catch {
    return null;
  }
}

export const getUserById = async (id?: string) => {
  if (!id) {
    return null;
  }

  try {
    const userFound = await db.user.findUnique({
      where: {
        id,
      },
    });

    return userFound;
  } catch {
    return null;
  }
};

export const patchUser = async (values?: UserData, fileUrl?: string, password?: string) => {
  try {
    if (!values) return { error: "No user data provided" };
    
    const { name, email } = values;

    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

    const user = await db.user.update({
      where: { id: values.id },
      data: {
        name,
        email,
        image: fileUrl || undefined, // Solo actualizar si hay un nuevo archivo
        ...(hashedPassword && { password: hashedPassword }) // Solo actualizar la contraseña si se proporciona
      },
    });
    return user;
  } catch (error) {
    return { error: "" };
  }
};
