"use server"

import { db } from "@/lib/db"
import CryptoJS from "crypto-js"


// AES Encryption
export async function encryptMessageAES(message: string, key: string) {
  return CryptoJS.AES.encrypt(message, key).toString()
}

export async function decryptMessageAES(encryptedMessage: string, key: string) {
  const bytes = CryptoJS.AES.decrypt(encryptedMessage, key)
  return bytes.toString(CryptoJS.enc.Utf8)
}

// Caesar Cipher (shift letters)
export async function encryptCaesar(message: string, shift: number) {
  return message
    .split("")
    .map((char) => {
      // Only shift letters
      if (/[a-zA-Z]/.test(char)) {
        const code = char.charCodeAt(0)
        const isUpperCase = code >= 65 && code <= 90
        const base = isUpperCase ? 65 : 97
        // Apply shift and wrap around the alphabet (26 letters)
        return String.fromCharCode(((((code - base + shift) % 26) + 26) % 26) + base)
      }
      return char
    })
    .join("")
}

export async function decryptCaesar(encryptedMessage: string, shift: number) {
  // To decrypt, we shift in the opposite direction
  return encryptCaesar(encryptedMessage, 26 - (shift % 26))
}

// Base64 Encoding
export async function encodeBase64(message: string) {
  return btoa(message)
}

export async function decodeBase64(encodedMessage: string) {
  try {
    return atob(encodedMessage)
  } catch (error) {
    throw new Error("Invalid Base64 string")
  }
}

// Reverse Text
export async function reverseText(message: string) {
  return message.split("").reverse().join("")
}

export async function saveMessage({
  originalText,
  encryptedText,
  isEncrypted,
  method,
  key,
}: {
  originalText: string
  encryptedText: string
  isEncrypted: boolean
  method: string
  key?: string
}) {
  try {
    await db.message.create({
      data: {
        originalText,
        encryptedText,
        isEncrypted,
        encryptionMethod: method,
        encryptionKey: key || "",
        createdAt: new Date(),
      },
    })
    return { success: true }
  } catch (error) {
    console.error("Failed to save message:", error)
    throw new Error("Failed to save message to database")
  }
}

export async function getMessages() {
  try {
    return await db.message.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })
  } catch (error) {
    console.error("Failed to fetch messages:", error)
    throw new Error("Failed to fetch messages from database")
  }
}

