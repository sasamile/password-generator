"use server";

import { currentUser } from "@/lib/auth-user";
import { db } from "@/lib/db";
import { formDataProps } from "@/types";

export async function PasswordCreate(
  formData: formDataProps,
  typeElement?: string
) {
  try {
    const user = await currentUser();
    const {
      isFavorite,
      username,
      password,
      name,
      notes,
      numberCard,
      urlWebsite,
    } = formData;

    if (!user) {
      return { error: "You must be logged in to create a password." };
    }

    await db.element.create({
      data: {
        userId: user.id,
        isFavorite,
        password,
        username,
        typeElement,
        name,
        notes,
        numberCard,
        urlWebsite,
      },
    });
    return { success: true, status: 200 };
  } catch (error) {
    return { error: "Something went wrong in the process!" };
  }
}
export async function PasswordUpdate(
  formData: formDataProps,
  elementId: string,
  typeElement?: string
) {
  try {
    const user = await currentUser();
    const {
      isFavorite,
      username,
      password,
      name,
      notes,
      numberCard,
      urlWebsite,
    } = formData;

    if (!user) {
      return { error: "You must be logged in to create a password." };
    }

    await db.element.update({
      where: {
        id: elementId,
      },
      data: {
        userId: user.id,
        isFavorite,
        password,
        username,
        typeElement,
        name,
        notes,
        numberCard,
        urlWebsite,
      },
    });
    return { success: true, status: 200 };
  } catch (error) {
    return { error: "Something went wrong in the process!" };
  }
}

export async function fetchData(userId: string) {
  if (!userId) {
    return { error: "You must be logged in to fetch data." };
  }
  try {
    const element = await db.element.findMany({
      where: {
        userId: userId,
      },
    });
    return element;
  } catch (error) {
    return { error: "Something went wrong in the process!" };
  }
}

export async function fetchDataElementEdit(elementId: string) {
  try {
    const element = await db.element.findUnique({
      where: {
        id: elementId,
      },
    });
    return element;
  } catch (error) {
    return { error: "Something went wrong in the process!" };
  }
}

export async function deletePassword(id: string) {
  try {
    const element = await db.element.delete({
      where: {
        id,
      },
    });
    return element;
  } catch (error) {
    return { error: "Something went wrong in the process!" };
  }
}
