"use server";

import { currentUser } from "@/lib/auth-user";
import { db } from "@/lib/db";

// Helper function to calculate password strength
function calculatePasswordStrength(password: string): number {
  let strength = 0;
  if (password.length >= 8) strength += 25;
  if (/[A-Z]/.test(password)) strength += 25;
  if (/[0-9]/.test(password)) strength += 25;
  if (/[^A-Za-z0-9]/.test(password)) strength += 25;
  return strength;
}

export async function getElementStats() {
  const user = await currentUser();
  if (!user?.email) return null;

  const elements = await db.element.findMany({
    where: {
      user: {
        email: user.email,
      },
    },
    select: {
      password: true,
      typeElement: true,
    },
  });

  // Calculate total elements and average password strength
  const totalElements = elements.length;
  const passwordElements = elements.filter((e) => e.password);
  const averageStrength =
    passwordElements.reduce((acc, curr) => {
      return acc + calculatePasswordStrength(curr.password || "");
    }, 0) / (passwordElements.length || 1);

  // Count elements by type
  const elementsByType = elements.reduce(
    (acc: Record<string, number>, curr) => {
      const type = curr.typeElement || "other";
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    },
    {}
  );

  return {
    totalElements,
    averageStrength,
    elementsByType,
  };
}

// Simulated visit tracking (you would typically use a proper analytics service)
export async function getVisitStats() {
  const user = await currentUser();
  if (!user?.email) return null;

  // Simulate visit data (replace with real analytics integration)
  const today = new Date();
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    return date.toISOString().split("T")[0];
  });

  const visitData = last30Days.map((date) => ({
    date,
    desktop: Math.floor(Math.random() * 100),
    mobile: Math.floor(Math.random() * 60),
  }));

  const totalVisits = visitData.reduce(
    (acc, curr) => acc + curr.desktop + curr.mobile,
    0
  );

  return {
    visitData,
    totalVisits,
  };
}
