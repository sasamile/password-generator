"use client";

import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import {
  Bot,
  ChevronLeftIcon,
  ChevronRightIcon,
  Combine,
  CreditCard,
  Eye,
  EyeOff,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { formSchema } from "@/schemas";

function ElementStepper({ open }: { open: boolean }) {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [typeElement, setTypeElement] = useState<"logins" | "card" | "other">();

  const validateCardType = (number: string) => {
    if (typeof number !== "string") return "Invalid card number";
    const cleanedNumber = number.replace(/\s/g, ""); // Eliminar espacios para la validación
    const visaPattern = /^4[0-9]{12}(?:[0-9]{3})?$/; // Visa
    const masterCardPattern = /^5[1-5][0-9]{14}$/; // MasterCard

    if (visaPattern.test(cleanedNumber)) {
      return "Visa";
    } else if (masterCardPattern.test(cleanedNumber)) {
      return "MasterCard";
    } else {
      return "Invalid card number";
    }
  };

  const [formData, setFormData] = useState<z.infer<typeof formSchema>>({
    name: "",
    password: "",
    isFavorite: false,
    notes: "",
    numberCard: "",
    urlWebsite: "",
  });

  const validateField = (name: string, value: string) => {
    try {
      const fieldSchema =
        formSchema.shape[name as keyof z.infer<typeof formSchema>];
      formSchema.parse(value);
      setErrors((prev) => ({ ...prev, [name]: "" }));
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors((prev) => ({ ...prev, [name]: error.errors[0].message }));
      }
      return false;
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      password: "",
      isFavorite: false,
      notes: "",
      numberCard: "",
      urlWebsite: "",
    });
    setStep(1);
    setErrors({});
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h2 className="font-bold">Add new password</h2>

            <div className="w-full rounded-xl bg-muted h-52 my-5 relative ">
              <Image
                src={"/image/stepper.avif"}
                alt="Intro"
                fill
                className=" rounded-xl aspect-video object-cover"
              />
            </div>
            <p>Choose the type of item you want to save!</p>
            <div className="mt-5">
              <Select
                onValueChange={(value) => {
                  setTypeElement(value as "logins" | "card" | "other");
                }}
                value={typeElement}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="text-center">
                  <SelectItem value="logins">
                    <div className="flex justify-center items-center text-center gap-2">
                      <Shield className="w-4 h-4" /> Authentication
                    </div>
                  </SelectItem>
                  <SelectItem value="card">
                    <div className="flex justify-center items-center text-center gap-2">
                      <CreditCard className="w-4 h-4" /> Credit Card
                    </div>
                  </SelectItem>
                  <SelectItem value="other">
                    <div className="flex justify-center items-center text-center gap-2">
                      <Combine className="w-4 h-4" />
                      Other
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      case 2:
        const cardType = validateCardType(formData.numberCard || "");

        return (
          <div className="space-y-4">
            {(typeElement === "logins" || typeElement === "other") && (
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Google"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="border-[#525252]"
                />
              </div>
            )}

            {typeElement === "card" && (
              <div className="space-y-2">
                <Label htmlFor="numberCard">Card Number</Label>
                <div className="flex justify-center items-center ">
                  <div
                    className={`${
                      cardType === "Visa" || cardType === "MasterCard"
                        ? "pr-3"
                        : ""
                    }`}
                  >
                    {cardType === "Visa" && (
                      <Image
                        src={"/icons/visa.svg"}
                        alt="logo"
                        width={50}
                        height={50}
                      />
                    )}
                    {cardType === "MasterCard" && (
                      <Image
                        src={"/icons/mastercard.svg"}
                        alt="logo"
                        width={50}
                        height={50}
                      />
                    )}
                  </div>
                  <Input
                    id="numberCard"
                    name="numberCard"
                    maxLength={19}
                    placeholder="4954 5654 2343 3456"
                    className="border-[#525252]"
                    value={formData.numberCard}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\s/g, "");
                      const formattedValue = value.replace(
                        /(\d{4})(?=\d)/g,
                        "$1 "
                      );
                      setFormData((prev) => ({
                        ...prev,
                        numberCard: formattedValue.trim(),
                      }));
                    }}
                  />
                </div>
                {formData.numberCard &&
                  formData.numberCard.length >= 19 &&
                  cardType === "Invalid card number" && (
                    <p className="text-red-500">{cardType}</p>
                  )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative flex items-center justify-between">
                <Input
                  id="password"
                  name="password"
                  className={cn("pr-11 border-[#525252]")}
                  type={showPassword ? "text" : "password"}
                  placeholder="8+ caracteres"
                  onChange={handleInputChange}
                  value={formData.password}
                />
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-1 hover:bg-transparent  p-0 mr-2"
                >
                  {showPassword ? (
                    <EyeOff className="min-w-5 min-h-5 shrink-0" />
                  ) : (
                    <Eye className="min-w-5 min-h-5 shrink-0" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="urlWebsite">URL Websites</Label>
              <div className="relative flex items-center justify-between">
                <Input
                  id="urlWebsite"
                  name="urlWebsite"
                  className="border-[#525252] py-4"
                  placeholder="https://www.google.com/"
                  onChange={handleInputChange}
                  value={formData.urlWebsite}
                />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <div className="relative flex items-center justify-between">
                <Textarea
                  id="notes"
                  name="notes"
                  className="border-[#525252] "
                  placeholder="Add important notes to your password"
                  value={formData.notes}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="isFavorite">Add to Favorites</Label>
              <div className="flex items-center ml-2">
                <Checkbox
                  className="w-4 h-4 border-gray-300 rounded"
                  id="isFavorite"
                  // Usa onCheckedChange en lugar de checked
                  checked={formData.isFavorite}
                  onCheckedChange={(checked) => {
                    // Convierte el valor a booleano
                    setFormData((prev) => ({
                      ...prev,
                      isFavorite: checked as boolean,
                    }));
                  }}
                />
                <span className="ml-4 text-sm">
                  Would you like to add this item to your favorites?
                </span>
              </div>
            </div>

            <div className="absolute right-5 bottom-7">
              <Button type="submit">
                <Bot /> Create Password
              </Button>
            </div>
          </div>
        );
    }
  };

  useEffect(() => {
    !open && resetForm();
  }, [open]);

  return (
    <div>
      <form onSubmit={onSubmit}>{renderStep()}</form>

      <div className="flex justify-between mt-5">
        {step > 1 && (
          <Button
            variant="outline"
            onClick={() => setStep((prev) => prev - 1)}
            className="flex items-center"
          >
            <ChevronLeftIcon className="mr-2 h-4 w-4" />
            Atrás
          </Button>
        )}
        {step < 3 && (
          <Button
            disabled={
              (step === 1 && !typeElement) || // Deshabilitar si no hay tipo seleccionado
              (step === 2 && // Deshabilitar si faltan campos en el paso 2
                typeElement === "logins" && // Para logins, todos los campos deben estar llenos
                (!formData.name || // Asegúrate de que el nombre no esté vacío
                  !formData.password || // Asegúrate de que la contraseña no esté vacía
                  !formData.urlWebsite)) || // Asegúrate de que la URL no esté vacía
              (step === 2 && // Deshabilitar si faltan campos en el paso 2
                typeElement === "card" && // Para logins, todos los campos deben estar llenos
                (!formData.numberCard || // Asegúrate de que el nombre no esté vacío
                  !formData.password || // Asegúrate de que la contraseña no esté vacía
                  !formData.urlWebsite)) || // Asegúrate de que la URL no esté vacía
              (step === 2 && // Deshabilitar si faltan campos en el paso 2
                typeElement === "other" && // Para logins, todos los campos deben estar llenos
                (!formData.name || // Asegúrate de que el nombre no esté vacío
                  !formData.password || // Asegúrate de que la contraseña no esté vacía
                  !formData.urlWebsite)) || // Asegúrate de que la URL no esté vacía
              (step === 3 &&
                !formData.notes && // Deshabilitar si no hay notas
                !formData.isFavorite) // Deshabilitar si no está marcado como favorito
            }
            onClick={() => {
              console.log(formData); // Debugging
              setStep((prev) => prev + 1);
            }}
            className="flex items-center ml-auto"
          >
            Continuar
            <ChevronRightIcon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

export default ElementStepper;
