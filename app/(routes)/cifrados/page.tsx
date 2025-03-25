"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  encryptMessageAES,
  decryptMessageAES,
  encryptCaesar,
  decryptCaesar,
  encodeBase64,
  decodeBase64,
  reverseText,
  saveMessage,
} from "@/actions/cifrados"
import toast from "react-hot-toast"
import { Loader2, Lock, Unlock, KeyRound, RotateCcw, Code, ShieldAlert } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function EncryptionForm() {
  const [message, setMessage] = useState("")
  const [key, setKey] = useState("")
  const [shift, setShift] = useState("5")
  const [result, setResult] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [encryptionMethod, setEncryptionMethod] = useState("aes")
  const [decryptionMethod, setDecryptionMethod] = useState("aes")

  const handleEncrypt = async () => {
    if (!message) {
      toast.error("Please provide a message to encrypt")
      return
    }

    if (encryptionMethod === "aes" && !key) {
      toast.error("AES encryption requires a key")
      return
    }

    setIsLoading(true)
    try {
      let encrypted = ""

      switch (encryptionMethod) {
        case "aes":
          encrypted = await encryptMessageAES(message, key)
          break
        case "caesar":
          encrypted = await encryptCaesar(message, Number.parseInt(shift))
          break
        case "base64":
          encrypted = await encodeBase64(message)
          break
        case "reverse":
          encrypted = await reverseText(message)
          break
        default:
          encrypted = await encryptMessageAES(message, key)
      }

      setResult(encrypted)

      await saveMessage({
        originalText: message,
        encryptedText: encrypted,
        isEncrypted: true,
        method: encryptionMethod,
        key: encryptionMethod === "aes" ? key : encryptionMethod === "caesar" ? shift : "",
      })

      toast.success("Message encrypted and saved to database")
    } catch (error) {
      toast.error("Failed to encrypt message")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDecrypt = async () => {
    if (!message) {
      toast.error("Please provide a message to decrypt")
      return
    }

    if (decryptionMethod === "aes" && !key) {
      toast.error("AES decryption requires a key")
      return
    }

    setIsLoading(true)
    try {
      let decrypted = ""

      switch (decryptionMethod) {
        case "aes":
          decrypted = await decryptMessageAES(message, key)
          break
        case "caesar":
          decrypted = await decryptCaesar(message, Number.parseInt(shift))
          break
        case "base64":
          decrypted = await decodeBase64(message)
          break
        case "reverse":
          decrypted = await reverseText(message)
          break
        default:
          decrypted = await decryptMessageAES(message, key)
      }

      setResult(decrypted)

      await saveMessage({
        originalText: decrypted,
        encryptedText: message,
        isEncrypted: false,
        method: decryptionMethod,
        key: decryptionMethod === "aes" ? key : decryptionMethod === "caesar" ? shift : "",
      })

      toast.success("Message decrypted and saved to database")
    } catch (error) {
      toast.error("Failed to decrypt message. Make sure you're using the correct method and key.")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const renderEncryptionOptions = () => {
    switch (encryptionMethod) {
      case "aes":
        return (
          <div className="space-y-2">
            <Label htmlFor="encryption-key">Encryption Key</Label>
            <div className="relative">
              <Input
                id="encryption-key"
                placeholder="Enter your encryption key"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="pr-10"
              />
              <KeyRound className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            </div>
            <p className="text-xs text-muted-foreground">
              AES is a strong encryption algorithm used by governments and security professionals.
            </p>
          </div>
        )
      case "caesar":
        return (
          <div className="space-y-2">
            <Label htmlFor="shift-value">Shift Value (1-25)</Label>
            <Input
              id="shift-value"
              type="number"
              min="1"
              max="25"
              placeholder="Enter shift value (1-25)"
              value={shift}
              onChange={(e) => setShift(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Caesar cipher shifts each letter by the specified number of positions in the alphabet.
            </p>
          </div>
        )
      case "base64":
        return (
          <p className="text-sm text-muted-foreground mt-2">
            Base64 encoding converts binary data to ASCII text format. No key required.
          </p>
        )
      case "reverse":
        return (
          <p className="text-sm text-muted-foreground mt-2">
            This simply reverses the order of characters in your message. No key required.
          </p>
        )
      default:
        return null
    }
  }

  const renderDecryptionOptions = () => {
    switch (decryptionMethod) {
      case "aes":
        return (
          <div className="space-y-2">
            <Label htmlFor="decryption-key">Decryption Key</Label>
            <div className="relative">
              <Input
                id="decryption-key"
                placeholder="Enter your decryption key"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="pr-10"
              />
              <KeyRound className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            </div>
          </div>
        )
      case "caesar":
        return (
          <div className="space-y-2">
            <Label htmlFor="shift-value-decrypt">Shift Value (1-25)</Label>
            <Input
              id="shift-value-decrypt"
              type="number"
              min="1"
              max="25"
              placeholder="Enter shift value (1-25)"
              value={shift}
              onChange={(e) => setShift(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Enter the same shift value used for encryption.</p>
          </div>
        )
      case "base64":
      case "reverse":
        return <p className="text-sm text-muted-foreground mt-2">No key required for this decryption method.</p>
      default:
        return null
    }
  }

  const getMethodIcon = (method: string) => {
    switch (method) {
      case "aes":
        return <ShieldAlert className="h-5 w-5" />
      case "caesar":
        return <RotateCcw className="h-5 w-5" />
      case "base64":
        return <Code className="h-5 w-5" />
      case "reverse":
        return <RotateCcw className="h-5 w-5" />
      default:
        return <Lock className="h-5 w-5" />
    }
  }

  return (
    <Card className="w-full shadow-lg border-t-4 border-t-primary">
      <CardHeader className="bg-gradient-to-r from-muted/50 to-background pb-6">
        <CardTitle className="text-2xl flex items-center gap-2">
          <Lock className="h-6 w-6 text-primary" />
          Encrypt or Decrypt Messages
        </CardTitle>
        <CardDescription className="text-base">
          Choose from multiple encryption methods to secure your messages
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Tabs defaultValue="encrypt" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="encrypt" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Encrypt
            </TabsTrigger>
            <TabsTrigger value="decrypt" className="flex items-center gap-2">
              <Unlock className="h-4 w-4" />
              Decrypt
            </TabsTrigger>
          </TabsList>

          <TabsContent value="encrypt" className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="encryption-method">Encryption Method</Label>
              <Select value={encryptionMethod} onValueChange={setEncryptionMethod}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select encryption method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aes" className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="h-4 w-4" />
                      <span>AES Encryption</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="caesar">
                    <div className="flex items-center gap-2">
                      <RotateCcw className="h-4 w-4" />
                      <span>Caesar Cipher (Shift Letters)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="base64">
                    <div className="flex items-center gap-2">
                      <Code className="h-4 w-4" />
                      <span>Base64 Encoding</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="reverse">
                    <div className="flex items-center gap-2">
                      <RotateCcw className="h-4 w-4" />
                      <span>Reverse Text</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message-to-encrypt">Message to Encrypt</Label>
              <div className="relative">
                <Textarea
                  id="message-to-encrypt"
                  placeholder="Enter the message you want to encrypt"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[120px] resize-none pr-10"
                />
                {getMethodIcon(encryptionMethod)}
              </div>
            </div>

            {renderEncryptionOptions()}

            <Button
              onClick={handleEncrypt}
              className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Encrypting...
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Encrypt Message
                </>
              )}
            </Button>
          </TabsContent>

          <TabsContent value="decrypt" className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="decryption-method">Decryption Method</Label>
              <Select value={decryptionMethod} onValueChange={setDecryptionMethod}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select decryption method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aes">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="h-4 w-4" />
                      <span>AES Decryption</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="caesar">
                    <div className="flex items-center gap-2">
                      <RotateCcw className="h-4 w-4" />
                      <span>Caesar Cipher (Shift Letters)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="base64">
                    <div className="flex items-center gap-2">
                      <Code className="h-4 w-4" />
                      <span>Base64 Decoding</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="reverse">
                    <div className="flex items-center gap-2">
                      <RotateCcw className="h-4 w-4" />
                      <span>Reverse Text</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message-to-decrypt">Message to Decrypt</Label>
              <Textarea
                id="message-to-decrypt"
                placeholder="Enter the encrypted message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[120px] resize-none"
              />
            </div>

            {renderDecryptionOptions()}

            <Button
              onClick={handleDecrypt}
              className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Decrypting...
                </>
              ) : (
                <>
                  <Unlock className="mr-2 h-4 w-4" />
                  Decrypt Message
                </>
              )}
            </Button>
          </TabsContent>

          {result && (
            <div className="mt-6 space-y-2 animate-in fade-in-50 duration-300">
              <Label htmlFor="result" className="flex items-center gap-2">
                <span>Result</span>
                <span className="text-xs text-muted-foreground">(Copy and share securely)</span>
              </Label>
              <div className="p-4 border rounded-md bg-muted/30 break-all relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-md"></div>
                {result}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => {
                  navigator.clipboard.writeText(result)
                  toast.success("Copied to clipboard!")
                }}
              >
                Copy to Clipboard
              </Button>
            </div>
          )}
        </Tabs>
      </CardContent>
    </Card>
  )
}

